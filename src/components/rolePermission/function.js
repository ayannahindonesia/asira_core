import { listAllRolePermission, dataMenu } from "../global/globalConstant";
import { destructErrorMessage } from "../global/globalFunction";

export function destructRolePermission(permission){

    try {
        let lastPermission = [] ;
        let id = '';

        for(const key in permission) {
            
            if(!permission[key].toString().toLowerCase().includes('detail')) {
                id = permission[key]
            }
            
            lastPermission.push({
                id,
                modules: permission[key],
            })
        }

        return(lastPermission)
    } catch (err) {
        const error = (err.response && err.response.data && destructErrorMessage(err.response.data)) || err.toString();
        return({error});
    }

};

export function constructRolePermission(rolePermission) {

    try {
        let newPermission = [];

        for(const key in rolePermission) {
            if(rolePermission[key].modules === 'all') {
                newPermission = ['all'];
                break;
            }
            newPermission.push(rolePermission[key].modules)
        }
        return newPermission;
    } catch (err) {
        const error = (err.response && err.response.data && destructErrorMessage(err.response.data)) || err.toString();
        return({error});
    }
    
};

export function checkingSystem (role, listRole){
    let listPermission = dataMenu;

    let newListAllRolePermission = [];
    
    for(const keyRole in listRole) {
      if(listRole[keyRole].id && listRole[keyRole].id.toString().toLowerCase() === role.toString().toLowerCase()) {
        for(const key in listPermission) {
          if(
            listPermission[key].system.toLowerCase().includes(listRole[keyRole].system.toString().toLowerCase()) 
          ) {
            if(listPermission[key].child) {
              const menuChild = listPermission[key].child;

              for(const keyChild in menuChild) {
                newListAllRolePermission.push(menuChild[keyChild])
              }
            } else {
              newListAllRolePermission.push(listPermission[key])
            }
            
          }
        }
        break;
      }
    }

    return newListAllRolePermission;
};

export function checkingRole (role, id){
    for (const key in role) {
      if (
        role[key].id.toString().trim() === id.toString().trim()
      ) {
        return true;
      }
    }
    return false;
}

export function findRoleName (idRole, dataRole) {
  let roleName = '';

  for(const key in dataRole) {
    if(idRole.toString().toLowerCase() === dataRole[key].id.toString().toLowerCase()) {
      roleName = dataRole[key].name
      break;
    }
  }

  return roleName;
}

export function findSystem (idRole, dataRole) {
  let system = '';

  for(const key in dataRole) {
    if(idRole.toString().toLowerCase() === dataRole[key].id.toString().toLowerCase()) {
      system = dataRole[key].system
      break;
    }
  }

  return system;
}
