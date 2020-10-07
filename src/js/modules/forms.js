
const handleForms = (cart) => {
    const forms = document.forms;
    const message = {
        initial: '',
        loading: 'Loading...',
        success: 'Thanks for your message',
        postError: 'Error',
        emailError: 'Email is incorrect',
        phoneNumberError: 'Phone number is incorrect',
    };
    const typeError = {
        emptyField: 'emptyField',
        wrongEmail: 'wrongEmail',
        wrongPhoneNumber: 'wrongPhoneNumber',
    };    

    for (let form of forms) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const submitButton = getSubmitButton(form);
            const messageArea = getFormStatusBlock(form);
            let result = validateForm(form);
            if (!result.length) {                                               // если проверка вернула пустой массив - все поля правильно заполнены
                submitButton.setAttribute('type', 'button');
                messageArea.textContent = message.loading;
                postForm(form.action, form)
                    .then(response => {
                        console.log(response);
                        messageArea.textContent = message.success;
                    })
                    .catch(error => {
                        console.log(error);
                        messageArea.textContent = message.error;
                    })
                    .finally(() => {
                        submitButton.setAttribute('type', 'submit');
                        cleanFields(form);
                        setTimeout(() => {
                            messageArea.textContent = message.initial;
                        }, 3000);
                    })
            } else {
                result.forEach(item => {
                    switch (item.typeError) {
                        case typeError.emptyField:
                            item.element.classList.add('with_error');
                            item.element.setAttribute('data-origin-placeholder', item.element.placeholder);
                            item.element.placeholder = 'Field is required';
                            break;
                        case typeError.wrongEmail:
                            item.element.classList.add('with_error');
                            messageArea.textContent = message.emailError;
                            break;
                        case typeError.wrongPhoneNumber:
                            item.element.classList.add('with_error');
                            messageArea.textContent = message.phoneNumberError;
                            break;
                        default:
                            break;
                    }
                });
            }
        })
    }

    for (let form of forms) {
        form.addEventListener('input', event => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                if (event.target.classList.contains('with_error')) {
                    event.target.classList.remove('with_error')
                }
            }
        })
    };

    const validateForm = form => { 
        const emailPattern = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/;        
        const elementErrorCreator = (element, typeError) => ({element, typeError});
        let elementsWithError = [];

        for (let element of form.elements) {
    
            if(element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'){                                   // если поле input или textarea
                if(element.value){                                                                         // если поле заполненное
                    if(element.type === 'email'){                                                                  // если тип поля email - дополнительная проверка
                        let email = element.value;
                        let result = emailPattern.test(email);
                        if(!result){                                                                             // если не соответствует паттерну - добавить в объект с неправильно
                            elementsWithError.push(elementErrorCreator(element, typeError.wrongEmail));               // заполненными полями
                        }
                    } 
                    if(element.type === 'tel' && element.value.length < 19){
                        elementsWithError.push(elementErrorCreator(element, typeError.wrongPhoneNumber));
                    }                  
                }else{                                                                                      // если поле пустое - добавить в объект с неправильно заполненными полями
                    elementsWithError.push(elementErrorCreator(element, typeError.emptyField));
                }
            } 
        };
        return elementsWithError;
    };
    const postForm = async (url, form) => {
        const formData = new FormData(form);
        const cart = getCart();
        if(cart){
            formData.append('cart', cart)
        }
        for(let item of formData.entries()){
            console.log(item);
        }
        let response = await fetch(url, {
            method: 'POST',
            body: formData,
        })
        return await response.text();
    };

    const getSubmitButton = form => {
        for(let element of form.elements){
            if(element.type === 'submit') return element;
        }
    };   
    const cleanFields = form => {
        for(let field of form.elements){
            if(field.type === 'radio'){
                field.checked = false;
            }else{
                field.value = '';
                if(field.dataset.originPlaceholder){
                    field.placeholder = field.dataset.originPlaceholder;
                    field.removeAttribute('data-origin-placeholder')
                } 
            }               
        }
        if(cart){
            cart.clearCart()
        }
    }; 
    const getFormStatusBlock = form => {
        for(let child of form.children){
            if(child.classList.contains('form-message')) return child;
        }
    };
    const createFormStatusBlock = (form) => {
        let formStatusBlock = document.createElement('p');
        formStatusBlock.classList.add('form-message');
        formStatusBlock.style.cssText = `
            margin-top: 0.6rem;
            width: 100%;
            height: 1rem;
            color: tomato;
            text-align: center;
        `;
        form.append(formStatusBlock);
    };
    for(let form of forms){
        createFormStatusBlock(form);
    };
    const getCart = () => {
        if(!localStorage.getItem('cart')) return null;
        let arr = JSON.parse(localStorage.getItem('cart')) ;
        let data = arr.map(item => {
            let { id, amount } = item;
            return { id, amount };
        })
        return JSON.stringify(data)
    }
};

