<?php

namespace App\Tests\Controller;

use App\Entity\User;
use DateTimeImmutable;
use DateTimeInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class ApiControllerTest extends WebTestCase
{
    public function testCreateShortUrl(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        $em = $container->get('doctrine')->getManager();
        $jwtManager = $container->get(JWTTokenManagerInterface::class);
        $user = new User();
        $user->setUuid(uniqid());
        $user->setRoles(['ROLE_USER']);
        $em->persist($user);
        $em->flush();
        $jwt = $jwtManager->create($user);
        $client->request('POST', '/api/urls', [], [], [
            'HTTP_Authorization' => 'Bearer ' . $jwt,
            'CONTENT_TYPE' => 'application/json'
        ], json_encode([
                'fullLink' => 'https://example.com/test',
                'isPublic' => true,
                'createDate' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
            ]));
        $this->assertResponseStatusCodeSame(201);

        $response = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('shortCode', $response);
    }

    public function testRateLimit(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        $em = $container->get('doctrine')->getManager();
        $jwtManager = $container->get(JWTTokenManagerInterface::class);
        $user = new User();
        $user->setUuid(uniqid());
        $user->setRoles(['ROLE_USER']);
        $em->persist($user);
        $em->flush();
        $jwt = $jwtManager->create($user);
        for ($i = 1; $i <= 11; $i++) {
            echo "Link " . $i;
            $client->request('POST', '/api/urls', [], [], [
                'HTTP_Authorization' => 'Bearer ' . $jwt,
                'CONTENT_TYPE' => 'application/json'
            ], json_encode([
                    'fullLink' => 'https://example.com/test' . $i,
                    'isPublic' => false,
                    'createDate' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
                ]));
            $response = $client->getResponse();
            echo "Status: " . $response->getStatusCode() . "\n";
            echo "Content: " . $response->getContent() . "\n";
            if ($i <= 10) {
                $this->assertResponseStatusCodeSame(201);
            } else {
                $this->assertResponseStatusCodeSame(429);
            }
        }
    }
}
