import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import { getAllActivityLogDetailFunction } from './saga'

class ActivityLogDetail extends React.Component{
    _isMounted = false

    state={
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:5,
        errorMessage:'',
        messages:{}
    }

    
    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentDidMount(){
        this._isMounted=true
        this.getAllLogDetail()
   
    }

    getAllLogDetail = async function () {
        const param = {}
        param.id = this.props.match.params.id
        const data = await getAllActivityLogDetailFunction(param)

        if(data){
            if(!data.error){
                const newDataLog = data.activityLogDetail 

                newDataLog.created_at = newDataLog.created_at.replace("T"," - ")
                newDataLog.updated_at = newDataLog.updated_at.replace("T"," - ")
                this.setState({rows:newDataLog,messages:data.activityLogDetail.messages})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    renderJsx =(param)=>{
        var jsx = Object.keys(param).map((val,index)=>{
            if(typeof(param[val]) === 'object' && param[val] !== null) {
                
                const childParam = param[val];
                
                let newDesign = Object.keys(childParam).map((paramIndex) => {
                        if(typeof(childParam[paramIndex]) === 'object' && childParam[paramIndex] !== null  ) {
                            const anotherChild = childParam[paramIndex]
                            
                            //  this.renderJsx(anotherChild)

                            let insideAnotherChild = Object.keys(anotherChild).map((valueAnotherChild,indexOther)=>{
                                return (
                                        <ul  key={indexOther}>
                                            <li>{`${val} : ${anotherChild[valueAnotherChild]}`}</li>
                                        </ul>
                                )
                            })
                            return insideAnotherChild
                        }

                        return(
                            <ul key={paramIndex}>
                                <li>{`${paramIndex.length>1?paramIndex:val} : ${childParam[paramIndex]}`}</li>
                            </ul>
                        )
                    })
                    return newDesign;
                
            }else{
                return(
                <ul key={index}>
                    <li>{`${val} : ${param[val]}`}</li>
                </ul>
                )
            }

        })
        return jsx
    }

    
    render(){   
        if(getToken()){
            return(
                <div style={{padding:0}}>
                    <h2>Activity Log - Detail [{this.props.match.params.id}]</h2>
                    <hr></hr>
                    <div className="row">
                        <div className="col col-xs col-md">
                            <table className="table table-bordered">
                             <thead className="table-warning">
                                <tr>
                                    <th className="text-center" scope="col">Details</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="text-left"> 
                                      {this.renderJsx(this.state.rows)}
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
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