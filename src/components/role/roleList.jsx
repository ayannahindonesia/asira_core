import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import {ListRoleFunction} from './saga'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {checkPermission} from './../global/globalFunction'

const cookie = new Cookies()

class RoleList extends React.Component{
    _isMounted = false;
    state={
        loading:true, rows:[],errMessage:''
    }
    componentDidMount(){
        this._isMounted=true;
        this.getAllRole()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    getAllRole = async function () {
        const param = {

        };
        const data  = await ListRoleFunction(param)
        if(data){
            if(!data.error){
                this.setState({loading:false,rows:data,errorMessage:''})
            }else{
                this.setState({loading:false,errorMessage:data.error})
            }
        }
        
    }
    
    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
                <td align="center" colSpan={6}>
                      <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
              />   
                </td>
              </tr>
            )
        }
        var jsx = this.state.rows.map((val,index)=>{
            return(
                <tr key={index}>
                <td align="center">{this.state.page >1 ? index+1 + (this.state.dataPerhalaman*(this.state.page -1)) : index+1}</td>
                <td align="center">{val.id}</td>
                <td align="center">{val.name}</td>
                <td align="center">{val.system}</td>
                <td align="center">{val.status ? "Aktif" : "Tidak Aktif"}</td>
                <td align="center">
                    
                    {checkPermission('Role_Edit') &&
                      <Link to={`/editrole/${val.id}`} className="mr-2">
                      <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                      </Link>
                    }
                    <Link to={`/detailrole/${val.id}`} >
                         <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                    </Link>
                </td>
        </tr>  
            )
                   
        })
                     
        return jsx;

    }
    render(){
        
        if(cookie.get('token')){
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">Role - List</h2> 
                             <div style={{color:"red"}}>
                                {this.state.errMessage} 
                             </div>
                        </div>
                    </div>
                   <hr/>
                   <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">ID Role</th>
                            <th className="text-center" scope="col">Nama Role</th>
                            <th className="text-center" scope="col">Sistem</th>
                            <th className="text-center" scope="col">Status</th>
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

export default RoleList;