<?php

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    return;
}

// get the name from cookie
$name = $_COOKIE["name"];

// get the message content
$message = $_POST["message"];
if (trim($message) == "") $message = "__EMPTY__";
$color = $_POST["color"];
require_once('xmlHandler.php');

// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}

// create the following DOM tree structure for a message
// and add it to the chatroom XML file
//
// <message name="...">...</message>
//
/* Add your code here */
$xmlh->openFile();
$messages_element = $xmlh->getElement("messages");
// add hyperlink in message

// The Regular Expression filter
//$reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
// Check if there is a url in the text
//if(preg_match($reg_exUrl,$message, $url)) {
       // make the urls hyper links
       //$message = preg_replace($reg_exUrl,"<a href="{$url[0]}">{$url[0]}</a>" ,$message);
	   //$replacement = "<a href=\" $url[0] \"> $url[0] </a >";
	   //$message = preg_replace($reg_exUrl,$replacement,$message);
//} else {
 //      // if no urls in the text do nothing
//       $message = $message;
//}

$message_element = $xmlh->addElement($messages_element,"message");
$xmlh->setAttribute($message_element, "name", $name);
$xmlh->setAttribute($message_element, "color", $color);
$xmlh->addText($message_element, $message);
$xmlh->saveFile();
header("Location: client.php");

?>
