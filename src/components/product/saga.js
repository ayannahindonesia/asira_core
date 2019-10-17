import axios from 'axios'
import Cookie from 'universal-cookie'
import {serverUrl} from '../url'
const cookie = new Cookie()

export async function getBankServiceFunction(param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.get(serverUrl+'admin/services',config)
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

export async function addProductFunction(param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.post(serverUrl+'admin/products',param,config)
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

export async function listProductFunction (param){
    return new Promise (async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        axios.get(serverUrl+`admin/products?orderby=updated_time&sort=asc${filter}`,config)
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


export async function detailProductFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.get(serverUrl+`admin/products/${param.id}`,config)
        .then((res)=>{
            param.dataProduct = res.data
            if(next){
                resolve(next(param))
            }
            resolve(res.data)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}


export async function detailServiceProductFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.get(serverUrl+`admin/services/${param.dataProduct.service_id}`,config)
        .then((res)=>{
            const data = res.data && res.data.data ? res.data.data : res.data;
            param.serviceProduct = data;
            if(next){
                resolve(next(param))
            }
            resolve(param)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function editProductFunction (param) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.patch(serverUrl+`admin/products/${param.id}`,param.newData,config)
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
