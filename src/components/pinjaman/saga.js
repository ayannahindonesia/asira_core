import { getToken } from "../index/token";
import { serverUrl } from '../url';
import axios from 'axios'
import { destructErrorMessage } from "../global/globalFunction";

export async function getAllPermintaanPinjamanFunction(param,next){
    return new Promise (async (resolve)=>{
        const config = {headers: {'Authorization': "Bearer " + getToken() }};
        let filter =''
        
        for (const key in param){
            filter += `&${[key]}=${param[key]}`
        }

        axios.get(serverUrl+`admin/loan?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.pinjamanList = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
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
                const dataLender = res && res.data;
                param.dataLender = dataLender;
                resolve(param)
            }
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
            param.error = error;
            resolve(param);
        })
    })

}
