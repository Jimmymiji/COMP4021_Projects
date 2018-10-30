// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
        pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}

function overlap(pos1, size1, pos2, size2) {
    return (pos1.x >= pos2.x - 10 && pos1.x + size1.w <= pos2.x + size2.w + 10 &&
        pos1.y >= pos2.y - 10 && pos1.y + size1.h <= pos2.y + size2.h + 10);
}
// The player class used in this program
function Player() {
    this.node = document.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
    this.direction = DIRECTION.RIGHT;
}

Player.prototype.isOnPlatform = function() {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        if (node.getAttribute("id") == "vertical platform"){
            var direction = node.getAttribute("direction");
            if (direction == DIRECTION.UP)
                y = y - PLATFORM_SPEED;
            if (direction == DIRECTION.DOWN)
                y = y + PLATFORM_SPEED;
        }
        

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
            ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
            (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y)
        {
            if (node.getAttribute("id") == "disappearing platform1"
                || node.getAttribute("id") == "disappearing platform2"
                || node.getAttribute("id") == "disappearing platform3") {
                var opacity = parseFloat(node.style.getPropertyValue("opacity"));
                opacity -= 0.1;
                node.style.setProperty("opacity", opacity, null);
                if (opacity <= 0.0)
                    platforms.removeChild(node);
            }
            return true;
        }
            
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        if (node.getAttribute("id") == "vertical platform") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}
Player.prototype.collideVerticalPlatform = function (position) {
    var node = document.getElementById("vertical platform");

    var x = parseFloat(node.getAttribute("x"));
    var y = parseFloat(node.getAttribute("y"));
    var w = parseFloat(node.getAttribute("width"));
    var h = parseFloat(node.getAttribute("height"));
    var direction = node.getAttribute("direction");
    var pre_y = y;
    if (direction==DIRECTION.DOWN)
        pre_y = y - PLATFORM_SPEED;
    if (direction == DIRECTION.UP)
        pre_y = y + PLATFORM_SPEED;
    var pos = new Point(x, y);
    var size = new Size(w, h);
    if (intersect(position, PLAYER_SIZE, pos, size)) {
        if (this.position.y >= pre_y + h)
            position.y = y + h;
        else
            position.y = y - PLAYER_SIZE.h;
        this.verticalSpeed = -3;
    }
        
}
Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 420);   // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a bullet

var MONSTER_SIZE = new Size(40, 40);        // The speed of a bullet
var score = 0;
var DIRECTION = { LEFT: 0, RIGHT: 1, UP: 3, DOWN: 4 };    // the dirction of a moving object

var CANDY_SIZE = new Size(20, 20);
var PLATFORM_SPEED = 1;                     // speed of vertical platform
var EXIT_SIZE = new Size(20, 40);
//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var player = null;                          // The player object
var gameInterval = null;                    // The interval
var svgdoc = null;                          // svg document
var usr_name = null;
var numOfMonsters = 1;                     
var MONSTER_SPEED = 2               // monster speed
var monsterShoot = true;            // monster can shoot or not
var bullet_remaining = 0;         
var bgm_audio = null;
var monster_die_audio = null;
var player_die_audio = null;
var shoot_audio = null;
var exit_audio = null;
var time_remaining = 0;
var level = 0;
var cheatMode = false;
var numOfCandies = 8;
//
// The load function
//
function load(evt) {
   // alert("successfully load");
    svgdoc = evt.target.ownerDocument;
    document.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
    // Attach keyboard events
    document.documentElement.addEventListener("keydown", keydown, false);
    document.documentElement.addEventListener("keyup", keyup, false);

    // Create the player
    player = new Player();

    bgm_audio = document.createElement("audio");
    bgm_audio.setAttribute("src", "./bgm.mp3");
    bgm_audio.volume = 0.2;
    document.body.appendChild(bgm_audio);
    shoot_audio = document.createElement("audio");
    shoot_audio.setAttribute("src", "./player_shoot.wav");
    document.body.appendChild(shoot_audio);
    monster_die_audio = document.createElement("audio");
    monster_die_audio.setAttribute("src", "./monster_die.wav");
    document.body.appendChild(monster_die_audio);
    player_die_audio = document.createElement("audio");
    player_die_audio.setAttribute("src", "./player_die.mp3");
    document.body.appendChild(player_die_audio);
    exit_audio = document.createElement("audio");
    exit_audio.setAttribute("src", "./exit.mp3");
    document.body.appendChild(exit_audio);
}

