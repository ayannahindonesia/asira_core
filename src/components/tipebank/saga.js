import Cookies from 'universal-cookie';
import axios from 'axios'
import { serverUrl } from '../url';
const cookie = new Cookies()

export async function AddTipeBankFunction (param){
    return new Promise (async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.post(serverUrl+`admin/bank_types`,param,config)
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

export async function ListTipeBankFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
          let filter = '';

          for(const key in param) {
              filter += `&${key}=${param[key]}`
          }
        axios.get(serverUrl+`admin/bank_types?orderby=updated_time&sort=asc${filter}`,config)
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

export async function DetailTipeBankFunction(params,next) {
    return new Promise(async(resolve)=>{
        
            const config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
              };
          
            axios.get(serverUrl+`admin/bank_types/${params.id}`,config)
            .then((res)=>{
                if(next){
                    resolve(next(params))
                }else{
                    resolve(res.data)
                }
            })
            .catch((err)=>{
                const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
                params.error = error;
                resolve(params);
            })
        
    })    
}

export async function EditTipeBankFunction(params) {
    return new Promise(async(resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        axios.patch(serverUrl+`admin/bank_types/${params.id}`,params.newData,config)
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            params.error = error;
            resolve(params);
        })
    })
}