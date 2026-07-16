/* =================================
   ANGEL COIN PREMIUM JAVASCRIPT
================================= */


// Smooth scrolling

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        document.querySelector(this.getAttribute("href"))
        .scrollIntoView({

            behavior:"smooth"

        });

    });

});





// Reveal animation when scrolling

const sections = document.querySelectorAll("section");


const observer = new IntersectionObserver(entries => {


entries.forEach(entry => {


if(entry.isIntersecting){

entry.target.style.opacity="1";
entry.target.style.transform="translateY(0)";


}


});


},
{
threshold:0.15
});



sections.forEach(section=>{


section.style.opacity="0";

section.style.transform="translateY(50px)";

section.style.transition="1s";


observer.observe(section);


});






// Create floating light particles


const particleContainer=document.createElement("div");

particleContainer.className="particles";


document.body.appendChild(particleContainer);



for(let i=0;i<80;i++){


let particle=document.createElement("span");


particle.className="particle";


particle.style.left=Math.random()*100+"%";


particle.style.animationDuration=
(5+Math.random()*10)+"s";


particle.style.animationDelay=
Math.random()*5+"s";


particleContainer.appendChild(particle);


}







// Token counter animation


const counters=document.querySelectorAll(".card p");


counters.forEach(counter=>{


counter.addEventListener("mouseenter",()=>{


counter.style.color="#ffd86b";

counter.style.textShadow=
"0 0 20px #ffd86b";


});


counter.addEventListener("mouseleave",()=>{


counter.style.color="white";

counter.style.textShadow="none";


});


});
