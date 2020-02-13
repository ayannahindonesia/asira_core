import axios from 'axios';
import { serverUrl, serverUrlGeo, serverLog } from '../url';
import jsonWebToken from 'jsonwebtoken';
import { setToken, setTokenGeo, getTokenAuth, setTokenLog } from './token';
import { destructErrorMessage } from '../global/globalFunction';

export async function postAdminLoginFunction(param, nextGeo, nextProfile, nextLog) {
    return new Promise(async (resolve) => { 
        const tokenAuth = getTokenAuth();

        
        const config = {
            headers: {
                'Authorization': "Bearer " + tokenAuth,
            },
        };

        const url = serverUrl + "client/admin_login"
        
        const logindata ={key: param.key,password: param.password};
  
        axios.post(url,logindata,config).then((res)=>{
            setToken(res.data.token, new Date().getTime() + (res.data.expires_in*1000))
            
            param.dataToken = res.data.token;
            param.expires = res.data.expires_in;      

            delete param.password;

            if( nextGeo && nextProfile) {
                nextGeo(param)
                resolve(nextProfile(param))
            } else {
                resolve(param)
            }
            
        }).catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data)) || err.toString()
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
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data)) || err.toString()
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
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data)) || err.toString()
            param.error = error
            resolve(param);
        }
        
        
    });
    
}

export async function sendEmailFunction (param,next){
    return new Promise(async (resolve)=>{
        const tokenAuth = getTokenAuth();
        const config = {
            headers: {'Authorization': "Bearer " + tokenAuth}
        };
        axios.post(serverUrl+'client/forgotpassword?system=core',param,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }
            resolve(res)
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data)) || err.toString()
            param.error = error
            resolve(param);
        })

    })
}

export async function changePasswordFunction (param,next){
    return new Promise(async(resolve)=>{
        const tokenAuth = getTokenAuth();

        const config = {
            headers: {'Authorization': "Bearer " + tokenAuth}
        };
        axios.post(serverUrl+'client/resetpassword',param,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }
            resolve(res)
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function getTokenLogFunction (param) {
    return new Promise(async (resolve) => {    
        
        const config = {
//            headers: {'Authorization': "Basic Yf983jf9we8f9jf9832jf3="}
            headers: {'Authorization': "Basic "+btoa("lenderkey:lendersecret")}

        };

        const url = serverLog + "login"

        const logData = {
            auth:{
                username : `lenderkey`,
                password : `lendersecret`
            }
        }
  
        axios.get(url,logData,config)
        .then((res)=>{
           // console.log(res)
            setTokenLog(res.data.token);
        }).catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data)) || err.toString()
            param.error = error
            resolve(param);
        })
    });
    
}