import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class Main extends React.Component{
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <p>CORE</p>
    
                </div>
            )
        }
        if(!cookie.get('token')){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default Main;