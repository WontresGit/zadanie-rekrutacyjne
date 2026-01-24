<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_UUID', fields: ['uuid'])]
class User implements UserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $uuid = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var Collection<int, ShortUrl>
     */
    #[ORM\OneToMany(targetEntity: ShortUrl::class, mappedBy: 'creator', orphanRemoval: true)]
    private Collection $shortUrls;

    public function __construct()
    {
        $this->shortUrls = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->uuid;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return Collection<int, ShortUrl>
     */
    public function getDeleteDate(): Collection
    {
        return $this->shortUrls;
    }

    public function addDeleteDate(ShortUrl $shortUrl): static
    {
        if (!$this->shortUrls->contains($shortUrl)) {
            $this->shortUrls->add($shortUrl);
            $shortUrl->setCreator($this);
        }

        return $this;
    }

    public function removeDeleteDate(ShortUrl $shortUrl): static
    {
        if ($this->shortUrls->removeElement($shortUrl)) {
            // set the owning side to null (unless already changed)
            if ($shortUrl->getCreator() === $this) {
                $shortUrl->setCreator(null);
            }
        }

        return $this;
    }
}
