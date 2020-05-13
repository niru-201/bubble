var cvs = document.getElementById("bubble");
var ctx = cvs.getContext('2d');
var body = document.querySelector('.body');
var frame = document.querySelector(' #frame');
var layout = document.querySelector(' #layout');
var timerclock = document.getElementById("timerclock");
var pause = document.getElementById("pause");
var restart = document.getElementById("restart");
var play = document.getElementById("play");
var bubble = [];
var num =2;
var circ;
var rate = 2000;
var touch=0;
var timer=0;
var m=0,s=0,ms=0;
var score=0;
var hs = localStorage.getItem("hs");
var status =0,gstat=0;
var gauntr=60000;
var addbinterval,drawinterval;
var colors = ["rgba(106,73,255,0.4)","rgba(241,238,22,0.4)","rgba(255,71,157,0.4)","rgba(47,243,63,0.4)","rgba(47,243,63,0.5)"];
var bgmusic= new Audio("bgmusic.mp3");
var pops= new Audio("pops.mp3");
var flag;
var gauntt;
const sprite = new Image();
sprite.src = "particle.png";
var isplaying = bgmusic.currentTime>0 && !bgmusic.pause;
var isplayings = pops.currentTime>0 && !pops.pause && pops.ended && pops.readyState >2;
dist = (x1,y1,x2,y2) => {
  var a = x1-x2;
  var b = y1-y2;
    return((Math.sqrt(a**2 +b**2)));
} 
setup = () => {  
   body.removeChild(layout);
}
setup();
area = () => {
  var areac=0;
  for(var i=0;i<bubble.length;i++)
     areac += Math.PI*(bubble[i].rad**2);
  if(areac > 0.75*800*600)   
      return true;
  else
      return false;    
}
 start = () =>
{
const playPromise = pops.play();
const playPromise2 =bgmusic.play();
  if (playPromise2 !== null){
    playPromise2.catch(() => { bgmusic.currentTime=0;
      bgmusic.play(); })
}
   if (playPromise !== null){
      playPromise.catch(() => {pops.play(); })
  }
  if(!timer){
    timer=setInterval(run,10);
  }
}
run = () =>
{ ratec();
  timerclock.textContent="TIME:"+(m<10? "0"+m : m)+":"+(s<10? "0"+s: s)+":"+(ms<10?"0"+ms:ms) + "  BEST:"+localStorage.getItem("hs");
  ms++;
  if(ms==100)
  {ms=0;
  s++;
  }
  if(s==60)
  {s=0;
  m++;
  }
} 
 stop = () =>
{clearInterval(timer);
  const playPromise = pops.play();
  const playPromise2 =bgmusic.play();
  if (playPromise !== null){
    playPromise.catch(() => {pops.currentTime=0;
      pops.play(); })
    if(playPromise2!== null){
      playPromise2.catch(() => {bgmusic.play();})
    }
}
  timer=0;
 ms=0;
 s=0;
 m=0;
 timerclock.textContent=(m<10? "0"+m : m)+":"+(s<10? "0"+s: s)+":"+(ms<10?"0"+ms:ms)+ "  BEST:"+localStorage.getItem("hs");
}
 reset = () =>
{stop();
document.location.reload();
}
ratec = () => {
  if(score>75)
     gauntr=30000;
  if(m<1)
    rate =2000;
  else if(m<2)
    { num=4;
    rate = 1000;}
  else if(m<3)
    {rate = 800; 
      num=6;}
  else if(m<4)
    {rate = 700;  
      num=7;}   
}
const gaunt = {
  draw : function(){
  ctx.drawImage(sprite,317,298,217,201,650,5,80,80);
  },
  burst: function(xm,ym){
   if(xm>650 && xm<730 && ym>5 && ym<85)
    {bubble.splice(0,(bubble.length)/2);
      clearInterval(gauntt);
      gstat=0;}
}
}
gauntact = (x,y) =>{
gaunt.draw(); 
gaunt.burst(x,y);
}

gauntadd =() =>{
  gstat =1;
}

