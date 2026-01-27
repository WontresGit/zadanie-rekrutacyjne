<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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
    public function downloadSession(Request $request, EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager, LoggerInterface $logger): JsonResponse
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
}
