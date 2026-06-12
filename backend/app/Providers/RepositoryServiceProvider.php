<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);

        // Add bindings here as new repositories are created:
        // $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        // $this->app->bind(OrderRepositoryInterface::class,   OrderRepository::class);
    }
}
