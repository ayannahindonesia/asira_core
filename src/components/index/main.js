import React from 'react'
import { Redirect } from 'react-router-dom';
import SecureLS from 'secure-ls';
import md5 from 'md5';

const newLs = new SecureLS({encodingType: 'aes', isCompression: true, encryptionSecret:'react-secret'});

class Main extends React.Component{
    render(){
        if(newLs.get(md5('token'))){
            return(
                <div className="container">
                   <p>CORE</p>
    
                </div>
            )
        }
        if(!newLs.get(md5('token'))){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default Main;