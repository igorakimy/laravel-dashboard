<?php

namespace App\Traits;

use BaconQrCode\Renderer\Color\Rgb;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\Fill;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Google2FA;
use Illuminate\Support\Str;

trait TwoFactorAuthenticatable
{
    public function hasEnabledTwoFactorAuthentication(): bool
    {
        return ! is_null($this->two_factor_secret) &&
               ! is_null($this->two_factor_confirmed_at);
    }

    public function twoFactorQrCodeSvg(): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(
                size: 200,
                margin: 1,
                fill: Fill::uniformColor(
                    new Rgb(255, 255, 255),
                    new Rgb(0, 0, 0)
                )
            ),
            new SvgImageBackEnd,
        );

        $writer = new Writer($renderer);

        $svg = $writer->writeString($this->twoFactorQrCodeUrl());

        return trim(substr($svg, strpos($svg, "\n") + 1));
    }

    public function twoFactorQrCodeUrl(): string
    {
        return Google2FA::getQRCodeUrl(
            config('app.name'),
            $this->email,
            $this->two_factor_secret,
        );
    }

    public function generateRecoveryCode(): string
    {
        return Str::random(10) . '-' . Str::random(10);
    }
}
