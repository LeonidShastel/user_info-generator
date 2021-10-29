<?php

$option = $_GET["option"];
$optionRequest = array(
    'http'=>array(
        'method'=>'GET',
        'header'=>"x-rapidapi-host: temp-email3.p.rapidapi.com\r\n"."x-rapidapi-key: fb3bde1a24msh6ad6e0a7c9ce7b0p16e7cbjsn5e847382848a\r\n"
    )
);

if($option==='create'){
    $context = stream_context_create($optionRequest);
    $file = file_get_contents('https://temp-email3.p.rapidapi.com/api/new', false, $context);
    echo $file;
}
else if($option==='messages'){
    $mail = $_GET['mail'];
    $context = stream_context_create($optionRequest);
    $url = "https://temp-email3.p.rapidapi.com/api/messages/".$mail;
    $file = file_get_contents($url, false, $context);
    echo $file;
}
else if($option==='message'){
    $mail = $_GET['mail'];
    $idMessage = $_GET['id'];
    $context = stream_context_create($optionRequest);
    $url = "https://temp-email3.p.rapidapi.com/api/message/".$mail."/".$idMessage;
    $file = file_get_contents($url, false, $context);
    echo $file;
}