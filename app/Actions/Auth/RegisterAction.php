<?php

namespace App\Actions\Auth;

use App\Actions\User\CreateUserAction;
use App\Data\Auth\RegisterData;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Auth\Events\Registered;

readonly final class RegisterAction
{
    public function __construct(
        private CreateUserAction $createUser
    ) {
    }

    /**
     * Зарегистрировать пользователя и авторизовать его.
     *
     * @param RegisterRequest $request
     * @return void
     */
    public function handle(RegisterRequest $request): void
    {
        $data = RegisterData::from($request);

        $user = $this->createUser->handle($data);

        event(new Registered($user));

        auth()->login($user);
    }
}
