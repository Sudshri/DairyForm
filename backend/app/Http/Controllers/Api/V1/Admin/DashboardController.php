<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariantInventory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $today     = now()->toDateString();
        $monthStart= now()->startOfMonth();

        $todayRevenue  = Order::where('payment_status', 'paid')
            ->whereDate('created_at', $today)->sum('total_amount');

        $monthRevenue  = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $monthStart)->sum('total_amount');

        $totalOrders   = Order::count();
        $pendingOrders = Order::whereIn('order_status', ['placed', 'confirmed', 'processing'])->count();
        $totalUsers    = User::where('role', 'customer')->count();
        $totalProducts = Product::where('status', 'active')->count();
        $lowStockCount = ProductVariantInventory::whereIn('stock_status', ['low_stock', 'out_of_stock'])->count();

        // 6-month revenue trend
        $revenueTrend = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month'   => date('M', mktime(0, 0, 0, (int) substr($r->month, 5), 1)),
                'revenue' => (float) $r->revenue,
                'orders'  => (int) $r->orders,
            ]);

        // 7-day milk (order items) trend
        $milkTrend = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.created_at', '>=', now()->subDays(7))
            ->whereIn('weight_unit', ['ml', 'l'])
            ->select(
                DB::raw("DATE(orders.created_at) as date"),
                DB::raw("SUM(CASE WHEN weight_unit='l'  THEN weight * qty
                                  WHEN weight_unit='ml' THEN weight * qty / 1000
                             END) as liters")
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($r) => ['date' => $r->date, 'liters' => round((float) $r->liters, 1)]);

        return $this->success([
            'today_revenue'  => round($todayRevenue, 2),
            'month_revenue'  => round($monthRevenue, 2),
            'total_orders'   => $totalOrders,
            'pending_orders' => $pendingOrders,
            'total_users'    => $totalUsers,
            'total_products' => $totalProducts,
            'low_stock_count'=> $lowStockCount,
            'revenue_trend'  => $revenueTrend,
            'milk_trend'     => $milkTrend,
        ]);
    }
}
