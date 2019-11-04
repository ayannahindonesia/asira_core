export function destructRolePermission(permission, listAllRolePermission){

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
        const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString();
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
        const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString();
        return({error});
    }
    
  }
