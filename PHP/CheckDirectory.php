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

// Normalize the path to handle different slashes and case variations
$normalizedPath = rtrim($finalPath, DIRECTORY_SEPARATOR);
$normalizedPath = str_replace(DIRECTORY_SEPARATOR, '/', $normalizedPath);

// Separate the parent directory and target directory
$parentDirectory = dirname($normalizedPath);
$targetDirectory = basename($normalizedPath);

$contents = scandir($parentDirectory);

// Perform case-insensitive comparison
$directoryExists = false;
$actualDirectoryName = null;
foreach ($contents as $item) {
    if (strcasecmp($item, $targetDirectory) === 0 && is_dir($parentDirectory . DIRECTORY_SEPARATOR . $item)) {
        $directoryExists = true;
        $actualDirectoryName = $item; // Capture the actual directory name
        break;
    }
}

$result = ['Valid' => $directoryExists, 'Name' => $actualDirectoryName];
echo json_encode($result);
?>
