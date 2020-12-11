console.log("Start Canvas-bulles.js")

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');
var circlesArray = [];
var velocity = 3;


/* body */

init();
animate();


/* events handler*/

window.addEventListener('resize',function(event){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasRect = canvas.getBoundingClientRect();
    init();
});

/* function */
function init(){
    circlesArray = [];
    for (let i = 0; i < 250; i++) {
        var radius = Math.random()*50;
        var x = radius + Math.random()* (innerWidth - radius*2);
        var y = radius + Math.random()* (innerHeight - radius*2);
        var dx = (Math.random() -0.5)*velocity;
        var dy = (Math.random() -0.5)*velocity;
        var red = Math.round(255*Math.random());
        var blue = Math.round(255*Math.random());
        var green = Math.round(255*Math.random());
        var opacity = Math.round(255*Math.random());
        var color = "rgba(" +red+","+ blue + ","+ green + "," + opacity + ")";
        circlesArray.push(new Circle(x,y,dx,dy,radius,color));

    }
}

function Circle(x,y,dx,dy,radius,color){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy,
    this.radius = radius;
    this.color = color;

    this.draw = function(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2, false)
        c.strokeStyle= this.color;
        c.stroke();
    }

    this.update = function()
    {
        if(this.x+this.radius > innerWidth || this.x-this.radius < 0){
            this.dx = -this.dx;
        }    
        if(this.y+this.radius > innerHeight || this.y-this.radius < 0){
            this.dy = -this.dy;
        }  
        this.x+=this.dx;
        this.y+=this.dy;
        this.draw();
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight);
    circlesArray.forEach(element => {
        element.update();
    });
}