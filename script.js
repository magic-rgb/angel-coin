"use strict";

/*====================================================

                ANGEL COIN

        AAA+ JavaScript Engine v1.0

        PART 1
        Core Engine
        DOM Engine
        Utility Engine
        Event Engine

====================================================*/


/*====================================================

                DOM SELECTORS

====================================================*/

const $ = selector => document.querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);

const body = document.body;

const html = document.documentElement;


/*====================================================

                GLOBAL OBJECT

====================================================*/

const APP = {

    version:"1.0.0",

    mobile:false,

    tablet:false,

    desktop:true,

    width:window.innerWidth,

    height:window.innerHeight,

    scrollY:0,

    ticking:false,

    reducedMotion:false,

    initialized:false

};


/*====================================================

                CACHE

====================================================*/

const CACHE={};

CACHE.navbar=$(".navbar");

CACHE.hero=$(".hero");

CACHE.sections=$$("section");

CACHE.cards=$$(".card,.feature-card,.about-card,.community-card,.roadmap-card,.token-card");

CACHE.buttons=$$(".btn-primary,.btn-secondary,.about-button");

CACHE.images=$$("img");

CACHE.links=$$("a");

CACHE.inputs=$$("input,textarea");

CACHE.scrollTop=$(".scroll-top");

CACHE.mobileMenu=$(".mobile-menu");

CACHE.menuButton=$(".menu-button");


/*====================================================

                CONFIG

====================================================*/

const CONFIG={

navbarOffset:80,

revealOffset:.18,

counterSpeed:2000,

buttonDuration:350,

cardDuration:400,

scrollDuration:700,

observerThreshold:.15,

mobileWidth:768,

tabletWidth:1100

};


/*====================================================

                DEVICE

====================================================*/

function detectDevice(){

APP.width=window.innerWidth;

APP.height=window.innerHeight;

APP.mobile=APP.width<CONFIG.mobileWidth;

APP.tablet=APP.width>=CONFIG.mobileWidth&&APP.width<CONFIG.tabletWidth;

APP.desktop=APP.width>=CONFIG.tabletWidth;

}

detectDevice();


/*====================================================

                REDUCED MOTION

====================================================*/

APP.reducedMotion=window.matchMedia("(prefers-reduced-motion:reduce)").matches;


/*====================================================

                EVENTS

====================================================*/

const Events={

on(el,event,callback){

if(!el)return;

el.addEventListener(event,callback);

},

off(el,event,callback){

if(!el)return;

el.removeEventListener(event,callback);

},

once(el,event,callback){

if(!el)return;

el.addEventListener(event,callback,{once:true});

},

emit(name,data={}){

document.dispatchEvent(

new CustomEvent(name,{detail:data})

);

}

};


/*====================================================

                UTILITIES

====================================================*/

const Utils={

clamp(value,min,max){

return Math.min(Math.max(value,min),max);

},

random(min,max){

return Math.random()*(max-min)+min;

},

map(value,inMin,inMax,outMin,outMax){

return (value-inMin)*(outMax-outMin)/(inMax-inMin)+outMin;

},

lerp(start,end,t){

return start+(end-start)*t;

},

distance(x1,y1,x2,y2){

return Math.hypot(x2-x1,y2-y1);

},

debounce(fn,delay){

let timer;

return(...args)=>{

clearTimeout(timer);

timer=setTimeout(()=>fn(...args),delay);

};

},

throttle(fn,delay){

let last=0;

return(...args)=>{

const now=Date.now();

if(now-last>=delay){

last=now;

fn(...args);

}

};

},

isVisible(element){

const rect=element.getBoundingClientRect();

return(

rect.top<window.innerHeight&&

rect.bottom>0

);

}

};


/*====================================================

                BODY STATE

====================================================*/

const Body={

lock(){

body.style.overflow="hidden";

},

unlock(){

body.style.overflow="";

},

add(className){

body.classList.add(className);

},

remove(className){

body.classList.remove(className);

},

toggle(className){

body.classList.toggle(className);

}

};


/*====================================================

                SCROLL ENGINE

====================================================*/

function updateScroll(){

APP.scrollY=window.scrollY;

}

window.addEventListener("scroll",()=>{

if(!APP.ticking){

window.requestAnimationFrame(()=>{

updateScroll();

APP.ticking=false;

});

APP.ticking=true;

}

});


/*====================================================

                RESIZE ENGINE

====================================================*/

window.addEventListener(

"resize",

Utils.debounce(()=>{

detectDevice();

Events.emit("resize");

},150)

);


/*====================================================

                DATASET ENGINE

====================================================*/

const Data={

set(el,key,value){

el.dataset[key]=value;

},

get(el,key){

return el.dataset[key];

},

remove(el,key){

delete el.dataset[key];

}

};


/*====================================================

                CSS ENGINE

====================================================*/

const CSS={

add(el,name){

el.classList.add(name);

},

remove(el,name){

el.classList.remove(name);

},

toggle(el,name){

el.classList.toggle(name);

},

has(el,name){

return el.classList.contains(name);

}

};


/*====================================================

                ANIMATION

====================================================*/

