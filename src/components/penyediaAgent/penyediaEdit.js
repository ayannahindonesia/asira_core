import React from 'react'
import { Redirect } from 'react-router-dom';
import { getToken } from '../index/token';


class PenyediaEdit extends React.Component{
    
    render(){
        if(getToken()){
            return(
                <div className="container">
                   <p>CORE</p>
    
                </div>
            )
        }
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default PenyediaEdit;