<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class StorageHelper
{
    /**
     * Store a file on the public disk and return its full absolute URL.
     *
     * Storage::url() only returns a path starting with "/storage/…".
     * This helper concatenates APP_URL so the frontend receives a complete URL
     * like: http://localhost:8000/storage/banners/abc.jpg
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @param  string  $directory   e.g. 'banners', 'products/5'
     * @return string  Full public URL
     */
    public static function storePublic(\Illuminate\Http\UploadedFile $file, string $directory): string
    {
        $relativePath = $file->store($directory, 'public');
        return self::fullUrl($relativePath);
    }

    /**
     * Convert a storage-relative path to a full absolute URL.
     * Works for paths returned by UploadedFile::store() or Storage::path().
     */
    public static function fullUrl(string $relativePath): string
    {
        // Build the URL from APP_URL directly to avoid double-prefixing
        // that can happen when Storage::disk('public')->url() already returns
        // a full URL in some Laravel/filesystem configurations.
        $base = rtrim(config('app.url'), '/');
        $path = ltrim($relativePath, '/');
        return "{$base}/storage/{$path}";
    }

    /**
     * Delete a file from public storage given its full URL.
     * Strips APP_URL + '/storage' prefix to get the disk-relative path.
     */
    public static function deleteByUrl(?string $fullUrl): void
    {
        if (! $fullUrl) return;

        $base = rtrim(config('app.url'), '/') . '/storage/';
        if (str_starts_with($fullUrl, $base)) {
            $diskPath = substr($fullUrl, \strlen($base));
            Storage::disk('public')->delete($diskPath);
        }
    }
}
