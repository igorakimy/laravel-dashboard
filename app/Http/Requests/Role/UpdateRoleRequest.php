<?php

namespace App\Http\Requests\Role;

use App\Enums\PermissionsEnum;
use App\Enums\RolesEnum;
use App\Models\Role;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property Role $role
 */
class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && $this->user()->can(PermissionsEnum::ROLES_EDIT);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($this->role),
            ],
            'display_name' => 'required|string|max:255',
            'permissions' => [
                'array',
                Rule::requiredIf($this->role->name !== RolesEnum::ADMIN->value),
            ],
            'permissions.*.name' => 'string|exists:permissions,name',
        ];
    }
}
