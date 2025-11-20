<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\GeneralSettingsRequest;
use App\Settings\GeneralSettings;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GeneralSettingsController extends Controller
{
    /**
     * Отобразить форму для редактирования общих настроек.
     *
     * @param GeneralSettings $settings
     * @return Response
     */
    public function edit(GeneralSettings $settings): Response
    {
        return Inertia::render('settings/general/form', [
            'app_name' => $settings->app_name,
            'app_description' => $settings->app_description,
        ]);
    }

    /**
     * Обработать запрос на обновление общих настроек приложения.
     *
     * @param GeneralSettings $settings
     * @param GeneralSettingsRequest $request
     * @return RedirectResponse
     */
    public function update(GeneralSettings $settings, GeneralSettingsRequest $request): RedirectResponse
    {
        $settings->app_name = $request->input('app_name');
        $settings->app_description = $request->input('app_description');

        $settings->save();

        return back()->with(
            'success',
            __('settings.success.updated')
        );
    }
}
