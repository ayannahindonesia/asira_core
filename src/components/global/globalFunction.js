import Cookies from 'universal-cookie';

const newCookie = new Cookies();
// const listPermissionCookie = newCookie.get('profileUser')
// const listPermission = [
//   'Bank_Add',
//   'Bank_List',
//   'Bank_Edit',
//   'Loan_List',
//   'Borrower_List',
//   'Permission_List',
//   'ServiceProduct_Add',
//   'ServiceProduct_List',
//   'ServiceProduct_Edit',
//   'BankService_Add',
//   'BankService_List',
//   'BankService_Edit',
//   'BankType_Add',
//   'BankType_List',
//   'BankType_Edit',
//   'LoanPurposes_Add',
//   'LoanPurposes_List',
//   'LoanPurposes_Edit',
//   'Role_Add',
//   'Role_List',
//   'Role_Edit',
//   'Permission_Add',
//   'Permission_List',
//   'Permission_Edit',
//   'User_Add',
//   'User_List',
//   'User_Edit',
//   'Report_List',
// ]


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

  const listPermission = newCookie.get('profileUser');

  for(const key in listPermission) {
    if(stringPermission && listPermission[key].permissions && listPermission[key].permissions.toString().toLowerCase() === stringPermission.toString().toLowerCase()) {
      flag = true;
      break;
    } else if(stringPermissionSecond && listPermission[key].permissions && listPermission[key].permissions.toString().toLowerCase() === stringPermissionSecond.toString().toLowerCase()) {
      flag = true;
      break;
    } else if(listPermission[key].permissions && listPermission[key].permissions.toString().toLowerCase() === 'all') {
      flag = true;
      break;
    }
  }

  return flag;
}