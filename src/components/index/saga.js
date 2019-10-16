import axios from 'axios';
import { serverUrl, serverUrlGeo } from '../url';
import Cookies from 'universal-cookie';

const cookie = new Cookies()

export async function postAdminLoginFunction(param, nextGeo, nextProfile, nextRole, nextPermission) {
    return new Promise(async (resolve) => {     
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenAuth')}
        };

        const url = serverUrl + "client/admin_login"
        
        const logindata ={key: param.key,password: param.password};
  
        axios.post(url,logindata,config).then((res)=>{
            const date = new Date();
            date.setTime(date.getTime() + (res.data.expires_in*1000));
            cookie.set('token',res.data.token,{expires: date})
            
            param.dataToken = res.data.token;
            param.expires = res.data.expires_in;

            delete param.password;

            if(nextGeo && nextProfile) {
                nextGeo(param)
                resolve(nextProfile(param, nextRole, nextPermission))
            } else {
                resolve(param)
            }
            
        }).catch((err)=>{
            console.log(err.toString())
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) 
            param.error = error
            resolve(param);
        })
    });
    
}

export async function getTokenGeoFunction(param, next) {
    return new Promise(async (resolve) => {     
        const config = {
            headers: {'Authorization': "Bearer " + param.dataToken}
        };

        const url = serverUrlGeo + "clientauth"

        const geoData = {
            auth:{
                username : `client`,
                password : `clientgeo`
            }
        }
  
        axios.get(url,geoData,config).then((res)=>{
            const date = new Date();
            date.setTime(date.getTime() + (res.data.expires*1000));
            cookie.set('tokenGeo',res.data.token,{expires: date})

            param.dataGeoToken = res.data.token;

            if(next) {
                resolve(next(param))
            } else {
                resolve(param)
            }
            
        }).catch((err)=>{
            console.log(err.toString())
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || 'Gagal menambah User'
            param.error = error
            resolve(param);
        })
    });
    
}

export async function getUserProfileFunction(param, next, nextPermission) {
    return new Promise(async (resolve) => {     
        const config = {
            headers: {'Authorization': "Bearer " + param.dataToken}
        };

        const url = serverUrl+"admin/profile"

  
        axios.get(url,config).then((res)=>{
            param.user = res.data;
            param.roleId = res.data.role_id || 0;

            if(next) {
                resolve(next(param, nextPermission))
            } else {
                resolve(param)
            }
            
        }).catch((err)=>{
            console.log(err.toString())
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || 'Gagal menambah User'
            param.error = error
            resolve(param);
        })
    });
    
}