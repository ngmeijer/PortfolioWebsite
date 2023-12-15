<?php
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://nilsmeijer.com'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

// Get the directory path from the query parameter
$path = isset($_GET['path']) ? $_GET['path'] : '';

// Get the list of directories
$directories = array_filter(glob($path . '/*'), 'is_dir');

// Get files
$files = array_filter(glob($path . '/*'), 'is_file');

$result = ['directories' => $directories, 'files' => $files, 'path' => $path];

echo json_encode($result);
?>