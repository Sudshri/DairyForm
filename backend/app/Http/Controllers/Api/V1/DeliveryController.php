<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DeliveryPincode;
use Illuminate\Http\JsonResponse;

class DeliveryController extends Controller
{
    /** GET /delivery/check-pincode/{pincode} */
    public function checkPincode(string $pincode): JsonResponse
    {
        $record = DeliveryPincode::where('pincode', $pincode)
            ->where('is_active', true)
            ->first();

        if (! $record) {
            return $this->success([
                'serviceable'     => false,
                'pincode'         => $pincode,
                'message'         => 'Sorry, we do not deliver to this pincode yet.',
            ]);
        }

        return $this->success([
            'serviceable'          => true,
            'pincode'              => $record->pincode,
            'area_name'            => $record->area_name,
            'city'                 => $record->city,
            'state'                => $record->state,
            'delivery_charge'      => $record->delivery_charge,
            'free_delivery_above'  => $record->free_delivery_above,
            'estimated_days'       => $record->estimated_days,
            'cut_off_time'         => $record->cut_off_time,
            'is_express_available' => $record->is_express_available,
            'express_charge'       => $record->express_charge,
            'express_hours'        => $record->express_hours,
        ]);
    }
}
