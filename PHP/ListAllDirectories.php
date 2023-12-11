<?php
header('Access-Control-Allow-Origin: *');

// Get the directory path from the query parameter
$directoryPath = __DIR__ . 'C:';

// Get the list of directories
$directories = array_filter(glob($directoryPath . '/*'), 'is_dir');

// Return the list of directories as JSON
echo json_encode(['directories' => $directories]);
?>