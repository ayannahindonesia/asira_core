import React from 'react';
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Moment from 'react-moment'
import './../../support/css/pagination.css'
import { getToken } from '../index/token';
import { getAllPermintaanPinjamanFunction } from './saga';
import { checkPermission } from '../global/globalFunction';
import SearchBar from './../subComponent/SearchBar'
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
      {
        id: 'id',
        numeric: false,
        label: 'ID Pinjaman',
      },
      {
        id: 'borrower_name',
        numeric: false,
        label: 'Nama Nasabah',
      },
      {
        id: 'bank_name',
        numeric: false,
        label: 'Nama Bank',
      },
      {
        id: 'category',
        numeric: false,
        label: 'Kategori',
      },
      {
        id: 'service',
        numeric: false,
        label: 'Layanan',
      },
      {
        id: 'product',
        numeric: false,
        label: 'Produk',
      },
      {
        id: 'created_time',
        numeric: false,
        label: 'Tanggal Pengajuan',
      },
      {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
]
class PermintaanPinjaman extends React.Component {
  state = {
    rows: [],detailNasabah:{}, searchRows:'',
    page: 1,
    rowsPerPage: 10,
    isEdit: false,
    editIndex:Number,
    udahdiklik : false,
    total_data:0,
    last_page:1,
    loading:true,
    BankName:'',serviceName:'',productName:'',
    errorMessage:'',paging:true
  };

  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  _isMounted=false
  componentDidMount(){
    this.getAllData()
    this._isMounted=true
  }
  componentWillUnmount(){
    this._isMounted=false
  }

  getAllData = async function(){
    const param ={
      rows:10,
      page:this.state.page
    }

    let hasil = this.state.searchRows;

    if(hasil){
      param.search_all = hasil
    }

    const data = await getAllPermintaanPinjamanFunction(param)
    const pinjamanList = data.pinjamanList && data.pinjamanList.data

    for (const key in pinjamanList){
      pinjamanList[key].category = pinjamanList[key].category==="account_executive"?"Account Executive" :pinjamanList[key].category === "agent"?"Agent":"Personal"
      pinjamanList[key].status = pinjamanList[key].status ==="approved"?"Diterima": pinjamanList[key].status==="rejected"?"Ditolak":"Dalam Proses"
      pinjamanList[key].service =  pinjamanList[key].service.toString()
      pinjamanList[key].product =  pinjamanList[key].product.toString()
      pinjamanList[key].created_time =<Moment date={pinjamanList[key].created_time } format=" DD  MMMM  YYYY" />
    }
    if(data){
      if(!data.error){
        this.setState({loading:false,
          rows:data.pinjamanList.data, 
          rowsPerPage:data.pinjamanList.rows,
          total_data:data.pinjamanList.total_data,
          last_page:data.pinjamanList.last_page,
          page:data.pinjamanList.current_page})
      }else{
        this.setState({errorMessage:data.error})
      }
    }
  }



  onBtnSearch = (e)=>{
      this.setState({loading:true,searchRows:e.target.value,page:1},()=>{
        if(this.state.paging){
          this.getAllData()

        }
    })
  }


  onChangePage = (current, pageSize) => {
    this.setState({loading:true,page:current},()=>{
      if(this.state.paging){
        this.getAllData()

      }
    })
  }

  render() {
   if(getToken()){
    return (
        <div className="container">
        <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">Pinjaman - List</h2>
                        </div>
                        <div className="col-4 mt-3 ml-5">
                        <div className="input-group">
                          <SearchBar 
                            onChange={this.onBtnSearch}
                            placeholder="Search Nama Nasabah, ID Pinjaman.."
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
                        permissionDetail={ checkPermission('core_loan_get_details') ? '/permintaanpinjamanDetail/' : null}

                    /> 
        
        </div>
      

    );
  
  

}
    else if(getToken()){
      return  <Redirect to='/login' />
    }
    
  }
}

const mapStateToProp = (state)=>{
  return{
     
      role: state.user.role,
      id: state.user.id
     
  }
  
}
export default connect (mapStateToProp)(PermintaanPinjaman) ;
