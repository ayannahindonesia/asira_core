import { getProfileUser } from '../index/token';

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
  
  const listPermission = getProfileUser() ? JSON.parse(getProfileUser()) : [];


  for(const key in listPermission) {
    if(stringPermission && listPermission[key] && listPermission[key].toString().toLowerCase() === stringPermission.toString().toLowerCase()) {
      flag = true;
      break;
    } else if(stringPermissionSecond && listPermission[key] && listPermission[key].toString().toLowerCase() === stringPermissionSecond.toString().toLowerCase()) {
      flag = true;
      break;
    } else if(listPermission[key] && listPermission[key].toString().toLowerCase() === 'all') {
      flag = true;
      break;
    }
  }
  
  return flag;
}