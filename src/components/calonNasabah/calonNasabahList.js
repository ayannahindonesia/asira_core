import React from 'react'
import { Redirect } from 'react-router-dom'
import {getAllBorrowerFunction} from './saga'
import { checkPermission, handleFormatDate } from '../global/globalFunction';
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
        id: 'fullname',
        numeric: false,
        label: 'Nama Nasabah',
    },
    {
        id: 'category',
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
            search: '',
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
        param.fullname = this.state.search;
        param.category = this.state.search;

        param.rows = this.state.rowsPerPage;
        param.page = this.state.page;

        const data = await getAllBorrowerFunction(param);

        if(data) {
            if(!data.error) {
                console.log(data)
                const dataListUser = data.dataUser || [];

                if(dataListUser.length !== 0) {
                    for(const key in dataListUser) {
                        dataListUser[key].created_time = dataListUser[key].created_time && handleFormatDate(dataListUser[key].created_time)
                        dataListUser[key].category = this.isCategoryExist(dataListUser[key].category) 
                        dataListUser[key].bank_name = dataListUser[key].agent_provider_name && dataListUser[key].agent_provider_name.length !== 0 ? dataListUser[key].agent_provider_name : dataListUser[key].bank_name
                    }
                }

                this.setState({
                    errorMessage:'',
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

    isCategoryExist = (category) => {
        if(category && category.toString().toLowerCase() === 'agent') {
          return 'Agen'
        } else if(category && category.toString().toLowerCase() === 'account_executive') {
          return 'Account Executive'
        } 
  
        return 'Personal';
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
                                value={this.state.search}
                                placeholder="Search Nama Nasabah, Kategori"
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
                        permissionDetail={ checkPermission('core_borrower_get_details') ? '/detailCalonNasabah/' : null}
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