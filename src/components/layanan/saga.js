import axios from 'axios';
import { serverUrl } from '../url';
import Cookies from 'universal-cookie';

const cookie = new Cookies()

export async function AddLayananFunction (param){
    return new Promise(async(resolve)=>{
        var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
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
export async function getAllListLayananFunction(param) {
    return new Promise(async(resolve)=>{
     
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
              };
    
            axios.get(serverUrl+`admin/services?orderby=updated_time&sort=desc`,config)
            .then((res)=>{
                const semuaData = res.data.data
                param.dataLayanan = semuaData
                resolve(param)
            })
            .catch((err)=>{
                    const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
                    param.error = error;
                    resolve(param);
            })
        
    })
    
}
export async function getDetailLayananFunction (param,next){
    return new Promise(async(resolve)=>{
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.get(serverUrl+`admin/services/${param.id}`,config)
        .then((res)=>{
            console.log(res.data)
            const semuaData = res.data
            param.detailData = semuaData
            resolve(param)

            if (semuaData.image_id !== undefined || semuaData.image_id !== null){
                if(next) {
                    resolve(next(param))
                } else {
                    resolve(param)
                }
               
            }
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })

    })
}
export async function getImageLayananFunction (param){
 
    return new Promise(async(resolve)=>{ 
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.get(serverUrl+`admin/image/${param.detailData.image_id}`,config)
        .then((res)=>{
            const dataImage = res.data.image_string;
            param.detailData.imageData = dataImage
            resolve(param)
        })
        .catch((err)=>console.log(err))
    })
}