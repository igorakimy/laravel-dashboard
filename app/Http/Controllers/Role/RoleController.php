<?php

namespace App\Http\Controllers\Role;

use App\Actions\Role\CreateRoleAction;
use App\Actions\Role\DeleteRoleAction;
use App\Actions\Role\UpdateRoleAction;
use App\Enums\PermissionsEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller implements HasMiddleware
{
    /**
     * @return Middleware[]
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:' . PermissionsEnum::ROLES_VIEW->value, only: ['index']),
            new Middleware('permission:' . PermissionsEnum::ROLES_CREATE->value, only: ['create', 'store']),
            new Middleware('permission:' . PermissionsEnum::ROLES_EDIT->value, only: ['edit', 'update']),
            new Middleware('permission:' . PermissionsEnum::ROLES_DELETE->value, only: ['destroy']),
        ];
    }

    /**
     * Отобразить страницу со списком всех ролей.
     *
     * @return Response
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')->get();

        return Inertia::render('roles/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Отобразить страницу создания новой роли.
     *
     * @return Response
     */
    public function create(): Response
    {
        $groupedPermissions = Permission::all()->groupBy('group');

        return Inertia::render('roles/form', [
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    /**
     * Обработать запрос на создание новой роли.
     *
     * @param StoreRoleRequest $request
     * @param CreateRoleAction $createRole
     * @return RedirectResponse
     */
    public function store(StoreRoleRequest $request, CreateRoleAction $createRole): RedirectResponse
    {
        $createRole->handle($request);

        return to_route('roles.index')
            ->with('success', __('roles.success.created'));
    }

    /**
     * Отобразить страницу редактирования роли.
     *
     * @param Role $role
     * @return Response
     */
    public function edit(Role $role): Response
    {
        $groupedPermissions = Permission::all()->groupBy('group');

        $role->load('permissions');

        return Inertia::render('roles/form', [
            'role' => $role,
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    /**
     * Обработать запрос на изменение роли.
     *
     * @param Role $role
     * @param UpdateRoleRequest $request
     * @param UpdateRoleAction $updateRole
     * @return RedirectResponse
     */
    public function update(Role $role, UpdateRoleRequest $request, UpdateRoleAction $updateRole): RedirectResponse
    {
        $updateRole->handle($role, $request);

        return to_route('roles.index')
            ->with('success', __('roles.success.updated'));
    }

    /**
     * Обработать запрос на удаление роли.
     *
     * @param Role $role
     * @param DeleteRoleAction $deleteRole
     * @return RedirectResponse
     */
    public function destroy(Role $role, DeleteRoleAction $deleteRole): RedirectResponse
    {
        $deleteRole->handle($role);

        return to_route('roles.index')
            ->with('success', __('roles.success.deleted'));
    }
}
