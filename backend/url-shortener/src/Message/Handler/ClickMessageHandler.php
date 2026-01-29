<?php
namespace App\Message\Handler;

use App\Message\ClickMessage;
use App\Entity\ShortUrl;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class ClickMessageHandler
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function __invoke(ClickMessage $message)
    {
        $shortUrl = $this->entityManager->getRepository(ShortUrl::class)
            ->find($message->shortUrlId);

        if (!$shortUrl) {
            return;
        }
        $shortUrl->setClicks($shortUrl->getClicks() + 1);
        $this->entityManager->flush();
    }
}