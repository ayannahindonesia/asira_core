import { getToken } from "../index/token";
import { serverUrl } from '../url';
import axios from 'axios'
import { destructErrorMessage } from "../global/globalFunction";

export async function getProfileNasabahFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {headers: {'Authorization': "Bearer " + getToken() }};
        let filter =''
        
        for (const key in param){
            filter += `&${[key]}=${param[key]}`
        }

        axios.get(serverUrl+`admin/borrower?account_number=not null&orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }else{
                param.listNasabah = res.data;
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


export async function getProfileNasabahDetailFunction (param,next){
    return new Promise(async (resolve)=>{
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
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function getImageFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
          };

          axios.get(serverUrl+`admin/image/${param.id}`,config)
          .then((res)=>{
              if(next){
                  resolve(next(param))
              }else{
                resolve(res)
              }
          })
          .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}