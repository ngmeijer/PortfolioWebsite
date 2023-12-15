<?php
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://nilsmeijer.com'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

// Get the directory path from the query parameter
$dataFromJavascript = isset($_GET['data']) ? $_GET['data'] : '';
$finalPath = $dataFromJavascript;

try {
    if (is_file($finalPath)) {
        $fileContents = file_get_contents($finalPath);
        if ($fileContents === false) {
            echo 'Error reading file';
        } else {
            echo $fileContents;
        }
    } else {
        echo "Invalid path of file: " . $finalPath;
    }
} catch (Exception $e) {
    // Handle other exceptions
    echo 'Exception: ' . $e->getMessage();
}
?>