function startGame() {
    // Create  monsters randomly
    createMonsterGroup(numOfMonsters);
    createGroupCandy(numOfCandies);
    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
    timeInterval = setInterval("timer()", 1000);

    document.getElementById("level_info").firstChild.data = level;
    bgm_audio.play();
}

function createCandy(x, y) {
    var candy = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    var candyPos = new Point(x, y);
    candy.setAttribute("x", candyPos.x)
    candy.setAttribute("y", candyPos.y);
    candy.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#candy");
    svgdoc.getElementById("candies").appendChild(candy);
}


function createGroupCandy(num) {
    for (i = 0; i < num; i++) {
        var x = 0, y = 0;
        do {
            x = Math.floor(Math.random() * (SCREEN_SIZE.w - CANDY_SIZE.w));
            y = Math.floor(Math.random() * (SCREEN_SIZE.h - CANDY_SIZE.h));
            candyPos = new Point(x, y);
        } while (intersect(PLAYER_INIT_POS, PLAYER_SIZE, candyPos, CANDY_SIZE)||(candyTouchPlatform(candyPos)));
        createCandy(x, y);
    }
}

function candyTouchPlatform(position) {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (overlap(position, CANDY_SIZE, pos, size))
        {
            alert("haha");
            return true;
        }
    }
    return false;
}
//
// This function creates the monsters in the game
//
function createMonster(x, y) {
    var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    var monPos = new Point(x,y);

    monster.setAttribute("x", monPos.x);
    monster.setAttribute("y", monPos.y);

    //set moving destination
    var monsterFinalPos = new Point(Math.floor(Math.random() * 520 + 40), Math.floor(Math.random() * 480) + 40);
    //avoid running to player start place
    while (intersect(monPos, new Size(160, 160), player.position, PLAYER_SIZE))
        monsterFinalPos = new Point(Math.floor(Math.random() * 520 + 50), Math.floor(Math.random() * 480) + 20);

    monster.setAttribute("Dx", monsterFinalPos.x);
    monster.setAttribute("Dy", monsterFinalPos.y);

    monster.setAttribute("flip", monsterFinalPos.x - monPos.x < 0 ? 1 : 0);

    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    svgdoc.getElementById("monsters").appendChild(monster);
}

function createShootingMonster(x, y) {
    var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    var monPos = new Point(x, y);

    monster.setAttribute("x", monPos.x);
    monster.setAttribute("y", monPos.y);

    //set moving destination
    var monsterFinalPos = new Point(Math.floor(Math.random() * 520 + 40), Math.floor(Math.random() * 480) + 40);
    //avoid running to player start place
    while (intersect(monPos, new Size(160, 160), player.position, PLAYER_SIZE))
        monsterFinalPos = new Point(Math.floor(Math.random() * 520 + 50), Math.floor(Math.random() * 480) + 20);
    monster.setAttribute("Dx", monsterFinalPos.x);
    monster.setAttribute("Dy", monsterFinalPos.y);
    monster.setAttribute("id", "shooting_monster");
    monster.setAttribute("flip", monsterFinalPos.x - monPos.x < 0 ? 1 : 0);
    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    svgdoc.getElementById("monsters").appendChild(monster);
}

function createMonsterGroup(num) {
    for (var i = 0; i < num; i++) {
        var x = 0, y = 0;
        do {
            x = Math.floor(Math.random() * (SCREEN_SIZE.w - MONSTER_SIZE.w));
            y = Math.floor(Math.random() * (SCREEN_SIZE.h - MONSTER_SIZE.h));
            monsterPos = new Point(x, y);
        } while (intersect(PLAYER_INIT_POS, PLAYER_SIZE, monsterPos, MONSTER_SIZE));  // || monsterTooClose(x, y));

        if (i == num - 1)
            createShootingMonster(x, y)
        else
            createMonster(x, y);
    }

}

function monsterTooClose(x, y) {
    for (var j = 0; j < monsters.childNodes.length; j++) {
        var monster = monsters.childNodes.item(j);
        var mx = parseInt(monster.getAttribute("x"));
        var my = parseInt(monster.getAttribute("y"));
        if ((mx - x) * (mx - x) + (my - y) * (my - y) < ((MONSTER_SIZE.h / 2) * (MONSTER_SIZE.h / 2) + (MONSTER_SIZE.w / 2) * (MONSTER_SIZE.w / 2)))
            return true;
    }
    return false;
}

