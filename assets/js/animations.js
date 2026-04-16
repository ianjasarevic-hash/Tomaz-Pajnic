document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger to Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }



    // 2. Cursor Glow Tracking
    const body = document.body;
    
    if (!document.querySelector('.cursor-glow')) {
        const glowDiv = document.createElement('div');
        glowDiv.className = 'cursor-glow';
        body.appendChild(glowDiv);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId = null;

    function moveGlow() {
        body.style.setProperty('--cursor-x', `${mouseX}px`);
        body.style.setProperty('--cursor-y', `${mouseY}px`);
        
        // Hero Mouse Parallax Effect
        const parallaxTexts = document.querySelectorAll('.parallax-text');
        if (parallaxTexts.length > 0) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const moveX = (mouseX - centerX) / 50;
            const moveY = (mouseY - centerY) / 50;

            parallaxTexts.forEach(text => {
                gsap.to(text, {
                    x: moveX,
                    y: moveY,
                    duration: 1,
                    ease: 'power2.out'
                });
            });
        }
        
        rafId = null;
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const target = e.target;
        const isInteractive = target.closest('a, button, [role="button"]');
        if (isInteractive) {
            body.classList.add('cursor-hover');
        } else {
            body.classList.remove('cursor-hover');
        }
        
        if (!rafId) {
            rafId = requestAnimationFrame(moveGlow);
        }
    }, { passive: true });


    // 3. Animate On Scroll (AOS) Initialization
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100,
        });
    }

    // 4. Magnetic Buttons Utility
    const magneticBtns = document.querySelectorAll('[data-magnetic]');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - window.scrollX;
            const y = e.pageY - position.top - window.scrollY;

            const centerX = position.width / 2;
            const centerY = position.height / 2;

            const deltaX = (x - centerX) * 0.3;
            const deltaY = (y - centerY) * 0.3;

            gsap.to(this, {
                x: deltaX,
                y: deltaY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // 5. Text Reveal Animations with Strong Blur
    const splitHeadlines = document.querySelectorAll('.reveal-text');
    splitHeadlines.forEach(headline => {
        gsap.to(headline, {
            scrollTrigger: {
                trigger: headline,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 2,
            ease: "power4.out"
        });
    });

    // 6. Horizontal Scroll for Projects (Desktop only)
    const horizontalSect = document.querySelector('.horizontal-scroll-section');
    const horizontalCont = document.querySelector('.horizontal-container');
    
    if (horizontalSect && horizontalCont) {
        ScrollTrigger.matchMedia({
            "(min-width: 769px)": function() {
                const amountToScroll = horizontalCont.offsetWidth - horizontalSect.offsetWidth + 100;
                
                gsap.to(horizontalCont, {
                    x: -amountToScroll,
                    ease: "none",
                    scrollTrigger: {
                        trigger: horizontalSect,
                        start: "top 20%",
                        end: () => `+=${amountToScroll}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    }
                });
            }
        });
    }

    // 7. Cinematic Split Page Loader Finish
    const loader = document.querySelector('.page-loader');
    const curtainL = document.querySelector('.curtain-l');
    const curtainR = document.querySelector('.curtain-r');
    const loaderLogo = document.querySelector('.loader-logo');

    if (loader) {
        // 1. Inject Spinner dynamically
        const loaderContent = loader.querySelector('.loader-content');
        if (loaderContent && !loaderContent.querySelector('.loader-spinner')) {
            const spinner = document.createElement('div');
            spinner.className = 'loader-spinner';
            spinner.innerHTML = `
                <svg viewBox="0 0 50 50">
                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="2"></circle>
                </svg>
            `;
            loaderContent.appendChild(spinner);
        }

        // 2. Minimum duration 1s
        const startTime = Date.now();
        const minDuration = 1000;

        window.addEventListener('load', () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDuration - elapsedTime);

            setTimeout(() => {
                const tl = gsap.timeline();
                
                tl.to(loaderContent, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power4.inOut"
                })
                .to(curtainL, {
                    xPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut"
                }, "-=0.2")
                .to(curtainR, {
                    xPercent: 100,
                    duration: 1.2,
                    ease: "power4.inOut"
                }, "<")
                .to(loader, {
                    opacity: 0,
                    duration: 0.1,
                })
                .set(loader, { display: 'none' });
            }, remainingTime);
        });
    }
});
