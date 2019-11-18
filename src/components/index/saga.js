import axios from 'axios';
import { serverUrl, serverUrlGeo } from '../url';
import jsonWebToken from 'jsonwebtoken';
import { setToken, setTokenGeo, getTokenAuth } from './token';

export async function postAdminLoginFunction(param, nextGeo, nextProfile) {
    return new Promise(async (resolve) => { 
        const tokenAuth = getTokenAuth();

        
        const config = {
            headers: {'Authorization': "Bearer " + tokenAuth}
        };

        const url = serverUrl + "client/admin_login"
        
        const logindata ={key: param.key,password: param.password};
  
        axios.post(url,logindata,config).then((res)=>{

            setToken(res.data.token, new Date().getTime() + (res.data.expires_in*1000))
            
            param.dataToken = res.data.token;
            param.expires = res.data.expires_in;      

            delete param.password;

            if(nextGeo && nextProfile) {
                nextGeo(param)
                resolve(nextProfile(param))
            } else {
                resolve(param)
            }
            
        }).catch((err)=>{
            console.log(err.toString())
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
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
            setTokenGeo(res.data.token);

            param.dataGeoToken = res.data.token;

            if(next) {
                resolve(next(param))
            } else {
                resolve(param)
            }
            
        }).catch((err)=>{
            console.log(err.toString())
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error
            resolve(param);
        })
    });
    
}

export async function getUserProfileFunction(param) {
    return new Promise(async (resolve) => {    
        try {
            var token = jsonWebToken.verify(param.dataToken,'sXQ8jUMpueOvN5P3cdCR');

            param.dataPermission = token.permissions;
            resolve(param)
        } catch (err) {
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error
            resolve(param);
        }
        
        
    });
    
}