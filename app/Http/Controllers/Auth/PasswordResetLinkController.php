<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\SendPasswordResetLinkAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetLinkRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PasswordResetLinkController extends Controller
{
    /**
     * Отобразить форму ввода email для сброса пароля.
     *
     * @param Request $request
     * @return Response
     */
    public function show(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status')
        ]);
    }

    /**
     * Отправить пользователю на email ссылку для сброса пароля.
     *
     * @param PasswordResetLinkRequest $request
     * @param SendPasswordResetLinkAction $sendPasswordResetLink
     * @return RedirectResponse
     */
    public function send(
        PasswordResetLinkRequest    $request,
        SendPasswordResetLinkAction $sendPasswordResetLink
    ): RedirectResponse
    {
        $sendPasswordResetLink->handle($request);

        return back()->with('status', __('Ссылка для сброса пароля была отправлена на указанный email'));
    }
}
