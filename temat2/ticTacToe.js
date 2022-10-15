
const columnSize = 50;

function createRowContainer(){
    return document.createElement('tr');
}

function createColumnContainer(positionX, positionY){
    const column = document.createElement('td');
    column.style.border = "1px solid black";
    column.style.width = columnSize+"px";
    column.style.height = columnSize+"px";
    column.style.fontSize = "30px";
    column.style.textAlign = "center";
    column.dataset.x = positionX;
    column.dataset.y = positionY;

    column.onclick = performMove;

    return column;
}

function generateBoard(container, size){
    const board = [];

    const table = document.createElement('table')

    for(let i=0; i<size; i++){
        const row = createRowContainer();
        board.push([]);

        for(let j=0; j<size; j++){
            const column = createColumnContainer();

            row.appendChild(column);
            board[i].push(column);
        }

        table.appendChild(row);
    }

    main.appendChild(table);

    return board;
}

let board = [];
const players = ['Player 1', 'Player 2'];
let currentPlayer = players[0];

function clearBoard(){
    for(let i=0; i<board.length; i++){
        for(let j=0; j<board.length; j++){
            board[i][j].innerText = '';
        }
    }
}

function resetGame(){
    clearBoard();
    updatePlayer(0);
}

function performMove(e){
    const clicked = e.target;
    if( !markField(clicked) ){
        return;
    }

    const game = new Game()
    const status = game.checkGameStatus();

    if( status ){
        setTimeout(()=>{
            alert(status) 
        }, 100);
        return;
    }

    updatePlayer(getNextPlayerIndex());
}

function drawPlayerPanel(main, width){
    const panel = document.createElement('div');
    panel.setAttribute('id', 'panel');
    panel.style.backgroundColor = "blue";
    panel.style.width = width+"px";
    panel.innerText = "Current player: "+currentPlayer;
    main.appendChild(panel);

    return panel;
}

function getNextPlayerIndex(){
    if( currentPlayer === players[0] ){
        return 1;
    }
    return 0;
}

function updatePlayer(playerIndex){
    currentPlayer = players[playerIndex];
    const panel = document.getElementById('panel');
    panel.innerText = "Current player: "+currentPlayer;
}

function markField(field){
    if( field.innerText !== '' ){
        return false;
    }

    if( currentPlayer === players[0] ){
        field.innerText = "X";
    }
    else{
        field.innerText = "O";
    }

    return true;
}

class Game{

    constructor(board){
        this.countX = 0;
        this.countO = 0;
    }

    resetCounts(){
        this.countX = 0;
        this.countO = 0;
    }

    updateCount(i, j){
        if( board[i][j].innerText === "X" ){
            this.countX++;
        }
        else if( board[i][j].innerText === "O" ){
            this.countO++;
        }
    }

    returnWinnerIfExists(){
        if( currentPlayer === players[0] && this.countX === board.length ){
            return players[0];
        }
        else if( currentPlayer === players[1] && this.countO === board.length ){
            return players[1];
        }

        return null;
    }

    checkGameStatus(){

        for(let i=0; i<board.length; i++){
            this.resetCounts();
    
            for(let j=0; j<board.length; j++){
                this.updateCount(i,j);
            }
            
            let potentialWinner = this.returnWinnerIfExists();
            if(potentialWinner){
                return "Winner: "+potentialWinner;
            }
    
            this.resetCounts();
            for(let j=0; j<board.length; j++){
                this.updateCount(j,i);
            }

            potentialWinner = this.returnWinnerIfExists();
            if(potentialWinner){
                return "Winner: "+potentialWinner;
            }
        }
    
        this.resetCounts()
        for(let i=0; i<board.length; i++){
            this.updateCount(i,i);
        }

        let potentialWinner = this.returnWinnerIfExists();
        if(potentialWinner){
            return "Winner: "+potentialWinner;
        }

        this.resetCounts()
        for(let i=0; i<board.length; i++){
            this.updateCount(i,board.length-1-i);
        }

        potentialWinner = this.returnWinnerIfExists();
        if(potentialWinner){
            return "Winner: "+potentialWinner;
        }

        let filledCount = 0;
        for(let i=0; i<board.length; i++){
            for(let j=0; j<board.length; j++){
                if( board[i][j].innerText !== '' ){
                    filledCount++;
                }
            }
        }

        if( filledCount === board.length * board.length ){
            return "Draft";
        }
        
        return null;
    }

    
}


function gen(){
    const main = document.getElementById('main')

    board = generateBoard(main, 3)
    const panel = drawPlayerPanel(main, board.length*columnSize);
    const btn = document.createElement('button');
    btn.onclick = resetGame;
    btn.innerText = "Reset game";
    main.appendChild(btn)
}