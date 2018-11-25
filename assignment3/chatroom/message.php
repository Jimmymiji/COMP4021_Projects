<?php

// get the name from cookie
$name = "";
if (isset($_COOKIE["name"])) {
    $name = $_COOKIE["name"];
}

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Message Page</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script language="javascript" type="text/javascript">
        //<![CDATA[
        var loadTimer = null;
        var request;
        var datasize;
        var lastMsgID;

        function load() {
            var username = document.getElementById("username");
            if (username.value == "") {
                if(document.cookie.match("name")!=null)window.location.reload();
                loadTimer = setTimeout("load()", 100);
                return;
            }

            loadTimer = null;
            datasize = 0;
            lastMsgID = 0;




            var node = document.getElementById("chatroom");
            //alert("make visible")
            node.style.setProperty("visibility", "visible", null);

            getUpdate();
        }

        function unload() {
            var username = document.getElementById("username");
            if (username.value != "") {
                //request = new ActiveXObject("Microsoft.XMLHTTP");
                request =new XMLHttpRequest();
                request.open("POST", "logout.php", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(null);
                username.value = "";
            }
            if (loadTimer != null) {
                loadTimer = null;
                clearTimeout("load()", 100);
            }
        }

        function getUpdate() {
            //request = new ActiveXObject("Microsoft.XMLHTTP");
            request =new XMLHttpRequest();
            request.onreadystatechange = stateChange;
            request.open("POST", "server.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("datasize=" + datasize);
        }

        function stateChange() {
            if (request.readyState == 4 && request.status == 200 && request.responseText) {
                var xmlDoc;
                try {
                    xmlDoc =new XMLHttpRequest();
                    xmlDoc.loadXML(request.responseText);
                } catch (e) {
                    var parser = new DOMParser();
                    xmlDoc = parser.parseFromString(request.responseText, "text/xml");
                }
                datasize = request.responseText.length;
                updateChat(xmlDoc);
                getUpdate();
            }
        }

        function updateChat(xmlDoc) {

            //point to the message nodes
            var messages = xmlDoc.getElementsByTagName("message");

            // create a string for the messages
            /* Add your code here */
            for(var i = lastMsgID;i<messages.length;i++){
                var msg = messages.item(i);
                var nameStr = msg.getAttribute("name");
                var color = msg.getAttribute("color");
                var contentStr = msg.innerHTML;
                showMessage(nameStr,contentStr,color);
            }
            lastMsgID = messages.length;
        }
        
        // helper function to add hyperlink in text
        function addHyperLink(str){
            var urlRegularExp = /(https?:\/\/[^\s]+)/g ;
            return str.replace(urlRegularExp,function(url){
                return '<a href="'+url+'">'+url+'</a>';
            });
        }

        function showMessage(nameStr, contentStr,color){
               
                var node = document.getElementById("chattext");
                // Create the name text span
                var nameNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

                // Set the attributes and create the text
                nameNode.setAttribute("x", 100);
                nameNode.setAttribute("dy", 20);
                nameNode.setAttribute("fill",color);
                nameNode.appendChild(document.createTextNode(nameStr));

                // Add the name to the text node
                node.appendChild(nameNode);

                // Create the score text span
                var contentNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

                // Set the attributes and create the text
                contentNode.setAttribute("x", 200);
                contentNode.setAttribute("fill", color);
                //conetentNode.appendChild(document.createTextNode(contentStr));
                // add hyperlink
                var currentIdx = 0;
                while(true)
                {
                    var str = null;
                    var url = null;
                    var urlIdx = contentStr.indexOf("http://",currentIdx);
                    // no url found in the remaining part, break
                    if(urlIdx == -1)
                    {
                        contentNode.appendChild(document.createTextNode(contentStr.substring(currentIdx)));
                        break;
                    }
                    str = contentStr.substring(currentIdx, urlIdx);
                    var spaceIdx = contentStr.indexOf("\b",urlIdx);
                    if(spaceIdx == -1) // the end of the remaining string
                    {
                        url = contentStr.substring(urlIdx);
                        if(str != null || str != ""){
                            contentNode.appendChild(document.createTextNode(str));
                        }
                        if (url != null && url != "") {
                            var urlNode = document.createElementNS("http://www.w3.org/2000/svg", "a");
                            urlNode.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);
                            urlNode.setAttribute("style", "text-decoration:underline");
                            urlNode.appendChild(document.createTextNode(url));
                            // make it open a new window
                            urlNode.setAttribute("target", "_blank");
                            contentNode.appendChild(urlNode);
                        }
                        // job finished, break
                        break;
                    }
                    else // not reach the end of string
                    {
                        url = contentStr.substring(urlIdx,spaceIdx);
                        if(str != null || str != ""){
                            contentNode.appendChild(document.createTextNode(str));
                        }
                        if (url != null && url != "") {
                            var urlNode = document.createElementNS("http://www.w3.org/2000/svg", "a");
                            urlNode.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);
                            urlNode.setAttribute("style", "text-decoration:underline");
                            urlNode.appendChild(document.createTextNode(url));
                            // make it open a new window
                            urlNode.setAttribute("target", "_blank");
                            contentNode.appendChild(urlNode);
                        }

                        currentIdx = spaceIdx;
                    }
                }
                // Add the name to the text node
                node.appendChild(contentNode);
        }

        //]]>
        </script>
    </head>

    <body style="text-align: left" onload="load()" onunload="unload()">
    <svg width="800px" height="2000px"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xhtml="http://www.w3.org/1999/xhtml"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:a="http://www.adobe.com/svg10-extensions" a:timeline="independent"
     >

        <g id="chatroom" style="visibility:hidden">                
        <rect width="520" height="2000" style="fill:white;stroke:red;stroke-width:2"/>
        <text x="260" y="40" style="fill:red;font-size:30px;font-weight:bold;text-anchor:middle">Chat Window</text> 
        <text id="chattext" y="45" style="font-size: 20px;font-weight:bold"/>
      </g>
  </svg>
  
         <form action="">
            <input type="hidden" value="<?php print $name; ?>" id="username" />
        </form>

    </body>
</html>
