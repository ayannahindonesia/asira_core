import { getToken } from "../index/token";
import { serverUrl } from '../url';
import axios from 'axios'

export async function getAllPermintaanPinjamanFunction(param,next){
    return new Promise (async (resolve)=>{
        const config = {headers: {'Authorization': "Bearer " + getToken() }};
        let filter =''
        
        for (const key in param){
            filter += `&${[key]}=${param[key]}`
        }

        axios.get(serverUrl+`admin/loan?orderby=updated_time&sort=desc${filter}`,config)
        .then((res)=>{
            param.pinjamanList = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })

}


export async function getDetailFunction(param,next){
    return new Promise (async (resolve)=>{
        const config = {headers: {'Authorization': "Bearer " + getToken() }};

        axios.get(serverUrl+`admin/loan/${param.id}`,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }else{
                resolve(res)
            }
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })

}

export async function getDetailBorrowerFunction(param,next){
    return new Promise (async (resolve)=>{
        const config = {headers: {'Authorization': "Bearer " + getToken() }};

        axios.get(serverUrl+`admin/borrower/${param.id}`,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }else{
                resolve(res)
            }
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })

}
