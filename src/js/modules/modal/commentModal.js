const bindCommentModal = () => {
    const closeBtnSelector = '.popup-close-comment';
    const triggerBtn = document.querySelector('.leave-comment__btn');
    const modal = document.querySelector('.popup-modal-comment')
    const wrap = document.querySelector('.popup-wrapper-comment')
    const main = document.querySelector('main')
    const cartIcon = document.querySelector('.cart-icon')

    const commentModal = {
        isOpened: false,
        open() {
            modal.classList.add('open')
            wrap.classList.add('open')
            document.body.classList.add('popup-open')
            main.classList.add('blur')
            cartIcon.classList.remove('open')
            this.isOpened = true
        },
        close(){
            modal.classList.remove('open')
            wrap.classList.remove('open')
            document.body.classList.remove('popup-open')
            main.classList.remove('blur') 
            if(JSON.parse(localStorage.getItem('cart')).length > 0) cartIcon.classList.add('open')            
            this.isOpened = false
        }
    };

    triggerBtn.addEventListener('click', event => {
        event.preventDefault();
        modalChangeState();
    });

    wrap.addEventListener('click', event => {
        if (event.target === wrap || event.target.closest(closeBtnSelector)) {
            modalChangeState();
        }
    });

    function modalChangeState(){
        if(commentModal.isOpened){
            commentModal.close();
        }else{
            commentModal.open();
        }
    };

    return commentModal;
}