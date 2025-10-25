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
    /**
     * Проверить, включена ли двухфакторная аутентификация у пользователя.
     *
     * @return bool
     */
    public function hasEnabledTwoFactorAuthentication(): bool
    {
        return ! is_null($this->two_factor_secret) && ! is_null($this->two_factor_confirmed_at);
    }

    /**
     * Сгенерировать и получить векторное изображение QR-кода.
     *
     * @return string
     */
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

    /**
     * Получить ссылку на сгенерированный QR-код.
     *
     * @return string
     */
    public function twoFactorQrCodeUrl(): string
    {
        return Google2FA::getQRCodeUrl(
            config('app.name'),
            $this->email,
            $this->two_factor_secret,
        );
    }

    /**
     * Заменить указанный код восстановления после использования.
     *
     * @param string $code
     * @return void
     */
    public function replaceRecoveryCode(string $code): void
    {
        $this->forceFill([
            'two_factor_recovery_codes' => json_encode(array_map(
                function ($recoveryCode) use ($code) {
                    return $recoveryCode === $code
                        ? $this->generateRecoveryCode()
                        : $recoveryCode;
                },
                json_decode($this->two_factor_recovery_codes)
            )),
        ])->save();
    }

    /**
     * Сгенерировать новый код восстановления.
     *
     * @return string
     */
    public function generateRecoveryCode(): string
    {
        return Str::random(10) . '-' . Str::random(10);
    }
}
