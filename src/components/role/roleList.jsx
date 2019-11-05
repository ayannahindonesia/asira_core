import React from 'react'
import { Redirect } from 'react-router-dom'
import {ListRoleFunction} from './saga'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {checkPermission} from './../global/globalFunction'
import { getToken } from '../index/token';
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import Pagination from 'rc-pagination';

class RoleList extends React.Component{
    _isMounted = false;
    state={
        loading:true,rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,dataPerhalaman:5,
        errorMessage:''
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
            page:this.state.page,
            rows:10
        };
        const data  = await ListRoleFunction(param)
        if(data){
            console.log(data)
            if(!data.error){
                this.setState({loading:false,
                    rows:data.data.data,
                    total_data:data.data.total_data,
                    page:data.data.current_page,
                    from:data.data.from,
                    to:data.data.to,
                    last_page:data.data.last_page,
                    dataPerhalaman:data.data.rows,
                    
                    errorMessage:''})
            }else{
                this.setState({loading:false,errorMessage:data.error})
            }
        }
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
          this.getAllRole()
        })
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
                <td align="center">{val.status==='active' ? "Aktif" : "Tidak Aktif"}</td>
                <td align="center">
                    {checkPermission('core_role_patch') &&
                      <Link to={`/editrole/${val.id}`} className="mr-2">
                      <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                      </Link>
                    }
                    {checkPermission('core_role_details') &&
                      <Link to={`/detailrole/${val.id}`} >
                      <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                      </Link>
                    }
                </td>
        </tr>  
            )
        })
        return jsx;
    }
    render(){
        if(getToken())
        {
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
                   <hr></hr>
                        <nav style={{float:"right",color:"black"}}> 
                            <Pagination 
                            className="ant-pagination"  
                            showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                            total={this.state.total_data}
                            pageSize={this.state.dataPerhalaman}
                            onChange={this.onChangePage}
                            locale={localeInfo}
                            current={this.state.page}
                            showLessItems
                            />
                        </nav>
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

export default RoleList;