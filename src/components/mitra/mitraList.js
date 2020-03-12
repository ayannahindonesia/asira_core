import React from 'react'
import { Redirect } from 'react-router-dom'
import {getAllMitraList} from './saga'
import { checkPermission } from '../global/globalFunction';
import 'rc-pagination/assets/index.css';
import './../../support/css/pagination.css'
import { getToken } from '../index/token';
import TableComponent from '../subComponent/TableComponent'


const columnDataUser = [
  {
      id: 'id',
      numeric: false,
      label: 'Mitra ID',
  },
  {
      id: 'name',
      numeric: false,
      label: 'Nama Mitra',
  },
  {
      id: 'pic',
      numeric: false,
      label: 'PIC',
  }
]

class MitraList extends React.Component{
  
    _isMounted=false;
    state={
        loading:true,
        paging:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,dataPerhalaman:5,
        search: '',
    }
    componentDidMount(){
      this._isMounted=true
        this.getAllBankData()
    }
    componentWillUnmount(){
      this._isMounted=false

    }

    getAllBankData = async function () {
        let param = { 
          page: this.state.page,
          rows:10
        }
        
        var hasil = this.state.search;

        if(hasil.toString().trim().length !== 0) {
          param.search_all = hasil
        }
        
        
        const data = await getAllMitraList(param)
        if(data){
          if(!data.error){
            this.setState({
              rows:data.mitraList.data,
              total_data:data.mitraList.total_data,
              page:data.mitraList.current_page,
              from:data.mitraList.from,
              to:data.mitraList.to,
              last_page:data.mitraList.last_page,
              dataPerhalaman:data.mitraList.rows,
              loading:false})
          }else{
              this.setState({errorMessage:data.error})
          }
        }
    }

    changeSearch = (e) => {
      this.setState({
          search: e.target.value,
      })
    }
  
    btnSearch = (e) => {
        this.setState({
            loading:true,
            page: 1,
        }, () => {
          if(this.state.paging){
            this.getAllBankData()
  
          }
        })
    }


    onChangePage = (current) => {
      
        this.setState({loading:true, page : current}, () => {
          if(this.state.paging){
            this.getAllBankData()
          }
        })
    }

 
    render(){
        if(getToken()){
            return(
              <div style={{padding:0}}>
                < TableComponent
                    id={"id"}
                    search={
                      {
                        value: this.state.search,
                        label: 'Search Nama Mitra, ID Mitra..',
                        onChange: this.changeSearch,
                        function: this.btnSearch,
                      }
                    }
                    title={'Mitra - List'}
                    paging={this.state.paging}
                    loading={this.state.loading}
                    columnData={columnDataUser}
                    data={this.state.rows}
                    page={this.state.page}
                    rowsPerPage={this.state.dataPerhalaman}
                    totalData={this.state.total_data}
                    onChangePage={this.onChangePage}     
                    permissionAdd={ checkPermission('core_bank_new') ? '/mitraAdd' : null }        
                    permissionDetail={ checkPermission('core_bank_detail') ? '/mitraDetail/' : null}
                    permissionEdit={ checkPermission('core_bank_patch') ? '/mitraEdit/' : null}

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

export default MitraList;