<?php 

require_once('xmlHandler.php');

// if (!isset($_COOKIE["name"])) {
//    header("Location: error.html");
//     exit;
// }

// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}
// clean chat record
//$xmlh->openFile();
//$user_elements = $xmlh->getElement("users");
//$msg_elements = $xmlh->getElement("messages");
//while($xmlh->getElement("user"))
//{
//    $xmlh->removeElement($user_elements, $xmlh->getElement("user"));
//}
//while($xmlh->getElement("message"))
//{
  //  $xmlh->removeElement($msg_elements, $xmlh->getElement("message"));
//}
//$xmlh->saveFile();

// clean the user's log on record (his name)
$xmlh->openFile();
$usrs = $xmlh->getChildNodes("user");
foreach ($usrs as $usr) {
    if($usr->getAttribute("name") ==  $_POST["name"])
    {
        $usr->parentNode->removeChild($usr);
    }
}
$xmlh->saveFile();
// delete user photo
unlink("images/".$_POST["name"].".png");
// clean cookie
if (isset($_COOKIE["name"]))
{
    setcookie("name","");
}
// reload
//echo "<script>window.parent.frames['message'].document.getElementById('username').setAttribute('value','');</script>";
echo "<script>window.parent.location.reload()</script>";

?>
