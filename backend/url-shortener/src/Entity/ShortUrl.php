<?php

namespace App\Entity;

use App\Repository\ShortUrlRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ShortUrlRepository::class)]
#[ORM\UniqueConstraint(
    name: 'unique_short_url',
    columns: ['full_link', 'is_public', 'creator_id']
)]
#[ORM\UniqueConstraint(
    name: 'unique_alias_creator',
    columns: ['alias', 'creator_id']
)]
// #[UniqueEntity(
//     fields: ['fullLink', 'isPublic', 'creator'],
//     message: 'A short link already exists.'
// )]
// #[UniqueEntity(
//     fields: ['alias', 'creator'],
//     message: 'You already used that alias.'
// )]
class ShortUrl
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Url(
        message: 'Podaj poprawny adres URL.'
    )]
    private ?string $fullLink = null;

    #[ORM\Column(length: 127, nullable: true)]
    private ?string $shortCode = null;

    #[ORM\Column(options: ["default" => false])]
    private ?bool $isPublic = false;

    #[ORM\Column]
    private ?\DateTimeImmutable $createDate = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $expireDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $alias = null;

    #[ORM\ManyToOne(inversedBy: 'uuid')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $creator = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deleteDate = null;

    #[ORM\Column(options: ["default" => true])]
    private ?int $clicks = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFullLink(): ?string
    {
        return $this->fullLink;
    }

    public function setFullLink(string $fullLink): static
    {
        $this->fullLink = $fullLink;

        return $this;
    }

    public function getShortCode(): ?string
    {
        return $this->shortCode;
    }

    public function setShortCode(string $shortCode): static
    {
        $this->shortCode = $shortCode;

        return $this;
    }

    public function isPublic(): ?bool
    {
        return $this->isPublic;
    }

    public function setIsPublic(bool $isPublic): static
    {
        $this->isPublic = $isPublic;

        return $this;
    }

    public function getCreateDate(): ?\DateTimeImmutable
    {
        return $this->createDate;
    }

    public function setCreateDate(\DateTimeImmutable $createDate): static
    {
        $this->createDate = $createDate;

        return $this;
    }

    public function getExpireDate(): ?\DateTimeImmutable
    {
        return $this->expireDate;
    }

    public function setExpireDate(?\DateTimeImmutable $expireDate): static
    {
        $this->expireDate = $expireDate;

        return $this;
    }

    public function getAlias(): ?string
    {
        return $this->alias;
    }

    public function setAlias(?string $alias): static
    {
        $this->alias = $alias;

        return $this;
    }

    public function getCreator(): string
    {
        return $this->creator->getUserIdentifier();
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;

        return $this;
    }

    public function getDeleteDate(): ?\DateTimeImmutable
    {
        return $this->deleteDate;
    }

    public function setDeleteDate(?\DateTimeImmutable $deleteDate): static
    {
        $this->deleteDate = $deleteDate;

        return $this;
    }

    public function getClicks(): ?int
    {
        return $this->clicks;
    }

    public function setClicks(int $clicks): static
    {
        $this->clicks = $clicks;

        return $this;
    }
}
