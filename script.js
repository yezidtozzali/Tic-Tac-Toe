const container = document.querySelector(".container");
const player1Score = document.querySelector(".player1score");
const player2Score = document.querySelector(".player2score");
const rematch = document.querySelector(".rematch-btn");
container.classList.add("hidden");
const player1NameDisplay = document.querySelector(".player1name");
const player2NameDisplay = document.querySelector(".player2name");
const playerTurn = document.querySelector(".player-turn");

const gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;

    const placeMarker = (index, marker) => {
        board[index] = marker;
    };

    const resetBoard = () =>{
        for (let  i=0; i<=8; i++){
            board[i] = "";
        }

    }
    return{getBoard, placeMarker,resetBoard};


})();


const player = (name, marker, score) => {
    return{name, marker, score};
};



const gameController = (() =>{
    

    
    const setPlayers = (name1, name2) => {
    player1 = player(name1, "X",0);
    player2 = player(name2, "O",0);
    if(Math.random() < 0.5){
        activePlayer = player1;
    }else{
        activePlayer = player2;
    }
    }

    const getPlayers = () => ({player1, player2});

    let player1;
    let player2;

    let activePlayer = player1;
    
    const switchPlayer = () =>{
        if(activePlayer === player1){
            activePlayer = player2;
        } else{
            activePlayer = player1;
        }
    };

    

    const winConditions = [[0,3,6],[2,5,8],[1,4,7],
    [0,1,2],[3,4,5],[6,7,8],
    [0,4,8],[2,4,6]];

    let gameOver = false;
    let loser;
    let winningCombination;

    const whoWins = () =>{
        const board = gameboard.getBoard();
        winConditions.forEach((combination) => {

            if(board[combination[0]] === board[combination[1]] && board[combination[1]] === board[combination[2]] && board[combination[0]] !== ""){
            gameOver = true;
            winningCombination = combination;
            loser = activePlayer === player1 ? player2 : player1;
            return;
            }
        });

        
    };

    const getWinningCombination = () => winningCombination;
    
    let isTie = false;
    const getIsTie = () => isTie;

    const checkTie =() =>{
        const board = gameboard.getBoard();
        if(board.every((cell) => cell !== "") && gameOver === false){
            gameOver = true;
            isTie = true;
            return;
        }
        }
    
    

    const playRound = (index) =>{
        gameboard.placeMarker(index, activePlayer.marker);

        whoWins();
        checkTie();
        if(gameOver === true){
            return;
        }
        switchPlayer();
        
    }
    const getActivePlayer = () => activePlayer;

    const getGameOver = () => gameOver;
    
    const resetGame = () =>{
        if(loser){
            activePlayer = loser;
        }else if(Math.random() < 0.5){
        activePlayer = player1;
        }else{
        activePlayer = player2;
        }

        isTie = false;
        gameboard.resetBoard();
        gameOver = false;
    }

    const resetAll = () => {
        gameboard.resetBoard();
        player1.score = 0;
        player2.score = 0;
        isTie = false;
        gameOver = false;
        loser = undefined;

    }

    
    return{getActivePlayer,playRound,getGameOver, setPlayers, resetGame, getPlayers, getIsTie, getWinningCombination, resetAll};

})();


