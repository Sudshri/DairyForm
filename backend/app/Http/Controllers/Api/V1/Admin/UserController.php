<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::withCount(['orders'])
            ->when($request->input('role'), fn($q, $v) => $q->where('role', $v))
            ->when($request->input('search'), fn($q, $v) =>
                $q->where('name', 'like', "%{$v}%")
                  ->orWhere('phone', 'like', "%{$v}%")
                  ->orWhere('email', 'like', "%{$v}%")
            )
            ->when($request->input('is_active') !== null, fn($q) =>
                $q->where('is_active', $request->boolean('is_active'))
            )
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 20));

        return $this->paginated($users);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::withCount(['orders'])
            ->with(['addresses', 'orders' => fn($q) => $q->latest()->limit(5)])
            ->findOrFail($id);

        return $this->success($user);
    }

    /** PATCH /admin/users/{id}/toggle-status */
    public function toggleStatus(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return $this->error('Cannot modify admin account status.', 403);
        }

        $user->update(['is_active' => ! $user->is_active]);

        // Revoke all tokens if suspending
        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        $status = $user->is_active ? 'activated' : 'suspended';
        return $this->success(['is_active' => $user->is_active], "User {$status}.");
    }
}
