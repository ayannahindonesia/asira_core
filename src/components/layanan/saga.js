import { serverUrl } from '../url';
import axios from 'axios'
import Cookies from 'universal-cookie';

const cookie = new Cookies()

export async function getAllLayananListFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        let filter =''
        
        for (const key in param){
            filter += `${[key]} = ${param[key]}`
        }


        axios.get(serverUrl+`admin/services?orderby=updated_time&sort=asc${filter}`,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }else{
                resolve(res)
            }
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function getDetailLayananFunction(param,next) {
    return new Promise(async (resolve)=>{
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.get(serverUrl+`admin/services/${param.id}`,config)
        .then((res)=>{
          
            if(next){
                param.image_id = res.data.image_id
                param.data = res.data
                resolve(next(param))
            }
                resolve(res)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function getImageFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.get(serverUrl+`admin/image/${param.image_id}`,config)
        .then((res)=>{
            param.imageData = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function editLayananFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
        axios.patch(serverUrl+`admin/services/${param.id}`,param.newData,config)
        .then((res)=>{
            param = res
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
    
export async function addLayananFunction (param, next){
    return new Promise(async (resolve)=>{
        const config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
        axios.post(serverUrl+'admin/services',param,config)
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