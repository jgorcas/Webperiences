/* #######################################################################################
                                Window Event Listener 
#######################################################################################*/

window.addEventListener("resize", resize);
window.addEventListener("mousemove", mousemove);
/* #######################################################################################
                                Déclaration des variables 
#######################################################################################*/

var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
var mouse = {
    x: undefined,
    y: undefined
}
var total = 0;
var centerX = undefined;
var centerY = undefined;
var baseRadius = undefined;
var canvasRect = undefined;

/* #######################################################################################
                                Corps du programe 
#######################################################################################*/

var datas = loadData();
datas.forEach(value => {
    total += value;
});
var startColor = Math.random() * 20;

init();
animate();

/* #######################################################################################
                                Functions 
#######################################################################################*/
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasRect = canvas.getBoundingClientRect();
    centerX = innerWidth / 2;
    centerY = innerHeight / 2;
    baseRadius = innerHeight > 600 && innerWidth > 1000 ? innerHeight * .3 : innerHeight * .2;
};

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    drawDatas();
};

function loadData() {
    var result = new Map();
    for (let i = 0; i < (2 + Math.random() * 10); i++) {
        result.set(`Label ${i}`, Math.round(Math.random() * 1000));
    }
    return result;
};

function resize() {
    init();
    drawDatas();
};

function drawDatas() {
    var lastArc = 0;
    var i = startColor;
    var angle = 2 * Math.PI / total;
    var mouseangle = mouseAngle();
    datas.forEach((v, k) => {
        var radius = baseRadius;
        var arc = lastArc + angle * v;
        var extRadius = 0;
        if (mouseangle.angle > lastArc && mouseangle.angle < arc && mouseangle.long < radius) {
            extRadius = 20;
        }
        c.beginPath();
        c.moveTo(centerX, centerY);
        c.arc(centerX, centerY, radius + extRadius, lastArc, arc, false);
        c.fillStyle = `hsl(${i * 15},100%, 60%)`;
        c.fill();
        c.lineWidth = 2;
        c.strokeStyle = "white";
        c.stroke();
        c.font = "20px serif";
        c.strokeStyle = "black";
        var radiusX = Math.cos(lastArc + (arc - lastArc) / 2) < 0 ? baseRadius * 1.44 : baseRadius * 1.12;
        var radiusY = Math.cos(lastArc + (arc - lastArc) / 2) < 0 ? baseRadius * 1.28 : baseRadius * 1.2;
        var coordTextX = radiusX * Math.cos(lastArc + (arc - lastArc) / 2) + centerX;
        var coordTextY = radiusY * Math.sin(lastArc + (arc - lastArc) / 2) + centerY;
        c.strokeText(k + " : " + v, coordTextX, coordTextY);
        lastArc = arc;
        i++;
    });
};

function mousemove(event) {
    if (event.x >= canvasRect.x && event.y > canvasRect.y
        && event.x < (canvasRect.x + canvasRect.width)
        && event.y < (canvasRect.y + canvasRect.height)) {
        mouse.x = Math.round((event.x - canvasRect.x) * (canvas.width / canvasRect.width));
        mouse.y = Math.round((event.y - canvasRect.y) * (canvas.height / canvasRect.height));
    }
    else if (mouse.x != undefined) {
        mouse.x = undefined;
        mouse.y = undefined;
    }
};

function mouseAngle() {
    var angle = 0;
    const cordX = mouse.x - centerX;
    const cordY = mouse.y - centerY;
    const long = Math.sqrt(cordX * cordX + cordY * cordY);
    if ((mouse.y - centerY) > 0)
        angle = Math.acos((cordX) / long);
    else
        angle = Math.PI * 2 - Math.acos((cordX) / long);
    return { angle, long };
};