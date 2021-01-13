import { RedditTopOfTheDayComponent } from './RedditTopOfTheDayComponent.js';

RedditTopOfTheDayComponent.register();

const sections = document.querySelectorAll('.section-content');

const throttle = (fn, wait) => {
    let inThrottle, lastFn, lastTime;
    return function () {
        const context = this,
            args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(function () {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
};

const ckeckItemInView = (element) => {
    const pos = element.getBoundingClientRect();
    if (window.scrollY > pos.bottom && element.classList.contains('off')) {
        element.classList.remove('off');
    }
};

document.addEventListener(
    'scroll',
    throttle((e) => {
        sections.forEach((element) => ckeckItemInView(element));
    }, 1000)
);

anime({
    targets: '#splash-container',
    opacity: {
        value: '0',
        duration: 3000,
    },
    delay: 1000,
});
