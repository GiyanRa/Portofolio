<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
echo method_exists($app, 'useStoragePath') ? 'yes' : 'no';
