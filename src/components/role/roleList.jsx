import React from 'react'
import { Redirect } from 'react-router-dom'
import {ListRoleFunction} from './saga'
import {checkPermission} from './../global/globalFunction'
import { getToken } from '../index/token';
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
    {
        id: 'id',
        numeric: false,
        label: 'ID Role',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Nama Role',
    },
    {
        id: 'system',
        numeric: false,
        label: 'Sistem',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status Pembiayaan',
    }

]
class RoleList extends React.Component{
    _isMounted = false;
    state={
        loading:true,rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,paging:true,
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
        const dataRole = data.data && data.data.data
        for (const key in dataRole){
            dataRole[key].status = dataRole[key].status ==='active'?"Aktif":"Tidak Aktif"
        }
        if(data){
            if(!data.error){
                this.setState({loading:false,
                    rows:data.data.data,
                    total_data:data.data.total_data,
                    page:data.data.current_page,
                    from:data.data.from,
                    to:data.data.to,
                    last_page:data.data.last_page,
                    rowsPerPage:data.data.rows,
                    errorMessage:''})
            }else{
                this.setState({loading:false,errorMessage:data.error})
            }
        }
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
            if(this.state.paging){
                this.getAllRole()
            }
        })
    }
    
    render(){
        if(getToken())
        {
            return(
                <div style={{padding:0}}>
                   < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        title={'Role - List'}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.rows}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.total_data}
                        onChangePage={this.onChangePage}    
                        permissionAdd={ checkPermission('core_role_new') ? '/roleAdd/' : null}         
                        permissionEdit={ checkPermission('core_role_patch') ? '/roleEdit/' : null}
                        permissionDetail={ checkPermission('core_role_details') ? '/roleDetail/' : null}

                    /> 
                  
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