<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\BulkOrderMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BulkOrderController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name'    => ['required', 'string', 'max:100'],
            'mobile'       => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'email'        => ['nullable', 'email', 'max:150'],
            'category'     => ['required', 'string', 'max:100'],
            'address'      => ['required', 'string', 'min:10'],
            'requirements' => ['required', 'string', 'min:20'],
        ]);

        Mail::to(config('mail.from.address'))->send(new BulkOrderMail($data));

        return $this->success(null, 'Bulk order inquiry received.');
    }
}
