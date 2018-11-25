<?php

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Online User List Page</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script language="javascript" type="text/javascript">
        //<![CDATA[
        var request;
        var usrListSize;

        function load() {
            usrListSize = 0;
            var node = document.getElementById("chatroom");
            getUpdate();
        }

        function getUpdate() {
            //request = new ActiveXObject("Microsoft.XMLHTTP");
            request =new XMLHttpRequest();
            request.onreadystatechange = stateChange;
            request.open("POST", "usrListServer.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("usrListSize=" + usrListSize);
        }

        function stateChange() {
            //alert("stateChange()");
            if (request.readyState == 4 && request.status == 200 && request.responseText) {
                var xmlDoc;
                try {
                    xmlDoc =new XMLHttpRequest();
                    xmlDoc.loadXML(request.responseText);
                } catch (e) {
                    var parser = new DOMParser();
                    xmlDoc = parser.parseFromString(request.responseText, "text/xml");
                }
                // TODO: count user number
                usrListSize = xmlDoc.getElementsByTagName("user").length;
                updateList(xmlDoc);
                getUpdate();
            }
        }

        function updateList(xmlDoc) {
            //alert("updateList(xmlDoc)");
            //point to the user nodes
            var users = xmlDoc.getElementsByTagName("user");
            // clean current usr list
            var elmtTable = document.getElementById('userList');
            var tableRows = elmtTable.getElementsByTagName('tr');
            var rowCount = tableRows.length;
            for (var x=rowCount-1; x>=0; x--) {
                elmtTable.deleteRow(i);
            }
            var table = document.getElementById("userList");
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = "User Image";
            cell2.innerHTML = "User Name";
            // create a string for the messages
            /* Add your code here */
            for(var i = 0;i<users.length;i++){
                var usr = users.item(i);
                var nameStr = usr.getAttribute("name");
                showUser(nameStr);
            }
        }

        function showUser(nameStr){
            //alert("show "+nameStr);
            //     var node = document.getElementById("userList");
            //     // Create the name text span
            //     var nameNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

            //     // Set the attributes and create the text
            //     nameNode.setAttribute("x", 100);
            //     nameNode.setAttribute("dy", 20);
            //     nameNode.appendChild(document.createTextNode(nameStr));

            //     // Add the name to the text node
            //     node.appendChild(nameNode);
            // Find a <table> element with id="myTable":
            var table = document.getElementById("userList");

            // Create an empty <tr> element and add it to the 1st position of the table:
            var row = table.insertRow(1);

            // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);

            // Add some text to the new cells:
            cell1.innerHTML = "<img src=\"images\\"+nameStr+".png\" border=1 height=50 width=50>";
            cell2.innerHTML = nameStr;
        }

        //]]>
        </script>
    </head>

    <body style="text-align: left" onload="load()">
    <svg width="800px" height="100px"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xhtml="http://www.w3.org/1999/xhtml"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:a="http://www.adobe.com/svg10-extensions" a:timeline="independent"
     >

    <g >                
        <text x="260" y="40" style="fill:blue;font-size:40px;font-weight:bold;text-anchor:middle">Online User List</text> 
    </g>
    </svg>
    <table  id="userList" width="400">
    </table>
    </body>
</html>
