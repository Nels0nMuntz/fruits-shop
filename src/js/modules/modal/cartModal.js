
const bindCartModal = () => {

    const closeBtnSelector = '.popup-close-cart';
    const openBtnSelector = '.cart-icon__bg';
    const triggerBtn = document.querySelector('.cart-icon__bg')
    const modal = document.querySelector('.popup-modal-cart')
    const wrap = document.querySelector('.popup-wrapper-cart')
    const main = document.querySelector('main')
    const cartIcon = document.querySelector('.cart-icon')

    const cartModal = {
        isOpened: false,
        open() {
            modal.classList.add('open')
            wrap.classList.add('open')
            document.body.classList.add('popup-open')
            main.classList.add('blur')
            cartIcon.classList.add('hidden')
            this.isOpened = true
        },
        close() {
            modal.classList.remove('open')
            wrap.classList.remove('open')
            document.body.classList.remove('popup-open')
            main.classList.remove('blur')
            cartIcon.classList.remove('hidden')
            this.isOpened = false
        }
    }

    triggerBtn.addEventListener('click', event => {
        if (event.target.closest(openBtnSelector)) {
            modalChangeState()
        }
    });

    wrap.addEventListener('click', event => {
        if (event.target === wrap || event.target.closest(closeBtnSelector)) {
            modalChangeState()
        }
    });

    function modalChangeState() {
        if (cartModal.isOpened) {
            cartModal.close();
        } else {
            cartModal.open();
        }
    };

    return cartModal;
}