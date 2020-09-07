document.addEventListener('DOMContentLoaded', function(){
    let qs = document.querySelector.bind(document);
    let bckOverlay = qs("#background-overlay");
    let ltr = qs("#letter");

    let width;
    const timeout = 8000;

    fade(bckOverlay, 1, 1);
    addLetters();

    function addLetters(){
        width = bckOverlay.getBoundingClientRect().width;
        setInterval(function(){
            for (let i = 0; i < 10; i++) {
                letterTimer(node());
            }
        }, 100);
    }

    function letterTimer(elm){
        const yTranslation = randomBetween(400, 1000);
        setTimeout(function(){
            elm.style.opacity = "0";
            elm.style.transform = `translateY(${yTranslation}px)`;
        }, 10);
        setTimeout(function(){
            elm.parentNode.removeChild(elm);
        }, timeout);
    }
    function node(){
        const fontSize = randomBetween(10, 25);
        // let elm = ltr.cloneNode(true);
        let elm = document.createElement("p");
        elm.textContent = randomTxt();
        elm.classList.add("letter");
        elm.style.top = randomBetween(-500, -30) + "px";
        elm.style.left = randomBetween(0, width) + "px";
        elm.style.fontSize = `${fontSize}px`;
        elm.style.transition = `all ${timeout}ms linear`;
        bckOverlay.appendChild(elm);
        return elm;
    }
    function randomTxt(){
        const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return str[randomBetween(0, str.length - 1)];
    }
    function randomBetween(min, max){
        let rnd = Math.random();
        return Math.floor(rnd * (max - min) + min);
    }
    function fade(element, scale, opacity){
        element.style.transform = `scale(${scale})`;
        element.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    }
})