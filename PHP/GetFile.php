<?php
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://nilsmeijer.com'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

// Get the file path from the query parameter
$dataFromJavascript = isset($_GET['data']) ? $_GET['data'] : '';
$filePath = $dataFromJavascript;

// Normalize the path to handle different slashes and case variations
$normalizedPath = rtrim($filePath, DIRECTORY_SEPARATOR);
#$normalizedPath = str_replace(DIRECTORY_SEPARATOR, '/', $normalizedPath);

// Separate the parent directory and target file
$parentDirectory = dirname($normalizedPath);
$targetFile = basename($normalizedPath);

$contents = scandir($parentDirectory);

// Perform case-insensitive comparison
$fileExists = false;
$actualFileName = null;
foreach ($contents as $item) {
    if (strcasecmp($item, $targetFile) === 0 && is_file($parentDirectory . DIRECTORY_SEPARATOR . $item)) {
        $fileExists = true;
        $actualFileName = $item; // Capture the actual file name
        break;
    }
}

$result = [];

if ($fileExists) {
    // Read the contents of the file
    $fileContent = file_get_contents($parentDirectory . DIRECTORY_SEPARATOR . $actualFileName);

    if ($fileContent === false) {
        echo 'Failed to read file content.';
    } else {
        // Process or display the file content
        $result = ['FileName' => $actualFileName, 'FileContent' => $fileContent];
        echo json_encode($result);
    }
} else {
    $result = ['FileContent' => 'Error while reading file:' . $fileContent];
    echo json_encode($result);
}
?>