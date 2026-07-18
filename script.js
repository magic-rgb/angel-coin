/*========================================================
        ANGEL COIN PREMIUM ENGINE
        APP.JS FINAL VERSION 2026
        Secure / Optimized / Modern JS
========================================================*/

"use strict";


const ANGEL = (()=>{


/*========================================================
        EXTRA MODULE QUEUE
========================================================*/


const ANGEL_EXTRA_INIT=[];




/*========================================================
        CONFIGURATION
========================================================*/


const CONFIG={


    selectors:{


        header:"header",

        hero:".hero",

        cards:
        ".token-card,.feature-card,.highlight-card,.stat-card,.card",

        sections:"section",

        counter:"[data-count]"


    },


    mobileBreakpoint:768


};







/*========================================================
        HELPER FUNCTIONS
========================================================*/


const Helper={



qs(selector,parent=document){


    try{

        return parent.querySelector(selector);

    }

    catch(e){

        return null;

    }


},



qsa(selector,parent=document){


    try{

        return [
        ...parent.querySelectorAll(selector)
        ];

    }

    catch(e){

        return [];

    }


},



clamp(value,min,max){

    return Math.min(
    Math.max(value,min),
    max
    );

},



random(min,max){

    return Math.random()*
    (max-min)+min;

},



throttle(fn,delay=100){


    let waiting=false;


    return (...args)=>{


        if(waiting)
        return;



        waiting=true;



        requestAnimationFrame(()=>{


            fn(...args);



            setTimeout(()=>{


                waiting=false;


            },delay);



        });



    };


},



debounce(fn,delay=300){


    let timer;


    return (...args)=>{


        clearTimeout(timer);



        timer=setTimeout(()=>{


            fn(...args);



        },delay);



    };


},



isMobile(){


    return window.innerWidth <
    CONFIG.mobileBreakpoint;


},



reducedMotion(){


    return window.matchMedia(
    "(prefers-reduced-motion: reduce)"
    ).matches;


}



};







/*========================================================
        DOM CACHE
========================================================*/


const DOM={



header:null,

hero:null,

cards:[],

sections:[],

counters:[],



load(){



this.header=
Helper.qs(
CONFIG.selectors.header
);



this.hero=
Helper.qs(
CONFIG.selectors.hero
);



this.cards=
Helper.qsa(
CONFIG.selectors.cards
);



this.sections=
Helper.qsa(
CONFIG.selectors.sections
);



this.counters=
Helper.qsa(
CONFIG.selectors.counter
);



}



};







/*========================================================
        PERFORMANCE
========================================================*/


const Performance={



init(){


if(
"scrollRestoration" in history
){

history.scrollRestoration="manual";

}



document.documentElement.style.scrollBehavior=
"smooth";



}



};







/*========================================================
        NAVBAR ENGINE
========================================================*/


const Navigation={



lastScroll:0,



init(){



if(!DOM.header)
return;



window.addEventListener(

"scroll",

Helper.throttle(()=>{


this.update();


},80)



);



},




update(){


const scroll=
window.scrollY;



if(scroll>50){


DOM.header.classList.add(
"scrolled"
);


}

else{


DOM.header.classList.remove(
"scrolled"
);


}




if(
scroll>this.lastScroll &&
scroll>150
){


DOM.header.classList.add(
"hide"
);


}

else{


DOM.header.classList.remove(
"hide"
);


}



this.lastScroll=
scroll;



}



};







/*========================================================
        SMOOTH SCROLL
========================================================*/


const Smooth={



init(){



Helper.qsa(
'a[href^="#"]'
)
.forEach(link=>{



link.addEventListener(

"click",

event=>{


const target=
Helper.qs(
link.getAttribute("href")
);



if(!target)
return;



event.preventDefault();



target.scrollIntoView({

behavior:"smooth",

block:"start"

});



}



);



});



}



};







/*========================================================
        MAIN INIT
========================================================*/


function init(){



try{


DOM.load();


Performance.init();


Navigation.init();


Smooth.init();



/*
 فعال کردن تمام ماژول‌های پارت‌های بعدی
*/


ANGEL_EXTRA_INIT
.forEach(module=>{


try{

module();

}

catch(error){

console.warn(
"Module Error:",
error
);

}


});



}

catch(error){


console.error(
"ANGEL ENGINE ERROR:",
error
);


}



}





return {


init,


Helper,


DOM


};



})();






