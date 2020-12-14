/* #######################################################################################
                                Déclaration des classes 
#######################################################################################*/ 
class MouseInfo{
    x;
    y;
    update(event){
        this.x = event.layerX;
        this.y = event.layerY;
    }
    reset(){
        this.x = undefined;
        this.y = undefined;
    }
}
class Case{
    constructor(x,y,posX,posY){
        this.x = x;
        this.y = y;
        this.posX = posX;
        this.posY = posY;
    }
    
    isWall= false;
    isStart = false;
    isEnd = false;
    isOpen = undefined;
    isClose = undefined;
    //heuristic = heuristic(myMap[startPoint].x,myMap[startPoint].y,this.x,this.y);
    heuristic;
    poidParcouru;
    poid(){
        return this.heuristic + this.poidParcouru;
    }
    parent;
}
/* #######################################################################################
                                Déclaration des variables 
#######################################################################################*/ 
let canvas = document.querySelector("canvas");
let container = document.querySelector(".canvas-container");
let infoDiv = document.querySelector(".detail");
let ctx = canvas.getContext("2d");
let mouse = new MouseInfo();
let cellSize = 30;
let nbWall=0;
let myMap;
let palierWallNb = 7;

/* A* */
let openList = []
let closeList = []
let isEnded = false;

/* #######################################################################################
                                Corps du programe 
#######################################################################################*/ 
InitializeInfoDiv();
Initialize();
Animate();

/* #######################################################################################
                                Window Event Listener 
#######################################################################################*/ 
window.addEventListener("resize",WindowResized);
canvas.addEventListener("mousemove",MouseMoved);
canvas.addEventListener("mouseleave",MouseReset);

/* #######################################################################################
                                Functions 
#######################################################################################*/ 
function Initialize(){
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.backgroundColor = "#555"
    maxBlockWidth =(canvas.width-canvas.width%cellSize)/cellSize;
    maxBlockHeight = (canvas.height-canvas.height%cellSize)/cellSize;
    startX = Math.floor(canvas.width%cellSize)/2;
    startY = Math.floor(canvas.height%cellSize)/2;
    startPoint = Math.floor(Math.random()*maxBlockWidth*maxBlockHeight);
    endPoint  = Math.floor(Math.random()*maxBlockWidth*maxBlockHeight);
    InitMap();
};

function InitMap() {
    myMap = [];
    const st = Math.floor(Math.random() * maxBlockWidth*maxBlockHeight);
    const end = Math.floor(Math.random() * maxBlockWidth*maxBlockHeight);
    var caseEnd=undefined;
    for (let i = 0; i < maxBlockHeight; i++) {
        for (let j = 0; j < maxBlockWidth; j++) {
            tmpCase = new Case(startX+j*cellSize,startY+i*cellSize,j,i);
            if(myMap.length +1 === st)
            {
                tmpCase.isStart = true;
                tmpCase.isOpen = true;
                tmpCase.poidParcouru = 0;
            }
            else if (myMap.length +1 === end){
                tmpCase.isEnd = true;
            }
            else if (Math.random()*10 > palierWallNb)
            {
                tmpCase.isWall = true;
                nbWall++
            }
            myMap.push(tmpCase);
        }
    }
    myMap.forEach(element => {
        element.heuristic = heuristic(element,myMap[end])
    });
}

function WindowResized(){
    Initialize();
    Animate();
};

function MouseMoved(event){
    mouse.update(event);
};

function MouseReset(){
    mouse.reset();
};

function DrawMousePosition()
{
    ctx.beginPath();
    ctx.font="20px serif";
    ctx.strokeText(`[${mouse.x}:${mouse.y}]`, mouse.x,mouse.y);
};

function DrawGrid(){
    ctx.beginPath();
    ctx.fillStyle = "#fff"
    ctx.fillRect(startX,startY,(maxBlockWidth*cellSize),(maxBlockHeight*cellSize));
    myMap.forEach(element => {
        ctx.strokeStyle = "#ddd";
        ctx.strokeRect(element.x,element.y,cellSize,cellSize);
        ctx.strokeStyle= "black"
        ctx.font="15px arial"
        if(element.isWall || element.isStart || element.isEnd)
        {
            if(element.isWall){
                ctx.fillStyle = "#555"
                ctx.fillRect(element.x,element.y,cellSize,cellSize);
            }
            else if (element.isStart){
                ctx.fillStyle = "#0f0"
                ctx.fillRect(element.x,element.y,cellSize,cellSize);
                ctx.strokeText("S",element.x+cellSize/2,element.y+cellSize/2)
            }
            else {
                ctx.fillStyle = "#f00"
                ctx.fillRect(element.x,element.y,cellSize,cellSize);
                ctx.strokeText("A",element.x+cellSize/2,element.y+cellSize/2)
            }
        }
    });
};

function InitializeInfoDiv(){
    tailleCanvasLabel =  document.createElement("label");
    tailleCanvasLabel.setAttribute("class","info-label")
    infoDiv.appendChild(tailleCanvasLabel);

    mousePositionLabel =  document.createElement("label");
    mousePositionLabel.setAttribute("class","info-label")
    infoDiv.appendChild(mousePositionLabel);

    nbCellLabel =  document.createElement("label");
    nbCellLabel.setAttribute("class","info-label")
    infoDiv.appendChild(nbCellLabel);

    nbWallLabel =  document.createElement("label");
    nbWallLabel.setAttribute("class","info-label")
    infoDiv.appendChild(nbWallLabel);
};

