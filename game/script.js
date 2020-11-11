const canvas = document.getElementById("screen");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity=0.98;

const sprites = {
	left: document.getElementById("sprites-left"),
	right: document.getElementById("sprites-right"),
	bullet: document.getElementById('sprites-bullet'),
	carry1: document.getElementById('sprites-carry1'),
	carry2: document.getElementById('sprites-carry2'),
	carry3: document.getElementById('sprites-carry3')
}

let shooting=false;
let playing = true;
let leftPressed = rightPressed = false;
let bullets = [];
let enemies = [];
let health = document.getElementById('health-progress')
let score = document.getElementById('score-progress')
let gameover = document.getElementById('gameover')
let restart = document.getElementById('restart')
let jumpFrenzy=false;

window.addEventListener('keydown', e => {
	console.log(e.code)
	switch(e.code){
		case "ArrowUp": case "KeyW":
			if(player.walk){
				player.dy = -23;
				if(!jumpFrenzy){
					player.walk=false;
				}
			}
		break;
		case "ArrowLeft": case "KeyA":
			leftPressed= true
			player.dir = "left";
		break;
		case "ArrowRight": case "KeyD":
			rightPressed= true;
			player.dir = "right";
		break;
		case "Space":
			if (!shooting) {
				bullets.push(new Bullet());
				shooting=true; 
				setTimeout(()=>{
					shooting=false;
				},400)
			}
		break;
		case "Backquote":
			const cmd = prompt("enter a command");
			switch(cmd){
				case 'jay shree ram':
					gameOver = function() {}
				break;
				case 'change my color':
					const colorChoice = prompt('type a color for player')
					player.color = colorChoice
				break;
				case 'udd gaye':
					player.update = function() {
						this.draw();
						if (leftPressed) {
							this.x--
						}
						if (rightPressed) {
							this.x++
						}
						if (upPressed) {
							this.y--
						}
						if (downPressed) {
							this.y++
						}
						for (var i = 0; i < enemies.length; i++) {
							if(!enemies[i].hit&&this.x+this.w>enemies[i].x && this.x < enemies[i].x+enemies[i].w){
								if(this.y+this.h>enemies[i].y && this.y < enemies[i].y+enemies[i].h){
									this.health-=20;
									enemies[i].hit = true;
									health.value=this.health
									if (health.value<=0) {
										gameOver()
									}
								}
							}
						}
					}
				break;
				case 'bhendi jump':
					jumpFrenzy = true;
				break;
			}
		break;
	}
})

window.addEventListener('keyup', e => {
	switch(e.code){
		case "ArrowLeft": case "KeyA":
			leftPressed= false;
		break;
		case "ArrowRight": case "KeyD":
			rightPressed= false;
		break;
	}
})

class Bullet {
	constructor(){
		this.w = 100;
		this.h = 50;
		this.img = sprites.bullet;
		this.y = player.y+((player.w-this.w)/2);
		this.x =  player.dir === "left" ? player.x-this.w:player.x+player.w;
		this.color = "yellow";
		this.dx = player.dir === "left" ? -4:4;
	}
	draw() {
		c.beginPath();
		c.drawImage(this.img,this.x,this.y,this.w,this.h)
	}
	update(){
		this.draw();
		this.x += this.dx;
	}
}

function Enemy (w, h, dx, dy, img, health, x, y) {
	this.side = Math.floor(Math.random()*2)
	this.dx= dx|| 5;
	this.dy= dy|| 0;
    this.health = health || 1;
	this.w= w || 75;
	this.h= h || 120;
	this.x = x || this.side == 1 ?0:innerWidth-this.h;
	this.y= y || ground.y-this.h;
	this.walk= false;
	this.dir= "left";
	this.dead=false;
	this.img = img || Math.random()<0.5?sprites.carry1:sprites.carry2;
	this.draw= function() {
		c.beginPath();
		c.drawImage(this.img,this.x,this.y,this.w,this.h)
	};
	this.update= function() {
		this.draw();
		if(this.side==1){
			this.x += this.dx;
		} else if(this.side==0){
			this.x -= this.dx;
		}
	}
}
const player = {
	x: innerWidth/2,
	y: innerHeight/2,
	img: sprites.left,
	dx: 2,
	dy: 0,
	w: 100,
	h: 100,
	health:parseInt(health.value),
	walk: false,
	dir: "left",
	draw: function() {
		c.beginPath();
		c.drawImage(this.img,this.x,this.y,this.w,this.h)
	},
	update: function() {
		this.draw();
		this.img = this.dir=="left"?sprites.left:sprites.right;
		if(rightPressed){
			this.x += this.dx;
		} else if(leftPressed){
			this.x -= this.dx;
		}
		this.y += this.dy;
		this.dy+=gravity;
		if(this.y+this.h>ground.y){
			this.walk=true;
			this.dy=0;
			this.y = ground.y - this.h
		}
		for (var i = 0; i < enemies.length; i++) {
			if(!enemies[i].hit&&this.x+this.w>enemies[i].x && this.x < enemies[i].x+enemies[i].w){
				if(this.y+this.h>enemies[i].y && this.y < enemies[i].y+enemies[i].h){
					this.health-=20;
					enemies[i].hit = true;
					health.value=this.health
					if (health.value<=0) {
						gameOver()
					}
				}
			}
		}
	}
}
function gameOver(){
	playing=false;
	gameover.style.display="block"
}
const ground = {
	x: 0,
	y: innerHeight * 3/4,
	w: innerWidth,
	h: innerHeight,
	color: "white",
	draw: function() {
		c.beginPath();
		c.fillStyle=this.color;
		c.fillRect(this.x,this.y,this.w,this.h);
	}
}
function screen(){
	c.clearRect(0,0,innerWidth, innerHeight);
	ground.draw();
	player.update();
	let tosplice=[];
	let bulletsplice=[];
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].update()
		for (var j = 0; j < enemies.length; j++) {
			if (bullets[i].x + bullets[i].w>enemies[j].x && bullets[i].x<enemies[j].x+enemies[j].w) {
				if ((bullets[i].y + bullets[i].h>enemies[j].y && bullets[i].y<enemies[j].y+enemies[j].h)||enemies[j].x<0||enemies[j].x>innerWidth) {
                    enemies[j].health--;
                    if(enemies[j].health<=0) {
                        tosplice.push(j);
                        bulletsplice.push(i);
                        score.innerHTML=parseInt(score.innerHTML)+10
                        if(parseInt(score.innerHTML)!=0){
                            if (parseInt(score.innerHTML)%100==0) {
                                enemies.push(new Enemy(200,300,0.55,0,sprites.carry3,3))
                            }
                            if (parseInt(score.innerHTML)%150==0) {
                                enemies.push(new Enemy(200,300,0.25,0,sprites.carry3,5))
                            }
                        }
                    }
				}
			}
		}
		if (bullets[i].x > innerWidth || bullets[i].x+bullets[i].w<0) {
			bullets.splice(i,1)
		}
	}
	for (var i = 0; i < bulletsplice.length; i++) {
		bullets.splice(bulletsplice[i],1)
	}
	for (var i = 0; i < tosplice.length; i++) {
		enemies.splice(tosplice[i],1)
	}
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].update()
	}
	if (playing) {
		requestAnimationFrame(screen)
	}
}
setInterval(function() {
	enemies.push(new Enemy())
},500)
screen()