document.addEventListener(

"DOMContentLoaded",

()=>{


ANGEL.init();


}

);

/*========================================================
        SCROLL REVEAL ENGINE
========================================================*/


const RevealEngine={


    observer:null,


    init(){


        if(
        Helper.reducedMotion()
        )
        return;



        this.observer=
        new IntersectionObserver(


            entries=>{


                entries.forEach(entry=>{


                    if(
                    entry.isIntersecting
                    ){


                        entry.target
                        .classList
                        .add("show");



                        this.observer
                        .unobserve(
                        entry.target
                        );


                    }



                });



            },


            {

                threshold:.15,

                rootMargin:
                "0px 0px -80px"

            }



        );



        DOM.sections.forEach(
        section=>{


            section.classList
            .add("reveal");


            this.observer
            .observe(
            section
            );


        });



    }



};






/*========================================================
        COUNTER ANIMATION ENGINE
========================================================*/


const CounterEngine={


    started:false,



    init(){


        if(
        !DOM.counters.length
        )
        return;



        const observer=
        new IntersectionObserver(


            entries=>{


                entries.forEach(
                entry=>{


                    if(
                    entry.isIntersecting
                    ){


                        this.animate(
                        entry.target
                        );


                        observer
                        .unobserve(
                        entry.target
                        );


                    }



                });


            },


            {

                threshold:.7

            }



        );



        DOM.counters.forEach(
        counter=>{


            observer.observe(
            counter
            );


        });



    },




    animate(element){


        const target=
        Number(
        element.dataset.count
        );



        if(
        Number.isNaN(target)
        )
        return;



        let current=0;



        const speed=
        Math.max(
        20,
        2000/target
        );



        const update=()=>{


            current +=
            Math.ceil(
            target/80
            );



            if(
            current>=target
            ){


                element.textContent=
                target.toLocaleString();


                return;


            }



            element.textContent=
            current.toLocaleString();



            requestAnimationFrame(
            update
            );



        };



        update();



    }



};







/*========================================================
        HERO PARALLAX ENGINE
========================================================*/


const ParallaxEngine={


    enabled:true,


    init(){


        if(
        !DOM.hero ||
        Helper.isMobile() ||
        Helper.reducedMotion()
        )
        return;




        window.addEventListener(

        "scroll",

        Helper.throttle(()=>{


            this.move();



        },30)



        );



    },



    move(){


        const scroll=
        window.scrollY;



        const speed=
        scroll*.25;



        DOM.hero.style
        .transform=
        `translate3d(0,${speed}px,0)`;


    }



};






/*========================================================
        SCROLL PROGRESS BAR
========================================================*/


const ProgressBar={


    bar:null,



    init(){


        this.bar=
        document.createElement(
        "div"
        );


        this.bar.id=
        "scroll-progress";



        Object.assign(

        this.bar.style,

        {

        position:"fixed",

        top:"0",

        left:"0",

        height:"3px",

        width:"0%",

        zIndex:"99999",

        background:
        "linear-gradient(90deg,#f4c542,#ffe78b)",

        transition:
        "width .15s ease"

        }


        );



        document.body
        .appendChild(
        this.bar
        );



        window.addEventListener(

        "scroll",

        Helper.throttle(()=>{


            this.update();


        },50)

        );



    },



    update(){


        const height=
        document.documentElement
        .scrollHeight -
        window.innerHeight;



        const progress=
        (
        window.scrollY /
        height
        )*100;



        this.bar.style.width=
        `${progress}%`;



    }



};







/*========================================================
        ACTIVATE PART 2 MODULES
========================================================*/


ANGEL_EXTRA_INIT.push(()=>{


    RevealEngine.init();


    CounterEngine.init();


    ParallaxEngine.init();


    ProgressBar.init();



});


/*========================================================
        MOUSE GOLD GLOW ENGINE
========================================================*/


