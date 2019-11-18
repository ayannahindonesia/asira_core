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

export function deleteSeparator(number, separator) {
  while(number.includes(separator)){
    number = number.replace(separator,"")
  }
  return number
}

export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function formatNumber(number,money) {
  number = (number && number.toString().trim()) || ''
  number = deleteSeparator(number,",")
  let pjg = number.length
  if(!isNumeric(number)){
    pjg = pjg-1
    number = number.substr(0,pjg)
  }
  let tmp = ""
  if(pjg>3){
    while(pjg>3){
      pjg -= 3
      tmp = number.substr(pjg,3) + "." + tmp
    }
    if(pjg<=3){
      tmp = number.substr(0,pjg) + "." + tmp
    }
    tmp = tmp.substr(0, tmp.length-1)
  }else{
    tmp = number
  }

  if(money && tmp.length !== 0) {
    tmp += ',00';
  } 

  return tmp.toString().length !== 0 ? tmp : '-'
}