import { RedditTopOfTheDayComponent } from './RedditTopOfTheDayComponent.js';

RedditTopOfTheDayComponent.register();

const sections = document.querySelectorAll('.section-content');
const covers = document.querySelectorAll('.section-cover');
let coversLoaded = 0;

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

const onImageLoaded = (e) => {
    coversLoaded++;
    if (coversLoaded === covers.length) {
        document.querySelector('#splash-container .strp-grid').classList.add('off');
        setTimeout(() => {
            document.querySelector('#splash-container').classList.add('off');
        }, 5000);
    }
};

document.addEventListener(
    'scroll',
    throttle((e) => {
        sections.forEach((element) => ckeckItemInView(element));

        document.querySelector('#splash-container').classList.add('off');
    }, 100)
);
sections.forEach((element) => ckeckItemInView(element));

covers.forEach((cover) => {
    const css = window.getComputedStyle(cover, ':after');
    const re = /url\("(.+)"\)/;
    const imageMatch = css.backgroundImage.match(re);

    if (imageMatch && imageMatch[1]) {
        const img = new Image();
        img.src = imageMatch[1];
        img.onload = (e) => {
            onImageLoaded(e);
        };
        img.onerror = (e) => {
            onImageLoaded(e);
        };
    } else {
        onImageLoaded();
        coversLoaded++;
    }
});
