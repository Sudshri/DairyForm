<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\OtpVerification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class OtpController extends Controller
{
    /** Send a 6-digit OTP to the given phone number. */
    public function send(Request $request): JsonResponse
    {
        $data  = $request->validate(['phone' => ['required', 'string', 'max:15']]);
        $phone = $data['phone'];

        // Exhaust previous pending OTPs
        OtpVerification::where('phone', $phone)->where('is_verified', false)
            ->update(['attempts' => 5]);

        $otp = (string) random_int(100000, 999999);

        OtpVerification::create([
            'phone'      => $phone,
            'otp'        => Hash::make($otp),
            'purpose'    => $request->input('purpose', 'login'),
            'expires_at' => now()->addMinutes(10),
            'ip_address' => $request->ip(),
        ]);

        // TODO: replace with real SMS gateway (Twilio / MSG91)
        // SmsService::send($phone, "Your DairyForm OTP: {$otp}");

        $response = ['message' => 'OTP sent successfully', 'expires_in_seconds' => 600];

        if (app()->isLocal()) {
            $response['otp_dev_only'] = $otp;  // expose in local env only
        }

        return $this->success($response);
    }

    /** Verify OTP, then sign in or create the user. */
    public function verify(Request $request): JsonResponse
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'max:15'],
            'otp'   => ['required', 'string', 'size:6'],
        ]);

        $record = OtpVerification::where('phone', $data['phone'])
            ->where('is_verified', false)
            ->where('attempts', '<', 5)
            ->where('expires_at', '>', now())
            ->latest()->first();

        if (! $record) {
            return $this->error('OTP expired or not found. Request a new one.', 422);
        }

        if (! Hash::check($data['otp'], $record->otp)) {
            $record->increment('attempts');
            $left = max(0, 5 - $record->attempts);
            return $this->error("Invalid OTP. {$left} attempt(s) remaining.", 422);
        }

        $record->update(['is_verified' => true, 'verified_at' => now()]);

        $user = User::firstOrCreate(
            ['phone' => $data['phone']],
            ['name' => 'User#' . substr($data['phone'], -4), 'role' => 'customer', 'is_active' => true]
        );

        if (! $user->is_active) {
            return $this->error('Account suspended. Contact support.', 403);
        }

        $user->update(['phone_verified_at' => now(), 'last_login_at' => now()]);
        $token = $user->createToken('api-token')->plainTextToken;

        return $this->success(['user' => $user, 'token' => $token], 'Login successful');
    }
}
