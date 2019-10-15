import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { serverUrl } from '../url';
import axios from 'axios'
import {Link} from 'react-router-dom'

const cookie = new Cookies()

class TambahBankList extends React.Component{
    state={
        loading:true
    }
    componentDidMount (){
        this.getAllList()
    }
    getAllList = ()=>{
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };

        axios.get(serverUrl+`admin/bank_types`,config)
        .then((res)=>{
            this.setState({loading:false,rows:res.data.data})
        })
        .catch((err)=>console.log(err))
    }

    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
                <td align="center" colSpan={4}>
                      <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
              />   
                </td>
              </tr>
            )
        }else{
            if(this.state.rows.length===0){
                return(
                  <tr>
                     <td align="center" colSpan={4}>Data empty</td>
                  </tr>
                )
              }else{
                var jsx = this.state.rows.map((val,index)=>{
                  return (
                      <tr key={index}>
                        <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
                        <td align="center">{val.id}</td>
                        <td align="center">{val.name}</td>
                         
                        <td align="center">
                        <Link to={`/banktypeedit/${val.id}`} className="mr-2">
                         <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                         </Link>
                        <Link to={`/banktypedetail/${val.id}`} >
                         <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                    </Link>
                        </td>
                      </tr>
                  )
              })
               return jsx;
              }
        }
    }

    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2 className="mt-3">Tipe Bank - List</h2>
                   <hr/>
                   <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">Id Tipe Bank</th>
                            <th className="text-center" scope="col">Nama Tipe Bank</th>
                            <th className="text-center" scope="col">Action</th>  
                        </tr>     
                    </thead>
                       <tbody>
                          {this.renderJSX()}

                       </tbody>
                   </table>
    
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

export default TambahBankList;