export function destructRolePermission(permission, listAllRolePermission){

    try {
        let newPermission = {};
        let lastPermission = [] ;

        for(const key in listAllRolePermission) {
            let flag = false;
            const dataPermissionModules = listAllRolePermission[key].modules.split(' ');

            for(const keyPermission in permission) {

                if(
                    permission[keyPermission].toString().toLowerCase() === 'all' || 
                    dataPermissionModules[0].toString().toLowerCase() === permission[keyPermission].toString().toLowerCase() ||
                    (dataPermissionModules[1] && dataPermissionModules[1].toString().toLowerCase() === permission[keyPermission].toString().toLowerCase())
                ) {
                    flag = true;
                    break;
                }
            }

            if(flag) {
                if(!newPermission[`${listAllRolePermission[key].modules.toString().toLowerCase()}`]) {
                    newPermission[`${listAllRolePermission[key].modules.toString().toLowerCase()}`] = {};
                    lastPermission.push({  
                        id: listAllRolePermission[key].id,
                        modules: listAllRolePermission[key].modules,
                    })
                }
                
            }

        }

        for(const key in permission) {
            if(!newPermission[`${permission[key].toString().toLowerCase()}`]) {
                lastPermission.push({  
                    id: '-',
                    modules: permission[key],
                })
            }
        }

        return(lastPermission)
    } catch (err) {
        const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString();
        return({error});
    }

};

export function constructRolePermission(rolePermission) {

    try {
        const newPermission = [];

        for(const key in rolePermission) {
            newPermission.push(rolePermission[key].modules)
        }
        return newPermission;
    } catch (err) {
        const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString();
        return({error});
    }
    
  }
