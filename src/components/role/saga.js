import Cookies from 'universal-cookie';
import axios from 'axios'
import { serverUrl } from '../url';
const cookie = new Cookies()

export async function AddRoleFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.post(serverUrl+'admin/roles',param,config)
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function ListRoleFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }
        axios.get(serverUrl+`admin/roles?orderby=updated_time&sort=asc${filter}`,config)
        .then((res)=>{
            resolve(res.data.data)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function DetailRoleFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.get(serverUrl+`admin/roles/${param.id}`,config)
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function EditRoleFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.patch(serverUrl+`admin/roles/${param.id}`,param.newData,config)
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}