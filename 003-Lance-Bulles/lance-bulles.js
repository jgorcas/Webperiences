/* #######################################################################################
                                Window Event Listener 
#######################################################################################*/ 

window.addEventListener('mousemove', mouseMove,false);
window.addEventListener('click',shoot,false);
window.addEventListener('resize',init,false);
window.addEventListener('keydown',keyDown,false);
window.addEventListener('keyup', keyUp,false);
window.addEventListener('mousemove',mouseMove,false);

/* #######################################################################################
                                Déclaration des variables 
#######################################################################################*/ 

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var bullets = []
var lines = []
var player = undefined
var playerVelocity = 3;
var bulletVelocity = 10;
var bulletRadius = 3;
var mouse = undefined;

/* #######################################################################################
                                Déclaration des classes 
#######################################################################################*/ 

class Mouse{
    constructor(){
        this.x = undefined;
        this.y = undefined;
    }

    drawCoordinates()
    {
        c.beginPath();
        c.font="15px Arial";
        c.fillStyle = "black";
        c.fillText("[" + this.x +";" + this.y +"]",this.x, this.y);
    }

    update(x,y)
    {
        if(x >= canvasRect.x && y > canvasRect.y 
            && x < (canvasRect.x+ canvasRect.width)
            && y < (canvasRect.y+ canvasRect.height) ){
                mouse.x =Math.round((x-canvasRect.x) * (canvas.width/canvasRect.width));
                mouse.y = Math.round((y-canvasRect.y)*(canvas.height/canvasRect.height));
        }
        else if (mouse.x != undefined) {
            mouse.x = undefined;
            mouse.y = undefined;
        }
    }
}

class Player {

    constructor(x,y,dx,dy)
    {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = 10;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.strokeStyle = "black";
        c.stroke();
        c.fillStyle = "red"
        c.fill();
    }

    move(){
        this.dx=0;
        if(this.moveLeft)
            this.dx -=1;
        if(this.moveRight)
            this.dx +=1;
        this.dy=0;
        if(this.moveUp)
            this.dy -=1;
        if(this.moveDown)
            this.dy +=1;
    }

    displayCoordinates(){
        c.beginPath();
        c.font="15px Arial";
        c.fillStyle = "black";
        c.fillText("[" + this.x +";" + this.y +"]",this.x-40, this.y-20);
    }

    update(){
        this.move();

        if(this.dx !=0 && this.x + this.dx*playerVelocity - this.radius > 0 && this.x +this.dx*playerVelocity +this.radius < innerWidth )
            this.x +=  this.dx*playerVelocity;
        if(this.dy != 0 && this.y + this.dy*playerVelocity - this.radius > 0 && this.y +this.dy*playerVelocity +this.radius < innerHeight )
            this.y +=  this.dy*playerVelocity;

        this.draw();
        this.displayCoordinates();
    }
}

class Bullet{
    constructor(x1,y1,x2,y2){
        this.x = x1;
        this.y = y1;
        var dist = Math.sqrt(Math.pow(Math.abs(x2-x1),2)+ Math.pow(Math.abs(y2-y1),2));
        this.dx = bulletVelocity*(x2-x1)/dist;
        this.dy = bulletVelocity*(y2-y1)/dist;
        this.radius = bulletRadius;
        this.color = 'red';
    }

    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2, false)
        c.strokeStyle= this.color;
        c.stroke();
        c.fill();
    }

    update()
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

class Line{
    constructor(x1,y1,x2,y2){
        this.x1 = x1;
        this.y1 =y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(){
        c.strokeStyle ="blue";
        c.beginPath();
        c.moveTo(this.x1, this.y1);
        c.lineTo(this.x2,this.y2);
        c.stroke();

        this.affine();
    }

    affine()
    {
        var test = Math.sqrt(Math.pow(Math.abs(this.x2-this.x1),2)+ Math.pow(Math.abs(this.y2-this.y1),2));
        c.beginPath();
        c.font="15px Arial";
        c.fillStyle = "black";
        c.fillText("x = " + (this.x2-this.x1)/test +" y =  " + (this.y2-this.y1)/test,this.x2, this.y2);
    }
}

/* #######################################################################################
                                Corps du programe 
#######################################################################################*/ 


init();
animate();

/* #######################################################################################
                                Functions 
#######################################################################################*/ 
function init()
{
    canvas.style.backgroundColor = "#ddd";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasRect = canvas.getBoundingClientRect();
    player = new Player(innerWidth/2,innerHeight/2,0,0)
    mouse = new Mouse();
    bullets = [];
    lines = [];
}

function animate()
{
    requestAnimationFrame(animate)
    c.clearRect(0,0,innerWidth,innerHeight);
    player.update();

    DrawLines();
    mouse.drawCoordinates();
    DrawBullets();
}

function DrawLines()
{
    if(lines != undefined)
    lines.forEach(element => {
        element.draw();
    });

}
function DrawBullets(){
    if(bullets != undefined)
    bullets.forEach(element => {
        element.update();
    });
}

function shoot(){
   lines.push(new Line(player.x, player.y,mouse.x,mouse.y))
   bullet = new Bullet(player.x,player.y,mouse.x,mouse.y)
   bullets.push(bullet);
}

function mouseMove(event){
    mouse.update(event.x,event.y);
};

function keyDown(event){
    if(event.key === 'z')
        player.moveUp = true;
    if(event.key === 's')
        player.moveDown = true;
    if(event.key === 'q')
        player.moveLeft = true;
    if(event.key === 'd')
        player.moveRight = true;
        
};

function keyUp(event){
    if(event.key === 'z')
        player.moveUp = false;
    if(event.key === 's')
        player.moveDown = false;
    if(event.key === 'q')
        player.moveLeft = false;
    if(event.key === 'd')
        player.moveRight = false;
};