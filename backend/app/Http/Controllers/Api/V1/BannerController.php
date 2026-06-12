<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /** GET /banners?type=slider */
    public function index(Request $request): JsonResponse
    {
        $banners = Banner::where('is_active', true)
            ->when($request->type, fn($q, $v) => $q->where('banner_type', $v))
            ->where(fn($q) => $q->whereNull('start_date')->orWhere('start_date', '<=', now()))
            ->where(fn($q) => $q->whereNull('end_date')->orWhere('end_date', '>=', now()))
            ->orderBy('sort_order')
            ->get();

        return $this->success($banners);
    }
}
