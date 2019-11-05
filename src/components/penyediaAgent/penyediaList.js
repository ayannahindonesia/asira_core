import React from 'react'
import { Redirect } from 'react-router-dom';
import { getToken } from '../index/token';


class PenyediaList extends React.Component{
    
    render(){
        if(getToken()){
            return(
                <div className="container">
                   <p>INI LIST</p>
    
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

export default PenyediaList;