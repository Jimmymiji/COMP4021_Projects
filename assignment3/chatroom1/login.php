<?php

// if name is not in the post data, exit
if (!isset($_POST["name"])) {
    header("Location: error.html");
    exit;
}

require_once('xmlHandler.php');

// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}

// open the existing XML file
$xmlh->openFile();

// get the 'users' element
$users_element = $xmlh->getElement("users");

// create a 'user' element
$user_element = $xmlh->addElement($users_element, "user");

// add the user name
$xmlh->setAttribute($user_element, "name", $_POST["name"]);

// save the XML file
$xmlh->saveFile();

// set the name to the cookie
setcookie("name", $_POST["name"]);

// dealing with the uploaded photo
if(isset($_FILES['usrimg'])){
	$file_type=strtolower(end(explode('.',$_FILES['usrimg']['name'])));
	$file_tmp = $_FILES['usrimg']['tmp_name'];
	$expensions = array("jpeg","jpg","png");
	// check if it is an image
    if(in_array($file_type,$expensions)=== false){
         $error="Wrong file type, please choose a JPEG or PNG file.";
		 print_r($error);
    }
	else {
		move_uploaded_file($file_tmp,"images/".$_POST["name"]);
        echo "Successfully upload image";
		// Cookie done, redirect to client.php (to avoid reloading of page from the client)
		header("Location: client.php");
	}
}



?>