const Animate={

fadeIn(el){

el.style.opacity=1;

},

fadeOut(el){

el.style.opacity=0;

},

show(el){

el.style.display="block";

},

hide(el){

el.style.display="none";

}

};


/*====================================================

                PERFORMANCE

====================================================*/

function preloadImages(){

CACHE.images.forEach(img=>{

img.loading="eager";

img.decoding="async";

});

}

preloadImages();


/*====================================================

                INITIALIZE

====================================================*/

function initializeCore(){

detectDevice();

updateScroll();

APP.initialized=true;

console.log(

"%cANGEL COIN ENGINE",

"color:#D4AF37;font-size:16px;font-weight:bold;"

);

console.log(

"Core Engine Loaded"

);

}

document.addEventListener(

"DOMContentLoaded",

initializeCore

);


/*====================================================

            PART 2
            Premium Navigation Engine
            Hero Engine
            Scroll Engine

====================================================*/


/*====================================================

            NAVBAR ENGINE

====================================================*/

const Navbar={

    element:CACHE.navbar,

    lastScroll:0,

    hidden:false,

    init(){

        if(!this.element) return;

        window.addEventListener(

            "scroll",

            this.onScroll.bind(this),

            {passive:true}

        );

    },

    onScroll(){

        const current=window.scrollY;

        if(current>CONFIG.navbarOffset){

            this.element.classList.add("scrolled");

        }else{

            this.element.classList.remove("scrolled");

        }

        if(current>this.lastScroll && current>250){

            this.hide();

        }else{

            this.show();

        }

        this.lastScroll=current;

    },

    hide(){

        if(this.hidden) return;

        this.hidden=true;

        this.element.style.transform="translateY(-110%)";

    },

    show(){

        if(!this.hidden) return;

        this.hidden=false;

        this.element.style.transform="translateY(0)";

    }

};


/*====================================================

            HERO ENGINE

====================================================*/

const Hero={

    section:CACHE.hero,

    badge:$(".hero-badge"),

    title:$(".hero-title"),

    description:$(".hero-description"),

    buttons:$$(".hero .btn-primary,.hero .btn-secondary"),

    start(){

        if(!this.section) return;

        requestAnimationFrame(()=>{

            CSS.add(this.section,"hero-loaded");

        });

    }

};


/*====================================================

            ACTIVE MENU

====================================================*/

const Navigation={

    links:$$(".nav-link"),

    sections:[...CACHE.sections],

    active:null,

    init(){

        window.addEventListener(

            "scroll",

            Utils.throttle(

                ()=>this.update(),

                50

            ),

            {passive:true}

        );

        this.update();

    },

    update(){

        let current=null;

        this.sections.forEach(section=>{

            const top=section.offsetTop-140;

            const bottom=top+section.offsetHeight;

            if(window.scrollY>=top && window.scrollY<bottom){

                current=section.id;

            }

        });

        if(current===this.active) return;

        this.active=current;

        this.links.forEach(link=>{

            CSS.remove(link,"active");

            const href=link.getAttribute("href");

            if(href==="#"+current){

                CSS.add(link,"active");

            }

        });

    }

};


/*====================================================

            SMOOTH SCROLL

====================================================*/

const SmoothScroll={

    init(){

        CACHE.links.forEach(link=>{

            const href=link.getAttribute("href");

            if(!href) return;

            if(!href.startsWith("#")) return;

            Events.on(

                link,

                "click",

                e=>{

                    e.preventDefault();

                    const target=$(href);

                    if(!target) return;

                    const y=

                    target.offsetTop-

                    CACHE.navbar.offsetHeight;

                    window.scrollTo({

                        top:y,

                        behavior:"smooth"

                    });

                    Mobile.close();

                }

            );

        });

    }

};


/*====================================================

            SCROLL PROGRESS

====================================================*/

const Progress={

    bar:$(".scroll-progress"),

    init(){

        if(!this.bar) return;

        window.addEventListener(

            "scroll",

            Utils.throttle(

                ()=>this.update(),

                10

            ),

            {passive:true}

        );

        this.update();

    },

    update(){

        const total=

        document.documentElement.scrollHeight-

        window.innerHeight;

        const percent=

        (window.scrollY/total)*100;

        this.bar.style.width=

        percent+"%";

    }

};


/*====================================================

            BACK TO TOP

====================================================*/

const BackTop={

    button:CACHE.scrollTop,

    init(){

        if(!this.button) return;

        window.addEventListener(

            "scroll",

            ()=>{

                if(window.scrollY>600){

                    CSS.add(this.button,"show");

                }else{

                    CSS.remove(this.button,"show");

                }

            },

            {passive:true}

        );

        Events.on(

            this.button,

            "click",

            ()=>{

                window.scrollTo({

                    top:0,

                    behavior:"smooth"

                });

            }

        );

    }

};


/*====================================================

            MOBILE ENGINE

====================================================*/

const Mobile={

    menu:CACHE.mobileMenu,

    button:CACHE.menuButton,

    opened:false,

    init(){

        if(!this.menu) return;

        if(!this.button) return;

        Events.on(

            this.button,

            "click",

            ()=>{

                this.toggle();

            }

        );

        this.menu

        .querySelectorAll("a")

        .forEach(link=>{

            Events.on(

                link,

                "click",

                ()=>{

                    this.close();

                }

            );

        });

    },

    open(){

        this.opened=true;

        CSS.add(this.menu,"active");

        Body.lock();

    },

    close(){

        this.opened=false;

        CSS.remove(this.menu,"active");

        Body.unlock();

    },

    toggle(){

        this.opened?

        this.close():

        this.open();

    }

};


