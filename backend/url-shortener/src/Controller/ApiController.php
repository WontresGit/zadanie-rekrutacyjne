<?php

namespace App\Controller;

use App\Entity\ShortUrl;
use App\Entity\User;
use App\Message\ClickMessage;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use App\Service\UrlShortener;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class ApiController extends AbstractController
{
    #[Route('/api/session', methods: ["POST"])]
    #[IsGranted("PUBLIC_ACCESS")]
    public function makeSession(EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager, LoggerInterface $logger): JsonResponse
    {
        try {
            $logger->info("POCZĄTEK");
            $user = new User();
            $uuid = uniqid();
            $logger->info($uuid);
            $user->setUuid($uuid);
            $user->setRoles(['ROLE_USER']);
            $entityManager->persist($user);
            $entityManager->flush();
            $logger->info($user->getUserIdentifier());
            $logger->info("Tworzenie jwt");
            $jwtToken = $jwtManager->create($user);
            $logger->info($jwtToken);
            return $this->json(['jwtToken' => $jwtToken], 200);
        } catch (Exception $e) {
            $logger->error($e);
            return $this->json(array('message' => 'There was a problem while creating new user session.'), 500);
        }
    }

    #[Route('/api/session', methods: ["GET"])]
    public function downloadSession(Request $request, JWTTokenManagerInterface $jwtManager, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            $authHeader = $request->headers->get('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $jwt = substr($authHeader, 7);
                $payload = $jwtManager->parse($jwt);
                $expiresAt = $payload['exp'];
            }
            return $this->json(array('user' => $user, "uuid" => $user ? $user->getUserIdentifier() : null, 'jwtToken' => $jwt ?? null, "expire" => $expiresAt ?? null), 200);
        } catch (Exception $e) {
            $logger->error($e);
            return $this->json(array('message' => 'There was a problem getting current user session.'), 500);
        }

    }

    #[Route('/api/urls', methods: ["POST"])]
    public function createShortUrl(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager, UrlShortener $urlShortener, ValidatorInterface $validator, RateLimiterFactory $createShortUrlLimiter, LoggerInterface $logger)
    {
        try {
            $user = $this->getUser();
            if (!$user) {
                return $this->json(["message" => "you are not authorized to create Short Url, log in first."], 401);
            }
            $limiter = $createShortUrlLimiter->create(
                $user->getUserIdentifier()
            );
            $limit = $limiter->consume(1);
            if (!$limit->isAccepted()) {
                return $this->json(['errors' => "Reacherd rate limit of 10 links per minute."], 429);
            }
            $content = $request->getContent();
            $logger->info($content);
            $shortUrl = $serializer->deserialize($content, ShortUrl::class, "json");
            $shortUrl->setCreator($user);
            $shortCode = $urlShortener->createShortCode($user->getUserIdentifier(), $shortUrl->getFullLink(), $shortUrl->isPublic());
            $shortUrl->setShortCode($shortCode);
            $errors = $validator->validate($shortUrl);
            if (count($errors) > 0) {
                $messages = [];
                foreach ($errors as $error) {
                    $messages[] = $error->getMessage();
                }
                return $this->json(['errors' => $messages], 400);
            }
            $entityManager->persist($shortUrl);
            $entityManager->flush();
            return $this->json(["shortCode" => $shortCode], 201);
        } catch (Exception $e) {
            $logger->error($e);
            return $this->json(array('message' => 'There was a problem creating short url.'), 500);
        }
    }

    #[Route('/api/urls', methods: ["GET"])]
    public function getShortUrls(LoggerInterface $logger)
    {
        try {
            $user = $this->getUser();
            if (!$user) {
                return $this->json(["message" => "you are not authorized to get Short Urls, log in first."], 401);
            }
            if ($user instanceof User) {
                $shortLinks = $user->getShortUrls()->filter((function (ShortUrl $shortUrl) {
                    return $shortUrl->getDeleteDate() === null;
                }));
                $logger->info("SIZE:" . $shortLinks->count());
                return $this->json($shortLinks->getValues(), 200);
            }

        } catch (Exception $e) {
            $logger->error($e);
            return $this->json(array('message' => 'There was a problem getting current user session.'), 500);
        }
    }
    #[Route('/api/urls/{id}/stats', methods: ["GET"])]
    #[IsGranted("PUBLIC_ACCESS")]
    public function getShortUrlStats(ShortUrl $shortUrl, LoggerInterface $logger)
    {
        try {
            $logger->info(message: "STATS");
            $user = $this->getUser();
            if ($user instanceof User)
                // $shortUrl = $user->getShortUrls()->filter(function (ShortUrl $shortUrl) use ($id) {
                //     return $shortUrl->getId() === $id && $shortUrl->getDeleteDate() !== null;
                // });
                // return $this->json(["clicks" => $shortUrl->first()->getClicks()], 200);
                if (!$shortUrl->getDeleteDate()) {
                    return $this->json(["clicks" => $shortUrl->getClicks()], 200);
                } else {
                    return $this->json(["message" => "Short link not found or was deleted."], 404);
                }
        } catch (Exception $e) {
            $logger->error($e);
            return $this->json(["message" => "There was a problem getting short url stats."], 500);
        }

    }
    #[Route('/api/urls/{id}', methods: ["DELETE"])]
    public function SoftDeleteShortUrl(ShortUrl $shortUrl, EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        try {
            $logger->info("DELETE");
            $user = $this->getUser();
            $logger->info($user ? $user->getUserIdentifier() : "BRAK USERA");
            if (!$user) {
                return $this->json(["message" => "You're not authorized to perform this action."], 500);
            }
            if ($shortUrl->getDeleteDate()) {
                return $this->json(["message" => "Short Url was not found or already deleted."], 404);
            }
            $shortUrl->setDeleteDate(new DateTimeImmutable());
            $entityManager->flush();
            return $this->json(["message" => "Short url was deleted."], 204);
        } catch (Exception $e) {
            $logger->error($e);
            return $this->json(["message" => "There was a problem deleting short url."], 500);
        }
    }
    #[Route('/api/public', methods: ["GET"])]
    #[IsGranted("PUBLIC_ACCESS")]
    public function getPublicShortUrls(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        try {
            $now = new DateTimeImmutable();
            $qb = $entityManager->getRepository(ShortUrl::class)->createQueryBuilder('s');
            $qb->where('s.isPublic = :isPublic')
                ->andWhere($qb->expr()->orX(
                    's.expireDate IS NULL',
                    's.expireDate > :now'
                ))
                ->andWhere('s.deleteDate IS NULL')
                ->setParameter('isPublic', true)
                ->setParameter('now', $now)
                ->orderBy('s.createDate', 'DESC');
            $results = $qb->getQuery()->getResult();
            return $this->json($results, 200);
        } catch (Exception $e) {
            $logger->error($e);
            return $this->json(array('message' => 'There was a problem getting all public links.'), 500);
        }
    }
    #[Route('/{shortCode}', methods: ["GET"], requirements: ['shortCode' => '[A-Za-z0-9]+'])]
    #[IsGranted("PUBLIC_ACCESS")]
    public function redirectToShortUrl(string $shortCode, EntityManagerInterface $entityManager, MessageBusInterface $bus, LoggerInterface $logger)
    {
        try {
            $now = new DateTimeImmutable();
            $qb = $entityManager->getRepository(ShortUrl::class)->createQueryBuilder('s');
            $qb->where('s.shortCode = :code')
                ->andWhere('s.deleteDate IS NULL')
                ->andWhere('s.expireDate IS NULL OR s.expireDate > :now')
                ->setParameter('code', $shortCode)
                ->setParameter('now', $now);
            $result = $qb->getQuery()->getOneOrNullResult();
            if (!$result)
                return $this->json(array('message' => 'Short Url not found or expired.'), 404);
            $bus->dispatch(new ClickMessage(
                $result->getId(),
                new DateTimeImmutable()
            ));
            return new RedirectResponse($result->getFullLink());
        } catch (Exception $e) {
            $logger->error($e);
            return $this->json(array('message' => 'There was a problem redirecting with short code.'), 500);
        }
    }
}
