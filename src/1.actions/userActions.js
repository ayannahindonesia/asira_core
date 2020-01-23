import Axios from 'axios'
import {serverUrl} from './../components/url'
import { getToken } from '../components/index/token'


export const keepLogin = ()=>{
  return (dispatch)=>{
        var config = {
          headers: {'Authorization': "Bearer " + getToken()}
        };
      Axios.get(serverUrl+"lender/profile",config)
      .then((res)=>{
        
         if (res.data !== "undefined"){
              dispatch({
                  type:'LOGIN_SUCCESS',
                  payload : res.data
              },
              )
          }
      })
      .catch((err)=>{throw(err)})
  }
}


export const resetUser = ()=>{
  return {
      type: 'RESET_USER'
  }
}