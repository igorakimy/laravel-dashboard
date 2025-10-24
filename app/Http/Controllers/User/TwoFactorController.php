<?php

namespace App\Http\Controllers\User;

use App\Actions\User\ConfirmTwoFactorAuthAction;
use App\Actions\User\DisableTwoFactorAction;
use App\Actions\User\EnableTwoFactorAction;
use App\Actions\User\GenerateNewRecoveryCodesAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Exceptions\IncompatibleWithGoogleAuthenticatorException;
use PragmaRX\Google2FA\Exceptions\InvalidCharactersException;
use PragmaRX\Google2FA\Exceptions\SecretKeyTooShortException;
use Symfony\Component\HttpFoundation\Response as StatusCode;

class TwoFactorController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('user/two-factor', [
            'requireConfirmation' => true,
            'twoFactorEnabled' => $request->user()->hasEnabledTwoFactorAuthentication(),
        ]);
    }

    /**
     * Включить двухфакторную аутентификацию.
     *
     * @param Request $request
     * @param EnableTwoFactorAction $enableTwoFactor
     * @return RedirectResponse
     * @throws IncompatibleWithGoogleAuthenticatorException
     * @throws InvalidCharactersException
     * @throws SecretKeyTooShortException
     */
    public function enable(Request $request, EnableTwoFactorAction $enableTwoFactor): RedirectResponse
    {
        $enableTwoFactor->handle($request);

        return back();
    }

    /**
     * Отключить двухфакторную аутентификацию.
     *
     * @param Request $request
     * @param DisableTwoFactorAction $disableTwoFactor
     * @return RedirectResponse
     */
    public function disable(Request $request, DisableTwoFactorAction $disableTwoFactor): RedirectResponse
    {
        $disableTwoFactor->handle($request);

        return back()->with('status', __('two-factor.disabled'));
    }

    /**
     * @param Request $request
     * @param ConfirmTwoFactorAuthAction $confirmTwoFactorAuth
     * @return RedirectResponse
     * @throws IncompatibleWithGoogleAuthenticatorException
     * @throws InvalidCharactersException
     * @throws SecretKeyTooShortException
     */
    public function confirm(Request $request, ConfirmTwoFactorAuthAction $confirmTwoFactorAuth): RedirectResponse
    {
        if (!$confirmTwoFactorAuth->handle($request)) {
            throw ValidationException::withMessages([
                'code' => __('Указанный вами код недействителен.'),
            ])->errorBag('confirmTwoFactorAuth');
        }

        return back()->with('status', __('two-factor.success'));
    }

    /**
     * Получить QR-код.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function qrCode(Request $request): JsonResponse
    {
        if (is_null($request->user()->two_factor_secret)) {
            return response()->json();
        }

        return response()->json([
            'svg' => $request->user()->twoFactorQrCodeSvg(),
            'url' => $request->user()->twoFactorQrCodeUrl(),
        ]);
    }

    /**
     * Получить коды восстановления.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function showRecoveryCodes(Request $request): JsonResponse
    {
        if (!$request->user()->two_factor_secret ||
            !$request->user()->two_factor_recovery_codes) {
            return response()->json();
        }

        return response()->json(json_decode(
            $request->user()->two_factor_recovery_codes,
            associative: true,
        ));
    }

    /**
     * Сгенерировать новые коды восстановления.
     *
     * @param Request $request
     * @param GenerateNewRecoveryCodesAction $generateNewRecoveryCodes
     * @return RedirectResponse
     */
    public function generateRecoveryCodes(
        Request                        $request,
        GenerateNewRecoveryCodesAction $generateNewRecoveryCodes
    ): RedirectResponse
    {
        $generateNewRecoveryCodes->handle($request);

        return back();
    }

    /**
     * Получить код активации двухфакторной аутентификации.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function secretKey(Request $request): JsonResponse
    {
        if (is_null($request->user()->two_factor_secret)) {
            abort(
                StatusCode::HTTP_NOT_FOUND,
                __('Не удалось включить двухфакторную аутентификацию.')
            );
        }

        return response()->json([
            'secretKey' => $request->user()->two_factor_secret,
        ]);
    }
}