const GlowEngine={


    light:null,


    init(){


        if(
        Helper.isMobile() ||
        Helper.reducedMotion()
        )
        return;



        this.create();



        window.addEventListener(

        "mousemove",

        Helper.throttle(
        e=>{

            this.move(e);

        },16)

        );



    },



    create(){


        this.light=
        document.createElement(
        "div"
        );


        this.light.className=
        "angel-mouse-glow";



        Object.assign(

        this.light.style,

        {

        position:"fixed",

        width:"280px",

        height:"280px",

        borderRadius:"50%",

        pointerEvents:"none",

        zIndex:"9998",

        opacity:"0",

        background:
        "radial-gradient(circle,rgba(244,197,66,.22),transparent 70%)",

        transform:
        "translate(-50%,-50%)",

        transition:
        "opacity .4s ease"

        }


        );



        document.body
        .appendChild(
        this.light
        );



    },




    move(event){


        this.light.style.left=
        event.clientX+"px";


        this.light.style.top=
        event.clientY+"px";


        this.light.style.opacity=
        "1";



    }



};








/*========================================================
        CARD 3D TILT ENGINE
========================================================*/


const TiltEngine={


    init(){


        if(
        Helper.isMobile() ||
        Helper.reducedMotion()
        )
        return;



        DOM.cards.forEach(card=>{


            card.addEventListener(

            "mousemove",

            e=>{


                this.move(
                e,
                card
                );


            }


            );



            card.addEventListener(

            "mouseleave",

            ()=>{


                card.style.transform=
                "rotateX(0) rotateY(0)";



            }


            );



        });



    },



    move(event,card){



        const rect=
        card.getBoundingClientRect();



        const x=
        event.clientX -
        rect.left;



        const y=
        event.clientY -
        rect.top;



        const centerX=
        rect.width/2;



        const centerY=
        rect.height/2;



        const rotateY=
        ((x-centerX)/centerX)*10;



        const rotateX=
        ((centerY-y)/centerY)*10;



        card.style.transform=

        `perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)`;



    }



};







/*========================================================
        MAGNETIC BUTTON ENGINE
========================================================*/


const MagneticButtons={


    init(){


        if(
        Helper.isMobile()
        )
        return;



        const buttons=
        Helper.qsa(
        "button,.btn,.hero a"
        );



        buttons.forEach(btn=>{


            btn.addEventListener(

            "mousemove",

            e=>{


                const box=
                btn.getBoundingClientRect();



                const x=
                e.clientX -
                box.left -
                box.width/2;



                const y=
                e.clientY -
                box.top -
                box.height/2;



                btn.style.transform=

                `translate(
                ${x*.18}px,
                ${y*.18}px
                )`;



            });



            btn.addEventListener(

            "mouseleave",

            ()=>{


                btn.style.transform=
                "";



            });



        });



    }



};








/*========================================================
        GLASS REFLECTION ENGINE
========================================================*/


const ReflectionEngine={


    init(){


        DOM.cards.forEach(card=>{


            const shine=
            document.createElement(
            "span"
            );



            shine.className=
            "card-shine";



            card.appendChild(
            shine
            );



            card.addEventListener(

            "mousemove",

            e=>{


                const rect=
                card.getBoundingClientRect();



                shine.style.left=
                (
                e.clientX-
                rect.left
                )+"px";



                shine.style.top=
                (
                e.clientY-
                rect.top
                )+"px";



            });



        });



    }



};








/*========================================================
        FLOATING ELEMENT ENGINE
========================================================*/


const FloatingEngine={


    init(){


        const items=
        Helper.qsa(
        ".floating,.orb,.coin"
        );



        items.forEach(
        (item,index)=>{


            item.animate(

            [

            {
            transform:"translateY(0)"
            },

            {
            transform:
            "translateY(-20px)"
            },

            {
            transform:
            "translateY(0)"
            }

            ],

            {


            duration:
            3000+
            index*400,


            iterations:
            Infinity,


            easing:
            "ease-in-out"


            }

            );



        });



    }



};






/*========================================================
        ACTIVATE PART 3
========================================================*/


ANGEL_EXTRA_INIT.push(()=>{


    GlowEngine.init();


    TiltEngine.init();


    MagneticButtons.init();


    ReflectionEngine.init();


    FloatingEngine.init();



});


