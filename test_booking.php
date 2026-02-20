<?php

$data = [
    'motorcycle_id' => 1,
    'customer_name' => 'John Doe',
    'customer_phone' => '08123456789',
    'customer_address' => 'Test',
    'start_date' => date('Y-m-d', strtotime('+1 day')),
    'end_date' => date('Y-m-d', strtotime('+2 days'))
];

$ch = curl_init('http://localhost:8000/api/bookings');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

file_put_contents('out.txt', "HTTP Code: $httpCode\nResponse: $response\n");
