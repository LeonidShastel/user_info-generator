<?php

header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');

$_POST = json_decode(file_get_contents('php://input'), true);

$birth = $_POST['birth'];
$city = $_POST['city'];
$email = $_POST['email'];
$flat = $_POST['flat'];
$house = $_POST['house'];
$index = $_POST['index'];
$name = $_POST['name'];
$password = $_POST['password'];
$patronymic = $_POST['patronymic'];
$phone = $_POST['phone'];
$randomWords = $_POST['randomWords'];
$street = $_POST['street'];
$surName = $_POST['surName'];

createFiles();

function createFiles()
{
    global $name, $birth, $city, $email, $flat, $house,$index, $password, $patronymic, $phone,$randomWords,$street,$surName;
    $filename = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/user_generator/';

    $fp = fopen('fullInfo.txt', 'w+');
    $text = "{\r\n\t'email': '$email'\r\n\t'password': '$password'\r\n\t'name': '$name'\r\n\t'patronymic': '$patronymic'\r\n\t'surName': '$surName'\r\n\t'birth: '$birth'\r\n\t'randomWords': '$randomWords'\r\n\t'city': '$city'\r\n\t'street': '$street'\r\n\t'house': '$house'\r\n\t'flat': '$flat'\r\n\t'index': '$index'\r\n\t'phone': '$phone'\r\n}";
    fwrite($fp, $text);
    fclose($fp);

    $fp = fopen('emailInfo.txt', 'w+');
    $text = "{\r\n\t'email': '$email'\r\n\t'password': '$password'\r\n}";
    fwrite($fp, $text);
    fclose($fp);

    $object = [
        'fullInfo'=>$filename.'fullInfo.txt',
        'emailInfo'=>$filename.'emailInfo.txt'
    ];

    echo json_encode($object);
}