/*========================================================
        GOLD PARTICLE ENGINE
========================================================*/


const ParticleEngine={


    canvas:null,

    ctx:null,

    particles:[],

    running:false,



    init(){


        if(
        Helper.isMobile() ||
        Helper.reducedMotion()
        )
        return;



        this.createCanvas();


        this.resize();


        this.createParticles();


        this.animate();



        window.addEventListener(

        "resize",

        Helper.debounce(()=>{

            this.resize();

        },300)

        );


    },




    createCanvas(){


        this.canvas=
        document.createElement(
        "canvas"
        );


        this.canvas.id=
        "angel-particles";



        Object.assign(

        this.canvas.style,

        {

        position:"fixed",

        inset:"0",

        pointerEvents:"none",

        zIndex:"-1"

        }


        );



        document.body
        .appendChild(
        this.canvas
        );



        this.ctx=
        this.canvas.getContext(
        "2d"
        );


    },




    resize(){


        this.canvas.width=
        window.innerWidth;



        this.canvas.height=
        window.innerHeight;



    },




    createParticles(){


        const count=80;


        this.particles=[];



        for(
        let i=0;
        i<count;
        i++
        ){


            this.particles.push({

                x:
                Math.random()*
                this.canvas.width,


                y:
                Math.random()*
                this.canvas.height,


                size:
                Helper.random(
                1,
                3
                ),


                speed:
                Helper.random(
                .2,
                .8
                ),


                opacity:
                Helper.random(
                .2,
                .8
                )


            });


        }



    },




    animate(){


        if(!this.ctx)
        return;



        this.ctx.clearRect(

        0,

        0,

        this.canvas.width,

        this.canvas.height

        );




        this.particles.forEach(p=>{


            p.y-=p.speed;



            if(
            p.y<0
            ){

                p.y=
                this.canvas.height;

            }



            this.ctx.beginPath();


            this.ctx.arc(

            p.x,

            p.y,

            p.size,

            0,

            Math.PI*2

            );



            this.ctx.fillStyle=
            `rgba(244,197,66,${p.opacity})`;



            this.ctx.fill();



        });



        requestAnimationFrame(

        ()=>this.animate()

        );



    }



};








/*========================================================
        CUSTOM CURSOR ENGINE
========================================================*/


const CursorEngine={


    cursor:null,


    init(){


        if(
        Helper.isMobile() ||
        Helper.reducedMotion()
        )
        return;



        this.cursor=
        document.createElement(
        "div"
        );



        this.cursor.className=
        "angel-cursor";



        Object.assign(

        this.cursor.style,

        {

        width:"22px",

        height:"22px",

        border:
        "1px solid #f4c542",

        borderRadius:"50%",

        position:"fixed",

        pointerEvents:"none",

        zIndex:"99999",

        transform:
        "translate(-50%,-50%)",

        transition:
        "transform .15s ease"

        }


        );



        document.body
        .appendChild(
        this.cursor
        );



        window.addEventListener(

        "mousemove",

        e=>{


            this.cursor.style.left=
            e.clientX+"px";



            this.cursor.style.top=
            e.clientY+"px";



        }

        );



        this.hover();


    },




    hover(){


        Helper.qsa(
        "a,button,.card"
        )
        .forEach(item=>{


            item.addEventListener(

            "mouseenter",

            ()=>{


                this.cursor.style.transform=
                "translate(-50%,-50%) scale(2)";


            });



            item.addEventListener(

            "mouseleave",

            ()=>{


                this.cursor.style.transform=
                "translate(-50%,-50%) scale(1)";


            });



        });



    }



};








/*========================================================
        LAZY IMAGE OPTIMIZER
========================================================*/


const LazyImage={


    init(){


        const images=
        Helper.qsa(
        "img[data-src]"
        );



        if(
        !images.length
        )
        return;



        const observer=
        new IntersectionObserver(

        entries=>{


            entries.forEach(
            entry=>{


                if(
                entry.isIntersecting
                ){


                    const img=
                    entry.target;



                    img.src=
                    img.dataset.src;



                    img.removeAttribute(
                    "data-src"
                    );



                    observer.unobserve(
                    img
                    );


                }



            });


        });



        images.forEach(
        img=>
        observer.observe(img)
        );



    }



};








