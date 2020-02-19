import axios from 'axios'
import { serverLog } from './../url'
import { getTokenLog } from '../index/token';
import { destructErrorMessage } from '../global/globalFunction';

export async function getAllActivityLog (param,next) {

    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenLog()}
          };

        let filter =''
        
        for (const key in param){
            filter += `&${[key]}=${param[key]}`
        }
        
        
        axios.get(serverLog+`ns/log?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.activityLog = res.data
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

export async function getAllClientsFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenLog()}
            };
        axios.get(serverLog+`ns/client`,config)
            .then((res)=>{
                param.clientList = res.data
                resolve(param)
            })
            .catch((err)=>{
                const error =( err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
                param.error = error;
                resolve(param);
            })
    })
}

export async function getAllActivityLogDetailFunction (param,next) {

    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenLog()}
          };

        axios.get(serverLog+`ns/log/${param.id}`,config)
        .then((res)=>{
            param.activityLogDetail = res.data
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