export function validateEmail(email) {
    let flag = false;

    if(email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      flag = true;
    }

    return flag;
}

export function  validatePhone(phone) {
    let flag = false;
    let phoneRegex = /^(^\+62\s?|^0)(\d{3,4}){2}\d{3,4}$/;

    if(phone.match(phoneRegex)) {
      flag = true
    }
    
    return flag;
}