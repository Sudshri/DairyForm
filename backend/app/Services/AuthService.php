<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private readonly UserRepositoryInterface $userRepository) {}

    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $user  = $this->userRepository->create($data);
        $token = $user->createToken('api-token')->plainTextToken;

        return compact('user', 'token');
    }

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke old tokens if single-session is desired
        // $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return compact('user', 'token');
    }

    public function refresh(User $user): string
    {
        $user->currentAccessToken()->delete();

        return $user->createToken('api-token')->plainTextToken;
    }
}
