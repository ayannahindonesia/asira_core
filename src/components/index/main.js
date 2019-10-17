import React from 'react'
import { Redirect } from 'react-router-dom';
import SecureLS from 'secure-ls';
import md5 from 'md5';

const newLs = new SecureLS({encodingType: 'aes', isCompression: true, encryptionSecret:'react-secret'});

class Main extends React.Component{
    componentDidMount() {
        
        const allRows = newLs.getAllKeys();

        console.log('token', md5('token'))
        console.log('tokenAuth', md5('tokenAuth'))

        for(const key in allRows) {
            console.log(allRows[key])
            console.log(newLs.get(allRows[key]))  
        }
        
        console.log(newLs.get(md5('token')))
    }
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