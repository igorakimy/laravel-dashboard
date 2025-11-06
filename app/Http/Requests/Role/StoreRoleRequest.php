<?php

namespace App\Http\Requests\Role;

use App\Enums\PermissionsEnum;
use App\Enums\RolesEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && $this->user()->can(PermissionsEnum::ROLES_CREATE);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:roles,name',
            'display_name' => 'required|string|max:255',
            'permissions' => [
                Rule::requiredIf(fn () => $this->input('name') !== RolesEnum::ADMIN->value),
                'array',
            ],
            'permissions.*.name' => 'string|exists:permissions,name',
        ];
    }
}
