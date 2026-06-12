<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'                  => ['required', 'string', 'max:150'],
            'email'                 => ['nullable', 'email', 'unique:users,email'],
            'phone'                 => ['required', 'string', 'max:15', 'unique:users,phone'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user  = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'] ?? null,
            'phone'    => $data['phone'],
            'password' => Hash::make($data['password']),
            'role'     => 'customer',
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user'    => new UserResource($user),
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => ['required_without:phone', 'email', 'nullable'],
            'phone'    => ['required_without:email', 'string', 'nullable'],
            'password' => ['required', 'string'],
        ]);

        $user = isset($data['email'])
            ? User::where('email', $data['email'])->first()
            : User::where('phone', $data['phone'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Your account has been deactivated.'], 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user'  => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(new UserResource($request->user()));
    }
}
