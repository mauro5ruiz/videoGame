const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const botonArriba = document.querySelector('#up');
const botonIzquierda = document.querySelector('#left');
const botonDerecha = document.querySelector('#right');
const botonAbajo = document.querySelector('#down');
const mensajeVidas = document.querySelector('#lifesCount');
const tiempoJugado = document.querySelector('#timePlayer');
const recordDeJuego = document.querySelector('#timeRecord');
const mensajeFinJuego = document.querySelector('#mensaje');
var timeStart;
var timePlayer;
var interval;
var xGame = undefined;
var yGame = undefined;

var  sizeEmoji;
var lifes = 3;

var playerPosition = {
    x: undefined,
    y: undefined
};
var positionVictory = {
    x: undefined,
    y: undefined
};

var enemyColisions = [];
var leven = 0;

recordDeJuego.innerHTML = localStorage.getItem('Récord');

botonArriba.addEventListener('click', moveUp);
botonIzquierda.addEventListener('click', moveLeft);
botonDerecha.addEventListener('click', moveRight);
botonAbajo.addEventListener('click', moveDown);
document.addEventListener('keydown', moveToKeys);

var size;

window.addEventListener('load', sizePlay);
window.addEventListener('resize', sizePlay);

function startGame(){   
    xGame = window.innerHeight;
    yGame = window.innerWidth;
    

    sizeEmoji = size / 10.3;
    game.font = sizeEmoji + 'px Verdana';
    game.textAlign = 'end';
    var existeMapaSiguiente = maps.length >= leven ? true : false;
    if(!existeMapaSiguiente){
        return congratulations();
    }

    if(!timeStart){
        timeStart = Date.now();
        interval = setInterval(contadorTiempoDeJuego, 100)
    }
    const map = maps[leven];
    if(map == undefined){
        return congratulations();
    }
    const mapsRow = map.trim().split('\n');
    const mapsColum = mapsRow.map(column => column.trim().split(''));

    game.clearRect(0,0,size,size);
    enemyColisions = [];
    mapsColum.forEach((row, indiceRow) => {
        row.forEach((column, indiceColumn) => {
            const positionX = sizeEmoji * (indiceColumn + 1);
            const positionY = sizeEmoji * (indiceRow + 1);
            if(column === 'O')
            {
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = positionX;
                    playerPosition.y = positionY;
                }
            }
            else if(column === 'I')
            {
                positionVictory.x = positionX;
                positionVictory.y = positionY;
            }
            else if(column === 'X'){
                enemyColisions.push({
                    x: positionX,
                    y: positionY
                });
            }
            game.fillText(emojis[column], positionX + 8, positionY + -2);
            
        });
    });

    movePlayer();
}
mostrarVidas();

function congratulations(){
    clearInterval(interval);
    comprobarSiEsNuevoRecord();
    alert("Felicidades, ganó todo el juego");
}

var mensaje = "";
function comprobarSiEsNuevoRecord(){
    const record = localStorage.getItem('Récord');
    if(record != null){
        if(tiempo < record){
            localStorage.setItem('Récord', tiempo);  
            mensaje = "Nuevo récord alcanzado";
        }     
        else
        {
            mensaje = "No superaste el récord";
        }
    }
    else
    {
        localStorage.setItem('Récord', tiempo);  
        mensaje = "Felicidades. Ahora trata de superar tu propio récord";
    }
    mensajeFinJuego.innerHTML = mensaje;
}

function mostrarVidas(){
    const showLifes = Array(lifes).fill(emojis['L']);
    mensajeVidas.innerHTML = '';
    showLifes.forEach(life => {
        mensajeVidas.append(life);
    })
}

var tiempo = 0;
function contadorTiempoDeJuego(){
    tiempo = Date.now() - timeStart;
    tiempoJugado.innerHTML = tiempo;
}

function sizePlay(){
    if(window.innerHeight > window.innerWidth)
    {
        size = window.innerWidth * 0.7;
    }
    else
    {
        size = window.innerHeight * 0.7;
    }
    canvas.setAttribute('height', size);
    canvas.setAttribute('width', size);
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function moveToKeys(event){
    switch(event.key){
        case 'ArrowUp': 
            moveUp();
            break;
        case 'ArrowLeft': 
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        default: 
            break;
    }
}

function moveUp(){
    if(playerPosition.y - sizeEmoji <= 1){
        
    }else{
        playerPosition.y -= sizeEmoji;
        startGame();
    }
}
function moveLeft(){
    if(playerPosition.x - sizeEmoji <= 0){
        
    }else{
        playerPosition.x -= sizeEmoji;
        startGame();
    }
}
function moveRight(){
    if(playerPosition.x + sizeEmoji > size){
        
    }else{
        playerPosition.x += sizeEmoji;
        startGame();
    }
}
function moveDown(){
    if(playerPosition.y + sizeEmoji > size){
        console.log(playerPosition.y);
    }
    else{
        playerPosition.y += sizeEmoji;    
        startGame();
    }
}

function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == positionVictory.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == positionVictory.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;
  
    if (giftCollision) {
        leven++;
        console.log('Subiste de nivel!!!!');
        startGame();
    }

    const colision = enemyColisions.find(enemy => {
        const positionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const positionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return positionX && positionY;
    })
    
    if(colision){
        --lifes;
        if(lifes > 0){
            reanudarNivel();
            mostrarVidas();
        }
        else{
            alert("Perdiste");
            
            reanudarJuego();
            mostrarVidas();
        }
    }

    game.fillText(emojis['BALON'], playerPosition.x + 8, playerPosition.y + -2);
}

function reanudarNivel(){
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function reanudarJuego(){
    leven = 0;
    lifes = 3;
    timeStart = undefined;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}


game.fillRect(0,0,100,100);
game.clearRect(50,50,50,50);
game.font = '18px Verdana';
game.fillStyle = 'white';
game.textAlign = 'start';
game.fillText('En busca de la copa', 50, 130);