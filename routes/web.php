<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Route::get('/', function () {
//    return Inertia::render('Welcome', [
//        'canLogin' => Route::has('login'),
//        'canRegister' => Route::has('register'),
//        'laravelVersion' => Application::VERSION,
//        'phpVersion' => PHP_VERSION,
//    ]);
//});

Route::middleware(['auth', 'verified'])->group(function (){
    Route::get('/', [\App\Http\Controllers\HomeController::class, 'home'])
        ->name('dashboard');
    Route::get('/user/{user}',[\App\Http\Controllers\MessageController::class, 'byUser'])
        ->name('chat.user');
    Route::get('/group/{group}',[\App\Http\Controllers\MessageController::class, 'byGroup'])
        ->name('chat.group');
    Route::post('/message', [\App\Http\Controllers\MessageController::class, 'store'])
        ->name('message.store');
    Route::delete('/message/{message}', [\App\Http\Controllers\MessageController::class, 'destroy'])
        ->name('message.destroy');
    Route::get('/message/older/{message}',[\App\Http\Controllers\MessageController::class,'loadOlder'])
        ->name('message.loadOlder');
});

//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