/*====================================================

            ESC CLOSE

====================================================*/

document.addEventListener(

    "keydown",

    e=>{

        if(e.key==="Escape"){

            Mobile.close();

        }

    }

);


/*====================================================

            INIT

====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Navbar.init();

        Hero.start();

        Navigation.init();

        SmoothScroll.init();

        Progress.init();

        BackTop.init();

        Mobile.init();

    }

);



/*====================================================

            PART 3
        Reveal Engine
        Observer Engine
        Card Engine
        Mouse Light Engine
        Ripple Engine

====================================================*/


/*====================================================

            REVEAL ENGINE

====================================================*/

const Reveal={

    elements:document.querySelectorAll(

        ".reveal,.card,.feature-card,.about-card,.community-card,.roadmap-card,.token-card"

    ),

    observer:null,

    init(){

        if(APP.reducedMotion){

            this.elements.forEach(el=>{

                el.classList.add("revealed");

            });

            return;

        }

        this.observer=new IntersectionObserver(

            this.callback.bind(this),

            {

                threshold:CONFIG.observerThreshold,

                rootMargin:"0px 0px -80px 0px"

            }

        );

        this.elements.forEach(el=>{

            this.prepare(el);

            this.observer.observe(el);

        });

    },

    prepare(el){

        el.style.opacity="0";

        el.style.transform="translateY(60px)";

        el.style.transition=`

            opacity .8s cubic-bezier(.22,1,.36,1),

            transform .8s cubic-bezier(.22,1,.36,1)

        `;

    },

    callback(entries){

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.style.opacity="1";

                entry.target.style.transform="translateY(0)";

                entry.target.classList.add("revealed");

                this.observer.unobserve(entry.target);

            }

        });

    }

};


/*====================================================

                STAGGER ENGINE

====================================================*/

const Stagger={

    groups:document.querySelectorAll(".stagger"),

    init(){

        this.groups.forEach(group=>{

            [...group.children].forEach(

                (child,index)=>{

                    child.style.transitionDelay=

                    `${index*80}ms`;

                    child.classList.add("reveal");

                }

            );

        });

    }

};


/*====================================================

            CARD ENGINE

====================================================*/

const Cards={

    cards:CACHE.cards,

    init(){

        this.cards.forEach(card=>{

            card.addEventListener(

                "mouseenter",

                ()=>{

                    card.classList.add("hover");

                }

            );

            card.addEventListener(

                "mouseleave",

                ()=>{

                    card.classList.remove("hover");

                }

            );

        });

    }

};


/*====================================================

            MOUSE LIGHT

====================================================*/

const MouseLight={

    init(){

        CACHE.cards.forEach(card=>{

            card.addEventListener(

                "mousemove",

                e=>{

                    const rect=

                    card.getBoundingClientRect();

                    const x=e.clientX-rect.left;

                    const y=e.clientY-rect.top;

                    card.style.setProperty(

                        "--x",

                        x+"px"

                    );

                    card.style.setProperty(

                        "--y",

                        y+"px"

                    );

                }

            );

        });

    }

};


/*====================================================

                RIPPLE EFFECT

====================================================*/

const Ripple={

    buttons:CACHE.buttons,

    init(){

        this.buttons.forEach(button=>{

            button.style.position="relative";

            button.style.overflow="hidden";

            button.addEventListener(

                "click",

                e=>{

                    this.create(

                        button,

                        e

                    );

                }

            );

        });

    },

    create(button,event){

        const ripple=

        document.createElement("span");

        const rect=

        button.getBoundingClientRect();

        const size=

        Math.max(

            rect.width,

            rect.height

        );

        ripple.style.width=size+"px";

        ripple.style.height=size+"px";

        ripple.style.position="absolute";

        ripple.style.borderRadius="50%";

        ripple.style.left=

        event.clientX-

        rect.left-

        size/2+

        "px";

        ripple.style.top=

        event.clientY-

        rect.top-

        size/2+

        "px";

        ripple.style.pointerEvents="none";

        ripple.style.background=

        "rgba(255,255,255,.18)";

        ripple.style.transform="scale(0)";

        ripple.style.transition=

        "transform .6s ease,opacity .6s ease";

        button.appendChild(ripple);

        requestAnimationFrame(()=>{

            ripple.style.transform="scale(4)";

            ripple.style.opacity="0";

        });

        setTimeout(()=>{

            ripple.remove();

        },650);

    }

};


/*====================================================

            BUTTON ENGINE

====================================================*/

const Buttons={

    init(){

        CACHE.buttons.forEach(button=>{

            button.addEventListener(

                "mouseenter",

                ()=>{

                    button.classList.add(

                        "button-hover"

                    );

                }

            );

            button.addEventListener(

                "mouseleave",

                ()=>{

                    button.classList.remove(

                        "button-hover"

                    );

                }

            );

        });

    }

};


