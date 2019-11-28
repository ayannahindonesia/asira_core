import axios from 'axios';
import { serverUrl } from '../url';
import { getToken } from '../index/token';

export async function getAllBorrowerFunction(param, next){
    return new Promise(async (resolve) => {

        const token = getToken();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        const urlNew = serverUrl+`admin/borrower?account_number=null&orderby=updated_time&sort=desc${filter}`
        
        axios.get(urlNew,config).then((res)=>{
            const listUser = res.data && res.data.data
            param.dataUser = listUser;
            param.totalData = res.data.total_data

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    });
};

export async function getBorrowerFunction(param, next) {
    return new Promise(async (resolve) => {

        const token = getToken();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        const urlNew = serverUrl+`admin/borrower/${param.calonNasabahId}`
    
        axios.get(urlNew,config).then((res)=>{
            const listUser = res.data && res.data.data ? res.data.data : res.data;
            param.dataUser = listUser;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    });
}

export async function getImageFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
          };

          axios.get(serverUrl+`admin/image/${param.idImage}`,config)
          .then((res)=>{
              if(next){
                  resolve(next(param))
              }else{
                param.image = res.data;
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