setInterval(gauntadd,gauntr);
gameover = () =>{
  ctx.clearRect(0,0,cvs.width,cvs.height);
  ctx.font = "50px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("GAME OVER",265,200);
  ctx.fillText("SCORE: "+JSON.stringify(score),285,260);
}
play.addEventListener("click",function(){
    body.removeChild(frame);
    body.appendChild(layout);
    pusharr();
    start();
});
restart.addEventListener("click",function(){
 reset();
})
pause.addEventListener("click",function(){
    if(pause.textContent== "PAUSE")
     { pause.textContent = "RESUME";
      clearInterval(timer);
      clearInterval(drawinterval);
      clearInterval(addbinterval);}
    else if(pause.textContent == "RESUME"){
        pause.textContent = "PAUSE";
     timer= setInterval(run,10);
     drawinterval =setInterval(draw,50);
     addbinterval= setInterval(addb,rate);
    }  
})
over = () => {
  if(area()){
    window.setTimeout(area(),10000);
    if(area()){``
      requestAnimationFrame(gameover);
      best();
      clearInterval(timer);
      clearInterval(drawinterval);
      clearInterval(addbinterval);
      window.setTimeout(reset,7000);
    }
  }
}
class circle{
  constructor(){
    this.x = Math.random()*740;
    this.y = Math.random()*540;
    this.rad = Math.random()*20 + 30;
    this.dx =2;
    this.dy = -2;
    this.vel = Math.random()/5;
  }
  }
newbubble = () => {
  circ = new circle();
   bubble.push(circ);
}  
drawbubble = (i) => {
  
  ctx.beginPath();
  ctx.fillStyle = colors[Math.floor(Math.random()*4)];
  ctx.arc(bubble[i].x,bubble[i].y,bubble[i].rad,0,Math.PI*2,false);
  ctx.fill();

}  
pusharr = () => {
 { for(var i=0;i<15;i++)
      newbubble();
  } 
 for(var i=0;i<bubble.length;i++) 
    drawbubble(i);
}
popbbl = (a,b) => {
  for(var i=0;i<bubble.length;i++){
    if((dist(a,b,bubble[i].x,bubble[i].y)) < bubble[i].rad)
      { bubble.splice(i,1);
        pops.currentTime=0;
        pops.play();
        score++;
        best();
      }
    }
  }    
 cvs.addEventListener('click',function(e){
    if(!isplaying)
       bgmusic.play();
    const rect =  cvs.getBoundingClientRect();
    const xpos = e.clientX - rect.left;
    const ypos = e.clientY - rect.top;
    console.log(xpos,ypos);
    liq(xpos,ypos);
    popbbl(xpos,ypos);
    if(gstat==1)
      {
        gauntt= setInterval(gauntact(xpos,ypos),40);
      }
 });
best= () => {
  if(hs != null){
    if(parseInt(hs) < score)
      localStorage.setItem("hs",JSON.stringify(score));}
  else
   localStorage.setItem("hs",JSON.stringify(score));}

addb = () => {
  for(var i=0;i<num;i++)
   { newbubble();
    drawbubble(bubble.length-1);}
  over();
}
liqluck = () => {
ctx.drawImage(sprite,125,119,197,188,5,5,80,80);}
liq = (mx,my) =>{
  if(status<2)
    if(mx >5 && mx<85 && my>5 && my<85){
    status++;
    pops.currentTime=0;
    pops.play();
         clearInterval(addbinterval);
         setTimeout(function(){setInterval(addb,rate)},10000);
    if(status ==2)   
        clearInterval(liqt);
    }

}
draw = () => {
  ctx.clearRect(0,0,cvs.width,cvs.height);
  if(gstat==1)
     gaunt.draw();
  for(var i=0;i<bubble.length;i++){
    drawbubble(i); 

if(bubble[i].y + bubble[i].dy > (cvs.height-bubble[i].rad) || (bubble[i].y + bubble[i].dy) < bubble[i].rad) 
    bubble[i].dy = -bubble[i].dy;
if(bubble[i].x + bubble[i].dx > (cvs.width-bubble[i].rad) || (bubble[i].x + bubble[i].dx) < bubble[i].rad)
    bubble[i].dx = -bubble[i].dx;
bubble[i].x += bubble[i].dx;
bubble[i].y += bubble[i].dy; 
 
}
}
drawinterval = setInterval(draw,40);
addbinterval = setInterval(addb,rate);
liqt = setInterval(liqluck,40);