/*====================================================

            MAGNETIC EFFECT

====================================================*/

const Magnetic={

    buttons:CACHE.buttons,

    init(){

        if(APP.mobile) return;

        this.buttons.forEach(button=>{

            button.addEventListener(

                "mousemove",

                e=>{

                    const rect=

                    button.getBoundingClientRect();

                    const x=

                    e.clientX-

                    rect.left-

                    rect.width/2;

                    const y=

                    e.clientY-

                    rect.top-

                    rect.height/2;

                    button.style.transform=

                    `translate(${x*.12}px,${y*.12}px)`;

                }

            );

            button.addEventListener(

                "mouseleave",

                ()=>{

                    button.style.transform="";

                }

            );

        });

    }

};


/*====================================================

            IMAGE OPTIMIZER

====================================================*/

const Images={

    init(){

        CACHE.images.forEach(img=>{

            img.loading="lazy";

            img.decoding="async";

            img.draggable=false;

        });

    }

};


/*====================================================

            INITIALIZE

====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Reveal.init();

        Stagger.init();

        Cards.init();

        MouseLight.init();

        Ripple.init();

        Buttons.init();

        Magnetic.init();

        Images.init();

    }

);



/*====================================================

            PART 4
    Counter Engine
    Toast Engine
    Clipboard Engine
    Loader Engine
    FAQ Engine
    Accordion Engine

====================================================*/


/*====================================================

                COUNTER ENGINE

====================================================*/

const Counter={

    items:document.querySelectorAll("[data-counter]"),

    observer:null,

    init(){

        if(!this.items.length) return;

        this.observer=new IntersectionObserver(

            entries=>{

                entries.forEach(entry=>{

                    if(entry.isIntersecting){

                        this.start(entry.target);

                        this.observer.unobserve(entry.target);

                    }

                });

            },

            {

                threshold:.5

            }

        );

        this.items.forEach(item=>{

            this.observer.observe(item);

        });

    },

    start(element){

        const target=

        Number(

            element.dataset.counter

        );

        const duration=2200;

        let start=0;

        let startTime=null;

        const animate=time=>{

            if(!startTime)

            startTime=time;

            const progress=

            Math.min(

                (time-startTime)/duration,

                1

            );

            const value=

            Math.floor(

                progress*target

            );

            element.textContent=

            value.toLocaleString();

            if(progress<1){

                requestAnimationFrame(animate);

            }

        };

        requestAnimationFrame(animate);

    }

};


/*====================================================

                TOAST ENGINE

====================================================*/

const Toast={

    container:null,

    init(){

        this.container=

        document.createElement("div");

        this.container.className=

        "toast-container";

        body.appendChild(this.container);

    },

    show(message,type="success"){

        const toast=

        document.createElement("div");

        toast.className=

        "toast "+type;

        toast.innerHTML=`

        <span>${message}</span>

        `;

        this.container.appendChild(toast);

        requestAnimationFrame(()=>{

            toast.classList.add("show");

        });

        setTimeout(()=>{

            toast.classList.remove("show");

            setTimeout(()=>{

                toast.remove();

            },500);

        },3500);

    }

};


/*====================================================

            COPY TO CLIPBOARD

====================================================*/

const Clipboard={

    buttons:

    document.querySelectorAll(

    "[data-copy]"

    ),

    init(){

        this.buttons.forEach(button=>{

            button.addEventListener(

                "click",

                ()=>{

                    const value=

                    button.dataset.copy;

                    navigator.clipboard.writeText(value);

                    Toast.show(

                    "Copied Successfully"

                    );

                }

            );

        });

    }

};


/*====================================================

                LOADER

====================================================*/

const Loader={

    element:

    document.querySelector(".preloader"),

    init(){

        if(!this.element) return;

        window.addEventListener(

            "load",

            ()=>{

                this.hide();

            }

        );

    },

    hide(){

        this.element.classList.add(

        "hide"

        );

        setTimeout(()=>{

            this.element.remove();

        },900);

    }

};


/*====================================================

                FAQ ENGINE

====================================================*/

const FAQ={

    items:

    document.querySelectorAll(

    ".faq-item"

    ),

    init(){

        this.items.forEach(item=>{

            const header=

            item.querySelector(

            ".faq-header"

            );

            header.addEventListener(

                "click",

                ()=>{

                    this.toggle(item);

                }

            );

        });

    },

    toggle(current){

        this.items.forEach(item=>{

            if(item!==current){

                item.classList.remove(

                "active"

                );

            }

        });

        current.classList.toggle(

        "active"

        );

    }

};


/*====================================================

                ACCORDION

====================================================*/

const Accordion={

    groups:

    document.querySelectorAll(

    ".accordion"

    ),

    init(){

        this.groups.forEach(group=>{

            const items=

            group.querySelectorAll(

            ".accordion-item"

            );

            items.forEach(item=>{

                item.querySelector(

                ".accordion-header"

                )

                ?.addEventListener(

                "click",

                ()=>{

                    item.classList.toggle(

                    "active"

                    );

                });

            });

        });

    }

};


/*====================================================

            TOOLTIP ENGINE

====================================================*/

