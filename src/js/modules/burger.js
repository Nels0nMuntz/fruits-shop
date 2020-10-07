const bindBurger = () => {
    const header = document.getElementById('header');
    const burgerIcon = document.querySelector('.burger-icon');
    const popupMenuElement = document.querySelector('.popup-menu');
    const cartIcon = document.querySelector('.cart-icon')
    const scrollWidth = getScroll();

    const popupMenu = {
        isOpened: false,
        open(){
            burgerIcon.classList.add('active');
            popupMenuElement.classList.add('active');
            cartIcon.classList.remove('hidden')
            document.body.style.overflow = 'hidden';
            document.body.style.marginRight = `${scrollWidth}px`;
            header.style.boxShadow  = 'none';
            header.style.zIndex = 60;
            popupMenu.isOpened = true;
        },
        close(){
            burgerIcon.classList.remove('active');
            popupMenuElement.classList.remove('active');
            cartIcon.classList.add('hidden')
            document.body.style.overflow = '';
            document.body.style.marginRight = `0px`;
            header.style.boxShadow  = '0 0 10px 5px rgba(0, 0, 0, 0.3)';
            header.style.zIndex = 20;
            popupMenu.isOpened = false;
        }
    }

    burgerIcon.addEventListener('click', () => {
        if(popupMenu.isOpened){
            popupMenu.close();
        }else{
            popupMenu.open();
        }
    })

    function getScroll(){
        let div = document.createElement('div');
        div.style.cssText = `
            width: 50px;
            height: 50px;
            overflow: scroll;
            visibility: hidden;
        `;
        document.body.append(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        return scrollWidth;
    }

    return popupMenu;
}