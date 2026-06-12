<?php

namespace Database\Seeders;

use App\Models\DeliveryPincode;
use Illuminate\Database\Seeder;

class DeliveryPincodeSeeder extends Seeder
{
    public function run(): void
    {
        $pincodes = [
            // Pune
            ['411001', 'Shivajinagar',   'Pune',   'Maharashtra', 0,   500, 1, '09:00', true,  30, 4],
            ['411002', 'Camp',            'Pune',   'Maharashtra', 0,   500, 1, '09:00', true,  30, 4],
            ['411013', 'Hadapsar',        'Pune',   'Maharashtra', 20,  800, 1, '08:00', true,  30, 5],
            ['411014', 'Ghorpadi',        'Pune',   'Maharashtra', 20,  800, 1, '08:00', false, 0,  null],
            ['411028', 'Viman Nagar',     'Pune',   'Maharashtra', 0,   500, 1, '09:00', true,  30, 4],
            ['411045', 'Magarpatta',      'Pune',   'Maharashtra', 0,   500, 1, '09:00', true,  35, 3],
            ['411057', 'Kharadi',         'Pune',   'Maharashtra', 20,  800, 1, '08:30', false, 0,  null],
            ['411021', 'Hinjewadi',       'Pune',   'Maharashtra', 30, 1000, 1, '08:00', false, 0,  null],
            // Mumbai
            ['400001', 'Fort',            'Mumbai', 'Maharashtra', 40, 1000, 2, null, false, 0, null],
            ['400051', 'Bandra West',     'Mumbai', 'Maharashtra', 40, 1000, 2, null, false, 0, null],
            ['400069', 'Powai',           'Mumbai', 'Maharashtra', 40, 1000, 2, null, false, 0, null],
            // Nashik
            ['422001', 'Nashik Road',     'Nashik', 'Maharashtra', 50, 1500, 2, null, false, 0, null],
            ['422002', 'Nashik City',     'Nashik', 'Maharashtra', 50, 1500, 2, null, false, 0, null],
        ];

        foreach ($pincodes as $p) {
            [
                $pincode, $area, $city, $state,
                $charge, $freeAbove, $days,
                $cutOff, $isExpress, $expressCharge, $expressHours
            ] = $p;

            DeliveryPincode::create([
                'pincode'                => $pincode,
                'area_name'             => $area,
                'city'                  => $city,
                'state'                 => $state,
                'delivery_charge'       => $charge,
                'free_delivery_above'   => $freeAbove,
                'estimated_days'        => $days,
                'cut_off_time'          => $cutOff,
                'is_active'             => true,
                'is_express_available'  => $isExpress,
                'express_charge'        => $expressCharge ?: null,
                'express_hours'         => $expressHours,
            ]);
        }
    }
}
