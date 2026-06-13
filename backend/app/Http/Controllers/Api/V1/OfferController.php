<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\JsonResponse;

class OfferController extends Controller
{
    /** GET /offers — returns active offers for public display */
    public function index(): JsonResponse
    {
        $offers = Offer::where('is_active', true)
            ->orderByDesc('created_at')
            ->limit(8)
            ->get();

        return $this->success($offers);
    }
}
