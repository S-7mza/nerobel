<?php
/**
 * ==============================================================================
 * Nerobel Group · FlowOps SAV Gateway Zero-CORS Reverse Proxy
 * Compatible with PHP 8.0+
 * Relays Schema Queries, Ticket Submissions (with File Uploads), and Receipts.
 * ==============================================================================
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$targetBase = "https://savnerobel.nexenflow.com/api/public/sav-requests";

$pathInfo = $_SERVER['PATH_INFO'] ?? '';
if (empty($pathInfo) && isset($_GET['__proxy_path'])) {
    $pathInfo = '/' . ltrim($_GET['__proxy_path'], '/');
}

$queryString = $_SERVER['QUERY_STRING'] ?? '';
if (!empty($queryString)) {
    parse_str($queryString, $params);
    unset($params['__proxy_path']);
    $queryString = http_build_query($params);
}

$targetUrl = $targetBase . $pathInfo;
if (!empty($queryString)) {
    $targetUrl .= '?' . $queryString;
}

$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);

    $postData = [];
    foreach ($_POST as $k => $v) {
        $postData[$k] = $v;
    }
    foreach ($_FILES as $k => $file) {
        if (isset($file['error']) && $file['error'] === UPLOAD_ERR_OK && !empty($file['tmp_name'])) {
            $postData[$k] = new CURLFile($file['tmp_name'], $file['type'] ?: 'application/octet-stream', $file['name']);
        }
    }

    if (empty($postData)) {
        $raw = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $raw);
        $headers = [];
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    } else {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    }
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Gateway connection failure', 'detail' => $curlError]);
    exit;
}

http_response_code($httpCode ?: 200);
if ($contentType) {
    header('Content-Type: ' . $contentType);
}
echo $response;