const displayController = () =>{

       

    player1NameDisplay.classList.remove("hidden");
    player2NameDisplay.classList.remove("hidden");
    playerTurn.classList.remove("hidden");
    container.innerHTML = "";

    player1NameDisplay.textContent = gameController.getPlayers().player1.name + ":";
    player2NameDisplay.textContent = gameController.getPlayers().player2.name + ":";


    
    playerTurn.textContent = gameController.getActivePlayer().name + " turn's";

    for(let i = 0; i <= 8; i++){
        

        const cell = document.createElement("div");
        cell.classList.add("cell");
        const span = document.createElement("span");
        cell.appendChild(span);
        container.appendChild(cell);

        cell.addEventListener("click", () => {
        if(gameController.getGameOver() === true){
            return;
        }
        

        if(gameboard.getBoard()[i] !== ""){
            return;
        }
        const currentPlayer = gameController.getActivePlayer(i);
        gameController.playRound(i);
        span.textContent = currentPlayer.marker;
        cell.style.color = "rgba(0, 0, 0, 1)";

        

        playerTurn.textContent = gameController.getActivePlayer().name + " turn's";
        playerTurn.classList.remove("fade");
        void playerTurn.offsetWidth;
        playerTurn.classList.add("fade");
        
        if(gameboard.getBoard().every((cell) => cell !== "") && gameController.getGameOver() === true && gameController.getIsTie() === true){
            playerTurn.textContent = "it's a tie!";
            playerTurn.classList.remove("fade");
            void playerTurn.offsetWidth;
            playerTurn.classList.add("fade");
            rematch.classList.remove("rematch-btn");
            rematch.classList.add("rematch");
            
        }
        

        if(gameController.getGameOver() === true && gameController.getIsTie() === false){
            playerTurn.textContent = gameController.getActivePlayer().name + " wins!"
            playerTurn.classList.remove("fade");
            void playerTurn.offsetWidth;
            playerTurn.classList.add("fade");
            gameController.getActivePlayer().score++;
            player1Score.textContent = gameController.getPlayers().player1.score;
            player1Score.classList.remove("fade");
            void player1Score.offsetWidth;
            player1Score.classList.add("fade");

            player2Score.textContent = gameController.getPlayers().player2.score;
            player2Score.classList.remove("fade");
            void player2Score.offsetWidth;
            player2Score.classList.add("fade");

            rematch.classList.remove("rematch-btn");
            rematch.classList.add("rematch");

            gameController.getWinningCombination().forEach((index) => {
                container.children[index].querySelector("span").style.background = "radial-gradient(circle, #95ff57aa, transparent)";

            });

        }

    });

        //hover cell//

        cell.addEventListener("mouseenter", () => {
        if(gameController.getGameOver() === true){
            return;
        }

        if(gameboard.getBoard()[i] === ""){
        span.textContent = gameController.getActivePlayer().marker;
        cell.style.borderColor = "black";
        cell.style.color = "rgba(0, 0, 0, 0.3)";
        }
        } );

        cell.addEventListener("mouseleave", () => {
        if(gameboard.getBoard()[i] === ""){
        span.textContent = "";
        cell.style.color = "rgba(0, 0, 0, 1)";
        }
        });
    };
    

};



const showDialog = document.querySelector(".start");
const dialog = document.querySelector(".player-name");
const form = document.querySelector(".players");
const player1Input = document.querySelector("#player1-input");
const player2Input = document.querySelector("#player2-input");
const scoreDisplay = document.querySelector(".score-display");



const UIController = (() => {

//show dialog//

    showDialog.addEventListener("click", () => {
        dialog.showModal();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const player1Name = player1Input.value;
        const player2Name = player2Input.value;

        gameController.setPlayers(player1Name, player2Name);
        player1Score.classList.remove("hidden");
        player2Score.classList.remove("hidden");
        player1Score.textContent = "0";
        player2Score.textContent = "0";
        scoreDisplay.classList.remove("hidden");
        playerTurn.classList.remove("hidden");

        dialog.close();
        form.reset();
        showDialog.style.display = "none";
        container.classList.remove("hidden");
        displayController();

    });
//close button dialog//

    const close = document.querySelector(".close");

    close.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.close();
        form.reset();
    });


//rematch button//

    rematch.addEventListener("click", () => {
        gameController.resetGame();
        container.innerHTML= "";
        rematch.classList.remove("rematch");
        rematch.classList.add("hidden");
        displayController();
    });

//title main menu//

    const h1 =document.querySelector("h1");

    h1.addEventListener("click", (e) => {
        e.preventDefault();

        gameController.resetGame();  
        gameController.resetAll();

        container.innerHTML= "";
        container.classList.add("hidden");

        player1Score.classList.add("hidden");
        player2Score.classList.add("hidden");
        player1Score.textContent = "";
        player2Score.textContent = "";

        player1NameDisplay.textContent = "";
        player2NameDisplay.textContent = ""
        player1NameDisplay.classList.add("hidden");
        player2NameDisplay.classList.add("hidden");


        playerTurn.classList.add("hidden");

        rematch.classList.remove("rematch");
        rematch.classList.add("rematch-btn");

        scoreDisplay.classList.add("hidden");

        showDialog.style.display = "flex";
    });
})();