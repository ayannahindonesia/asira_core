import axios from 'axios'
import { serverLog } from './../url'
import { getToken } from '../index/token';

export async function getAllActivityLog (param,next) {

    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
          };

        let filter =''
        
        for (const key in param){
            filter += `&${[key]}=${param[key]}`
        }


        axios.get(serverLog+`?orderby=updated_at&sort=desc${filter}`,config)
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
