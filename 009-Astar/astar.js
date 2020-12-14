/* #######################################################################################
                                Déclaration des classes 
#######################################################################################*/
class MouseInfo {
    x;
    y;
    update(event) {
        this.x = event.layerX;
        this.y = event.layerY;
    }
    reset() {
        this.x = undefined;
        this.y = undefined;
    }
}
class Case {
    constructor(x, y, posX, posY) {
        this.x = x;
        this.y = y;
        this.posX = posX;
        this.posY = posY;
    }

    isWall = false;
    isStart = false;
    isEnd = false;
    isOpen = undefined;
    isClose = undefined;
    heuristic;
    poidParcouru;
    poid() {
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
let nbWall = 0;
let myMap;
let palierWallNb = 6;
let maxBlockWidth = undefined;
let maxBlockHeight = undefined;
let startX = undefined;
let startY = undefined;
let startPoint = undefined;
let endPoint = undefined;
let tailleCanvasLabel = undefined;
let nbCellLabel = undefined;
let nbWallLabel = undefined;
let nbOpenNode = undefined;
let nbCloseNode = undefined;
let nbPathNode = undefined;
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
window.addEventListener("resize", WindowResized);
canvas.addEventListener("mousemove", MouseMoved);
canvas.addEventListener("mouseleave", MouseReset);

/* #######################################################################################
                                Functions 
#######################################################################################*/
function Initialize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = "#555";
    maxBlockWidth = (canvas.width - canvas.width % cellSize) / cellSize;
    maxBlockHeight = (canvas.height - canvas.height % cellSize) / cellSize;
    startX = Math.floor(canvas.width % cellSize) / 2;
    startY = Math.floor(canvas.height % cellSize) / 2;
    startPoint = Math.floor(Math.random() * maxBlockWidth * maxBlockHeight) - 1;
    endPoint = Math.floor(Math.random() * maxBlockWidth * maxBlockHeight) - 1;
    InitMap();
};

function InitMap() {
    myMap = [];
    for (let i = 0; i < maxBlockHeight; i++) {
        for (let j = 0; j < maxBlockWidth; j++) {
            const tmpCase = new Case(startX + j * cellSize, startY + i * cellSize, j, i);
            if (myMap.length + 1 === startPoint) {
                tmpCase.isStart = true;
                tmpCase.isOpen = true;
                tmpCase.poidParcouru = 0;
            }
            else if (myMap.length + 1 === endPoint) {
                tmpCase.isEnd = true;
            }
            else if (Math.random() * 10 > palierWallNb) {
                tmpCase.isWall = true;
                nbWall++;
            }
            myMap.push(tmpCase);
        }
    }
    myMap.forEach(element => {
        element.heuristic = heuristic(element, myMap[endPoint]);
    });
}

function WindowResized() {
    Initialize();
    Animate();
};

function MouseMoved(event) {
    mouse.update(event);
};

function MouseReset() {
    mouse.reset();
};

function DrawMousePosition() {
    ctx.beginPath();
    ctx.font = "20px serif";
    ctx.strokeText(`[${mouse.x}:${mouse.y}]`, mouse.x, mouse.y);
};

function DrawGrid() {
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.fillRect(startX, startY, (maxBlockWidth * cellSize), (maxBlockHeight * cellSize));
    myMap.forEach(element => {
        ctx.strokeStyle = "#ddd";
        ctx.strokeRect(element.x, element.y, cellSize, cellSize);
        ctx.strokeStyle = "black";
        ctx.font = "15px arial";
        if (element.isWall || element.isStart || element.isEnd) {
            if (element.isWall) {
                ctx.fillStyle = "#555";
                ctx.fillRect(element.x, element.y, cellSize, cellSize);
            }
            else if (element.isStart) {
                ctx.fillStyle = "#0f0";
                ctx.fillRect(element.x, element.y, cellSize, cellSize);
                ctx.strokeText("S", element.x + cellSize / 3, element.y + cellSize / 1.5);
            }
            else {
                ctx.fillStyle = "#f00";
                ctx.fillRect(element.x, element.y, cellSize, cellSize);
                ctx.strokeText("A", element.x + cellSize / 2, element.y + cellSize / 2);
            }
        }
    });
};


function InitializeInfoDiv() {
    tailleCanvasLabel = document.createElement("label");
    tailleCanvasLabel.setAttribute("class", "info-label");
    infoDiv.appendChild(tailleCanvasLabel);

    nbCellLabel = document.createElement("label");
    nbCellLabel.setAttribute("class", "info-label");
    infoDiv.appendChild(nbCellLabel);

    nbWallLabel = document.createElement("label");
    nbWallLabel.setAttribute("class", "info-label");
    infoDiv.appendChild(nbWallLabel);

    nbOpenNode = document.createElement("label");
    nbOpenNode.setAttribute("class", "info-label");
    nbOpenNode.style = "background-color:#55f";
    infoDiv.appendChild(nbOpenNode);

    nbCloseNode = document.createElement("label");
    nbCloseNode.setAttribute("class", "info-label");
    nbCloseNode.style = "background-color:#ff6";
    infoDiv.appendChild(nbCloseNode);

    nbPathNode = document.createElement("label");
    nbPathNode.setAttribute("class", "info-label");
    nbPathNode.style = "background-color:#f5f";
    infoDiv.appendChild(nbPathNode);
};

function AddInfo() {
    tailleCanvasLabel.textContent = `Taille : ${canvas.width}px*${canvas.height}px`;
    nbCellLabel.textContent = `# cases : ${maxBlockWidth * maxBlockHeight}`;
    nbWallLabel.textContent = `# murs : ${nbWall}`;
    nbCloseNode.textContent = `# noeuds fermés : ${listClose()}`;
    nbOpenNode.textContent = `# noeuds ouverts : ${listOpen()}`;
    nbPathNode.textContent = `Longueur  chemin : ${pathLength}`;
};

function Animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    DrawGrid();
    tryToExit();
    AddInfo();
};

