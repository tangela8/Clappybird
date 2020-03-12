//global variables:
let myGamePiece;// box first then change to bird
let pipes = [];
let myScore = 0;

//create the canvas for the game
const gameCanvas = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;//drawing the game area
        this.canvas.height = 500;//drawing the game area
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);//setting the speed of the pipes
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// start game
function startGame() {
    myGamePiece = new bird(80, 80, "Dumbo-gif.gif", 10, 120, "image");
    myGamePiece.gravity = 0.05;
    myScore = new bird("10px", "Consolas", "black", 280, 40, "text");
    gameCanvas.start();
}

//Game piece: make a square for now and input image later on
function bird(width, height, color, x, y, type) {
    this.type = type;
    if(type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = gameCanvas.context;
        if (this.type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY //+ this.gravitySpeed;
        this.hitBottom();
    }
    //stop the falling when it hits the bottom of the game area
    this.hitBottom = function() {
        var rockbottom = gameCanvas.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(obstacles) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = obstacles.x;
        let otherright = obstacles.x + (obstacles.width);
        let othertop = obstacles.y;
        let otherbottom = obstacles.y + (obstacles.height);
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

//game controls

// function up(n) {
//     myGamePiece.gravity = n;
// }
function moveUp() {
    myGamePiece.speedY = -2; 
    
}

function moveDown() {
    myGamePiece.speedY = 2; 
}

function clearMove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}
//setting the distance between the pipes
function everyinterval(n) {
    if ((gameCanvas.frameNo / n) % 1 == 0) {return true;}
    return false;
}

//putting movements and obstacles into game area
function updateGameArea() {
    myGamePiece.newPos();
    myGamePiece.update();
    let x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < pipes.length; i += 1) {
        if (myGamePiece.crashWith(pipes[i])) {
            return;
        } 
    }
    gameCanvas.clear();
    gameCanvas.frameNo += 1;
    //conditions for the pipes
    if (gameCanvas.frameNo == 1 || everyinterval(200)) {
        x = gameCanvas.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 100;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        pipes.push(new bird(30, height, "green", x, 0));
        pipes.push(new bird(30, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < pipes.length; i += 1) {
        pipes[i].x += -1;
        pipes[i].update();
    }
    myScore.text="SCORE: " + gameCanvas.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}




