<?php
require_once('vendor/autoload.php');

use \Dejurin\GoogleTranslateForFree;

header('Content-Type: text/html; charset =utf-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');

$data = file_get_contents("http://cadic.name/whoisgen/gen.php");

$data = mb_convert_encoding($data, 'UTF-8', 'KOI8-R');

$address = getAddress();
$name = getName();
$name = translate("ru","en",$name);
$phone = getPhone();
$birth = getBirth();
$words = getWords();

$object = [
    'name' => $name,
    'birth' => $birth,
    'address' => $address,
    'phone' => $phone,
    'words' => $words,
];

echo json_encode($object);

function getBirth()
{
    global $data;
    $posStart = strpos($data, "birth-date:");
    $posEnd = strpos($data, "type:") - 1;
    return substr($data, $posStart + 12, $posEnd - $posStart - 12);
}

function getPhone()
{
    global $data;
    $posStart = strpos($data, "phone:");
    $posEnd = strpos($data, "state:") - 1;

    return substr($data, $posStart + 7, $posEnd - $posStart - 7);
}

function getName()
{
    global $data;
    $posStart = strpos($data, "person-r:");
    $posEnd = strpos($data, "passport") - 1;

    return substr($data, $posStart + 10, $posEnd - $posStart - 10);
}

function getAddress()
{
    global $data;
    $posStart = strpos($data, "p-addr:");
    $posEnd = strpos($data, "phone") - 1;
    $string = substr($data, $posStart + 8, $posEnd - $posStart - 8);
    $posEnd = strrpos($string, ',');
    $address = substr($string, 0, $posEnd);
    $array = explode(",", $address);
    $ready_array = array();

    for ($i = 0; $i < count($array); $i++) {
        $index = 0;
        switch ($i) {
            case 0:
                $index = 0;
                break;
            case 1:
            case 3:
                $index = 4;
                break;
            case 2:
            case 4:
                $index = 6;
                break;
        }
        $str = substr($array[$i], $index);
        array_push($ready_array,$str);
    }

    $object = [
        "index" => $ready_array[0],
        "city" => translate('ru','en',$ready_array[1]),
        "street" => translate('ru','en',$ready_array[2]),
        "house" => $ready_array[3],
        "flat" => $ready_array[4]
    ];
    return json_encode($object);
}

function getWords()
{
    $words = file_get_contents("http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=3&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5");
    $words = json_decode($words);
    $array = array();

    foreach ($words as $obj) {
        array_push($array, $obj->word);
    }

    return json_encode($array);
}

function translate($source, $target, $text)
{
    $tr = new GoogleTranslateForFree();
    return $tr->translate($source, $target, $text);

}
