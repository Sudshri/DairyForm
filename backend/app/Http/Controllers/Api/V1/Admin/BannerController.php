<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\StorageHelper;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    /** Convert empty strings to null so nullable validation rules pass */
    private function nullifyEmpty(Request $request, string ...$fields): void
    {
        foreach ($fields as $field) {
            if ($request->input($field) === '') {
                $request->merge([$field => null]);
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
        $this->nullifyEmpty($request, 'link_url', 'link_type', 'link_id', 'cta_text', 'subtitle', 'start_date', 'end_date');

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
        $banner = Banner::findOrFail($id);

        $this->castBoolean($request, 'is_active', 'open_in_new_tab');
        $this->nullifyEmpty($request, 'link_url', 'link_type', 'link_id', 'cta_text', 'subtitle', 'start_date', 'end_date');

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
            'open_in_new_tab' => ['nullable', 'boolean'],
            'start_date'      => ['nullable', 'date'],
            'end_date'        => ['nullable', 'date'],
        ]);

        if ($request->hasFile('image')) {
            $oldPath = $banner->getRawOriginal('image');
            if ($oldPath) Storage::disk('public')->delete($oldPath);
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        if ($request->hasFile('mobile_image')) {
            $oldPath = $banner->getRawOriginal('mobile_image');
            if ($oldPath) Storage::disk('public')->delete($oldPath);
            $data['mobile_image'] = $request->file('mobile_image')->store('banners', 'public');
        }

        $banner->update($data);
        return $this->success($banner->fresh(), 'Banner updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $banner = Banner::findOrFail($id);
        Storage::disk('public')->delete(array_filter([
            $banner->getRawOriginal('image'),
            $banner->getRawOriginal('mobile_image'),
        ]));
        $banner->delete();
        return $this->noContent('Banner deleted.');
    }
}
