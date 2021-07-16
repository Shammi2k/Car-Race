let start = document.querySelector(".popupStart");
let scoreBox = document.querySelector(".scoreBox");
let gameOver = document.querySelector(".GameOver");
let score = document.querySelector(".Score");
let displayScore = document.querySelector(".displayScore");
let road = document.querySelector(".road");
let scoreIntervalId;
let mainCar;

let directions = {
    ArrowLeft:false,
    ArrowRight:false,
    ArrowUp:false,
    ArrowDown:false
}

let lineSpeed = 3;
let enemyCarSpeed = 4;
let player = {speed:5};
player.start = false;

const increaseScore = ()=>{
        score.innerHTML = parseInt(score.innerHTML) + 1;
}

const MoveLines = ()=>{
    let lines = document.querySelectorAll(".roadLines");
    for(elem of lines){
        y = elem.offsetTop;
        if(y>700){elem.style.top = `-100px`;}
        else{elem.style.top = `${y+lineSpeed}px`;}
    }
}

const randomColor = ()=>{
    const c = ()=>{
        return Math.floor(Math.random()*256).toString(16)
    }
    return `#${c()}${c()}${c()}`;
}

const MoveEnemyCars = ()=>{
    let enemyCar = document.querySelectorAll(".enemyCar");
    for(elem of enemyCar){
        y = elem.offsetTop;
        if(y>700){
            elem.style.top = `-50px`
            elem.style.left = `${Math.floor(Math.random()*350)}px`;
            elem.style['backgroundColor'] = randomColor();
        }
        else{elem.style.top = `${y+enemyCarSpeed}px`;}
    }
}

const MoveMainCar = ()=>{
    let roadDim = road.getBoundingClientRect();
    if(directions.ArrowLeft){
        player.x = Math.max(player.x-player.speed,0);
        mainCar.style.left = `${player.x}px`;
    }
    if(directions.ArrowRight){
        player.x = Math.min(player.x+player.speed,roadDim.width-60);
        mainCar.style.left = `${player.x}px`;
    }
    if(directions.ArrowUp){
        player.y = Math.max(player.y-player.speed,0);
        mainCar.style.top = `${player.y}px`;
    }
    if(directions.ArrowDown){
        player.y = Math.min(player.y+player.speed,roadDim.height-100);
        mainCar.style.top = `${player.y}px`;
    }
}

const inCollisionRange = (enemyCar)=>{
    let mainCarDim = mainCar.getBoundingClientRect();
    let enemyCarDim = enemyCar.getBoundingClientRect();
    return ((mainCarDim.left>=enemyCarDim.left-mainCarDim.width)&&
    (mainCarDim.left<=enemyCarDim.right)&&
    (mainCarDim.top>=enemyCarDim.top-mainCarDim.height)&&
    (mainCarDim.top<=enemyCarDim.bottom));
}

const collision = ()=>{
    let enemyCars = document.querySelectorAll(".enemyCar");
    for(elem of enemyCars){
        if(inCollisionRange(elem)){
            player.start=false;
        }
    }
}

const endGame = ()=>{
    start.setAttribute("style","visibility:visible");
    gameOver.setAttribute("style","visibility:visible");
    let enemyCars = document.querySelectorAll(".enemyCar");
    for(elem of enemyCars){
        elem.remove();
    }
    mainCar.remove();
    let roadlines = document.querySelectorAll(".roadLines");
    for(elem of roadlines){
        elem.remove();
    }
    directions = {
        ArrowLeft:false,
        ArrowRight:false,
        ArrowUp:false,
        ArrowDown:false
    }
    clearInterval(scoreIntervalId);
}

const increaseDifficulty = ()=>{
    if(!(parseInt(score.innerHTML)%500)){
        enemyCarSpeed++;
    }
}

const giveAnimations = ()=>{
    MoveMainCar();
    MoveLines();
    MoveEnemyCars();
    collision();
    increaseScore();
    increaseDifficulty();
    if(player.start){
        window.requestAnimationFrame(giveAnimations);
    }
    else{
        endGame();
    }
}

const addMainCar = ()=>{
    mainCar = document.createElement("div");
    mainCar.classList.add("mainCar");
    road.appendChild(mainCar);
    player.x = mainCar.offsetLeft;
    player.y = mainCar.offsetTop;
}


const createLines = ()=>{
    for(i=0;i<4;i++){
        let lines = document.createElement("div");
        lines.setAttribute('class','roadLines');
        lines.setAttribute('style',`top:${200*i}px`)
        road.appendChild(lines);
    }
}

const addEnemyCars = ()=>{
    for(i=0;i<3;i++){
        let enemyCar = document.createElement("div");
        enemyCar.setAttribute('class','enemyCar');
        enemyCar.setAttribute('style',`left:${Math.floor(Math.random()*350)}px; top:${200*i}px`);
        enemyCar.style['backgroundColor'] = randomColor();
        road.appendChild(enemyCar);
    }
}

const StartGame = () =>{
    enemyCarSpeed = 4;
    score.innerHTML = 0;
    player.start=true;
    start.setAttribute("style","visibility:hidden");
    gameOver.setAttribute("style","visibility:hidden");
    increaseScore();
    posFromBottom=5;
    posFromLeft=1;
    addMainCar();
    addEnemyCars();
    createLines();
}

start.addEventListener('click',()=>{
    window.requestAnimationFrame(giveAnimations);
    StartGame();
})

window.addEventListener('keydown',(e)=>{
    if(player.start){
        if(e.key in directions){
            directions[e.key] = true;
        }
    }
})

window.addEventListener('keyup',(e)=>{
    if(player.start){
        if(e.key in directions){
        directions[e.key] = false;
        }
    }
})