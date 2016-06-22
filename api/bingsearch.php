<?php
$account_key = "RtG4UXG+1kcMoxL8bMr11ahWsh0IcCI9PDj6IiIVE04";
$query = $_POST["query"];

$request = "https://api.datamarket.azure.com/Bing/Search/v1/Image?\$format=json&Query=%27".$query."%27&Market=%27ja-JP%27&Adult=%27Strict%27";

$cred = sprintf('Authorization: Basic %s', base64_encode($account_key . ":" . $account_key) );

$data = array(
    'http' => array(
        'request_fulluri' => true,
        'ignore_errors' => true,
        'header' => $cred,
    ),
);
$context = stream_context_create($data);
$result = file_get_contents($request, 0, $context);
$json = json_decode($result);
$results = $json->d->results;
foreach($results as $value){
    $urls[] = $value->MediaUrl;
}
echo json_encode($urls);
?>