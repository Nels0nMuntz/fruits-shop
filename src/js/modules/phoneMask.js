function phoneMask(selector){
    const phoneInputs = document.querySelectorAll(selector);
    let currentInputValue = '';

    phoneInputs.forEach(inputElement => {

        inputElement.setAttribute('maxlength', '19');

        inputElement.addEventListener('focus', event => {
            event.preventDefault();
            if(inputElement.value === ""){
                inputElement.value = '+';
            }
        })

        inputElement.addEventListener('blur', event => {
            event.preventDefault();
            if(inputElement.value === "+"){
                inputElement.value = '';
            }
        })

        inputElement.addEventListener('mouseup', event => {
            event.preventDefault();
            inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length)
        })

        inputElement.addEventListener('input', event => {  
            if(!/\d/.test(event.data) && event.data !== null){
                inputElement.value = currentInputValue;
            }         
            if(inputElement.value.length == 3 && event.data !== null){
                inputElement.value += ' (';
                inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length)
            }
            if(inputElement.value.length == 8 && event.data !== null){
                inputElement.value += ') ';
                inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length)
            }
            if(inputElement.value.length == 13 && event.data !== null ||
                inputElement.value.length == 16 && event.data !== null){
                inputElement.value += '-';
                inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length)
            }
            if(inputElement.value === ""){             
                inputElement.value = '+';
            }
            currentInputValue = inputElement.value;
        })
    })
}