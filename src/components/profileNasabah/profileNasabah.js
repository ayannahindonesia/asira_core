import React from 'react';
import Moment from 'react-moment';
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import './../../support/css/pagination.css'
import { getProfileNasabahFunction } from './saga';
import { getToken } from '../index/token';
import { checkPermission } from '../global/globalFunction';
import SearchBar from './../subComponent/SearchBar'
import TableComponent from './../subComponent/TableComponent'

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
    id: 'created_time',
    numeric: false,
    label: 'Tanggal Registrasi',
  },
  {
    id: 'loan_status',
    numeric: false,
    label: 'Status Nasabah',
  },
]

class profileNasabah extends React.Component {
  state = {
    rows: [], searchRows:'',
    page: 1,
    rowsPerPage: 5,
    isEdit: false,
    editIndex:Number,
    totalData:0,
    last_page:1,
    loading:true,
    bankID:0,bankName:'',
    paging:true
  
  };

  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  
  _isMounted = false
  componentDidMount(){
    this.getAllData()
    this._isMounted = true
  }
  componentWillUnmount(){
    this._isMounted = false
  }

  //Ambil data pertama kali
  getAllData = async function(){
      const param ={
        rows:10,
        page:this.state.page
      }
      let hasil = this.state.searchRows
      if (hasil){
        param.search_all = hasil
      }

      const data = await getProfileNasabahFunction(param)
      console.log(data.listNasabah.data)
      
      if(data){

        if(!data.error){
          const dataNasabah = data.listNasabah.data;
          console.log(dataNasabah)

          for (const key in dataNasabah){
             dataNasabah[key].category = dataNasabah[key].category && dataNasabah[key].category==="account_executive"?"Account Executive" :dataNasabah[key].category === "agent"?"Agent":"Personal"
             dataNasabah[key].loan_status = dataNasabah[key].loan_status && dataNasabah[key].loan_status==="active"?"Aktif" :"Tidak Aktif"
             dataNasabah[key].created_time =   <Moment date={dataNasabah[key].created_time } format=" DD  MMMM  YYYY" />

          }

          this.setState({loading:false,rows:dataNasabah,rowsPerPage:data.listNasabah.rows,total_data:data.listNasabah.total_data,last_page:data.listNasabah.last_page,page:data.listNasabah.current_page})
        }else{
          this.setState({errorMessage:data.error})
        }
      } 
  }

  onBtnSearch = (e)=>{
    var searching = e.target.value
    this.setState({loading:true,searchRows:searching,page:1},()=>{
      if (this.state.paging){
        this.getAllData()
      }
    })
  
  }

 onChangePage = (current) => {
  this.setState({loading:true,page:current},()=>{
    if (this.state.paging){
      this.getAllData()
    }
  })
}
  

  render() {
   
if(getToken()){
    return (
        <div className="container">
         <div className="row">
                        <div className="col-6">
                             <h2 className="mt-3">Nasabah - List</h2>
                        </div>
                        <div className="col-5 mt-3 ml-5">
                        <div className="input-group">
                        <SearchBar 
                            onChange={this.onBtnSearch}
                            placeholder="Search Nama Nasabah, ID Nasabah.."
                            value={this.state.searchRows}
                          />
                           
                        </div>
                        </div>
          </div>
        <hr></hr>
                     < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.rows}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.total_data}
                        onChangePage={this.onChangePage}             
                        permissionDetail={ checkPermission('core_borrower_get_details') ? '/profileNasabahDetail/' : null}

                    /> 
         
        </div>
    );

}
    else if(!getToken()){
      return  <Redirect to='/login' />
    }
    
  }
}


const mapStateToProp = (state)=>{
  return{     
      id: state.user.id
  }
  
}
export default connect (mapStateToProp)(profileNasabah) ;