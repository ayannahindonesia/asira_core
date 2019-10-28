
import {serverUrl} from './../url'
import axios from 'axios'
import Cookies from 'universal-cookie';
const cookie = new Cookies()

export async function getAllBankListFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }
        console.log(filter)
        axios.get(serverUrl+`admin/banks?orderby=id&sort=ASC${filter}`,config)
        .then((res)=>{
          
            param.BankList = res.data.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}` 
            param.error = error;
            resolve(param);
        })
    })
}

export async function getAllLoanDataFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        var newLink =`admin/reports/convenience_fee?${filter}`
        axios.get(serverUrl+newLink,config)
        .then((res)=>{
            
            param.config = res.config.url
            param.reportFee = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
          
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })

}