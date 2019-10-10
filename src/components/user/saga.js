import axios from 'axios';
import { serverUrl } from '../url';
import Cookies from 'universal-cookie';

const cookie = new Cookies()

export async function getAllUserFunction(param, next){
    return new Promise(async (resolve) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        const urlNew = serverUrl+`admin/users?orderby=updated_time&sort=desc${filter}`
    
        axios.get(urlNew,config).then((res)=>{
            const listUser = res.data && res.data.data
            param.dataUser = listUser;
            param.totalData = res.data.total_data

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    });
};

export async function getUserFunction(param, next) {
    return new Promise(async (resolve) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        const urlNew = serverUrl+`admin/users/${param.userId}`
    
        axios.get(urlNew,config).then((res)=>{
            const listUser = res.data && res.data.data ? res.data.data : res.data;
            param.dataUser = listUser;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    });
}

export async function getRoleFunction(param, next) {
    return new Promise(async (resolve) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        const urlNew = serverUrl+`admin/users/${param.userId}`
    
        axios.get(urlNew,config).then((res)=>{
            const listUser = res.data && res.data.data ? res.data.data : res.data;
            param.dataUser = listUser;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    });
}

export async function getRolePermissionFunction(param, next) {
    return new Promise(async (resolve) => {
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        const urlNew = serverUrl+`admin/users/${param.userId}`
    
        axios.get(urlNew,config).then((res)=>{
            const listUser = res.data && res.data.data ? res.data.data : res.data;
            param.dataUser = listUser;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    });
}

export async function patchUserAddFunction(param) {
    return new Promise(async (resolve) => {     
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
  
        axios.patch(serverUrl+'admin/users',param.dataUser,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || 'Gagal menambah User'
            param.error = error
            resolve(param);
        })
    });
    
}

export async function postUserAddFunction(param) {
    return new Promise(async (resolve) => {     
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
  
        axios.post(serverUrl+'admin/users',param.dataUser,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || 'Gagal menambah User'
            param.error = error
            resolve(param);
        })
    });
    
}