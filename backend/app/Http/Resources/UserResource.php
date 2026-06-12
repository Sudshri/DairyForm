<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'email'              => $this->email,
            'phone'              => $this->phone,
            'avatar'             => $this->avatar,
            'gender'             => $this->gender,
            'date_of_birth'      => $this->date_of_birth?->format('Y-m-d'),
            'role'               => $this->role,
            'is_active'          => $this->is_active,
            'email_verified_at'  => $this->email_verified_at?->toIso8601String(),
            'phone_verified_at'  => $this->phone_verified_at?->toIso8601String(),
            'last_login_at'      => $this->last_login_at?->toIso8601String(),
            'created_at'         => $this->created_at->toIso8601String(),
        ];
    }
}