const Tooltip={

    items:

    document.querySelectorAll(

    "[data-tooltip]"

    ),

    init(){

        this.items.forEach(item=>{

            item.addEventListener(

                "mouseenter",

                ()=>{

                    const tip=

                    document.createElement("div");

                    tip.className="tooltip";

                    tip.innerText=

                    item.dataset.tooltip;

                    body.appendChild(tip);

                    const rect=

                    item.getBoundingClientRect();

                    tip.style.left=

                    rect.left+

                    rect.width/2-

                    tip.offsetWidth/2+

                    "px";

                    tip.style.top=

                    rect.top-45+"px";

                    item._tooltip=tip;

                }

            );

            item.addEventListener(

                "mouseleave",

                ()=>{

                    item._tooltip?.remove();

                }

            );

        });

    }

};


/*====================================================

            NOTIFICATION API

====================================================*/

const Notify={

    permission(){

        if(

        "Notification"

        in window){

            Notification.requestPermission();

        }

    },

    send(title,text){

        if(

        Notification.permission===

        "granted"

        ){

            new Notification(title,{

                body:text

            });

        }

    }

};


/*====================================================

                INITIALIZE

====================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

Counter.init();

Toast.init();

Clipboard.init();

Loader.init();

FAQ.init();

Accordion.init();

Tooltip.init();

Notify.permission();

});




/*====================================================

                PART 5
        Tabs Engine
        Modal Engine
        Scroll Spy
        Lazy Loader
        Form Validation
        Performance Engine

====================================================*/


/*====================================================

                TAB ENGINE

====================================================*/

const Tabs={

    wrappers:document.querySelectorAll(".tabs"),

    init(){

        this.wrappers.forEach(wrapper=>{

            const buttons=

            wrapper.querySelectorAll("[data-tab]");

            const panels=

            wrapper.querySelectorAll("[data-panel]");

            buttons.forEach(button=>{

                button.addEventListener("click",()=>{

                    const target=

                    button.dataset.tab;

                    buttons.forEach(btn=>{

                        btn.classList.remove("active");

                    });

                    panels.forEach(panel=>{

                        panel.classList.remove("active");

                    });

                    button.classList.add("active");

                    wrapper

                    .querySelector(

                    `[data-panel="${target}"]`

                    )

                    ?.classList.add("active");

                });

            });

        });

    }

};



/*====================================================

                MODAL ENGINE

====================================================*/

const Modal={

    current:null,

    init(){

        document

        .querySelectorAll("[data-modal-open]")

        .forEach(button=>{

            button.addEventListener("click",()=>{

                this.open(

                button.dataset.modalOpen

                );

            });

        });

        document

        .querySelectorAll("[data-modal-close]")

        .forEach(button=>{

            button.addEventListener("click",()=>{

                this.close();

            });

        });

    },

    open(id){

        this.current=

        document.getElementById(id);

        if(!this.current) return;

        this.current.classList.add("show");

        document.body.style.overflow="hidden";

    },

    close(){

        if(!this.current) return;

        this.current.classList.remove("show");

        document.body.style.overflow="";

        this.current=null;

    }

};



/*====================================================

                CLICK OUTSIDE

====================================================*/

window.addEventListener("click",e=>{

    if(

    e.target.classList.contains("modal")

    ){

        Modal.close();

    }

});



/*====================================================

                SCROLL SPY

====================================================*/

const ScrollSpy={

    sections:[

        ...document.querySelectorAll("section")

    ],

    nav:[

        ...document.querySelectorAll(".nav-link")

    ],

    init(){

        window.addEventListener(

            "scroll",

            ()=>this.update(),

            {passive:true}

        );

    },

    update(){

        let current="";

        this.sections.forEach(section=>{

            if(

            scrollY>=

            section.offsetTop-180

            ){

                current=section.id;

            }

        });

        this.nav.forEach(link=>{

            link.classList.remove("active");

            if(

            link.getAttribute("href")==="#"+current

            ){

                link.classList.add("active");

            }

        });

    }

};



/*====================================================

                LAZY LOADER

====================================================*/

const Lazy={

    images:[

    ...document.querySelectorAll(

    "img[data-src]"

    )

    ],

    observer:null,

    init(){

        this.observer=

        new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    const img=

                    entry.target;

                    img.src=

                    img.dataset.src;

                    img.removeAttribute(

                    "data-src"

                    );

                    this.observer.unobserve(img);

                }

            });

        });

        this.images.forEach(image=>{

            this.observer.observe(image);

        });

    }

};



/*====================================================

            FORM VALIDATION

====================================================*/

const Form={

    forms:

    document.querySelectorAll("form"),

    init(){

        this.forms.forEach(form=>{

            form.addEventListener(

                "submit",

                e=>{

                    if(

                    !this.validate(form)

                    ){

                        e.preventDefault();

                    }

                }

            );

        });

    },

    validate(form){

        let valid=true;

        form

        .querySelectorAll("[required]")

        .forEach(input=>{

            input.classList.remove("error");

            if(

            !input.value.trim()

            ){

                input.classList.add("error");

                valid=false;

            }

        });

        return valid;

    }

};



/*====================================================

            FPS MONITOR

====================================================*/

