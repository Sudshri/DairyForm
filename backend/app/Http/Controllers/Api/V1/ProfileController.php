<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /** GET /profile */
    public function show(Request $request): JsonResponse
    {
        return $this->success($request->user()->load('addresses'));
    }

    /** PUT /profile */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'         => ['sometimes', 'string', 'max:150'],
            'email'        => ['sometimes', 'nullable', 'email', 'unique:users,email,' . $user->id],
            'gender'       => ['sometimes', 'nullable', 'in:male,female,other'],
            'date_of_birth'=> ['sometimes', 'nullable', 'date', 'before:today'],
        ]);

        $user->update($data);

        return $this->success($user->fresh(), 'Profile updated.');
    }

    /** PUT /profile/change-password */
    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($data['password'])]);

        // Revoke all other tokens so other sessions are logged out
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return $this->success(null, 'Password changed successfully.');
    }

    /** PUT /profile/update-fcm-token */
    public function updateFcmToken(Request $request): JsonResponse
    {
        $request->validate(['fcm_token' => ['required', 'string']]);
        $request->user()->update(['fcm_token' => $request->fcm_token]);

        return $this->success(null, 'FCM token updated.');
    }
}
