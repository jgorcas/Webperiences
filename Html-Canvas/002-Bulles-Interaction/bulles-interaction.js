/* #######################################################################################
                                Window Event Listener
#######################################################################################*/
window.addEventListener("mousemove", mousemove);
window.addEventListener("resize", resize);

/* #######################################################################################
                                Déclaration des variables
#######################################################################################*/

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvasRect = canvas.getBoundingClientRect();
var mouse = {
    x: undefined,
    y: undefined
}
var maxRadius = 100;
var baseVelocity = 3;
var colorArray = [
    "#06090D",
    "#2EA6A6",
    "#BFB6B4",
    "#D94E41",
    "#F24C3D"
];
var circlesArray = [];
var c = canvas.getContext("2d");

/* #######################################################################################
                                Corps du programe
#######################################################################################*/
init();
animate();

/* #######################################################################################
                                Functions
#######################################################################################*/
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

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasRect = canvas.getBoundingClientRect();
    init();
};

function init() {
    console.log("init");
    circlesArray = [];
    for (let i = 0; i < 500; i++) {
        const radius = Math.random() * (maxRadius / 4) + 1;
        const x = radius + Math.random() * (innerWidth - radius * 2);
        const y = radius + Math.random() * (innerHeight - radius * 2);
        const dx = (Math.random() - 0.5) * baseVelocity;
        const dy = (Math.random() - 0.5) * baseVelocity;
        const red = Math.round(255 * Math.random());
        const blue = Math.round(255 * Math.random());
        const green = Math.round(255 * Math.random());
        const opacity = Math.round(255 * Math.random());
        const color = colorArray[Math.round(Math.random() * (colorArray.length - 1))];
        circlesArray.push(new Circle(x, y, dx, dy, radius, color));
    }
};

function DisplayMouseCoordinates() {
    c.beginPath();
    c.font = "15px Arial";
    c.fillStyle = "black";
    c.fillText(`[${mouse.x};${mouse.y}]`, mouse.x, mouse.y);
};

function Circle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy,
        this.radius = radius;
    this.color = color;
    this.baseRadius = radius;
    this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color;
        c.stroke();
        c.fillStyle = this.color;
        c.fill();
    }

    this.update = function () {
        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        if (Math.abs(mouse.x - this.x) < 50 && Math.abs(mouse.y - this.y) < 50) {
            if (this.radius < maxRadius)
                this.radius += 2;
        } else if (this.radius - 2 > this.baseRadius && this.radius - 2 > 0) {
            this.radius -= 2;
        }
        this.draw();
    }
};

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    circlesArray.forEach(element => {
        element.update();
    });
    DisplayMouseCoordinates();
}