const Performance={

    fps:0,

    frame:0,

    last:performance.now(),

    init(){

        requestAnimationFrame(

        this.loop.bind(this)

        );

    },

    loop(now){

        this.frame++;

        if(now>=this.last+1000){

            this.fps=this.frame;

            this.frame=0;

            this.last=now;

        }

        requestAnimationFrame(

        this.loop.bind(this)

        );

    }

};



/*====================================================

            PAGE VISIBILITY

====================================================*/

document.addEventListener(

"visibilitychange",

()=>{

    if(document.hidden){

        document.body.classList.add(

        "page-hidden"

        );

    }else{

        document.body.classList.remove(

        "page-hidden"

        );

    }

});



/*====================================================

            KEYBOARD SHORTCUTS

====================================================*/

document.addEventListener(

"keydown",

e=>{

    if(e.key==="Home"){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    if(e.key==="End"){

        window.scrollTo({

            top:

            document.body.scrollHeight,

            behavior:"smooth"

        });

    }

});



/*====================================================

            PRELOAD FONTS

====================================================*/

document.fonts?.ready.then(()=>{

    document.body.classList.add(

    "fonts-loaded"

    );

});



/*====================================================

            INITIALIZE

====================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    Tabs.init();

    Modal.init();

    ScrollSpy.init();

    Lazy.init();

    Form.init();

    Performance.init();

});



/*====================================================

            PART 6
        Event Bus
        State Engine
        Theme Engine
        Mouse Engine
        Resize Engine
        Idle Engine

====================================================*/


/*====================================================

                EVENT BUS

====================================================*/

const EventBus={

events:{},

on(event,callback){

(this.events[event]??=[]).push(callback);

},

emit(event,data){

(this.events[event]||[])

.forEach(callback=>callback(data));

},

off(event,callback){

this.events[event]=

(this.events[event]||[])

.filter(item=>item!==callback);

}

};



/*====================================================

                GLOBAL STATE

====================================================*/

const Store={

state:{

theme:"dark",

menu:false,

loading:false,

scroll:0,

device:"desktop"

},

set(key,value){

this.state[key]=value;

EventBus.emit(

"state:"+key,

value

);

},

get(key){

return this.state[key];

}

};



/*====================================================

                DEVICE ENGINE

====================================================*/

const Device={

detect(){

const width=window.innerWidth;

if(width<768){

Store.set(

"device",

"mobile"

);

}else if(width<1200){

Store.set(

"device",

"tablet"

);

}else{

Store.set(

"device",

"desktop"

);

}

}

};

Device.detect();



/*====================================================

                THEME ENGINE

====================================================*/

const Theme={

button:document.querySelector(

".theme-toggle"

),

init(){

if(!this.button) return;

this.button.addEventListener(

"click",

()=>{

this.toggle();

}

);

},

toggle(){

const theme=

Store.get("theme")==="dark"

?

"light"

:

"dark";

Store.set(

"theme",

theme

);

document.documentElement

.setAttribute(

"data-theme",

theme

);

localStorage.setItem(

"theme",

theme

);

},

restore(){

const saved=

localStorage.getItem(

"theme"

);

if(saved){

Store.set(

"theme",

saved

);

document.documentElement

.setAttribute(

"data-theme",

saved

);

}

}

};



/*====================================================

                MOUSE ENGINE

====================================================*/

const Mouse={

x:0,

y:0,

init(){

window.addEventListener(

"mousemove",

e=>{

this.x=e.clientX;

this.y=e.clientY;

EventBus.emit(

"mouse",

{

x:this.x,

y:this.y

}

);

},

{passive:true}

);

}

};



/*====================================================

                CARD LIGHT

====================================================*/

const CardLight={

cards:[

...document.querySelectorAll(

".card,.feature-card,.about-card"

)

],

init(){

this.cards.forEach(card=>{

card.addEventListener(

"mousemove",

e=>{

const rect=

card.getBoundingClientRect();

card.style.setProperty(

"--x",

`${e.clientX-rect.left}px`

);

card.style.setProperty(

"--y",

`${e.clientY-rect.top}px`

);

}

);

});

}

};



/*====================================================

                RESIZE ENGINE

====================================================*/

const Resize={

init(){

window.addEventListener(

"resize",

Utils.debounce(()=>{

Device.detect();

EventBus.emit(

"resize"

);

},120)

);

}

};



/*====================================================

                SCROLL ENGINE

====================================================*/

const ScrollEngine={

last:0,

direction:"down",

init(){

window.addEventListener(

"scroll",

()=>{

const current=

window.scrollY;

Store.set(

"scroll",

current

);

this.direction=

current>

this.last

?

"down"

:

"up";

this.last=current;

EventBus.emit(

"scroll",

{

position:current,

direction:this.direction

}

);

},

{passive:true}

);

}

};



/*====================================================

                IDLE ENGINE

====================================================*/

const Idle={

timer:null,

delay:60000,

init(){

["mousemove",

"keydown",

"scroll",

"touchstart"]

.forEach(event=>{

window.addEventListener(

event,

()=>{

clearTimeout(

this.timer

);

this.start();

},

{passive:true}

);

});

this.start();

},

start(){

this.timer=

setTimeout(()=>{

EventBus.emit(

"idle"

);

},this.delay);

}

};



/*====================================================

                NETWORK

====================================================*/

const Network={

init(){

window.addEventListener(

"online",

()=>{

Toast.show(

"Connection Restored"

);

});

window.addEventListener(

"offline",

()=>{

Toast.show(

"Offline Mode",

"error"

);

});

}

};



/*====================================================

                STORAGE

====================================================*/

const Storage={

set(key,value){

localStorage.setItem(

key,

JSON.stringify(value)

);

},

get(key){

const value=

localStorage.getItem(

key

);

try{

return JSON.parse(value);

}catch{

return value;

}

},

remove(key){

localStorage.removeItem(

key

);

}

};



/*====================================================

                PAGE TIMER

====================================================*/

const Timer={

start:performance.now(),

finish(){

const total=

performance.now()-this.start;

console.log(

"Loaded:",

total.toFixed(0),

"ms"

);

}

};

window.addEventListener(

"load",

()=>{

Timer.finish();

});



/*====================================================

                AUTO INIT

====================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

Theme.restore();

Theme.init();

Mouse.init();

CardLight.init();

Resize.init();

ScrollEngine.init();

Idle.init();

Network.init();

});



/*====================================================

            PART 7
        Accessibility Engine
        Keyboard Engine
        Focus Engine
        Command Palette
        Error Engine
        Production Engine

====================================================*/


/*====================================================

            ACCESSIBILITY ENGINE

====================================================*/

const Accessibility={

init(){

this.images();

this.buttons();

this.inputs();

this.landmarks();

},

images(){

document.querySelectorAll("img").forEach(img=>{

if(!img.hasAttribute("alt")){

img.setAttribute("alt","Angel Coin");

}

});

},

buttons(){

document.querySelectorAll("button").forEach(button=>{

if(!button.hasAttribute("type")){

button.type="button";

}

});

},

inputs(){

document.querySelectorAll("input").forEach(input=>{

if(!input.hasAttribute("autocomplete")){

input.setAttribute(

"autocomplete",

"off"

);

}

});

},

landmarks(){

document

.querySelectorAll("section")

.forEach(section=>{

if(!section.id){

section.id=

"section-"+

Math.random()

.toString(36)

.slice(2,8);

}

});

}

};



/*====================================================

            KEYBOARD ENGINE

====================================================*/

const Keyboard={

pressed:{},

init(){

window.addEventListener(

"keydown",

e=>{

this.pressed[e.key]=true;

EventBus.emit(

"keyDown",

e.key

);

});

window.addEventListener(

"keyup",

e=>{

delete this.pressed[e.key];

});

},

isPressed(key){

return !!this.pressed[key];

}

};



/*====================================================

            FOCUS ENGINE

====================================================*/

const Focus={

init(){

document

.querySelectorAll(

"a,button,input,textarea"

)

.forEach(element=>{

element.addEventListener(

"focus",

()=>{

element.classList.add(

"focus-visible"

);

});

element.addEventListener(

"blur",

()=>{

element.classList.remove(

"focus-visible"

);

});

});

}

};



/*====================================================

            COMMAND PALETTE

====================================================*/

const Command={

panel:null,

opened:false,

init(){

this.panel=

document.querySelector(

".command-palette"

);

window.addEventListener(

"keydown",

e=>{

if(

(e.ctrlKey||e.metaKey)

&&

e.key==="k"

){

e.preventDefault();

this.toggle();

}

});

},

toggle(){

if(!this.panel) return;

this.opened=!this.opened;

this.panel.classList.toggle(

"active"

);

}

};



/*====================================================

            ERROR ENGINE

====================================================*/

const Errors={

init(){

window.addEventListener(

"error",

e=>{

console.error(

"[Angel Coin]",

e.message

);

});

window.addEventListener(

"unhandledrejection",

e=>{

console.error(

"[Promise]",

e.reason

);

});

}

};



/*====================================================

            COMPONENT ENGINE

====================================================*/

const Components={

init(){

document

.querySelectorAll(

"[data-component]"

)

.forEach(component=>{

component.classList.add(

"component-ready"

);

});

}

};



/*====================================================

            VISIBILITY ENGINE

====================================================*/

const Visibility={

init(){

document.addEventListener(

"visibilitychange",

()=>{

if(document.hidden){

Store.set(

"hidden",

true

);

}else{

Store.set(

"hidden",

false

);

}

});

}

};



/*====================================================

            PERFORMANCE ENGINE

====================================================*/

const PerformanceEngine={

init(){

this.prefetch();

this.passive();

},

prefetch(){

document

.querySelectorAll(

"a[data-prefetch]"

)

.forEach(link=>{

link.addEventListener(

"mouseenter",

()=>{

fetch(

link.href

).catch(()=>{});

},

{once:true}

);

});

},

passive(){

const events=[

"touchstart",

"touchmove",

"wheel"

];

events.forEach(event=>{

window.addEventListener(

event,

()=>{},

{

passive:true

}

);

});

}

};



/*====================================================

            MEMORY ENGINE

====================================================*/

const Memory={

clean(){

document

.querySelectorAll(

".ripple"

)

.forEach(ripple=>{

ripple.remove();

});

}

};

setInterval(

()=>{

Memory.clean();

},

10000

);



/*====================================================

            PAGE STATE

====================================================*/

const Page={

ready:false,

loaded:false,

init(){

document.addEventListener(

"readystatechange",

()=>{

if(

document.readyState==="interactive"

){

this.ready=true;

}

if(

document.readyState==="complete"

){

this.loaded=true;

}

});

}

};



/*====================================================

            PRODUCTION ENGINE

====================================================*/

const Production={

init(){

console.clear();

console.info(

"%cANGEL COIN",

"color:#D4AF37;font-size:18px;font-weight:bold"

);

console.info(

"Production Mode"

);

}

};



/*====================================================

            AUTO START

====================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

Accessibility.init();

Keyboard.init();

Focus.init();

Command.init();

Errors.init();

Components.init();

Visibility.init();

PerformanceEngine.init();

Page.init();

Production.init();

});


/*====================================================

            PART 8
        Animation Timeline Engine
        Scheduler Engine
        Queue Engine
        Page Transition Engine
        Custom Cursor Engine

====================================================*/


/*====================================================

                RAF ENGINE

====================================================*/

const RAF={

callbacks:[],

running:false,

add(callback){

this.callbacks.push(callback);

if(!this.running){

this.running=true;

this.loop();

}

},

remove(callback){

this.callbacks=

this.callbacks.filter(

item=>item!==callback

);

},

loop(){

requestAnimationFrame(()=>{

this.callbacks.forEach(

callback=>callback()

);

this.loop();

});

}

};



/*====================================================

                TASK QUEUE

====================================================*/

const Queue={

tasks:[],

busy:false,

add(task){

this.tasks.push(task);

this.next();

},

next(){

if(this.busy) return;

if(!this.tasks.length) return;

this.busy=true;

const task=this.tasks.shift();

Promise.resolve(task())

.finally(()=>{

this.busy=false;

this.next();

});

}

};



/*====================================================

                TIMELINE

====================================================*/

const Timeline={

animations:[],

add({

element,

className,

delay=0

}){

this.animations.push({

element,

className,

delay

});

},

play(){

this.animations.forEach(

animation=>{

setTimeout(()=>{

animation.element

.classList.add(

animation.className

);

},animation.delay);

});

}

};



/*====================================================

                PAGE TRANSITION

====================================================*/

const Transition={

overlay:

document.querySelector(

".page-transition"

),

init(){

document

.querySelectorAll(

"a[href]"

)

.forEach(link=>{

if(

link.hostname!==

location.hostname

)return;

link.addEventListener(

"click",

e=>{

const href=

link.href;

if(

href.includes("#")

)return;

e.preventDefault();

this.open(href);

});

});

},

open(url){

if(!this.overlay){

location.href=url;

return;

}

this.overlay.classList.add(

"show"

);

setTimeout(()=>{

location.href=url;

},500);

}

};



/*====================================================

                CUSTOM CURSOR

====================================================*/

const Cursor={

cursor:null,

x:0,

y:0,

cx:0,

cy:0,

init(){

if(APP.mobile) return;

this.cursor=

document.querySelector(

".cursor-ring"

);

if(!this.cursor) return;

window.addEventListener(

"mousemove",

e=>{

this.x=e.clientX;

this.y=e.clientY;

});

RAF.add(

this.render.bind(this)

);

document

.querySelectorAll(

"a,button"

)

.forEach(item=>{

item.addEventListener(

"mouseenter",

()=>{

this.cursor

.classList.add(

"active"

);

});

item.addEventListener(

"mouseleave",

()=>{

this.cursor

.classList.remove(

"active"

);

});

});

},

render(){

this.cx+=

(this.x-this.cx)*0.18;

this.cy+=

(this.y-this.cy)*0.18;

this.cursor.style.transform=

`translate(${this.cx}px,${this.cy}px)`;

}

};



/*====================================================

                AUTO REVEAL

====================================================*/

const AutoReveal={

init(){

document

.querySelectorAll(

"[data-reveal]"

)

.forEach(

(element,index)=>{

Timeline.add({

element,

className:"revealed",

delay:index*80

});

});

window.addEventListener(

"load",

()=>{

Timeline.play();

});

}

};



/*====================================================

                COMPONENT LOADER

====================================================*/

const LoaderEngine={

modules:[

Navbar,

Hero,

Navigation,

Reveal,

Ripple,

Buttons,

Magnetic,

Counter,

Toast,

Clipboard,

Modal,

Tabs,

Form,

PerformanceEngine

],

init(){

this.modules.forEach(

module=>{

if(

typeof module.init===

"function"

){

module.init();

}

});

}

};



/*====================================================

                DEBUG

====================================================*/

const Debug={

enabled:false,

log(...args){

if(!this.enabled) return;

console.log(...args);

}

};



/*====================================================

                VERSION

====================================================*/

const Version={

name:"Angel Coin",

version:"1.0.0",

build:"AAA+",

author:"OpenAI"

};



/*====================================================

                STARTUP

====================================================*/

window.addEventListener(

"DOMContentLoaded",

()=>{

LoaderEngine.init();

Cursor.init();

Transition.init();

AutoReveal.init();

Debug.log(

Version

);

});











