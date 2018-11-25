<?php

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    return;
}

// get the name from cookie
$name = $_COOKIE["name"];

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Add Message Page</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script type="text/javascript">
        //<![CDATA[
        function load() {
            var name = "<?php print $name; ?>";

            //delete this line 
            //window.parent.frames["message"].document.getElementById("username").setAttribute("value", name)

            setTimeout("document.getElementById('msg').focus()",100);
        }
        function select(color){
            document.getElementById("color").value = color;
        }
        //]]>
        </script>
    </head>

    <body style="text-align: left" onload="load()">
        <form action="add_message.php" method="post">
            <table border="0" cellspacing="5" cellpadding="0">
                <tr>
                    <td>What is your message?</td>
                </tr>
                <tr>
                    <td><input class="text" type="text" name="message" id="msg" style= "width: 780px" /></td>
                </tr>
                <td> Choose your color:
                    
						<button style="background-color:black;width:30px;height:30px" onclick="select('black');return false;"/>
						<button style="background-color:yellow;width:30px;height:30px" onclick="select('yellow');return false;"/>
						<button style="background-color:red;width:30px;height:30px" onclick="select('red');return false;"/>
						<button style="background-color:green;width:30px;height:30px" onclick="select('green');return false;"/>
						<button style="background-color:blue;width:30px;height:30px" onclick="select('blue');return false;"/>
						<button style="background-color:pink;width:30px;height:30px" onclick="select('pink');return false;"/>
					
                </td>
                <tr>
                    <td><input class="button" type="submit" value="Send Your Message" style="width: 200px" /></td>
                </tr>
            </table>
            <input type="hidden" id="color" value="black" name="color">
        </form>
        
        <!--logout button-->
        <form action="logout.php" method="post">
            <table border="0" cellspacing="5" cellpadding="0">
                <tr>
                    <td><input class="button" type="submit" value="Log Out" style="width: 200px" /></td>
                </tr>
            </table>
        </form>

        <!--logout button-->
        <a href="onlineUsrList.php" target="_blank">
            <table border="0" cellspacing="5" cellpadding="0">
                <tr>
                    <td><input class="button" type="submit" value="Show Online User List" style="width: 200px" /></td>
                </tr>
            </table>
        </a>

    </body>
</html>
