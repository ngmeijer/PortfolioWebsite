<?php
header('Access-Control-Allow-Origin: *');

$currentDirectory = __DIR__ . '/C:/';  

// Get the directory path from the query parameter
$dataFromJavascript = isset($_GET['data']) ? $_GET['data'] : '';

if (is_dir($currentDirectory . $dataFromJavascript)) {
    echo "true";
} else {
    echo "false";
}
?>