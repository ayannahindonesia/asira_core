import axios from 'axios';
import { serverUrl, serverUrlGeo } from '../url';
import Cookies from 'universal-cookie';

const cookie = new Cookies()

export async function postAdminLoginFunction(param, nextGeo, nextProfile) {
    return new Promise(async (resolve) => {     
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenAuth')}
        };

        const url = serverUrl + "client/admin_login"
        
        const logindata ={key: param.key,password: param.password};
  
        axios.post(url,logindata,config).then((res)=>{
            const date = new Date();
            date.setTime(date.getTime() + (res.data.expires*1000));
            cookie.set('token',res.data.token,{expires: date})

            param.dataToken = res.data.token;

            delete param.password;

            if(nextGeo && nextProfile) {
                nextGeo(param)
                resolve(nextProfile(param))
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

export async function getUserProfileFunction(param, next) {
    return new Promise(async (resolve) => {     
        const config = {
            headers: {'Authorization': "Bearer " + param.dataToken}
        };

        const url = serverUrl+"admin/profile"

  
        axios.get(url,config).then((res)=>{
            const date = new Date();
            date.setTime(date.getTime() + (res.data.expires*1000));
            cookie.set('profileUser',res.data,{expires: date})

            param.user = res.data;

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