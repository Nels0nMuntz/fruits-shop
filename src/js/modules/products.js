const bindCart = () => {

    const client = contentful.createClient({
        space: "d474eh7bsgf7",
        accessToken: "5xcJYbY2s1A5MXJf8Ol0yodQkuDwV8Es4ypbx6l1fXI",
        requestId: "90623662-c34f-4017-8bed-475141ec83b4"
    });

    const contentType = ['sets', 'fruits', 'drinks', 'oil'];

    // variables
    const setsContainer = document.querySelector('.sets__center');
    const fruitsContainer = document.querySelector('.goods__center-fruits');
    const drinksContainer = document.querySelector('.goods__center-drinks');
    const oilContainer = document.querySelector('.goods__center-oil');
    const cartContainer = document.querySelector('.popup-modal__products');
    const cartIcon = document.querySelector('.cart-icon');
    const cartTotalAmount = document.querySelector('.cart-icon__total');
    const cartTotalPriceElements = [
        document.querySelector('.popup-modal__total span'),
        document.querySelector('.popup-modal__total-large span'),
    ];
    const cartMinOrder = [
        document.querySelector('.popup-modal__total p:first-child'),
        document.querySelector('.popup-modal__total-large p:first-child'),
    ]

    // cart
    let cart = [];

    // buttons
    let buttonsDOM = [];

    class Products {
        async getProducts(contentType) {
            try {
                let entries = await client.getEntries({ content_type: contentType });
                let products = entries.items;
                products = products.map(item => {
                    const id = item.sys.id;
                    const { title, descr, price, setComposition, unit, composition, expiration } = item.fields;
                    const image = item.fields.image.fields.file.url;

                    switch (contentType) {
                        case 'sets':
                            return { id, title, descr, price, image, setComposition };
                        case 'fruits':
                            return { id, title, descr, price, image, unit };
                        case 'drinks':
                            return { id, title, descr, price, image, unit };
                        case 'oil':
                            return { id, title, descr, price, image, unit, composition, expiration };
                        default:
                            break;
                    }
                });
                return products;
            }
            catch (error) {
                console.log(error.message);
            }
        }
    }

    class UI {
        displayProducts(type, products) {
            let result = '';
            switch (type) {
                case 'sets':
                    products.forEach(({ id, title, descr, price, image }) => {
                        result += `
                            <article class="sets__item item-sets" data-id="${id}" data-aos="zoom-in" data-aos-delay="100">
                                <div class="item-sets__photo">
                                  <img src=${image} alt="pack">
                                </div>
                                <h3 class="item-title">${title}</h3>
                                <div class="item-descr item-descr-center">${descr}</div>
                                <div class="item-price">${this.formatPrice(price)}&nbsp;руб.</div>
                                <div class="item-button">
                                  <button class="main-btn cart-btn" data-id="${id}" data-type="${type}">Выбрать набор</button>
                                  <button class="info-btn" data-id="${id}">Состав набора</button>
                                </div>
                            </article>
                        `;
                    });
                    setsContainer.innerHTML = result;
                break;

                case 'fruits':
                    products.forEach(({ id, title, descr, price, image, unit }) => {
                        result += `

                            <article class="goods__item" data-id="${id}" data-aos="zoom-in" data-aos-delay="25">
                                <div class="item-sets__photo">
                                  <img src=${image} alt="fruits">
                                </div>
                                <h3 class="item-title">${title}</h3>
                                <div class="item-descr">
                                  <p>Страна: ${descr.country}</p>
                                  <p>Средний вес плода: ${descr.weight}</p>
                                </div>
                                <div class="item-price">${price ? this.formatPrice(price) : ""} ${unit}</div>
                                <div class="item-button">
                                  <button class="main-btn small-btn cart-btn" data-id="${id}" data-type="${type}" ${price === undefined ? 'disabled' : ''}>Выбрать фрукт</button>
                                </div>
                            </article>
                        `;
                    });
                    fruitsContainer.innerHTML = result;
                break;

                case 'drinks':
                    products.forEach(({ id, title, descr, price, image, unit }) => {
                        result += `
                            <article class="goods__item" data-id="${id}" data-aos="zoom-in" data-aos-delay="25">
                                <div class="item-sets__photo">
                                  <img src=${image} alt="drinks">
                                </div>
                                <h3 class="item-title">${title}</h3>
                                <div class="item-descr">
                                  <p>Страна: ${descr.country}</p>
                                  <p>Объем: ${descr.volume}</p>
                                </div>
                                <div class="item-price">${price ? this.formatPrice(price) : ""} ${unit}</div>
                                <div class="item-button">
                                  <button class="main-btn small-btn cart-btn" data-id="${id}" data-type="${type}" ${price === undefined ? 'disabled' : ''}>Выбрать напиток</button>
                                </div>
                            </article>
                        `;
                    });
                    drinksContainer.innerHTML = result;
                break;

                case 'oil':
                    products.forEach(({ id, title, descr, price, image, unit, composition, expiration }) => {
                        result += `
                        <article class="goods__item" data-id="${id}" data-aos="zoom-in" data-aos-delay="25">
                            <div class="item-sets__photo item-sets__photo-oil">
                                <img src=${image} alt="oil">
                            </div>
                            <h3 class="item-title">${title}</h3>
                            <div class="item-descr">
                                <p>Страна: ${descr.country}</p>
                                <p>Объем: ${descr.volume}</p>
                            </div>
                            <div class="item-descr">
                                <p><span>Состав</span>: ${composition}</p>
                            </div>
                            <div class="item-descr">
                                <p><span>Годен</span>: ${expiration}</p>
                            </div>
                            <div class="item-price">${price ? this.formatPrice(price) : ""} ${unit}</div>
                            <div class="item-button">
                                <button class="main-btn small-btn cart-btn" data-id="${id}" data-type="${type}" ${!price ? "disabled" : ""} >Выбрать масло</button>
                            </div>
                        </article>
                        `;
                    });
                    oilContainer.innerHTML = result;
                break;

                default:
                break;
            }
            result = null;
        }
        bindButtons() {
            const buttons = [...document.getElementsByClassName('cart-btn')];
            buttonsDOM = buttons;
            buttons.forEach(button => {
                const id = button.dataset.id;
                const type = button.dataset.type;
                const inCart = cart.find(item => item.id === id)
                if (inCart) {
                    button.textContent = "В корзине";
                    button.disabled = true;
                }
                button.addEventListener('click', event => {
                    button.textContent = "В корзине";
                    button.disabled = true;

                    // show cart icon if it's non shown yet
                    if (!cartIcon.classList.contains('open')) cartIcon.classList.add('open');

                    // get product from products
                    const product = Storage.getProdact(type, id);

                    // set property "amount"
                    product.amount = 1;

                    // add product to the cart (bag)
                    cart = [...cart, product];

                    // save cart in local storege
                    Storage.setCart(cart)

                    // set cart values
                    this.setCartValues(cart)

                    // add product to the cart
                    this.addCartItem(product)
                })
            })
        }
        initializeCart() {
            cart = Storage.getCart();
            if (cart && cart.length > 0) cartIcon.classList.add('open')
            this.setCartValues(cart);
            this.populateCart(cart);
        }
        setCartValues(cart, cartItem, HTMLElement) {
            /* method calculates 
                1. total amount and price of all products in the cart 
                2. total price of some product (if params "cartItem" and "HTMLElement" specified)
                3. and renders these values
            */

            if(!cart || cart.length === 0) return
            let totalPrice = 0;
            let totalAmount = 0;            
            
            cart.forEach(item => {
                totalPrice += item.amount * item.price;
                totalAmount += item.amount;
            });

            if (totalPrice > 1500) {
                cartMinOrder.forEach(element => {
                    element.classList.add('hide');
                });
            }else{
                cartMinOrder.forEach(element => {
                    element.classList.remove('hide');
                });
            }

            totalPrice = this.formatPrice(totalPrice)
            cartTotalAmount.textContent = totalAmount;
            cartTotalPriceElements.forEach(node => {
                node.textContent = totalPrice;
            });

            if(cartItem && HTMLElement){
                cartItem.totalPrice = cartItem.amount * cartItem.price;
                Storage.setCart(cart);
                const HTMLCollection = HTMLElement.children;
                for(let child of HTMLCollection){                    
                    if(child.classList.contains('products__price')){
                        child.textContent = `${this.formatPrice(cartItem.totalPrice)} p.`;
                    }
                    else if(child.classList.contains('products__plusminus')){
                        for(let elem of child.children){
                            if(elem.classList.contains('products__count')){
                                elem.textContent = cartItem.amount;
                            }
                        }                        
                    }
                }
            }            
        }
        addCartItem({ id, title, price, image, amount }) {
            let cartItem = document.createElement('li');
            cartItem.classList.add('products__item');
            cartItem.innerHTML = `
            <div class="products__img"><img src=${image} alt="set"></div>
            <div class="products__info">
              <div class="products__title">${title}</div>
              <div class="products__nav">
                <div class="products__plusminus">
                  <span class="count-minus" data-id="${id}">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                      id="Layer_1" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"
                      enable-background="new 0 0 64 64" xml:space="preserve">
                      <g>
                        <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="14" y1="31" x2="50"
                          y2="31" />
                      </g>
                      <g>
                        <circle fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" cx="32" cy="32"
                          r="30.999" />
                      </g>
                    </svg>
                  </span>
                  <span class="products__count">${amount}</span>
                  <span class="count-plus" data-id="${id}">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                      id="Layer_1" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"
                      enable-background="new 0 0 64 64" xml:space="preserve">
                      <g>
                        <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="32" y1="50" x2="32"
                          y2="14" />
                        <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="14" y1="32" x2="50"
                          y2="32" />
                      </g>
                      <g>
                        <circle fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" cx="32" cy="32"
                          r="30.999" />
                      </g>
                    </svg>
                  </span>
                </div>              
                <div class="products__price">${this.formatPrice(price)} p.</div>
                <div class="products__close" data-id="${id}">
                  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px"
                    viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                    <g>
                      <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="18.947" y1="17.153"
                        x2="45.045" y2="43.056" />
                    </g>
                    <g>
                      <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="19.045" y1="43.153"
                        x2="44.947" y2="17.056" />
                    </g>
                    <g>
                      <circle fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" cx="32" cy="32"
                        r="30.999" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            `;
            cartContainer.append(cartItem);
        }
        populateCart(cart) {
            cart.forEach(item => {
                this.addCartItem(item);
            });
        }
        cartlogic() {
            cartContainer.addEventListener('click', event => {
                if (event.target.closest('.count-plus')) {
                    let target = event.target.closest('.count-plus');
                    let id = target.dataset.id;
                    let cartItem = cart.find(item => item.id === id);
                    cartItem.amount = cartItem.amount + 1;
                    // Storage.setCart(cart);
                    // target.previousElementSibling.textContent = cartItem.amount;
                    // this.setCartValues(cart);
                    this.setCartValues(cart, cartItem, target.closest('.products__nav'));
                }
                else if (event.target.closest('.count-minus')) {
                    let target = event.target.closest('.count-minus');
                    let id = target.dataset.id;
                    let cartItem = cart.find(item => item.id === id);
                    cartItem.amount = cartItem.amount - 1;
                    if (cartItem.amount > 0) {
                        // Storage.setCart(cart);
                        // this.setCartValues(cart);
                        // target.nextElementSibling.textContent = cartItem.amount;
                        this.setCartValues(cart, cartItem, target.closest('.products__nav'));
                    } else {
                        this.removeCartItem(id);
                        cartContainer.removeChild(target.closest('.products__item'));
                    }
                }
                else if (event.target.closest('.products__close')) {
                    let target = event.target.closest('.products__close');
                    let id = target.dataset.id;
                    this.removeCartItem(id);
                    cartContainer.removeChild(target.closest('.products__item'));
                }
            })
        }
        removeCartItem(id) {
            cart = cart.filter(item => item.id !== id) || [];
            Storage.setCart(cart);
            this.setCartValues(cart);
            let button = buttonsDOM.find(item => item.dataset.id === id);
            button.disabled = false;
            button.textContent = 'Выбрать набор';
            if (cart.length === 0) {
                cartModal.close();
                cartIcon.classList.remove('open');
            }
        }
        formatPrice(price) {
            let formatedPrice = price.toString().split('').reverse();
            for (let i = 3; i <= formatedPrice.length; i += 3) {
                formatedPrice.splice(i, 0, ' ');
                i++;
            };
            let result = formatedPrice.reverse().join('');
            return result;
        } clearCart() {
            const cartItems = cart.map(item => item.id);
            cartItems.forEach(id => this.removeCartItem(id));
            cartContainer.innerHTML = "";
        }
    }

    class Storage {
        static getCart() {
            return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
        }
        static setCart(cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        static getProdact(type, id) {
            let products = JSON.parse(localStorage.getItem(type));
            return products.find(product => product.id === id);
        }
        static setProducts(type, products) {
            localStorage.setItem(type, JSON.stringify(products))
        }
    }


    const ui = new UI();
    ui.initializeCart();

    const products = new Products();

    let requests = contentType.map(type => {
        return products.getProducts(type).then(response => {
            ui.displayProducts(type, response);
            Storage.setProducts(type, response);
        })
    });

    Promise.all(requests)
    .then(() => {
        ui.bindButtons();
        ui.cartlogic();
    })
    .then(() => {
        bindDetailsModal();
    })



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
                cartIcon.classList.remove('open')
                this.isOpened = true
            },
            close() {
                modal.classList.remove('open')
                wrap.classList.remove('open')
                document.body.classList.remove('popup-open')
                main.classList.remove('blur')
                cartIcon.classList.add('open')
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
    const cartModal = bindCartModal();
    const bindDetailsModal = () => {
        const closeBtnSelector = '.popup-close-details'
        const triggerBtns = document.getElementsByClassName('info-btn');
        const popupBg = document.querySelector('.popup-wrapper-details .popup-modal__bg');
        const popupTitle = document.querySelector('.popup-wrapper-details .popup-modal__title');
        const popupDescr = document.querySelector('.popup-modal__text-descr');
        const popupDetails = document.querySelector('.popup-modal__text-compos');

        const modal = document.querySelector('.popup-modal-details')
        const wrap = document.querySelector('.popup-wrapper-details')
        const main = document.querySelector('main')
        const cartIcon = document.querySelector('.cart-icon')

        const detailsModal = {
            isOpened: false,
            open() {
                modal.classList.add('open')
                wrap.classList.add('open')
                document.body.classList.add('popup-open')
                main.classList.add('blur')
                cartIcon.classList.remove('open')
                this.isOpened = true
            },
            close() {
                modal.classList.remove('open')
                wrap.classList.remove('open')
                document.body.classList.remove('popup-open')
                main.classList.remove('blur')
                cartIcon.classList.add('open')
                this.isOpened = false
            }
        }

        for (let button of triggerBtns) {
            const id = button.dataset.id;
            const products = JSON.parse(localStorage.getItem('sets'));
            const product = products.find(item => item.id === id);
            if (!product) return;
            const { title, descr, image, setComposition } = product;
            button.addEventListener('click', () => {
                const img = `<img class="popup-modal__img" src=${image} alt="sets">`;
                popupBg.innerHTML = img;
                popupTitle.textContent = title;
                popupDescr.textContent = descr;
                popupDetails.textContent = setComposition;
                detailsModal.open();
            });

            wrap.addEventListener('click', event => {
                if (event.target === wrap || event.target.closest(closeBtnSelector)) {
                    // if (event.target === wrap) {
                    detailsModal.close()
                }
            });
        }

        return detailsModal;
    };

    return ui;
}