function moveMonsters() {
    // Go through all monsters
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monNode = monsters.childNodes.item(i);

        if (parseInt(monNode.getAttribute("x")) == parseInt(monNode.getAttribute("Dx")) && parseInt(monNode.getAttribute("y")) == parseInt(monNode.getAttribute("Dy"))) {

            var monsterFinalPos = new Point(Math.floor(Math.random() * 500), Math.floor(Math.random() * 350));
            monNode.setAttribute("Dx", monsterFinalPos.x);
            monNode.setAttribute("Dy", monsterFinalPos.y);

            var check = monsterFinalPos.x - parseInt(monNode.getAttribute("x")) < 0 ? 1 : 0;
            if (check != parseInt(monNode.getAttribute("flip"))) {
                monNode.setAttribute("flip", check);
            }
        }
        else if (parseInt(monNode.getAttribute("x")) == parseInt(monNode.getAttribute("Dx")) && parseInt(monNode.getAttribute("y")) != parseInt(monNode.getAttribute("Dy"))) {
            var y_displacement = 1;
            if (parseInt(monNode.getAttribute("y")) > parseInt(monNode.getAttribute("Dy")))
                y_displacement *= -1;
            monNode.setAttribute("y", parseInt(monNode.getAttribute("y")) + y_displacement);
        }
        else if (parseInt(monNode.getAttribute("x")) != parseInt(monNode.getAttribute("Dx")) && parseInt(monNode.getAttribute("y")) == parseInt(monNode.getAttribute("Dy"))) {
            var x_displacement = 1;
            if (parseInt(monNode.getAttribute("flip")))
                x_displacement *= -1;
            monNode.setAttribute("x", parseInt(monNode.getAttribute("x")) + x_displacement);
        }
        else {
            var y_displacement = 1;
            if (parseInt(monNode.getAttribute("y")) > parseInt(monNode.getAttribute("Dy")))
                y_displacement *= -1;
            monNode.setAttribute("y", parseInt(monNode.getAttribute("y")) + y_displacement);

            var x_displacement = 1;
            if (parseInt(monNode.getAttribute("flip")))
                x_displacement *= -1;
            monNode.setAttribute("x", parseInt(monNode.getAttribute("x")) + x_displacement);

        }
    }
}

function monsterShootBullet() {
    if (monsterShoot)
    {
        var monsterBullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
        //shooting monster is the last monster in the queue
        //var shootingMonster = monsters.childNodes.item(monsters.childNodes.length - 1);
        var shootingMonster = document.getElementById("shooting_monster");
        if (shootingMonster == null)
        {
            monsterShoot = false;
            return;
        }
        var x = parseInt(shootingMonster.getAttribute('x')) + MONSTER_SIZE.w / 2;
        var y = parseInt(shootingMonster.getAttribute('y')) + MONSTER_SIZE.h / 2;
        monsterBullet.setAttribute("x", x);
        monsterBullet.setAttribute("y", y);
        //alert("haha");
        monsterBullet.setAttribute("direction", 1- parseInt(shootingMonster.getAttribute("flip")));
        monsterBullet.setAttribute("id","monsterBullet");
        monsterBullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
        document.getElementById("monster_bullets").appendChild(monsterBullet);
        monsterShoot = false;
    }
    
}
//
// This function shoots a bullet from the player
//
function shootBullet() {
    // Disable shooting for a short period of time
    if (bullet_remaining <= 0 && (!cheatMode))
        return;
    shoot_audio.play();
    canShoot = false;
    setTimeout("canShoot = true", SHOOT_INTERVAL);

    // Create the bullet using the use node
    var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
    bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
    bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);
    bullet.setAttribute("direction", player.direction);
    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    if (!cheatMode)
    bullet_remaining--;
    document.getElementById("bullets").appendChild(bullet);
}


//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            player.direction = DIRECTION.LEFT;
           player.motion = motionType.LEFT;
            break;

        case "D".charCodeAt(0):
            player.direction = DIRECTION.RIGHT;
            player.motion = motionType.RIGHT;
            break;
			
        case "W".charCodeAt(0):
            if (player.isOnPlatform()) {
                player.verticalSpeed = JUMP_SPEED;
            }
            break;

        case 32:
            if (canShoot) shootBullet();
            break;

        //case "C".charCodeAt(0):
          //  clearHighScoreTable();
           // alert("High score table cleared.");
            //break;

        case "C".charCodeAt(0):
            cheatMode = true;
            break;

        case "V".charCodeAt(0):
            cheatMode = false;
            break;
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT)
                player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT)
                player.motion = motionType.NONE;
            break;
    }
}


