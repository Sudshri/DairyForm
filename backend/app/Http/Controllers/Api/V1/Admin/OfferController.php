<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\VariantOffer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $offers = Offer::withCount('variantOffers')
            ->when($request->input('search'), fn($q, $v) =>
                $q->where('offer_name', 'like', "%{$v}%")
                  ->orWhere('offer_code', 'like', "%{$v}%")
            )
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 15));

        return $this->paginated($offers);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(
            Offer::with(['variantOffers.variant.product:id,product_name'])->findOrFail($id)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'offer_name'               => ['required', 'string', 'max:150'],
            'offer_code'               => ['nullable', 'string', 'max:50', 'unique:offers,offer_code'],
            'description'              => ['nullable', 'string'],
            'offer_type'               => ['required', 'in:percentage,fixed,bogo,category'],
            'discount_value'           => ['required', 'numeric', 'min:0'],
            'min_order_amount'         => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount'      => ['nullable', 'numeric', 'min:0'],
            'applicable_category_id'   => ['nullable', 'integer', 'exists:categories,id'],
            'start_date'               => ['required', 'date'],
            'end_date'                 => ['required', 'date', 'after:start_date'],
            'is_active'                => ['nullable', 'boolean'],
            'is_public'                => ['nullable', 'boolean'],
            'usage_limit'              => ['nullable', 'integer', 'min:1'],
            'per_user_limit'           => ['nullable', 'integer', 'min:1'],
        ]);

        return $this->created(Offer::create($data), 'Offer created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $offer = Offer::findOrFail($id);

        $data = $request->validate([
            'offer_name'           => ['sometimes', 'string', 'max:150'],
            'offer_code'           => ['nullable', 'string', "unique:offers,offer_code,{$id}"],
            'offer_type'           => ['sometimes', 'in:percentage,fixed,bogo,category'],
            'discount_value'       => ['sometimes', 'numeric', 'min:0'],
            'min_order_amount'     => ['nullable', 'numeric'],
            'max_discount_amount'  => ['nullable', 'numeric'],
            'start_date'           => ['sometimes', 'date'],
            'end_date'             => ['sometimes', 'date'],
            'is_active'            => ['nullable', 'boolean'],
            'is_public'            => ['nullable', 'boolean'],
            'usage_limit'          => ['nullable', 'integer', 'min:1'],
            'per_user_limit'       => ['nullable', 'integer', 'min:1'],
        ]);

        $offer->update($data);
        return $this->success($offer->fresh(), 'Offer updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        Offer::findOrFail($id)->delete();
        return $this->noContent('Offer deleted.');
    }

    /** POST /admin/offers/{offerId}/assign-variant */
    public function assignVariant(Request $request, int $offerId): JsonResponse
    {
        $data = $request->validate([
            'product_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
        ]);

        $offer = Offer::findOrFail($offerId);

        $variantOffer = VariantOffer::updateOrCreate(
            ['product_variant_id' => $data['product_variant_id'], 'offer_id' => $offer->id],
            ['is_active' => true]
        );

        return $this->success($variantOffer, 'Offer assigned to variant.');
    }

    /** DELETE /admin/offers/{offerId}/remove-variant/{variantId} */
    public function removeVariant(int $offerId, int $variantId): JsonResponse
    {
        VariantOffer::where('offer_id', $offerId)
            ->where('product_variant_id', $variantId)
            ->firstOrFail()
            ->delete();

        return $this->noContent('Offer removed from variant.');
    }
}
