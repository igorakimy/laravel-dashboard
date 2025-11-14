<?php

namespace App\Http\Requests\User;

use App\Enums\PermissionsEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && $this->user()->can(PermissionsEnum::USERS_VIEW);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string',
            'page' => 'nullable|integer',
            'per_page' => 'nullable|integer',
            'sort_by' => 'nullable|string|in:' . implode(',', $this->sortableFieldsAndRelations()),
            'sort_dir' => 'nullable|string|in:asc,desc',
        ];
    }

    private function sortableFieldsAndRelations(): array
    {
        return [
            'name',
            'email',
            'roles',
        ];
    }
}
