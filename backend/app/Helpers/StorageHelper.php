<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class StorageHelper
{
    /**
     * Store a file and return only the relative path (e.g. "products/1/abc.png").
     * Never store full URLs in the database — use fullUrl() at read time.
     */
    public static function storePublic(\Illuminate\Http\UploadedFile $file, string $directory): string
    {
        return $file->store($directory, 'public');
    }

    /**
     * Convert a stored path to a full URL using the current APP_URL.
     *
     * Handles three input formats:
     *   1. Relative path  → "products/1/abc.png"
     *   2. Old full URL   → "http://localhost:8000/storage/products/1/abc.png"
     *   3. Any other host → "https://old-server.com/storage/products/1/abc.png"
     *
     * Always returns: "{APP_URL}/storage/{relative-path}"
     */
    public static function fullUrl(?string $path): ?string
    {
        if (empty($path)) return null;

        // Already a URL — strip the host+/storage/ prefix to get relative path
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            // Extract everything after "/storage/"
            $pos = strpos($path, '/storage/');
            if ($pos !== false) {
                $path = substr($path, $pos + \strlen('/storage/'));
            }
            // If no /storage/ found, return as-is (external image)
            else {
                return $path;
            }
        }

        // Strip leading "storage/" if accidentally saved with it
        $path = ltrim($path, '/');
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, \strlen('storage/'));
        }

        $base = rtrim(config('app.url'), '/');
        return "{$base}/storage/{$path}";
    }

    /**
     * Delete a file from public storage given its full URL or relative path.
     */
    public static function deleteByUrl(?string $urlOrPath): void
    {
        if (! $urlOrPath) return;

        if (str_starts_with($urlOrPath, 'http://') || str_starts_with($urlOrPath, 'https://')) {
            $pos = strpos($urlOrPath, '/storage/');
            if ($pos === false) return;
            $diskPath = substr($urlOrPath, $pos + \strlen('/storage/'));
        } else {
            $diskPath = ltrim($urlOrPath, '/');
            if (str_starts_with($diskPath, 'storage/')) {
                $diskPath = substr($diskPath, \strlen('storage/'));
            }
        }

        Storage::disk('public')->delete($diskPath);
    }
}