//
// This function checks collision
//
function collisionDetection() {
    // Check whether the player collides with a monster
    transmission();
    var monsters = document.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        var x = parseInt(monster.getAttribute("x"));
        var y = parseInt(monster.getAttribute("y"));

        if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE) && (!cheatMode)) {
            player_die_audio.play();
            gameOver();
            return;
        }
    }
    var monsterBullet = document.getElementById("monsterBullet");
    if (monsterBullet) {
        var x = parseInt(monsterBullet.getAttribute("x"));
        var y = parseInt(monsterBullet.getAttribute("y"));
        if (intersect(new Point(x, y), BULLET_SIZE, player.position, PLAYER_SIZE) && (!cheatMode)) {
            player_die_audio.play();
            gameOver();
            return;
        }
    }
    // Check whether a bullet hits a monster
    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {
                monster_die_audio.play();
                monsters.removeChild(monster);
                j--;
                bullets.removeChild(bullet);
                i--;

                //write some code to update the score
                score += 10;
                document.getElementById("score").firstChild.data = score;
            }
        }
    }
    
}


//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
    var bullets = document.getElementById("bullets");
    //alert(bullets.childNodes.length);
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        if (parseInt(node.getAttribute("direction")))
            node.setAttribute("x", x + BULLET_SPEED);
        else
            node.setAttribute("x", x - BULLET_SPEED);

        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x < 0) {
            bullets.removeChild(node);
            i--;
        }
    }
    var monster_bullet = document.getElementById("monsterBullet");
    if (monster_bullet) {
        var x = parseInt(monster_bullet.getAttribute("x"));
        if (parseInt(monster_bullet.getAttribute("direction")))
            monster_bullet.setAttribute("x", x + BULLET_SPEED);
        else
            monster_bullet.setAttribute("x", x - BULLET_SPEED);
        if (!monsterShoot) {
            var mbullet = document.getElementById("monsterBullet");
            if (mbullet && ((parseInt(mbullet.getAttribute('x')) > SCREEN_SIZE.w) || (parseInt(mbullet.getAttribute('x')) < 0))) {
                document.getElementById("monster_bullets").removeChild(mbullet);
                //alert("monster can shoot");
                monsterShoot = true;
            }
        }
    }
}


//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
    // Check collisions
    collisionDetection();

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();
    
    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);
    player.collideVerticalPlatform(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    // Move the bullets and monsters
    monsterShootBullet();
    moveBullets();
    moveMonsters();
    movePlatform();
    updateScreen();
    if (checkExit())
    {
        levelUp();
    }
}

function collectCandy() {
    var candies = document.getElementById("candies");
    for (var i = 0; i < candies.childNodes.length; i++) {
        var node = candies.childNodes.item(i);
        var x = parseInt(node.getAttribute("x"));
        var y = parseInt(node.getAttribute("y"));
        if (intersect(player.position, PLAYER_SIZE, new Point(x,y), CANDY_SIZE)) {
            candies.removeChild(node);
            score += 10;
            document.getElementById("score").firstChild.data = score;
        }
    }
}
//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {
    // Transform the player
    // if it is facing right and need to move left, we need to flip it
    if (player.direction == DIRECTION.LEFT) {
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")" + "translate(" + PLAYER_SIZE.w + ", 0) scale(-1,1)");
    }
    else {
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
    }
    collectCandy();
    if (!cheatMode) {
        document.getElementById("bullet_info").firstChild.data = bullet_remaining;
    }
    else {
        document.getElementById("bullet_info").firstChild.data = "Infinite";
    }
}

function initializeGame() {
   // alert("initializeGame()");
    usr_name = prompt("Please enter your name: ", usr_name);
    if (usr_name.length == 0 || usr_name == 'null' || usr_name == "" || usr_name == null)
        usr_name = "Anonymous";
    document.getElementById("startScreen").style.setProperty("visibility", "hidden", null);
    document.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
    document.getElementById("vertical platform").setAttribute("direction", DIRECTION.DOWN);
    cheatMode = false;
    score = 0;
    timeRemaining = 0;
    bullet_remaining = 8;
    time_remaining = 60;
    level = 1;
    cheatMode = false;
    startGame();
}

