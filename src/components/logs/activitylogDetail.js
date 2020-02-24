import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import { getAllActivityLogDetailFunction } from './saga'

class ActivityLogDetail extends React.Component{
    _isMounted = false

    state={
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:5,
    }

    
    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentDidMount(){
        this._isMounted=true
        //this.getAllLogDetail()
   
    }

    getAllLogDetail = async function () {
        const param = {}
        param.id = this.props.match.params.id
        console.log(this.props.match.params.id)
        const data = await getAllActivityLogDetailFunction(param)

        if(data){
            console.log(data)
        }
    }



    
    render(){   
        if(getToken()){
            return(
                <div style={{padding:0}}>
                    <h2>Activity Log - Detail [{this.props.match.params.id}]</h2>
                    <hr></hr>
                    <div>
                        <input type="button" className="btn btn-outline-primary" value="Kembali" onClick={()=>window.history.back()}/>
                    </div>
                        
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

export default ActivityLogDetail