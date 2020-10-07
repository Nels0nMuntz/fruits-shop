const bindAnchors = (popupMenu) => {
    const navMenu = document.getElementsByTagName('nav');
    const burgerIcon = document.querySelector('.burger-icon');

    [...navMenu].forEach(elem => {
        elem.addEventListener('click', event => {
            event.preventDefault();
            if(event.target.closest('.nav__link') && event.target.classList.contains('anchor')){
                if(popupMenu.isOpened){
                    popupMenu.close();
                }

                let id = event.target.getAttribute('href')
                id = id.slice(1);
                let htmlElement = document.getElementById(id);
                let y = getCoordY(htmlElement) - 104;
                window.scrollTo(0, y);                
            }            
        })
    });

    function getCoordY(element){
        let coords = element.getBoundingClientRect();
        return coords.top + pageYOffset;
    }
}