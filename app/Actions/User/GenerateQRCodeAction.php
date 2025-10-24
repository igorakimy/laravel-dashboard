<?php

namespace App\Actions\User;

use BaconQrCode\Renderer\Color\Rgb;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\Fill;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Google2FA;

class GenerateQRCodeAction
{
    public function handle(string $holder, string $secret): string
    {
        $QRContent = Google2FA::getQRCodeUrl(
            config('app.name'),
            $holder,
            $secret
        );

        $renderer = new ImageRenderer(
            new RendererStyle(
                size: 200,
                margin: 0,
                fill: Fill::uniformColor(
                    new Rgb(255, 255, 255),
                    new Rgb(0, 0, 0),
                )
            ),
            new SvgImageBackEnd
        );

        $writer = new Writer($renderer);

        return 'data:image/svg+xml;base64,' . base64_encode($writer->writeString($QRContent));
    }
}
