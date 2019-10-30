import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
// import SubTable from './../subComponent/SubTable'
import localeInfo from 'rc-pagination/lib/locale/id_ID'
import Pagination from 'rc-pagination';
import {getAllRoleFunction} from './saga'
import { checkPermission } from '../global/globalFunction';
import { getToken } from '../index/token'


// const columnDataRole = [
//     {
//         id: 'id',
//         numeric: 'true',
//         disablePadding: false,
//         label: 'Id Role Permission',
//     },
//     {
//         id: 'name',
//         numeric: 'false',
//         disablePadding: true,
//         label: 'Nama Role',
//     },
//     { id: 'status', numeric: 'false', disablePadding: true, label: 'Status' },
//     {
//         id: 'updated_time',
//         numeric: 'false',
//         disablePadding: false,
//         label: 'Update Date',
//         time: 'true',
//     },
// ]

class RolePermissionList extends React.Component{
    _isMounted = false;

    state = {
        loading:true, 
        listRole: [],
        page: 1,
        rowsPerPage: 10,
    }

    componentDidMount(){
        this._isMounted = true;
        this.refresh()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    refresh = async function(){
        const param = {};
        param.rowsPerPage = this.state.rowsPerPage;
        param.page = this.state.page;

        const data = await getAllRoleFunction(param);

        if(data) {
            
            if(!data.error) {
                const listRole = [];
                const dataRole = data.dataRole;

                for(const key in dataRole) {
                    if(dataRole[key].permissions && dataRole[key].permissions.length !== 0) {
                        listRole.push(dataRole[key])
                    }
                }

                
                this.setState({
                    listRole,
                    totalData: listRole.length,
                    loading: false,
                })
                

            } else {
                this.setState({
                    errorMessage: data.error,
                    loading: false,
                })
            }      
        }
    }

    renderJSX = () => {

        if (this.state.loading || !this.state.listRole){
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
        
        
        var jsx = this.state.listRole && this.state.listRole.map((val,index)=>{
            return(
                <tr key={index}>
                    <td align="center">{this.state.page >1 ? (index+1 + this.state.rowsPerPage*(this.state.page-1)) : index+1}</td>
                    <td align="center">{val.id}</td>
                    <td align="center">{val.name}</td>
                    <td align="center">{val.system}</td>
                    <td align="center">{val.status ? "Aktif" : "Tidak Aktif"}</td>
                    <td align="center">
                        {   checkPermission('core_permission_patch') && 
                            <Link to={`/editRolePermission/${val.id}`} className="mr-2">
                                <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                            </Link>
                        }
                        {   checkPermission('core_permission_detail') && 
                            <Link to={`/detailRolePermission/${val.id}`} >
                                <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                            </Link>
                        }
                    </td>
                </tr>  
            )
                   
        })
                     
        return jsx;

    }

    onChangePage = (current, pageSize) => {
        this.setState({
            loading:true,
            page:current,
        }, () => {
            this.refresh();
        })
    }
    


    render(){
        
        
        if(getToken()){
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">Role Permission - List</h2>
                        </div>
                        <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                            {this.state.errorMessage}
                        </div>   
                    </div>
                   <hr/>

                   {/* <SubTable
                        // headerTitle={'List Application'}
                        // search={this.state.flagAdd ? searchBar : null}
                        columnData={columnDataRole}
                        data={this.state.listRole}
                        idKey={'id'}
                        // onAddFunction={
                        //     // this.state.flagAdd ? this.handleAddApplication : null
                        // }
                        // onRowClickedFunction={this.handleViewApplication}
                    /> */}
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
                    <nav className="navbar" style={{float:"right"}}> 

                        <Pagination className="ant-pagination"  
                            showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                            total={this.state.totalData}
                            pageSize={this.state.rowsPerPage}
                            onChange={this.onChangePage}
                            locale={localeInfo}
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

export default RolePermissionList;