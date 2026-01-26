<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use DateInterval;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class ApiController extends AbstractController
{
    #[Route('/api/session', methods: ["POST"])]
    public function makeSession(EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        try {
            $user = new User();
            $uuid = uniqid();
            $user->setUuid($uuid);
            $jwtToken = $jwtManager->create($user);
            $user->setJwtToken($jwtToken);
            $timeNow = new DateTimeImmutable();
            $jwtTokenValid = $timeNow->add(new DateInterval("P7D"));
            $user->setJwtTokenValid($jwtTokenValid);
            $entityManager->persist($user);
            $entityManager->flush();
            return new JsonResponse(array('code' => 200, 'userUuid' => $uuid, 'jwtToken' => $jwtToken, 'validDateTime' => $jwtTokenValid));
        } catch (Exception $e) {
            return new JsonResponse(array('code' => 500, 'message' => 'There was a problem while creating new user session.'));
        }
    }

    #[Route('/api/session', methods: ["GET"])]
    public function downloadSession(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $content = $request->getContent();
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ApiController.php',
        ]);
    }
}
