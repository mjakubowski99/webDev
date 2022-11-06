
let canvas;
let ctx;
let pos_x = 320, pos_y = 300;
let welcome_screen = true;

let snake = null;
let board = [];

const widthX = 20;
const widthY = 20;

let lenX = 66;
let lenY = 36;

class Snake{
    
    constructor(assets){
        this.assets = assets;
        this.currentHead = assets[0];
        this.init();
        this.direction = "up";
        this.snakeLength = 3;
        this.snakeCords = [];
    }

    updateHead(index){
        this.currentHead = this.assets[index];
    }

    checkIfInSnake(x,y){
        for(let i=0; i<this.snakeCords.length; i++){
            if( this.snakeCords[i].x === x && this.snakeCords[i].y === y ){
                return true;
            }
        }
        return false;
    }

    init(){
        for(let i=0; i<lenX; i++){
            board.push([]);
            for(let j=0; j<lenY; j++){
                board[i].push({
                    pos_x: i*widthX,
                    pos_y: j*widthY,
                    occupied: false,
                    object_type: null
                })
            }
        }

        window.addEventListener("keydown", keyPressed, false);
        canvas = document.getElementById('game');
        canvas.setAttribute("style", "background-color: black;");
        ctx = canvas.getContext('2d');

        this.initSnake();
    }

    initSnake(){
        ctx.save();
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.translate(pos_x, pos_y);
        ctx.fillStyle = "blue";
        ctx.drawImage(this.currentHead, 0, 0, widthX, widthY);
        ctx.restore();
    }

    setDirection(direction){
        this.direction = direction;
    }

    updatePosition(){
        if( welcome_screen ){
            return;
        }

        let pos = getBoardPosition();

        if( board[pos.x][pos.y] === undefined ){
            alert("You loose");
            setTimeout(() => location.reload(), 1000);
        }
        else if( board[pos.x][pos.y].occupied === false){
            if( this.snakeCords.length === this.snakeLength ){
                let cords = this.snakeCords.shift();
                board[cords.x][cords.y].occupied = false;
                board[cords.x][cords.y].object_type = null;
            }
            this.snakeCords.push({x: pos.x, y: pos.y});
        }
        else if( board[pos.x][pos.y].occupied && board[pos.x][pos.y].object_type === "apple" ){
            board[pos.x][pos.y].occupied = true;
            board[pos.x][pos.y].occupied = "snake";
            this.snakeLength++;
        }

        board[pos.x][pos.y].occupied = true;
        board[pos.x][pos.y].object_type = "snake";
        
        ctx.fillStyle = "blue";
        ctx.clearRect(0,0,1280,720);

        for(let i=0; i<board.length; i++){
            for(let j=0; j<board[i].length; j++){
                if( board[i][j].occupied ){
                    if( board[i][j].object_type === "apple" ){
                        ctx.drawImage(this.assets[4], board[i][j].pos_x, board[i][j].pos_y, widthX, widthY);
                    }
                    else if( board[i][j].object_type === "snake" && this.checkIfInSnake(i,j) ){
                        ctx.fillRect(board[i][j].pos_x, board[i][j].pos_y, widthX, widthY);
                    }
                }
            }
        }
        
        switch(this.direction){
            case "up":
                pos_y+=10;
                break;
            case "down":
                pos_y-=10;
                break;
            case "left":
                pos_x-=10;
                break;
            case "right":
                pos_x+=10;
                break;
        }

        this.initSnake();
    }
}

function getBoardPosition(){
    let x = parseInt(pos_x/widthX);
    let y = parseInt(pos_y/widthY);

    return {
        x: x,
        y: y
    }
}

function keyPressed(e){
    if( !snake ){
        return;
    }

    if( welcome_screen ){
        window.setInterval(() => {
            snake.updatePosition();
        }, 50);
        welcome_screen = false;
    }

    switch(e.keyCode){
        case 37:
            snake.setDirection("left");
            snake.updateHead(2);
            break;
        case 38:
            snake.setDirection("down");
            snake.updateHead(0);
            break;
        case 39:
            snake.setDirection("right");
            snake.updateHead(3);
            break;
        case 40:
            snake.setDirection("up");
            snake.updateHead(1);
            break;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function fillRandom(){
    
    let i = getRandomInt(64);
    let j = getRandomInt(32);

    ctx.drawImage(snake.assets[4], board[i][j].pos_x, board[i][j].pox_y, widthX, widthY);
    board[i][j].occupied = true;
    board[i][j].object_type = "apple";
}

const assets = [
    'assets/head_up.png',
    'assets/head_down.png',
    'assets/head_left.png',
    'assets/head_right.png',
    'assets/apple.png'
];

const assetsLoaded = assets.map( function(url) {
    return new Promise( (resolve, reject) => {
        const img = new Image();
        img.onerror = e => reject(`${url} failed to load`);
        img.onload = e => resolve(img);
        img.src = url;
    });
});

document.addEventListener('DOMContentLoaded', function(){
    Promise.all(assetsLoaded)
        .then( images => {
            snake = new Snake(images);

            window.setInterval(fillRandom, 1000);
        });
});