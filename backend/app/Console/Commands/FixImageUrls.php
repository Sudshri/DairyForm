<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixImageUrls extends Command
{
    protected $signature   = 'images:fix-urls';
    protected $description = 'Strip hardcoded host from stored image URLs, leaving only the relative path';

    public function handle(): int
    {
        $tables = [
            ['table' => 'product_images', 'columns' => ['image_path', 'thumbnail_path']],
            ['table' => 'banners',        'columns' => ['image', 'mobile_image']],
        ];

        foreach ($tables as ['table' => $table, 'columns' => $columns]) {
            foreach ($columns as $col) {
                // Replace any full URL prefix up to and including "/storage/" with just the path
                $affected = DB::table($table)
                    ->whereNotNull($col)
                    ->where($col, 'like', '%/storage/%')
                    ->get(['id', $col]);

                foreach ($affected as $row) {
                    $original = $row->$col;
                    $pos = strpos($original, '/storage/');
                    if ($pos === false) continue;

                    $relativePath = substr($original, $pos + \strlen('/storage/'));

                    DB::table($table)->where('id', $row->id)->update([$col => $relativePath]);
                }

                $this->info("  {$table}.{$col}: fixed " . count($affected) . " rows");
            }
        }

        $this->info('Done. All image paths are now relative. Accessors will build correct URLs from APP_URL.');
        return self::SUCCESS;
    }
}
