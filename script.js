"use strict";

/*==================================================
            ANGEL COIN PREMIUM SCRIPT V2
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

const $ = (e)=>document.querySelector(e);
const $$ = (e)=>document.querySelectorAll(e);

/*=========================================
            HEADER SCROLL
=========================================*/

const header = $(".header");

window.addEventListener("scroll",()=>{

if(window.scrollY>80){

header.classList.add("header-scroll");

}else{

header.classList.remove("header-scroll");

}

});

/*=========================================
            SMOOTH SCROLL
=========================================*/

$$('a[href^="#"]').forEach(link=>{

link.addEventListener("click",e=>{

const target=document.querySelector(link.getAttribute("href"));

if(!target) return;

e.preventDefault();

window.scrollTo({

top:target.offsetTop-90,

behavior:"smooth"

});

});

});

/*=========================================
            REVEAL ANIMATION
=========================================*/

const revealElements=$$(
".reveal,.card,.about-box,.team-card,.roadmap-card,.stat-item,.feature-card"
);

const revealObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("active");

}

});

},{

threshold:.15

});

revealElements.forEach(item=>{

item.classList.add("reveal");

revealObserver.observe(item);

});

/*=========================================
            STATS COUNTER
=========================================*/

const stats=$$(".stat-item strong");

const counterObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(!entry.isIntersecting) return;

const el=entry.target;

const target=parseInt(el.dataset.target)||0;

let current=0;

const speed=target/120;

const update=()=>{

current+=speed;

if(current<target){

el.innerText=Math.floor(current);

requestAnimationFrame(update);

}else{

el.innerText=target.toLocaleString();

}

};

update();

counterObserver.unobserve(el);

});

});

stats.forEach(stat=>counterObserver.observe(stat));

/*=========================================
            PARALLAX HERO
=========================================*/

const hero=$(".hero");

window.addEventListener("scroll",()=>{

const offset=window.pageYOffset;

if(hero){

hero.style.backgroundPosition=`center ${offset*0.35}px`;

}

});


/*=========================================
        GOLD PARTICLES
=========================================*/

function createParticle(){

const p=document.createElement("span");

p.className="gold-particle";

p.style.left=Math.random()*100+"vw";

const size=Math.random()*6+2;

p.style.width=size+"px";
p.style.height=size+"px";

p.style.animationDuration=(Math.random()*8+8)+"s";

p.style.opacity=Math.random();

document.body.appendChild(p);

setTimeout(()=>{

p.remove();

},17000);

}

setInterval(createParticle,350);


/*=========================================
        BACK TO TOP BUTTON
=========================================*/

const topButton=document.createElement("div");

topButton.className="back-top";

topButton.innerHTML='<i class="fa-solid fa-chevron-up"></i>';

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

if(window.scrollY>600){

topButton.classList.add("show");

}else{

topButton.classList.remove("show");

}

});

topButton.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});


/*=========================================
        ACTIVE MENU
=========================================*/

const sections=document.querySelectorAll("section");

const navLinks=document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const top=section.offsetTop-150;

const height=section.offsetHeight;

if(pageYOffset>=top){

current=section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){

link.classList.add("active");

}

});

});


/*=========================================
        CARD HOVER EFFECT
=========================================*/

document.querySelectorAll(

".card,.feature-card,.about-box,.team-card,.roadmap-card"

).forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateX=((y/rect.height)-0.5)*-8;

const rotateY=((x/rect.width)-0.5)*8;

card.style.transform=

