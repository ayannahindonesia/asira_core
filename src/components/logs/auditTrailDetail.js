import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import { getAuditTrailDetailFunction } from './saga'
import Loader from 'react-loader-spinner'

var _ = require('lodash');

class AuditTrailDetail extends React.Component{
    _isMounted = false

    state={
        newData:[],
        originalDataFee:[],
        originalData:[],
        rows:{},
        objC:{},
        loading:true
    }

    
    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentDidMount(){
        this._isMounted=true
        this.getAuditDetail()
   
    }

    getAuditDetail = async function () {
        const param = {}
        param.id = this.props.match.params.id
        const data = await getAuditTrailDetailFunction(param)
       if(data){
           console.log(data)
           if(!data.error){
              const newDataLog = data.auditTrailDetail 
              newDataLog.original = JSON.parse(newDataLog.original)
              newDataLog.original.created_at = newDataLog.original.created_at.replace("T"," - ")
              newDataLog.original.updated_at = newDataLog.original.updated_at.replace("T"," - ")
              
              if(newDataLog.original.deleted_at !==null){
                newDataLog.original.deleted_at = newDataLog.original.deleted_at.replace("T"," - ")
              }
           
              newDataLog.new = JSON.parse(newDataLog.new)
              newDataLog.new.created_at = newDataLog.new.created_at.replace("T"," - ")
              newDataLog.new.updated_at = newDataLog.new.updated_at.replace("T"," - ")
              if(newDataLog.new.deleted_at !==null){
                newDataLog.new.deleted_at = newDataLog.new.deleted_at.replace("T"," - ")
              }

              this.setState({
                originalData:  newDataLog.original,
                newData:  newDataLog.new,
                rows:newDataLog,
                loading:false
              })
           }
           else{
               this.setState({errorMessage:data.error})
           }
       }
    }

   
    renderJsx= (param)=>{
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
            } else {
                return(
                    <ul key={index}>
                        <li>{`${val} : ${param[val]}`}</li>
                    </ul>
                )
            }
          
        })
        return jsx
    }
   
     extractJSON = (obj, indent) => {
         let finalObj =''

         if(obj !== null) {
            finalObj = Object.keys(obj).map((i,index) => {
                if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
                    return this.extractJSON(obj[i], ' --- '+ indent + '  ' + i + ' > ');
                  } else {
                    return (
                        <ul key={index}>
                            <li>{indent + i + ': ' + obj[i] }</li>
                        </ul>
                    )
                  }
             }, this)
         } else {
            finalObj = (<ul><li>Null</li></ul>)
         }
         

        return(finalObj) 
      }
   
    getValueandPropertyDifferences =(oldData,newData)=>{
        let objectCombine = {}

        for (const key in oldData){
           objectCombine[key] =  oldData[key]
           for (const key2 in newData){
               if(newData === oldData){

               }    
           }
        }
        // for (const key2 in newData){
        //     objectCombine[key2] = newData[key2]
        // }

        console.log(objectCombine)
      
    }
    
    render(){   
        if(this.state.loading){
            return(
                <Loader 
                  type="ThreeDots"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
            )
        }
        else if(getToken()){
            return(
                <div style={{padding:0}}>
                    <h2>Audit Trail - Detail {this.state.rows.id}</h2>
                    <hr></hr>
                    <div className="row">
                        <div className="col col-xs col-md">
                            <table className="table table-bordered">
                             <thead className="table-warning">
                                <tr>
                                    <th className="text-center" scope="col">Sebelum</th>
                                    <th className="text-center" scope="col">Sesudah</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="text-left w-25"> 
                                      {this.extractJSON(this.state.originalData,"  ")}
                                    </td>
                                    <td className="text-left w-25"> 
                                      {this.extractJSON(this.state.newData,"  ")}
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div>
                        <input type="button" className="btn btn-outline-primary" value="Kembali" onClick={()=> window.history.back()}/>
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

export default AuditTrailDetail