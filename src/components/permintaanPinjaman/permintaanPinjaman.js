import React from 'react';
import axios from 'axios'
import {connect } from 'react-redux'
import Cookie from 'universal-cookie'
import { Redirect } from 'react-router-dom'
import {serverUrlBorrower} from '../url'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import QueryString from 'query-string'
import Moment from 'react-moment'
import Pagination from 'rc-pagination';
import './../../support/css/pagination.css'
import localeInfo from 'rc-pagination/lib/locale/id_ID'

const kukie = new Cookie()

var config = {headers: {'Authorization': "Bearer " + kukie.get('token')}};

class PermintaanPinjaman extends React.Component {
  state = {
    rows: [],detailNasabah:{}, searchRows:null,
    page: 1,
    rowsPerPage: 10,
    isEdit: false,
    editIndex:Number,
    udahdiklik : false,
    totalData:0,
    last_page:1,
    loading:true,
    BankName:'',serviceName:'',productName:'',
    halamanConfig:`orderby=id&sort=ASC&rows=10`
    
  };

  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  
  componentDidMount(){
    this.getAllData()
  }

  getAllData = ()=>{
    config = {headers: {'Authorization': "Bearer " + kukie.get('token')}};
      var newLink =`admin/loan`
      if (this.props.location.search){
        var hasil = this.getLink()
        if(!isNaN(hasil)){
          newLink += `?id=${hasil}`+this.state.halamanConfig
        }else{
          newLink += `?owner_name=${hasil}`+this.state.halamanConfig
        }
      }else{
        newLink += `?`+this.state.halamanConfig
      }
      axios.get(serverUrlBorrower+newLink,config)
      .then((res)=>{
          this.setState({loading:false,
            rows:res.data.data, 
            rowsPerPage:res.data.rows,
            totalData:res.data.total_data,
            last_page:res.data.last_page,
            page:res.data.current_page})
      })
      .catch((err)=>{
          console.log(err)
      })

  }
  getLink = ()=>{
    var obj = QueryString.parse(this.props.location.search)
   return obj.query 
  }
  pushUrl = ()=>{
    var newLink ='/permintaanpinjaman/search'
    var params =[]
    //categoryDropdown,search
    if(this.refs.search.value){
        params.push({
            params:'query',
            value:this.refs.search.value
        })
    }
    

    for (var i=0;i<params.length;i++){
        if(i===0){
            newLink += '?'+params[i].params+ '='+ params[i].value
        }else{
            newLink += '&'+params[i].params+ '='+ params[i].value
        }
    }
    this.props.history.push(newLink)
}



  onBtnSearch = ()=>{
    this.pushUrl()
    var searching = this.refs.search.value
    this.setState({loading:true,searchRows:searching})
  
    var newLink =``
    if(searching){
      //search function
      if(!isNaN(searching)){
        newLink +=`admin/loan?id=${searching}&${this.state.halamanConfig}`
      }else{
        newLink +=`admin/loan?owner_name=${searching}&${this.state.halamanConfig}`
      }
  
    }else{
      newLink+=`admin/loan?${this.state.halamanConfig}`
    
    }  
    axios.get(serverUrlBorrower+newLink,config)
    .then((res)=>{
        this.setState({loading:false,rows:res.data.data,searchRows:null, rowsPerPage:res.data.rows,
            totalData:res.data.total_data})
    })
    .catch((err)=>{
        console.log(err)
    })
  }


  onChangePage = (current, pageSize) => {
    this.setState({loading:true})
    console.log('onChange:current=', current);
    console.log('onChange:pageSize=', pageSize);
    var searching = this.refs.search.value
    var newLink =``

    if(searching){
      //search function
      if(!isNaN(searching)){
        newLink +=`admin/loan?id=${searching}&${this.state.halamanConfig}&page=${current}`
      }else{
        newLink +=`admin/loan?owner_name=${searching}&${this.state.halamanConfig}&page=${current}`
      }
  
    }else{
      newLink+=`admin/loan?${this.state.halamanConfig}&page=${current}`
    
    }  
    axios.get(serverUrlBorrower+newLink,config)
    .then((res)=>{
        console.log(res.data)
        this.setState({loading:false,rows:res.data.data,dataPerhalaman:res.data.rows,page:current, rowsPerPage:res.data.rows,
          totalData:res.data.total_data})
    })
    .catch((err)=>{
        console.log(err)
    })
  }


  renderJSX = ()=>{
    if (this.state.loading){
      return  (
        <tr>
          <td align="center" colSpan={9}>
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
           <td align="center" colSpan={9}>Data empty</td>
        </tr>
      )
    }else{
      var jsx = this.state.rows.map((val,index)=>{
        return (
            <tr key={index}>
              <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
              <td align="center">{val.id}</td>
              <td align="center">{val.borrower_info.fullname}</td>
              {/* <td align="center"> {val.borrower_info.bank.Int64} </td>
              <td align="center"> {val.service} </td>
              <td align="center"> {val.product} </td> */}
              <td align="center"><Moment date={val.created_time} format=" DD  MMMM  YYYY" /></td>
              <td align="center">{val.status ==="approved"?"Diterima":val.status==="rejected"?"Ditolak":"Diproses"}</td>
              <td align="center">
              <Link style={{textDecoration:"none"}} to={`/permintaanpinjamanDetail/${val.id}/${val.owner.Int64}`}>
              <i className="fas fa-eye" style={{color:"black",fontSize:"28px",marginRight:"10px"}}/>
              </Link>
              </td>
            </tr>
        )
    })
     return jsx;
    }
  }
   
  }

  
    
  render() {
   
  
if(kukie.get("token")){
      
    return (
        <div className="container">
        <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">Permintaan Pinjaman</h2>
                        </div>
                        <div className="col-4 mt-3 ml-5">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="search" placeholder="Search Bank.." />
                            <span className="input-group-addon ml-2" style={{border:"1px solid grey",width:"35px",height:"35px",paddingTop:"2px",borderRadius:"4px",paddingLeft:"2px",marginTop:"6px",cursor:"pointer"}} onClick={this.onBtnSearch}> 
                            <i className="fas fa-search" style={{fontSize:"28px"}} ></i></span>
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
                  {/* <th className="text-center" scope="col">Bank Akun</th>
                  <th className="text-center" scope="col">Layanan</th>
                  <th className="text-center" scope="col">Produk</th> */}
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
                />     
          </nav>
        </div>
      

    );
  
  

}else if (!kukie.get("token")){
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
