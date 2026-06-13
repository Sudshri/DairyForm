<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\PartnerInquiryAdminMail;
use App\Mail\PartnerInquiryConfirmMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PartnerInquiryController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name'     => ['required', 'string', 'max:100'],
            'mobile'        => ['required', 'string', 'max:20'],
            'email'         => ['required', 'email', 'max:150'],
            'business_name' => ['required', 'string', 'max:150'],
            'address'       => ['required', 'string', 'max:500'],
            'message'       => ['required', 'string', 'min:20'],
        ]);

        // Notify admin
        Mail::to(config('mail.from.address'))->send(new PartnerInquiryAdminMail($data));

        // Confirm to applicant
        Mail::to($data['email'])->send(new PartnerInquiryConfirmMail($data));

        return $this->success(null, 'Partnership application submitted successfully.');
    }
}
