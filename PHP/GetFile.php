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
$result;

try {
    // Use glob for case-insensitive filename matching
    $matchingFiles = glob($finalPath, GLOB_BRACE | GLOB_NOCHECK | GLOB_NOESCAPE);
    $notEmpty = !empty($matchingFiles);
    $isFile = is_file($matchingFiles[0]);

    if (!empty($matchingFiles) && is_file($matchingFiles[0])) {
        $fileContents = file_get_contents($matchingFiles[0]);
        if ($fileContents === false) {
            $result = ['FileData' => 'Could not retrieve data.'];
        } else {
            $result = ['FileData' => $fileContents, 'FilePath' => $matchingFiles[0]];
        }
        echo json_encode($result);
    } else {
        $result = ['FileData' => 'Invalid.', 'FilePath' => $finalPath, 'Is file?' => $isFile, 'Matching files:' => $matchingFiles];
        echo json_encode($result);
    }
} catch (Exception $e) {
    // Handle other exceptions
    echo 'Exception: ' . $e->getMessage();
}
?>