/*========================================================
        BACKGROUND ORB ENGINE
========================================================*/


const OrbEngine={


    init(){


        const orbs=
        Helper.qsa(
        ".orb"
        );



        orbs.forEach(
        (orb,i)=>{


            orb.animate(

            [

            {
            transform:
            "translate(0,0)"
            },

            {
            transform:
            `translate(
            ${30+i*10}px,
            ${-40-i*5}px
            )`
            },

            {
            transform:
            "translate(0,0)"
            }

            ],

            {


            duration:
            6000+i*800,


            iterations:
            Infinity,


            easing:
            "ease-in-out"


            }

            );


        });



    }



};






/*========================================================
        ACTIVATE PART 4
========================================================*/


ANGEL_EXTRA_INIT.push(()=>{


    ParticleEngine.init();


    CursorEngine.init();


    LazyImage.init();


    OrbEngine.init();



});


/*========================================================
        SECURITY LAYER
========================================================*/


const SecurityEngine={


    init(){


        this.preventBrokenImages();


        this.cleanExternalLinks();


    },




    preventBrokenImages(){


        Helper.qsa("img")
        .forEach(img=>{


            img.addEventListener(

            "error",

            ()=>{


                img.style.opacity="0";



            });



        });



    },




    cleanExternalLinks(){


        Helper.qsa(
        'a[target="_blank"]'
        )
        .forEach(link=>{


            link.setAttribute(
            "rel",
            "noopener noreferrer"
            );



        });



    }



};








/*========================================================
        AUTO ANIMATION MANAGER
========================================================*/


const AnimationManager={


    paused:false,



    init(){


        document.addEventListener(

        "visibilitychange",

        ()=>{


            this.paused=
            document.hidden;



        });



    }



};








/*========================================================
        PERFORMANCE MONITOR
========================================================*/


const FPSOptimizer={


    init(){


        if(
        !window.requestIdleCallback
        )
        return;



        requestIdleCallback(()=>{


            this.optimize();


        });



    },



    optimize(){


        Helper.qsa(
        ".animate,.floating"
        )
        .forEach(el=>{


            el.style.willChange=
            "transform";


        });



    }



};








/*========================================================
        MOBILE TOUCH OPTIMIZER
========================================================*/


const MobileOptimizer={


    init(){


        if(
        !Helper.isMobile()
        )
        return;



        document.body.classList
        .add("mobile-device");



        Helper.qsa(
        ".tilt,.magnetic"
        )
        .forEach(el=>{


            el.style.transform=
            "none";



        });



    }



};








/*========================================================
        BACK TO TOP BUTTON
========================================================*/


const BackTop={


    button:null,


    init(){


        this.button=
        document.createElement(
        "button"
        );


        this.button.innerHTML=
        "↑";



        this.button.className=
        "back-top";



        Object.assign(

        this.button.style,

        {

        position:"fixed",

        bottom:"30px",

        right:"30px",

        width:"45px",

        height:"45px",

        borderRadius:"50%",

        cursor:"pointer",

        zIndex:"9999"

        }



        );



        document.body
        .appendChild(
        this.button
        );




        this.button.addEventListener(

        "click",

        ()=>{


            window.scrollTo({

                top:0,

                behavior:"smooth"

            });



        });



        window.addEventListener(

        "scroll",

        Helper.throttle(()=>{


            this.toggle();


        },100)



        );



    },




    toggle(){


        this.button.style.opacity=

        window.scrollY>500
        ?
        "1"
        :
        "0";



    }



};








/*========================================================
        FINAL STARTUP
========================================================*/


ANGEL_EXTRA_INIT.push(()=>{


    SecurityEngine.init();


    AnimationManager.init();


    FPSOptimizer.init();


    MobileOptimizer.init();


    BackTop.init();



});








/*========================================================
        FINAL READY EVENT
========================================================*/


window.addEventListener(

"load",

()=>{


    document.body
    .classList
    .add("angel-ready");



    console.log(
    "ANGEL COIN ENGINE READY"
    );



});


