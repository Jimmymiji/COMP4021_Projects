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
if(isset($_FILES["usrimg"]))
{
    $file_type = strtolower(end(explode('.',$_FILES["usrimg"]["name"])));
    $file_tmp = $_FILES["usrimg"]["tmp_name"];
    $extension = array("jpeg","jpg","png");
    if ($_FILES["usrimg"]["size"] > 2000000 || $_FILES["usrimg"]["size"] == 0 ) {
        $error = "Uploaded image is too large";
        print_r($error);
        header("Location: error.html");
    }
    else
    {
        if(!in_array($file_type,$extension)){
        $error = "Wrong file type or no photo submitted, please choose a JPG or PNG file\n ";
        print_r($error);
        header("Location: error.html");
        }
        else{
        move_uploaded_file($file_tmp,"images/".$_POST["name"].".png");
        echo "Sucessfully upload file";
        header("Location: client.php");
        }
    }
}
// Cookie done, redirect to client.php (to avoid reloading of page from the client)
//header("Location: client.php");

?>
