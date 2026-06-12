<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /** GET /addresses */
    public function index(Request $request): JsonResponse
    {
        $addresses = UserAddress::where('user_id', $request->user()->id)
            ->orderByDesc('is_default')
            ->get();

        return $this->success($addresses);
    }

    /** POST /addresses */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name'      => ['required', 'string', 'max:150'],
            'phone'          => ['required', 'string', 'max:15'],
            'alternate_phone'=> ['nullable', 'string', 'max:15'],
            'address_line1'  => ['required', 'string', 'max:300'],
            'address_line2'  => ['nullable', 'string', 'max:300'],
            'landmark'       => ['nullable', 'string', 'max:150'],
            'city'           => ['required', 'string', 'max:100'],
            'state'          => ['required', 'string', 'max:100'],
            'pincode'        => ['required', 'string', 'max:10'],
            'address_type'   => ['nullable', 'in:home,office,other'],
            'is_default'     => ['nullable', 'boolean'],
        ]);

        $userId = $request->user()->id;

        if ($request->boolean('is_default')) {
            UserAddress::where('user_id', $userId)->update(['is_default' => false]);
        }

        // First address is always default
        if (! UserAddress::where('user_id', $userId)->exists()) {
            $data['is_default'] = true;
        }

        $address = UserAddress::create(['user_id' => $userId] + $data);

        return $this->created($address, 'Address added.');
    }

    /** GET /addresses/{id} */
    public function show(Request $request, int $id): JsonResponse
    {
        $address = UserAddress::where('user_id', $request->user()->id)->findOrFail($id);
        return $this->success($address);
    }

    /** PUT /addresses/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $address = UserAddress::where('user_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'full_name'    => ['sometimes', 'string', 'max:150'],
            'phone'        => ['sometimes', 'string', 'max:15'],
            'address_line1'=> ['sometimes', 'string', 'max:300'],
            'address_line2'=> ['nullable', 'string', 'max:300'],
            'landmark'     => ['nullable', 'string', 'max:150'],
            'city'         => ['sometimes', 'string', 'max:100'],
            'state'        => ['sometimes', 'string', 'max:100'],
            'pincode'      => ['sometimes', 'string', 'max:10'],
            'address_type' => ['nullable', 'in:home,office,other'],
        ]);

        $address->update($data);

        return $this->success($address->fresh(), 'Address updated.');
    }

    /** DELETE /addresses/{id} */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $address = UserAddress::where('user_id', $request->user()->id)->findOrFail($id);

        if ($address->is_default) {
            return $this->error('Cannot delete your default address. Set another as default first.', 422);
        }

        $address->delete();
        return $this->noContent('Address deleted.');
    }

    /** PUT /addresses/{id}/set-default */
    public function setDefault(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()->id;
        UserAddress::where('user_id', $userId)->update(['is_default' => false]);
        UserAddress::where('user_id', $userId)->findOrFail($id)->update(['is_default' => true]);

        return $this->success(null, 'Default address updated.');
    }
}
