<?php

namespace App\Http\Controllers\User;

use App\Actions\User\CreateUserAction;
use App\Actions\User\UpdateUserAction;
use App\Data\Common\FilteringData;
use App\Data\Common\PaginationData;
use App\Data\Common\SortingData;
use App\Data\User\CreateUserData;
use App\Data\User\UpdateUserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\BulkBanUserRequest;
use App\Http\Requests\User\BulkDeleteUserRequest;
use App\Http\Requests\User\IndexUserRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Отобразить список пользователей с сортировкой, фильтрацией и пагинацией.
     */
    public function index(IndexUserRequest $request): Response
    {
        $sortingData = SortingData::from($request);
        $filteringData = FilteringData::from($request);
        $paginationData = PaginationData::from($request);

        $queryParams = [
            'sort_by' => $sortingData->sort_by,
            'sort_dir' => $sortingData->sort_dir,
            'search' => $filteringData->search,
            'per_page' => $paginationData->per_page,
            'page' => $paginationData->page,
        ];

        $query = User::query()->with('roles');

        if ($request->filled('sort_by') && $sortingData->sort_by === 'roles') {
            $query->orderByLeftPowerJoins('roles.name', $sortingData->sort_dir);
        }

        if ($request->filled('search')) {
            $query->where('users.name', 'ilike', "%$filteringData->search%");
        }

        if ($request->filled('sort_by') && $sortingData->sort_by !== 'roles') {
            $query->orderBy('users.' . $sortingData->sort_by, $sortingData->sort_dir);
        }

        $users = $query
            ->paginate($paginationData->per_page)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => UserResource::collection($users)->additional([
                'query_params' => $queryParams,
            ]),
        ]);
    }

    /**
     * Отобразить форму для создания нового пользователя.
     */
    public function create(): Response
    {
        $roles = Role::select(['id', 'name', 'display_name'])->get();

        return Inertia::render('users/form', [
            'roles' => $roles,
        ]);
    }

    /**
     * Обработать запрос на добавление нового пользователя.
     */
    public function store(StoreUserRequest $request, CreateUserAction $createUser): RedirectResponse
    {
        if (!$createUser->handle(CreateUserData::from($request))) {
            return to_route('users.index')
                ->with('error', __('users.error.created'));
        }

        return to_route('users.index')
            ->with('success', __('users.success.created'));
    }

    /**
     * Отобразить форму для редактирования данных пользователя.
     */
    public function edit(User $user): Response
    {
        $roles = Role::select(['id', 'name', 'display_name'])->get();

        return Inertia::render('users/form', [
            'user' => $user,
            'roles' => $roles,
            'currentRoles' => $user->roles->pluck('name'),
        ]);
    }

    /**
     * Обработать запрос на обновление данных пользователя.
     */
    public function update(UpdateUserRequest $request, User $user, UpdateUserAction $updateUser): RedirectResponse
    {
        $updateUser->handle($user, UpdateUserData::from($request));

        return to_route('users.index')
            ->with('success', __('users.success.updated'));
    }

    /**
     * Удалить пользователя.
     */
    public function destroy(User $user): RedirectResponse
    {
        if (!$user->delete()) {
            return back()->with('error', 'Failed to delete user.');
        }

        return to_route('users.index')
            ->with('success', __('users.success.deleted'));
    }

    /**
     * Удалить несколько пользователей по идентификаторам.
     *
     * @param BulkDeleteUserRequest $request
     * @return RedirectResponse
     */
    public function bulkDelete(BulkDeleteUserRequest $request): RedirectResponse
    {
        User::whereIn('id', $request->validated('ids'))->delete();

        return to_route('users.index')
            ->with('success', __('users.success.bulk_deleted'));
    }

    /**
     * Забанить несколько пользователей по идентификаторам.
     *
     * @param BulkBanUserRequest $request
     * @return RedirectResponse
     */
    public function bulkBan(BulkBanUserRequest $request): RedirectResponse
    {
        $bannableUsers = User::whereIn('id', $request->validated('ids'))->get();

        foreach ($bannableUsers as $user) {
            if (! $this->isCurrentUser($user)) {
                $user->ban();
            }
        }

        return to_route('users.index')
            ->with('success', __('users.success.bulk_banned'));
    }

    /**
     * Забанить пользователя.
     *
     * @param User $user
     * @return RedirectResponse
     */
    public function ban(User $user): RedirectResponse
    {
        if (! $this->isCurrentUser($user)) {
            $user->ban();
        }

        return to_route('users.index')
            ->with('success', __('users.success.banned'));
    }

    /**
     * Разбанить пользователя.
     *
     * @param User $user
     * @return RedirectResponse
     */
    public function unban(User $user): RedirectResponse
    {
        $user->unban();

        return to_route('users.index')
            ->with('success', __('users.success.unbanned'));
    }
}
