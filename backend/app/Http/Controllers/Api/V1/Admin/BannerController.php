<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\StorageHelper;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /**
     * FormData sends booleans as the strings "true"/"false".
     * Laravel's 'boolean' rule only accepts 1/0/"1"/"0"/true/false.
     * This helper normalizes the field in-place before validation.
     */
    private function castBoolean(Request $request, string ...$fields): void
    {
        foreach ($fields as $field) {
            if ($request->has($field)) {
                $request->merge([
                    $field => \filter_var($request->input($field), FILTER_VALIDATE_BOOLEAN),
                ]);
            }
        }
    }

    public function index(Request $request): JsonResponse
    {
        $banners = Banner::when($request->input('type'), fn($q, $v) => $q->where('banner_type', $v))
            ->orderBy('sort_order')
            ->paginate($request->integer('per_page', 20));

        return $this->paginated($banners);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(Banner::findOrFail($id));
    }

    public function store(Request $request): JsonResponse
    {
        $this->castBoolean($request, 'is_active', 'open_in_new_tab');

        $data = $request->validate([
            'title'           => ['required', 'string', 'max:150'],
            'subtitle'        => ['nullable', 'string', 'max:250'],
            'banner_type'     => ['required', 'in:slider,offer,popup,category_strip,full_width'],
            'link_type'       => ['nullable', 'in:product,category,offer,external,none'],
            'link_id'         => ['nullable', 'integer'],
            'link_url'        => ['nullable', 'url', 'max:500'],
            'cta_text'        => ['nullable', 'string', 'max:50'],
            'sort_order'      => ['nullable', 'integer'],
            'is_active'       => ['nullable', 'boolean'],
            'open_in_new_tab' => ['nullable', 'boolean'],
            'start_date'      => ['nullable', 'date'],
            'end_date'        => ['nullable', 'date'],
            'image'           => ['nullable', 'image', 'max:3072', 'mimes:jpg,jpeg,png,webp'],
            'mobile_image'    => ['nullable', 'image', 'max:2048'],
        ]);

        // Store files and save the complete APP_URL-prefixed URL
        if ($request->hasFile('image')) {
            $data['image'] = StorageHelper::storePublic($request->file('image'), 'banners');
        }
        if ($request->hasFile('mobile_image')) {
            $data['mobile_image'] = StorageHelper::storePublic($request->file('mobile_image'), 'banners');
        }

        return $this->created(Banner::create($data), 'Banner created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->castBoolean($request, 'is_active', 'open_in_new_tab');

        $banner = Banner::findOrFail($id);

        $data = $request->validate([
            'title'           => ['sometimes', 'string', 'max:150'],
            'subtitle'        => ['nullable', 'string', 'max:250'],
            'banner_type'     => ['sometimes', 'in:slider,offer,popup,category_strip,full_width'],
            'link_type'       => ['nullable', 'in:product,category,offer,external,none'],
            'link_id'         => ['nullable', 'integer'],
            'link_url'        => ['nullable', 'url', 'max:500'],
            'cta_text'        => ['nullable', 'string', 'max:50'],
            'sort_order'      => ['nullable', 'integer'],
            'is_active'       => ['nullable', 'boolean'],
            'start_date'      => ['nullable', 'date'],
            'end_date'        => ['nullable', 'date'],
            'image'           => ['nullable', 'image', 'max:3072'],
            'mobile_image'    => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            StorageHelper::deleteByUrl($banner->image); // delete old file
            $data['image'] = StorageHelper::storePublic($request->file('image'), 'banners');
        }
        if ($request->hasFile('mobile_image')) {
            StorageHelper::deleteByUrl($banner->mobile_image);
            $data['mobile_image'] = StorageHelper::storePublic($request->file('mobile_image'), 'banners');
        }

        $banner->update($data);
        return $this->success($banner->fresh(), 'Banner updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $banner = Banner::findOrFail($id);
        StorageHelper::deleteByUrl($banner->image);
        StorageHelper::deleteByUrl($banner->mobile_image);
        $banner->delete();
        return $this->noContent('Banner deleted.');
    }
}