function AddInfo(){
    tailleCanvasLabel.textContent = `Taille canvas : ${canvas.width}px*${canvas.height}px`;
    mousePositionLabel.textContent = mouse.x ? `Position souris : ${mouse.x}:${mouse.y}`:"Position souris : Disable";
    nbCellLabel.textContent = `Nb case : ${maxBlockWidth*maxBlockHeight}`;
    nbWallLabel.textContent = `Nb wall : ${nbWall}`;
};

function Animate(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    AddInfo();
    DrawGrid();
    tryToExit();
    //requestAnimationFrame(Animate);
};


/* #######################################################################################
                                Astar 
#######################################################################################*/ 

function heuristic(cell1,cell2) {
    const diag = Math.min(Math.abs(cell1.posX-cell2.posX), Math.abs(cell1.posY-cell2.posY)) * 14;
    const rest = Math.max(Math.abs(cell1.posX-cell2.posX), Math.abs(cell1.posY-cell2.posY)) * 10;
    return diag+rest;
}

function neighbors(cell0){
    if(!cell0)return;
    var currentCell = cell0;
    var pos = currentCell.posY*maxBlockWidth + currentCell.posX;
    //console.log(currentCell);
    //console.log(maxBlockWidth);
    //console.log(maxBlockHeight);
    //console.log(pos);
    //console.log(`Init : ${cell0.posX} : ${cell0.posY}`);
    if(currentCell.posY>0){
        if(currentCell.posX>0)
            addToOpenList(myMap[pos-1-maxBlockWidth],currentCell,14);
        addToOpenList(myMap[pos-maxBlockWidth],currentCell,10);
        if(currentCell.posX<maxBlockWidth-1)
            addToOpenList(myMap[pos+1-maxBlockWidth],currentCell,14);
    }
    if(currentCell.posX>0)
        addToOpenList(myMap[pos-1],currentCell,10);
    if(currentCell.posX<maxBlockWidth-1)
        addToOpenList(myMap[pos+1],currentCell,10);
    if(currentCell.posY <maxBlockHeight){
        if(currentCell.posX>0)
            addToOpenList(myMap[pos-1+maxBlockWidth],currentCell,14);
        addToOpenList(myMap[pos+maxBlockWidth],currentCell,10);
        if(currentCell.posX<maxBlockWidth-1)
            addToOpenList(myMap[pos+1+maxBlockWidth],currentCell,14);
    }
    cell0.isOpen=false;
    cell0.isClose=true;
    DrawCell(cell0,true);
}
function addToOpenList(cell,cellRef, poid){
    if(!cell) return;
    if(cell.isEnd){
        cell.parent= cellRef;
        isEnded = true;
        return;
    }
    if(cell && !cell.isWall && !cell.isClose){
        if(!cell.isOpen || (cell.isOpen && (!cell.poidParcouru || cell.poidParcouru > cellRef.poidParcouru+poid)))
        {
            cell.poidParcouru = cellRef.poidParcouru+poid;
            cell.parent = cellRef;
            cell.isOpen = true;
            //console.log("poid : " +cell.poid());
            DrawCell(cell,false);
        }
    }
};
function DrawCell(cell,isClose){
    if(cell.isEnd || cell.isStart) return;
    ctx.beginPath();
    ctx.fillStyle = isClose?"orange":"blue";
    ctx.fillRect(cell.x,cell.y,cellSize,cellSize);
}

function DrawPathInit(){
    myMap.forEach(element => {
        if(element.isEnd){
            DrawPath(element.parent);
        }
    });
};
function DrawPath(cell){
    ctx.beginPath();
    ctx.fillStyle = "purple";
    ctx.fillRect(cell.x,cell.y,cellSize,cellSize);
    if(cell.parent && !cell.parent.isStart)
        DrawPath(cell.parent);
};


function tryToExit(){
    var i = 0;
    //console.log(i);
    isEnded=false;
    var poidMin = undefined;
    nextToCheck = undefined;
    for (let i = 0; i < 5000; i++) {
        //onrecup le plus petit ouvert
        poidMin = undefined;
        myMap.forEach(element => {
            if(!element.isClose && element.isOpen){
                if (!poidMin || element.poid() < poidMin)
                {
                    poidMin =  element.poid();
                    nextToCheck = element;
                }
            }

        });
        if(isEnded){
            DrawPathInit();
            return;
        }
        if(!nextToCheck) return;
        //console.log(`next poid : ${nextToCheck.poid()}`);
        neighbors(nextToCheck);
        nextToCheck = undefined;
    }
}

function listOpen(){
    myMap.forEach(element => {
        if(element.isOpen)
            console.log(element);
    });
}

function listClose(){
    myMap.forEach(element => {
        if(element.isClose)
            console.log(element);
    });
}


function listEnd(){
    myMap.forEach(element => {
        if(element.isEnd)
            console.log(element);
    });
}