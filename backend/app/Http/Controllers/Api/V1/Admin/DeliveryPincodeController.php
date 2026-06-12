<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryPincode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryPincodeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pincodes = DeliveryPincode::when($request->input('city'), fn($q, $v) => $q->where('city', $v))
            ->when($request->input('search'), fn($q, $v) =>
                $q->where('pincode', 'like', "%{$v}%")
                  ->orWhere('area_name', 'like', "%{$v}%")
            )
            ->orderBy('city')->orderBy('pincode')
            ->paginate($request->integer('per_page', 25));

        return $this->paginated($pincodes);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(DeliveryPincode::findOrFail($id));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'pincode'               => ['required', 'string', 'max:10', 'unique:delivery_pincodes,pincode'],
            'area_name'             => ['nullable', 'string', 'max:150'],
            'city'                  => ['required', 'string', 'max:100'],
            'state'                 => ['required', 'string', 'max:100'],
            'delivery_charge'       => ['nullable', 'numeric', 'min:0'],
            'free_delivery_above'   => ['nullable', 'numeric', 'min:0'],
            'estimated_days'        => ['nullable', 'integer', 'min:1'],
            'cut_off_time'          => ['nullable', 'date_format:H:i'],
            'is_active'             => ['nullable', 'boolean'],
            'is_express_available'  => ['nullable', 'boolean'],
            'express_charge'        => ['nullable', 'numeric', 'min:0'],
            'express_hours'         => ['nullable', 'integer', 'min:1'],
        ]);

        return $this->created(DeliveryPincode::create($data), 'Pincode added.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $pincode = DeliveryPincode::findOrFail($id);

        $data = $request->validate([
            'pincode'              => ["sometimes", "unique:delivery_pincodes,pincode,{$id}"],
            'area_name'            => ['nullable', 'string', 'max:150'],
            'city'                 => ['sometimes', 'string', 'max:100'],
            'state'                => ['sometimes', 'string', 'max:100'],
            'delivery_charge'      => ['nullable', 'numeric', 'min:0'],
            'free_delivery_above'  => ['nullable', 'numeric', 'min:0'],
            'estimated_days'       => ['nullable', 'integer', 'min:1'],
            'cut_off_time'         => ['nullable', 'date_format:H:i'],
            'is_active'            => ['nullable', 'boolean'],
            'is_express_available' => ['nullable', 'boolean'],
            'express_charge'       => ['nullable', 'numeric', 'min:0'],
            'express_hours'        => ['nullable', 'integer', 'min:1'],
        ]);

        $pincode->update($data);
        return $this->success($pincode->fresh(), 'Pincode updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        DeliveryPincode::findOrFail($id)->delete();
        return $this->noContent('Pincode deleted.');
    }
}
