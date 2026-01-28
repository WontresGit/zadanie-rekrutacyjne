<?php
namespace App\Service;

class UrlShortener
{
    public function createShortCode(string $uuid, string $url, bool $isPublic): string
    {
        $normalizedUrl = $this->normalizeUrl($url);
        $input = $uuid . "|" . $normalizedUrl . "|" . $isPublic;
        $hash = hash('sha256', $input, true);
        $code = rtrim(strtr(base64_encode($hash), '+/', '-_'), '=');
        return substr($code, 0, 8);
    }

    function normalizeUrl(string $url): string
    {
        $url = trim($url);
        $url = strtolower($url);
        return rtrim($url, '/');
    }
}
