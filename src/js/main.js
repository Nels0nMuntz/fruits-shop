
@@include('./modules/burger.js')
@@include('./modules/anchors.js')
@@include('./modules/forms.js')
@@include('./modules/phoneMask.js')
@@include('./modules/products.js')

@@include('./modules/modal/commentModal.js')

window.addEventListener('DOMContentLoaded', () => {

    // Aos Animation instance
    AOS.init();

    const phoneNumberInputSelector = 'input[name="user-phoeNumber"]'
    const popupMenu = bindBurger();
    bindAnchors(popupMenu);
    phoneMask(phoneNumberInputSelector);
    bindCommentModal()
    const cart = bindCart();
    handleForms(cart);

});