/* #######################################################################################
                                Astar 
#######################################################################################*/

function heuristic(cell1, cell2) {
    if (!cell1 || !cell2) return undefined;
    const diag = Math.min(Math.abs(cell1.posX - cell2.posX), Math.abs(cell1.posY - cell2.posY)) * 14;
    const rest = Math.max(Math.abs(cell1.posX - cell2.posX), Math.abs(cell1.posY - cell2.posY)) * 10;
    return diag + rest;
}

function neighbors(cell0) {
    if (!cell0) return;
    const currentCell = cell0;
    const pos = currentCell.posY * maxBlockWidth + currentCell.posX;
    if (currentCell.posY > 0) {
        if (currentCell.posX > 0)
            addToOpenList(myMap[pos - 1 - maxBlockWidth], currentCell, 14);
        addToOpenList(myMap[pos - maxBlockWidth], currentCell, 10);
        if (currentCell.posX < maxBlockWidth - 1)
            addToOpenList(myMap[pos + 1 - maxBlockWidth], currentCell, 14);
    }
    if (currentCell.posX > 0)
        addToOpenList(myMap[pos - 1], currentCell, 10);
    if (currentCell.posX < maxBlockWidth - 1)
        addToOpenList(myMap[pos + 1], currentCell, 10);
    if (currentCell.posY < maxBlockHeight) {
        if (currentCell.posX > 0)
            addToOpenList(myMap[pos - 1 + maxBlockWidth], currentCell, 14);
        addToOpenList(myMap[pos + maxBlockWidth], currentCell, 10);
        if (currentCell.posX < maxBlockWidth - 1)
            addToOpenList(myMap[pos + 1 + maxBlockWidth], currentCell, 14);
    }
    cell0.isOpen = false;
    cell0.isClose = true;
    DrawCell(cell0, true);
}

function addToOpenList(cell, cellRef, poid) {
    if (!cell) return;
    if (cell.isEnd) {
        cell.parent = cellRef;
        isEnded = true;
        return;
    }
    if (!cell.isWall && !cell.isClose) {
        if (!cell.isOpen || (cell.isOpen && (!cell.poidParcouru || cell.poidParcouru > cellRef.poidParcouru + poid))) {
            cell.poidParcouru = cellRef.poidParcouru + poid;
            cell.parent = cellRef;
            cell.isOpen = true;
            DrawCell(cell, false);
        }
    }
};
function DrawCell(cell, isClose) {
    if (cell.isEnd || cell.isStart) return;
    ctx.beginPath();
    ctx.fillStyle = isClose ? "#ff6" : "#55f";
    ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
}
var pathLength = 2;
function DrawPathInit() {
    pathLength = 2;
    myMap.forEach(element => {
        if (element.isEnd) {
            DrawPath(element.parent);
        }
    });
};
function DrawPath(cell) {
    pathLength++;
    ctx.beginPath();
    ctx.fillStyle = "#f5f";
    ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
    if (cell.parent && !cell.parent.isStart)
        DrawPath(cell.parent);
};


function tryToExit() {
    isEnded = false;
    var nextToCheck = undefined;
    for (let i = 0; i < 5000; i++) {
        var poidMin = undefined;
        myMap.forEach(element => {
            if (!element.isClose && element.isOpen) {
                if (!poidMin || element.poid() < poidMin) {
                    poidMin = element.poid();
                    nextToCheck = element;
                }
            }
        });
        if (isEnded) {
            DrawPathInit();
            return;
        }
        if (!nextToCheck) return;
        neighbors(nextToCheck);
        nextToCheck = undefined;
    }
};

function listOpen() {
    var count = 0;
    myMap.forEach(element => {
        if (element.isOpen) {
            count++;
        }
    });
    return count;
};

function listClose() {
    var count = 0;
    myMap.forEach(element => {
        if (element.isClose) {
            count++;
        }
    });
    return count;
};