function gameOver() {
    bgm_audio.pause();
    // Clear the game interval
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    // Get the high score table from cookies
    var highScoreTable = getHighScoreTable();

    // // Create the new score record

    var record = new ScoreRecord(usr_name, score);

    // // Insert the new score record
    var position = 0;
    while (position < highScoreTable.length) {
        var curPositionScore = highScoreTable[position].score;
        if (curPositionScore < score)
            break;

        position++;
    }
    if (position < 10)
        highScoreTable.splice(position, 0, record);

    // Store the new high score table
    setHighScoreTable(highScoreTable);

    // Show the high score table
    showHighScoreTable(highScoreTable);

}

function movePlatform() {
   // alert("haha");
    var verticalPlatform = document.getElementById("vertical platform");
    // Update the position of the vertical_platform
    var y = parseInt(verticalPlatform.getAttribute("y"));
    var direction = parseInt(verticalPlatform.getAttribute("direction"));
    if (direction == DIRECTION.DOWN) {
        verticalPlatform.setAttribute("y", y + PLATFORM_SPEED);
    }
    if (direction == DIRECTION.UP) {
        verticalPlatform.setAttribute("y", y - PLATFORM_SPEED);
    }

    if (y <= 320)
        verticalPlatform.setAttribute("direction", DIRECTION.DOWN);
    if (y >= 420)
        verticalPlatform.setAttribute("direction", DIRECTION.UP);
}

function transmission() {
    // bule portal
    if (intersect(new Point(590, 100), new Size(10, 40), player.position, PLAYER_SIZE)) {
        player.position.x = 10;
        player.position.y = 280;
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
    }

    //red portal
    if (intersect(new Point(0, 280), new Size(10, 40), player.position, PLAYER_SIZE)) {
        player.position.x = 550;
        player.position.y = 100;
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
    }
}

function timer() {
    if (time_remaining <= 0)
    {   
        if (time_remaining == 0)
            gameOver();
        return;
    }
    time_remaining = time_remaining - 1;
    document.getElementById("time_info").firstChild.data = time_remaining + " s";
}

function checkExit() {
    var exit = svgdoc.getElementById("exit");
    var x= parseInt(exit.getAttribute('x'));
    var y = parseInt(exit.getAttribute('y'));
    var exitPosition = new Point(x,y);
    if (intersect(player.position, PLAYER_SIZE, exitPosition, EXIT_SIZE)) {
        if (document.getElementById("candies").childNodes.length == 0)
            alert("level up");
            return true;
    }
    return false;
}

function levelUp() {
    bgm_audio.pause();
    alert("LEVEL UP !")
    score += level * 100;
    score += time_remaining;
    document.getElementById("score").firstChild.data = score;
    level++;
    numOfMonsters += 4;
    bullet_remaining = 8;
    time_remaining = 60;
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    player.position = PLAYER_INIT_POS;
    startGame();
}
function cleanGroupById(id) {
    var parent = document.getElementById(id);
    while (parent.firstChild) {
        parent.removeChild(myNode.firstChild);
    }
}

function cleanDisappearingPlatforms() {
    var p1 = document.getElementById("disappearing platform1");
    var p2 = document.getElementById("disappearing platform2");
    var p3 = document.getElementById("disappearing platform3");
    if (p1)
        document.getElementById("platforms").removeChild(p1);
    if (p2)
        document.getElementById("platforms").removeChild(p2);
    if (p3)
        document.getElementById("platforms").removeChild(p3);

}
function restart() {
    // Remove other things
    cleanUpGroup("highscoreText", false);
    cleanGroupById("monsters");
    cleanGroupById("candies");
    cleanGroupById("bullets");
    cleanGroupById("monster_bullets");
    cleanDisappearingPlatforms();
    createDisappearingPlatforms();

    // clear sunlights
    clearSunlights();
    clearZombies();
    // other staff
    score = 0;
    cheatMode = false;
    zoom = 1.0
    numberOfSunlights = 0;
    Zoom = false;
    zombieCanShoot = true;
    playerObject.setAttribute("opacity", 1.0);
    // Initialize the game
    svgdoc.getElementById("highscoreTable").style.setProperty("visibility", "hidden", null);
    svgdoc.getElementById('startScreen').style.setProperty("visibility", "visible", null);
}