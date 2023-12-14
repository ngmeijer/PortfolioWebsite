<?php
header('Access-Control-Allow-Origin: *');

$rootDirectory = __DIR__ . '/MainDrive/';

// Get the directory path from the query parameter
$dataFromJavascript = isset($_GET['data']) ? $_GET['data'] : '';

echo "coming from php";

if (is_dir("/". $dataFromJavascript)) {
    echo "true";
} else {
    echo "false";
}
?>