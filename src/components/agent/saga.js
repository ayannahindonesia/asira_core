import axios from 'axios';
import { serverUrl } from '../url';
import { getToken } from '../index/token';

export async function getAllAgentFunction(param, next){
    return new Promise(async (resolve) => {

        const token = getToken();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        const urlNew = serverUrl+`admin/users?orderby=updated_time&sort=desc${filter}`
    
        axios.get(urlNew,config).then((res)=>{
            const listAgent = res.data && res.data.data
            param.dataAgent = listAgent;
            param.totalData = res.data.total_data

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    });
};

export async function getAgentFunction(param, next) {
    return new Promise(async (resolve) => {

        const token = getToken();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        const urlNew = serverUrl+`admin/users/${param.userId}`
    
        axios.get(urlNew,config).then((res)=>{
            const listAgent = res.data && res.data.data ? res.data.data : res.data;
            param.dataAgent = listAgent;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    });
}

export async function patchAgentAddFunction(param) {
    return new Promise(async (resolve) => {   
        const token = getToken() 
        const config = {
            headers: {'Authorization': "Bearer " + token}
          };
  
        axios.patch(serverUrl+`admin/users/${param.id}`,param.dataUser,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)
            param.error = error;
            resolve(param);
        })
    });
    
}

export async function postAgentAddFunction(param) {
    return new Promise(async (resolve) => {     

        const token = getToken()
        const config = {
            headers: {'Authorization': "Bearer " + token}
          };
  
        axios.post(serverUrl+'admin/users',param.dataAgen,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)
            param.error = error
            resolve(param);
        })
    });
    
}