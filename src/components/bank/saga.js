import {serverUrl, serverUrlGeo} from '../url'
import axios from 'axios'
import Cookies from 'universal-cookie';

const cookie = new Cookies()

export async function addBankFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.post(serverUrl+'admin/banks',param,config)
        .then((res)=>{
            if(next){
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

export async function getProvinsiFunction(param) {
    return new Promise(async (resolve)=>{
        const configGeo = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenGeo')}
            };
        axios.get(serverUrlGeo+`client/provinsi`,configGeo)
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

export async function getKabupatenFunction (param){
    return new Promise(async (resolve)=>{
        const configGeo = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenGeo')}
            };
        axios.get(serverUrlGeo+`client/provinsi/${param}/kota`,configGeo)
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

export async function getServiceFunction(param) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.get(serverUrl+'admin/services',config)
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

export async function getAllBankList (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        axios.get(serverUrl+`admin/banks?orderby=id&sort=ASC&rows=10${filter}`,config)
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

export async function getBankDetailFunction (param,next){
    return new Promise(async (resolve)=>{
            const config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
              };
          
            axios.get(serverUrl+`admin/banks/${param.id}`,config)
            .then((res)=>{
                if(next){
                    resolve(next(param))
                }else{
                    resolve(res.data)
                }
            })
            .catch((err)=>{
                const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
                param.error = error;
                resolve(param);
            })
        
    })
}