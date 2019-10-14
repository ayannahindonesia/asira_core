import Cookies from 'universal-cookie';

const newCookie = new Cookies();
const listPermissionCookie = newCookie.get('profileUser')
const listPermission = [
  'Bank_Add',
  'Bank_List',
  'Borrower_List',
  'Permission_List',
]

console.log(listPermissionCookie)


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

export function checkPermission(stringPermission, stringPermissionSecond) {
  let flag = false;

  for(const key in listPermission) {
    if(listPermission[key].toString().toLowerCase() === stringPermission.toString().toLowerCase()) {
      flag = true;
      break;
    } else if(stringPermissionSecond && listPermission[key].toString().toLowerCase() === stringPermissionSecond.toString().toLowerCase()) {
      flag = true;
      break;
    } else if(listPermission[key].toString().toLowerCase() === 'all') {
      flag = true;
      break;
    }
  }

  return flag;
}