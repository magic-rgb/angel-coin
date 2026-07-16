/*==================================================
            ANGEL COIN SCRIPT
==================================================*/


// Smooth Scroll

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        const target =
        document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});





/*==================================================
        SCROLL REVEAL ANIMATION
==================================================*/


const revealElements =
document.querySelectorAll(
".feature-card, .box, .stat-box, .token-card, .timeline-box, .team-card, .faq-box"
);



const revealObserver =
new IntersectionObserver((entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){

entry.target.classList.add("show");

}


});


},{
threshold:.15
});



revealElements.forEach(el=>{

el.classList.add("hidden");

revealObserver.observe(el);

});






/*==================================================
            NUMBER COUNTER
==================================================*/


const counters =
document.querySelectorAll(".stat-box h3");


let started=false;



function startCounter(){


if(started) return;


const stats =
document.querySelector(".stats");


const position =
stats.getBoundingClientRect().top;


if(position < window.innerHeight){


started=true;


counters.forEach(counter=>{


let text =
counter.innerText;


let number =
parseInt(text.replace(/\D/g,""));


let suffix =
text.replace(/[0-9,]/g,"");


let count=0;


let speed =
number / 100;



let update=()=>{


count += speed;


if(count < number){


counter.innerText =
Math.floor(count).toLocaleString()
+ suffix;


requestAnimationFrame(update);


}

else{


counter.innerText =
number.toLocaleString()
+ suffix;


}


};


update();


});


}


}



window.addEventListener(
"scroll",
startCounter
);





/*==================================================
            MOBILE MENU
==================================================*/


const menuBtn =
document.querySelector(".menu-btn");


const nav =
document.querySelector("nav");



if(menuBtn){


menuBtn.addEventListener(
"click",
()=>{


nav.classList.toggle("active");


});


}





/*==================================================
            GOLD PARTICLE EFFECT
==================================================*/


const particles = 40;


for(let i=0;i<particles;i++){


let dot =
document.createElement("span");


dot.className="particle";


dot.style.left =
Math.random()*100+"%";


dot.style.animationDelay =
Math.random()*10+"s";


dot.style.animationDuration =
(5+Math.random()*10)+"s";


document.body.appendChild(dot);


}
