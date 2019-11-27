import React from 'react';
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Moment from 'react-moment'
import Pagination from 'rc-pagination';
import './../../support/css/pagination.css'
import localeInfo from 'rc-pagination/lib/locale/id_ID'
import { getToken } from '../index/token';
import { getAllPermintaanPinjamanFunction } from './saga';
import { checkPermission } from '../global/globalFunction';
import SearchBar from './../subComponent/SearchBar'

class PermintaanPinjaman extends React.Component {
  state = {
    rows: [],detailNasabah:{}, searchRows:'',
    page: 1,
    rowsPerPage: 10,
    isEdit: false,
    editIndex:Number,
    udahdiklik : false,
    totalData:0,
    last_page:1,
    loading:true,
    BankName:'',serviceName:'',productName:'',
    errorMessage:''
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
    if(data){
      console.log(data)
      if(!data.error){
        this.setState({loading:false,
          rows:data.data.data, 
          rowsPerPage:data.data.rows,
          totalData:data.data.total_data,
          last_page:data.data.last_page,
          page:data.data.current_page})
      }else{
        this.setState({errorMessage:data.error})
      }
    }
  }



  onBtnSearch = (e)=>{
      this.setState({loading:true,searchRows:e.target.value,page:1},()=>{
      this.getAllData()
    })
  }


  onChangePage = (current, pageSize) => {
    this.setState({loading:true,page:current},()=>{
      this.getAllData()
    })
  }


  renderJSX = ()=>{
    if (this.state.loading){
      return  (
        <tr>
          <td align="center" colSpan={10}>
                <Loader 
            type="Circles"
            color="#00BFFF"
            height="40"	
            width="40"
        />   
          </td>
        </tr>
      )
  }else{
    if(this.state.rows.length===0){
      return(
        <tr>
           <td align="center" colSpan={10}>Data empty</td>
        </tr>
      )
    }else{
      var jsx = this.state.rows.map((val,index)=>{
        return (
            <tr key={index}>
              <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
              <td align="center">{val.id}</td>
              <td align="center">{val.owner_name}</td>
              <td align="center"> {val.bank_name} </td>
              <td align="center"> {val.category ==="account_executive"?"Account Executive" :val.category === "agent"?"Agent":"Personal"} </td>
              <td align="center"> {val.product.toString()} </td>
              <td align="center"> {val.product} </td>
              <td align="center"><Moment date={val.created_time} format=" DD  MMMM  YYYY" /></td>
              <td align="center" style={val.status==="approved"?{color:"green"}:val.status==="rejected"?{color:"red"}:{color:"blue"}}>
                {val.status ==="approved"?"Diterima":val.status==="rejected"?"Ditolak":"Dalam Proses"}</td>
              <td align="center">
            
                {   checkPermission('core_loan_get_details') &&
                      <Link style={{textDecoration:"none"}} to={`/permintaanpinjamanDetail/${val.id}/${val.owner.Int64}`}>
                      <i className="fas fa-eye" style={{color:"black",fontSize:"28px",marginRight:"10px"}}/>
                      </Link>
                }
                         
              </td>
            </tr>
        )
    })
     return jsx;
    }
  }
   
  }

  
    
  render() {
   if(getToken()){
    return (
        <div className="container">
        <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">Permintaan Pinjaman - List</h2>
                        </div>
                        <div className="col-4 mt-3 ml-5">
                        <div className="input-group">
                        <SearchBar 
                            onChange={this.onBtnSearch}
                            placeholder="Search Nama Nasabah, ID Nasabah.."
                            value={this.state.search}
                          />
                           
                        </div>
                        </div>
                    </div>
        <hr></hr>
          <table className="table table-hover">
          <thead className="table-warning" style={{fontWeight:'bold'}}>

              <tr>
                  <th className="text-center" scope="col">#</th>
                  <th className="text-center" scope="col">Id Pinjaman</th>
                  <th className="text-center" scope="col">Nama Nasabah</th>
                  <th className="text-center" scope="col">Bank Akun</th>
                  <th className="text-center" scope="col">Kategori</th>
                  <th className="text-center" scope="col">Layanan</th>
                  <th className="text-center" scope="col">Produk</th>
                  <th className="text-center" scope="col">Tanggal Pengajuan</th>
                  <th className="text-center" scope="col">Status Pinjaman</th>
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
                showLessItems
                current={this.state.page}
                />     
          </nav>
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
