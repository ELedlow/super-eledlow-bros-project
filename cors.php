<?php

/* Handle CORS */

// Specify domains that are allowed
header('Access-Control-Allow-Origin: *');

// Specify allowed methods
header('Access-Control-Allow-Methods: Put, GET, POST, DELETE, OPTIONS');

// Additional headers
header('Access-Control-Allow-Headers: X-Requested-With,Authorization,Content-Type');

// Set age to one day to improve speed
header('Access-Control-Max-Age: 86400');

// Exit early to skip options requests
if(strtolower($_SERVER['REQUEST_METHOD']) == 'options') {
    exit();
}
?>