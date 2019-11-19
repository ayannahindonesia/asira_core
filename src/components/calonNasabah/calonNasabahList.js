import React from 'react'
import { Redirect } from 'react-router-dom'
import {getAllUserFunction} from './saga'
import { checkPermission, handleFormatDate } from '../global/globalFunction';
import { getAllRoleFunction } from '../rolePermission/saga';
import { getToken } from '../index/token'
import TableComponent from '../subComponent/TableComponent'
import SearchBar from '../subComponent/SearchBar';


const columnDataUser = [
    {
        id: 'id',
        numeric: false,
        label: 'ID Nasabah',
    },
    {
        id: 'username',
        numeric: false,
        label: 'Nama Nasabah',
    },
    {
        id: 'role',
        numeric: false,
        label: 'Kategori',
    },
    {
        id: 'bank_name',
        numeric: false,
        label: 'Bank Akun',
    },
    { id: 'created_time', numeric: false, label: 'Tanggal Registrasi'},
]

class CalonNasabahList extends React.Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            paging:true,
            loading:true, 
            listUser: [],
            page: 1,
            rowsPerPage: 10,
            totalData: 0,
        }
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

        const data = await getAllUserFunction(param, getAllRoleFunction);

        if(data) {
            if(!data.error) {
                const dataListUser = data.dataUser || [];

                if(dataListUser.length !== 0) {
                    for(const key in dataListUser) {
                        dataListUser[key].created_time = dataListUser[key].created_time && handleFormatDate(dataListUser[key].created_time)
                    }
                }

                this.setState({
                    listUser: dataListUser,
                    totalData: data.totalData,
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

    findRole = (roleUser, dataRole) => {
        let role = '';
        for(const keyRole in roleUser) {
            for(const key in dataRole) {
                if(dataRole[key].id === roleUser[keyRole]) {
                    if(role.trim().length !== 0) {
                        role += ', ';
                    }
                    role += `${dataRole[key].name} (${dataRole[key].system})`;
                }
            }
        }
        
        return role;
    }

    onChangePage = (current) => {
        this.setState({
            loading:true,
            page:current,
        }, () => {
            if(this.state.paging) {
                this.refresh()
            };
        })
    }

    changeSearch = (e) => {
        this.setState({
            loading:true,
            page: 1,
            search: e.target.value,
        }, () => {
            this.refresh();
        })
    }
    


    render(){

        if(getToken()){
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mt-3">Calon Nasabah - List</h2>
                        </div>
                        <div className="col-8" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                            {this.state.errorMessage}
                        </div>  
                        <div className="col-4">
                            <SearchBar
                                id="search"
                                hiddenLabel
                                value={this.state.search}
                                placeholder="Search"
                                onChange={this.changeSearch} 
                            />
                        </div>  
                    </div>
                   <hr/>

                   < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.listUser}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.totalData}
                        onChangePage={this.onChangePage}             
                        permissionDetail={ checkPermission('core_user_details') ? '/detailCalonNasabah/' : null}
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

export default CalonNasabahList;