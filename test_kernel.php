<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create(
    '/api/bookings',
    'POST',
    [
        'motorcycle_id' => 1,
        'customer_name' => 'John',
        'customer_phone' => '081234567890',
        'customer_address' => 'Test',
        'start_date' => '2026-02-20',
        'end_date' => '2026-02-21'
    ],
    [],
    [],
    ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json']
);

$response = $kernel->handle($request);
file_put_contents('kernel_out.txt', "Status: " . $response->getStatusCode() . "\n" . $response->getContent());
echo "Done\n";
