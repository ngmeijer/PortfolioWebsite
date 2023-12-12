<?php
header('Access-Control-Allow-Origin: *');

// Get the directory path from the query parameter
$directoryPath = __DIR__ . '/C:';

// Get the list of directories
$directories = array_filter(glob($directoryPath . '/*'), 'is_dir');

// Get files
$files = array_filter(glob($directoryPath . '/*'), 'is_file');

$result = ['directories' => $directories, 'files' => $files];

echo json_encode($result);
?>