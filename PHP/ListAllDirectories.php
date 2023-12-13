<?php
header('Access-Control-Allow-Origin: *');

// Get the directory path from the query parameter
$path = isset($_GET['path']) ? $_GET['path'] :'';

// Get the list of directories
$directories = array_filter(glob($path . '/*'), 'is_dir');

// Get files
$files = array_filter(glob($path . '/*'), 'is_file');

$result = ['directories' => $directories, 'files' => $files];

echo json_encode($result);
?>