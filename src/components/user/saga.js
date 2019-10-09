import axios from 'axios';
import { serverUrl } from '../url';
import Cookies from 'universal-cookie';
import {destructRolePermission, destructRolePermissionAll} from './function'

const cookie = new Cookies()

export async function getAllRoleFunction(param, next){
    return new Promise(async (resolve, reject) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
    
        axios.get(serverUrl+`admin/roles?orderby=updated_time&sort=desc`,config).then((res)=>{
            const listRole = res.data && res.data.data
            param.dataRole = listRole;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            reject({error});
        })
    });
};
    
export async function getAllRolePermissionListFunction(param, next){
    return new Promise(async (resolve, reject) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        axios.get(serverUrl+`admin/permission`,config)
        .then((res)=>{
            const listPermission = res.data && res.data.data ? res.data.data : res.data;
            const listRole = param.dataRole;
            const newRole = [];
            const rolePerPages = [];

            for(const key in listRole) {
                const rolePerLine = listRole[key];
                rolePerLine.permission = []
                for(const keyPermission in listPermission) {
                    if(
                        rolePerLine.id.toString() === listPermission[keyPermission].role_id.toString() &&
                        listPermission[keyPermission].permissions.toString().trim().length !== 0
                    ) {
                        rolePerLine.permission.push(listPermission[keyPermission].permissions)
                    }
                }

                if(rolePerLine.permission.length !== 0) {
                    newRole.push(rolePerLine);
                }
            }
            
            for(let i = (param.rowsPerPage*(param.page-1)); i < param.rowsPerPage * param.page; i+=1) {
                if(newRole[i] && newRole[i].id) {
                    rolePerPages.push(newRole[i])
                }            
            }
            
            param.totalData = newRole.length;
            param.dataRolePermission = rolePerPages;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }

        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            reject({error});
        })
    })
}

export async function getAllRolePermissionAddFunction(param, next){
    return new Promise(async (resolve, reject) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
      
          axios.get(serverUrl+`admin/permission`,config)
          .then((res)=>{
              const listPermission = res.data && res.data.data ? res.data.data : res.data;
              const listRole = param.dataRole;
              const newRole = [];
              let role = 0;
      
              for(const key in listRole) {
                const rolePerLine = listRole[key];
                rolePerLine.permission = []
                for(const keyPermission in listPermission) {
                  if(
                    rolePerLine.id.toString() === listPermission[keyPermission].role_id.toString() && 
                    listPermission[keyPermission].permissions.toString().trim().length !== 0
                  ) {
                    rolePerLine.permission.push(listPermission[keyPermission].permissions)
                  }
                }
      
                if(rolePerLine.permission.length === 0) {
                  if(role === 0) {
                    role = rolePerLine.id;
                  }
                  newRole.push(rolePerLine);
                }
              }
              
              if(newRole.length && newRole.length !== 0) {
                  param.role = role;
                  param.dataRole = newRole
              } else {
                  param.error = 'Data Role yang belum di setup tidak ditemukan';
              }
      
              if(next) {
                  resolve(next(param));
              } else {
                  resolve(param);
              }
      
          }).catch((err)=>{
              const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
              reject({error});
          })
    });
}

export async function getRoleFunction(param, next) {
    return new Promise(async (resolve, reject) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        axios.get(serverUrl+`admin/roles/${param.roleId}`,config).then((res)=>{
            const listRole = res.data;
            param.dataRole = listRole;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            reject({error});
        })
    });
}

export async function getRolePermissionFunction(param, next) {
    return new Promise(async (resolve, reject) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
          
        axios.get(serverUrl+`admin/permission?role_id=${param.roleId}`,config)
        .then((res)=>{
            const listPermission = res.data && res.data.data ? res.data.data : res.data;
            const listRole = param.dataRole;
            let newPermission = [];

            for(const keyPermission in listPermission) {
                if(
                    listRole.id.toString() === listPermission[keyPermission].role_id.toString() &&
                    listPermission[keyPermission].permissions.toString().trim().length !== 0
                ) {
                if(listPermission[keyPermission].permissions.toString().trim().toLowerCase() === 'all') {
                    newPermission = destructRolePermissionAll(param.listAllRolePermission);
                    break;
                } else {
                    const permissionNew = destructRolePermission(listPermission[keyPermission].permissions, param.listAllRolePermission)
                    newPermission.push(permissionNew)
                }
                
                }
            }
    
            param.dataRolePermission = newPermission
    
            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
    
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            reject({error});
        })
    });
    
}