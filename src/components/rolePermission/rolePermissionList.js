import React from 'react'
import { Redirect } from 'react-router-dom'
import TableComponent from '../subComponent/TableComponent'
import {getAllRoleFunction} from './saga'
import { checkPermission } from '../global/globalFunction';
import { getToken } from '../index/token'


const columnDataRole = [
    {
        id: 'id',
        numeric: false,
        label: 'Id Role Permission',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Nama Role',
    },
    { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
]

class RolePermissionList extends React.Component{
    _isMounted = false;

    state = {
        loading:true, 
        listRole: [],
        page: 1,
        paging: false,
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
        param.rows = this.state.rowsPerPage;
        param.page = this.state.page;

        const data = await getAllRoleFunction(param);

        if(data) {
            
            if(!data.error) {
                const listRole = [];
                const dataRole = data.dataRole;

                for(const key in dataRole) {
                    if(dataRole[key].permissions && dataRole[key].permissions.length !== 0) {
                        const role = dataRole[key]
                        role.status = role.status.toString().toLowerCase() === 'active' ? 'Aktif' : 'Tidak Aktif'
                        listRole.push(role)
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

    onChangePage = (current) => {
        this.setState({
            loading:this.state.paging ? true : false,
            page:current,
        }, () => {
            if(this.state.paging) {
                this.refresh();
            }
        })
    }
    


    render(){
        
        
        if(getToken()){
            return(
                <div style={{padding:0}}>

                   < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        title={'Permission - List'}
                        loading={this.state.loading}
                        columnData={columnDataRole}
                        data={this.state.listRole}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.totalData}
                        onChangePage={this.onChangePage}    
                        permissionAdd={ checkPermission('core_permission_new') ? '/permissionAdd/' : null}     
                        permissionDetail={ checkPermission('core_permission_detail') ? '/permissionDetail/' : null}
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

export default RolePermissionList;