`perspective(900px)

rotateX(${rotateX}deg)

rotateY(${rotateY}deg)

translateY(-8px)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});


/*=========================================
        BUTTON GLOW
=========================================*/

document.querySelectorAll(

".gold-button,.buy-btn"

).forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.boxShadow=

"0 0 35px rgba(244,197,66,.9)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.boxShadow="";

});

});


/*=========================================
        PRELOADER
=========================================*/

const loader=document.querySelector(".preloader");

if(loader){

window.addEventListener("load",()=>{

loader.style.opacity="0";

loader.style.visibility="hidden";

setTimeout(()=>{

loader.remove();

},700);

});

}


/*=========================================
        HERO PARALLAX
=========================================*/

const heroImage=document.querySelector(".hero-image");
const heroGlow=document.querySelector(".hero-glow");

window.addEventListener("mousemove",(e)=>{

if(!heroImage) return;

const x=(e.clientX/window.innerWidth-.5)*20;
const y=(e.clientY/window.innerHeight-.5)*20;

heroImage.style.transform=
`translate(${x}px,${y}px)`;

if(heroGlow){

heroGlow.style.transform=
`translate(${x*.5}px,${y*.5}px)`;

}

});


/*=========================================
        MAGNET BUTTONS
=========================================*/

document.querySelectorAll(
".gold-button,.buy-btn"
).forEach(button=>{

button.addEventListener("mousemove",(e)=>{

const rect=button.getBoundingClientRect();

const x=e.clientX-rect.left-rect.width/2;

const y=e.clientY-rect.top-rect.height/2;

button.style.transform=

`translate(${x*.18}px,${y*.18}px)`;

});

button.addEventListener("mouseleave",()=>{

button.style.transform="translate(0,0)";

});

});


/*=========================================
        IMAGE FADE
=========================================*/

const images=document.querySelectorAll("img");

const imageObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

imageObserver.unobserve(entry.target);

}

});

},{
threshold:.2
});

images.forEach(img=>{

img.style.opacity="0";

img.style.transform="translateY(40px)";

img.style.transition="1s";

imageObserver.observe(img);

});


/*=========================================
        RANDOM GLOW
=========================================*/

setInterval(()=>{

document.querySelectorAll(

".card,.about-box,.feature-card"

).forEach(card=>{

card.style.boxShadow=

`0 0 ${20+Math.random()*40}px rgba(244,197,66,.15)`;

});

},2500);


/*=========================================
        HERO FLOAT
=========================================*/

let floatValue=0;

setInterval(()=>{

floatValue+=0.02;

if(heroImage){

heroImage.style.marginTop=

Math.sin(floatValue)*12+"px";

}

},16);



/*=========================================
        CUSTOM CURSOR
=========================================*/

const cursor=document.createElement("div");

cursor.className="cursor-glow";

document.body.appendChild(cursor);

document.addEventListener("mousemove",(e)=>{

cursor.style.left=e.clientX+"px";

cursor.style.top=e.clientY+"px";

});

document.querySelectorAll(

"a,button,.card,.feature-card,.team-card,.about-box"

).forEach(item=>{

item.addEventListener("mouseenter",()=>{

cursor.classList.add("active");

});

item.addEventListener("mouseleave",()=>{

cursor.classList.remove("active");

});

});


/*=========================================
        HERO TYPE EFFECT
=========================================*/

const heroTitle=document.querySelector(".hero h2");

if(heroTitle){

const text=heroTitle.textContent;

heroTitle.textContent="";

let i=0;

function typing(){

if(i<text.length){

heroTitle.textContent+=text.charAt(i);

i++;

setTimeout(typing,45);

}

}

typing();

}


/*=========================================
        SECTION GLOW
=========================================*/

const sectionObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.animate([

{

opacity:.92,

transform:"translateY(40px)"

},

{

opacity:1,

transform:"translateY(0)"

}

],{

duration:900,

fill:"forwards",

easing:"ease"

});

}

});

},{threshold:.15});

document.querySelectorAll("section").forEach(section=>{

sectionObserver.observe(section);

});


/*=========================================
        RANDOM STAR TWINKLE
=========================================*/

setInterval(()=>{

const stars=document.querySelectorAll(".gold-particle");

stars.forEach(star=>{

star.style.opacity=Math.random();

});

},800);


/*=========================================
        FPS OPTIMIZATION
=========================================*/

let resizeTimer;

window.addEventListener("resize",()=>{

clearTimeout(resizeTimer);

resizeTimer=setTimeout(()=>{

window.dispatchEvent(new Event("scroll"));

},200);

});


/*=========================================
        FINISH
=========================================*/

console.log(

"%cANGEL COIN PREMIUM",

"color:#FFD86B;font-size:22px;font-weight:bold;"

);

console.log(

"Premium UI Loaded Successfully"

);

});





            
            
                          
