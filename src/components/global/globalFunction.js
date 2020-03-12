import { getProfileUser } from '../index/token';
var crypto = require("crypto");

export function validateEmail(email) {
    let flag = false;

    if(email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      flag = true;
    }

    return flag;
}

export function  validatePhone(phone) {
    let flag = false;
    let phoneRegex = /^(^62\s?)(\d{3,4}){2}\d{3,4}$/;

    if(phone.match(phoneRegex)) {
      flag = true
    }
    
    return flag;
}

export function checkPermission(stringPermission) {
  let flag = false;
  
  const listPermission = getProfileUser() ? JSON.parse(getProfileUser()) : [];


  for(const key in listPermission) {
    
    if(typeof(stringPermission) !== 'object') {
      if(stringPermission && listPermission[key] && listPermission[key].toString().toLowerCase() === stringPermission.toString().toLowerCase()) {
        flag = true;
        break;
      } else if(listPermission[key] && listPermission[key].toString().toLowerCase() === 'all') {
        flag = true;
        break;
      }
    } else {
      for(const keyPermission in stringPermission) {
        if(stringPermission[keyPermission] && listPermission[key] && listPermission[key].toString().toLowerCase() === stringPermission[keyPermission].toString().toLowerCase()) {
          flag = true;
          break;
        } else if(listPermission[key] && listPermission[key].toString().toLowerCase() === 'all') {
          flag = true;
          break;
        }
      }
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
      tmp = number.substr(pjg,3) + "," + tmp
    }
    if(pjg<=3){
      tmp = number.substr(0,pjg) + "," + tmp
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

export function handleFormatDate (dateBefore, time){
  let dateAfter = new Date(dateBefore);

  return `${dateAfter.getDate()} ${getMonthNow(dateAfter.getMonth().toString())} ${dateAfter.getFullYear()} ${time ? `${dateAfter.getHours()}:${dateAfter.getMinutes()}:${dateAfter.getSeconds()}`: ''}`;
};

export function getMonthNow(bulanNow) {
  let bulan = '';

  if(bulanNow) {
    if(bulanNow.toString() === '0') {
      bulan = 'Januari';
    } else if(bulanNow.toString() === '1') {
      bulan = 'Februari';
    } else if(bulanNow.toString() === '2') {
      bulan = 'Maret';
    } else if(bulanNow.toString() === '3') {
      bulan = 'April';
    } else if(bulanNow.toString() === '4') {
      bulan = 'Mei';
    } else if(bulanNow.toString() === '5') {
      bulan = 'Juni';
    } else if(bulanNow.toString() === '6') {
      bulan = 'Juli';
    } else if(bulanNow.toString() === '7') {
      bulan = 'Agustus';
    } else if(bulanNow.toString() === '8') {
      bulan = 'September';
    } else if(bulanNow.toString() === '9') {
      bulan = 'Oktober';
    } else if(bulanNow.toString() === '10') {
      bulan = 'November';
    } else if(bulanNow.toString() === '11') {
      bulan = 'Desember';
    }
  }



  return bulan
}

export function decryptImage(text){
  let keyStr = "BpLnfgDsc3WD9F3qap394rjd239smsdk"
  const algorithm = 'aes-256-cfb';

  const contents = Buffer.from(text, 'base64');
  const iv = contents.slice(0, 16);
  const textBytes = contents.slice(16);
  const decipher = crypto.createDecipheriv(algorithm, keyStr, iv);
  let res = decipher.update(textBytes, '', 'utf8');

  res += decipher.final('utf8');
  
  return res
}

export function destructErrorMessage(objError) {
  let errorMessage = 'Error : ';
  let integerError = 0;

  if(objError && objError.details) {
    const errDetail = objError.details

    for(const key in errDetail) {

      if(errDetail[key] && errDetail[key].toString() && errDetail[key].toString().trim().length !== 0) {
        if(integerError !== 0) {
          errorMessage += ', ';
        } 

        errorMessage += `${key} ${errDetail[key]}`;

        integerError += 1
      }

    }

    if(integerError < 1) {
      errorMessage += ` ${objError.message}`
    }

  } else if (objError && !objError.details && objError.message) {
    errorMessage += ` ${objError.message}`
  }

  return errorMessage
}

export async function changeFileToBase64(file) { 
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function(e) { 
        resolve(e.target.result)
    };
    reader.onerror = error => resolve({error});
  });
}

export function findAmount (dataFees, stringFee, amountPinjamanPokok, charPersen){
  let feeNew = '';
  
  if(dataFees && stringFee && amountPinjamanPokok) {
    for(const key in dataFees) {
      if(dataFees[key].description.toString().toLowerCase() === stringFee.toString().toLowerCase()) {
        if(dataFees[key].amount.toString().toLowerCase().includes('%')) {
          if(charPersen) {
            feeNew = parseFloat(dataFees[key].amount).toFixed(2);
          } else {
            feeNew = parseInt(dataFees[key].amount) * amountPinjamanPokok / 100;
          }
        } else {
          if(charPersen) {
            feeNew = parseFloat(parseInt(dataFees[key].amount)  * 100 / amountPinjamanPokok).toFixed(2);
          } else {
            feeNew = parseInt(dataFees[key].amount);
          }
        }
      }
    }
  }

  return feeNew;
}