

export function destructRolePermissionAll(listAllRolePermission){
    try {
        let newPermission = [];

        for(const key in listAllRolePermission) {
            newPermission.push({
                id: listAllRolePermission[key].id,
                name: listAllRolePermission[key].name,
                modules: listAllRolePermission[key].modules,
            });
        }

        return (newPermission)
    } catch (err) {
        const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString();
        return({error});
    }
};

export function destructRolePermission(permission, listAllRolePermission){

    try {
        let newPermission = {};
        const dataPermission = permission.split('_');

        newPermission = {
            id: findIdRolePermission(dataPermission, listAllRolePermission),
            modules: dataPermission[0],
            name: dataPermission[1] || dataPermission[0],
        };

        return(newPermission)
    } catch (err) {
        const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString();
        return({error});
    }

};

export function findIdRolePermission (dataPermission, listAllRolePermission) {

    try {
        let idPermission = 0;

        for(const key in listAllRolePermission) {
            if(
                listAllRolePermission[key].modules.toString().toLowerCase().trim() === dataPermission[0].toString().toLowerCase().trim() && 
                dataPermission[1] &&
                listAllRolePermission[key].name.toString().toLowerCase().trim() === dataPermission[1].toString().toLowerCase().trim()
            ) {
                idPermission = listAllRolePermission[key].id;
            }
        }

        return(idPermission)
    } catch (err) {
        const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString();
        return({error});
    }
        
    
    
};

export function constructRolePermission(rolePermission) {

    try {
        const newPermission = [];

        for(const key in rolePermission) {
            newPermission.push(`${rolePermission[key].modules}_${rolePermission[key].name}`)
        }
        return newPermission;
    } catch (err) {
        const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString();
        return({error});
    }
    
  }
