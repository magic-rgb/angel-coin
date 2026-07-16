/*==================================================
            ANGEL COIN JAVASCRIPT
==================================================*/


// ===============================
// Smooth Scroll
// ===============================


document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(e){

        const target =
        document.querySelector(
            this.getAttribute("href")
        );


        if(target){

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});






// ===============================
// Reveal Animation
// ===============================


const revealItems =
document.querySelectorAll(
".card, .stat-item, .about-box, .token-box, .phase-box, .team-card, .faq-item"
);



const revealObserver =
new IntersectionObserver((items)=>{


items.forEach(item=>{


if(item.isIntersecting){

item.target.classList.add("visible");

}


});


},{
threshold:.15

});



revealItems.forEach(item=>{

item.classList.add("reveal");

revealObserver.observe(item);

});







// ===============================
// Counter Animation
// ===============================


const counters =
document.querySelectorAll(".stat-item strong");


let counterStarted=false;



function startCounters(){


if(counterStarted) return;


const section =
document.querySelector(".stats");


if(!section) return;



const top =
section.getBoundingClientRect().top;



if(top < window.innerHeight){


counterStarted=true;


counters.forEach(counter=>{


let value =
counter.innerText;


let number =
parseInt(
value.replace(/,/g,"")
);



let suffix =
value.replace(/[0-9,]/g,"");



let count=0;


let speed =
number / 120;



function update(){


count += speed;



if(count < number){


counter.innerText =
Math.floor(count)
.toLocaleString()
+ suffix;


requestAnimationFrame(update);


}

else{


counter.innerText =
number
.toLocaleString()
+ suffix;


}


}


update();



});


}


}



window.addEventListener(
"scroll",
startCounters
);






// ===============================
// Mobile Menu
// ===============================


const menu =
document.querySelector(".menu-btn");


const navigation =
document.querySelector("nav");



if(menu){


menu.onclick=function(){

navigation.classList.toggle(
"open"
);

};


}






// ===============================
// Gold Floating Particles
// ===============================


function createParticles(){


for(let i=0;i<35;i++){


let particle =
document.createElement("span");


particle.className =
"gold-particle";



particle.style.left =
Math.random()*100+"%";



particle.style.animationDuration =
(5 + Math.random()*8)+"s";



particle.style.animationDelay =
Math.random()*5+"s";



document.body.appendChild(
particle
);



}


}



createParticles();
