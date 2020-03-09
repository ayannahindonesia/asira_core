import axios from 'axios';
import { getToken } from '../index/token';
import { serverUrl } from '../url';
import { destructErrorMessage } from '../global/globalFunction';


export async function getAllFAQListFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
          };
        let filter =''
        
        for (const key in param){
            filter += `&${[key]}=${param[key]}`
        }


        axios.get(serverUrl+`admin/faq?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.listFaq = res.data
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

export async function addFAQFunction(param) {
    return new Promise(async(resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
          };

          axios.post(serverUrl+`admin/faq`,param,config)
          .then((res)=>{
                resolve(res)
          })
          .catch((err)=>{
              const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
              param.error = error;
              resolve(param);
          })
    })
}

export async function detailFAQFunction (param,next){
    return new Promise(async(resolve)=>{
        const config ={
            headers: {'Authorization': "Bearer " + getToken()}

        }
        axios.get(serverUrl+`admin/faq/${param.id}`,config)
          .then((res)=>{
              param.FAQDetail = res.data
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

export async function EditFAQFunction(params) {
    return new Promise(async(resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };
        axios.patch(serverUrl+`admin/faq/${params.id}`,params.newData,config)
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
            params.error = error;
            resolve(params);
        })
    })
}

export async function DeleteFAQFunction(params) {
    return new Promise(async(resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };
        axios.delete(serverUrl+`admin/faq/${params.id}`,config)
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
            params.error = error;
            resolve(params);
        })
    })
}