<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Google2FA;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Closure;
use Illuminate\Support\Facades\Session;

class TwoFactorChallengeRequest extends FormRequest
{
    /**
     * Пользователь, который пытается авторизоваться.
     *
     * @var User|null
     */
    protected User|null $challengedUser = null;

    /**
     * Указывает, хотел ли пользователь, чтобы его запомнили после входа в систему.
     *
     * @var bool
     */
    protected bool $remember = false;

    /**
     * Определить, авторизован ли пользователь, чтобы выполнить этот запрос.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Получить правила валидации, чтобы применить их к запросу.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        if ($this->routeIs('two-factor.recovery')) {
            return [
                'recovery_code' => ['required', 'string', $this->hasValidRecoveryCode()]
            ];
        }

        return [
            'code' => ['required', 'string', $this->hasValidCode()]
        ];
    }

    /**
     * Проверить, валиден ли код подтверждения.
     *
     * @return Closure
     */
    protected function hasValidCode(): Closure
    {
        return function ($attribute, $value, $fail) {
            if (! $value) return;

            $isValid = Google2FA::verifyKey(
                $this->challengedUser()->two_factor_secret,
                $value
            );

            if (! $isValid) {
                $fail(__('Указанный вами код недействителен.'));
            }
        };
    }

    /**
     * Проверить валиден ли код восстановления.
     *
     * @return Closure
     */
    protected function hasValidRecoveryCode(): Closure
    {
        return function ($attribute, $value, $fail) {
            if (! $value) return;

            $recoveryCodes = $this->challengedUser()->two_factor_recovery_codes;
            $isValid = in_array($value, json_decode($recoveryCodes));

            if (! $isValid) {
                $fail(__('Указанный вами код восстановления недействителен'));
            }
        };
    }

    /**
     * Получить пользователя, который пытается авторизоваться.
     *
     * @throws AuthenticationException
     */
    public function challengedUser(): User|null
    {
        if ($this->challengedUser) {
            return $this->challengedUser;
        }

        /** @var UserProvider|User $authProvider */
        $authProvider = auth()->getProvider();
        $model = $authProvider->getModel();

        $hasSessionLoginId = Session::has('two_factor.login.id');
        $sessionLoginId = Session::get('two_factor.login.id');

        if (! $hasSessionLoginId || ! $user = $model::find($sessionLoginId)) {
            throw new AuthenticationException();
        }

        return $this->challengedUser = $user;
    }

    /**
     * Получить состояние кнопки "Запомнить меня" выбранного пользователем при авторизации.
     *
     * @return bool
     */
    public function remember(): bool
    {
        if (! isset($this->remember)) {
            $this->remember = Session::pull('two_factor.login.remember', false);
        }

        return $this->remember;
    }
}
