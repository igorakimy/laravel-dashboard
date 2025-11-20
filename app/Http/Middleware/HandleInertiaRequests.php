<?php

namespace App\Http\Middleware;

use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request),
            [
                'appName' => config('app.name'),
                'auth' => [
                    'user' => fn () => $request->user()
                        ? $request->user()->only(['id', 'name', 'email'])
                        : null,
                    'permissions' => fn () => $request->user()?->getAllPermissions(),
                    'isAdmin' => fn () => $request->user()?->isAdmin(),
                ],
                'flash' => [
                    'success' => fn() => $request->session()->get('success'),
                    'error' => fn() => $request->session()->get('error'),
                ],
                'ziggy' => fn () => [
                    ...(new Ziggy)->toArray(),
                    'location' => $request->url(),
                    'query' => $request->query(),
                ],
                'settings' => [
                    'general' => fn() => app(GeneralSettings::class)->toArray(),
                ]
            ]
        );
    }
}
