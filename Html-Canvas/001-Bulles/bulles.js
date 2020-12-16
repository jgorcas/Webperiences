/* #######################################################################################
                                Window Event Listener 
#######################################################################################*/

window.addEventListener("resize", resize);

/* #######################################################################################
                                Déclaration des variables
#######################################################################################*/

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");
var circlesArray = [];
var velocity = 3;
var canvasRect;

/* #######################################################################################
                                Corps du programe
#######################################################################################*/
init();
animate();


/* #######################################################################################
                                Functions
#######################################################################################*/
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasRect = canvas.getBoundingClientRect();
    init();
};
function init() {
    circlesArray = [];
    for (let i = 0; i < 250; i++) {
        const radius = Math.random() * 50;
        const x = radius + Math.random() * (innerWidth - radius * 2);
        const y = radius + Math.random() * (innerHeight - radius * 2);
        const dx = (Math.random() - 0.5) * velocity;
        const dy = (Math.random() - 0.5) * velocity;
        const red = Math.round(255 * Math.random());
        const blue = Math.round(255 * Math.random());
        const green = Math.round(255 * Math.random());
        const opacity = Math.round(255 * Math.random());
        const color = `rgba(${red},${blue},${green},${opacity})`;
        circlesArray.push(new Circle(x, y, dx, dy, radius, color));

    }
};
function Circle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy,
        this.radius = radius;
    this.color = color;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color;
        c.stroke();
    }

    this.update = function () {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
};

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    circlesArray.forEach(element => {
        element.update();
    });
};