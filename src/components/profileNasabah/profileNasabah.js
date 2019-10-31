import React from 'react';
import Loader from 'react-loader-spinner'
import Moment from 'react-moment';
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {Link} from 'react-router-dom'
import Pagination from 'rc-pagination';
import './../../support/css/pagination.css'
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import { getProfileNasabahFunction } from './saga';
import { getToken } from '../index/token';
import { checkPermission } from '../global/globalFunction';

class profileNasabah extends React.Component {
  state = {
    rows: [], searchRows:null,
    page: 1,
    rowsPerPage: 5,
    isEdit: false,
    editIndex:Number,
    totalData:0,
    last_page:1,
    loading:true,
    bankID:0,bankName:'',
  
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
        if(!isNaN(hasil)){
          param.id = hasil
        }else{
          param.fullname = hasil
        }
      }

      const data = await getProfileNasabahFunction(param)

      if(data){
        if(!data.error){
          this.setState({loading:false,rows:data.data.data,rowsPerPage:data.data.rows,jumlahBaris:null,totalData:data.data.total_data,last_page:data.data.last_page,page:data.data.current_page})
        }else{
          this.setState({errorMessage:data.error})
        }
      }
  }

  onBtnSearch = ()=>{
    
    var searching = this.refs.search.value
    this.setState({loading:true,searchRows:searching,page:1},()=>{
        this.getAllData()
    })
  
  }

 
 
 // rpp =5
 // p = 3
 // index = 11

 onChangePage = (current) => {
  this.setState({loading:true,page:current},()=>{
    this.getAllData()
  })
}
  
  renderJSX = ()=>{
    if (this.state.loading){
      return  (
        <tr>
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
      
      
   
  }else{
    if (this.state.rows.length===0){
      return(
        <tr>
          <td align="center" colSpan={6}>Data empty</td>
        </tr>
      )
    }else{
      var jsx = this.state.rows.map((val,index)=>{
        return (
        <tr key={index}>
            <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
            <td align="center">{val.id}</td>
            <td align="center">{val.fullname}</td>
            {/* <td align="center">{this.getBankName(val.bank.Int64)}</td>             */}
            <td align="center"><Moment date={val.created_time} format=" DD  MMMM  YYYY" /></td>
            {/* <TableCell align="center">{val.status}</TableCell> */}
            <td align="center">

            {   checkPermission('core_borrower_get_details') &&
                      <Link style={{textDecoration:"none"}} to={`/profileNasabahDetail/${val.id}`}>
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
                        <div className="col-6">
                             <h2 className="mt-3">Nasabah - List</h2>
                        </div>
                        <div className="col-5 mt-3 ml-5">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="search" placeholder="Search.." style={{width:"150px"}} />
                            <span className="input-group-addon ml-2" style={{border:"1px solid grey",width:"35px",height:"35px",paddingTop:"2px",borderRadius:"4px",paddingLeft:"2px",marginTop:"6px",cursor:"pointer"}} onClick={this.onBtnSearch}> 
                            <i className="fas fa-search" style={{fontSize:"28px"}} ></i></span>
                        </div>
                        </div>
          </div>
        <hr></hr>
          <table className="table table-hover">
          <thead className="table-warning">
              <tr>
                  <th className="text-center" scope="col">#</th>
                  <th className="text-center" scope="col">Id Nasabah</th>
                  <th className="text-center" scope="col">Nama Nasabah</th>
                  {/* <th className="text-center" scope="col">Bank Akun</th> */}
                  <th  className="text-center" scope="col">Tanggal Registrasi</th>
                  {/* <TableCell align="center">Status Nasabah</TableCell> */}
                  <th  className="text-center" scope="col">Action</th>
                 
              </tr>     
          </thead>
          <tbody>
            {this.renderJSX()}
          </tbody>  
          </table>
                <hr/>
          <nav className="navbar" style={{float:"right"}}> 
                <Pagination className="ant-pagination"  
                showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                total={this.state.totalData}
                pageSize={this.state.rowsPerPage}
                onChange={this.onChangePage}
                locale={localeInfo}
                current={this.state.page}
                />     
          </nav>
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