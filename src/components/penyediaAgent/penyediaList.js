import React from 'react';
import Loader from 'react-loader-spinner'
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {Link} from 'react-router-dom'
import Pagination from 'rc-pagination';
import './../../support/css/pagination.css'
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import { getToken } from '../index/token';
import { checkPermission } from '../global/globalFunction';
import { getPenyediaAgentListFunction } from './saga';
import SearchBar from './../subComponent/SearchBar'

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

      const data = await getPenyediaAgentListFunction(param)

      if(data){
        console.log(data)
        if(!data.error){
          this.setState({loading:false,rows:data.dataListAgent.data,
            rowsPerPage:data.dataListAgent.rows,
            jumlahBaris:null,totalData:data.dataListAgent.total_data,
            last_page:data.dataListAgent.last_page,page:data.dataListAgent.current_page})
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
            <td align="center">{val.name}</td>
            <td align="center">{val.status ==="inactive"?"Tidak Aktif":"Aktif"}
            </td>
            <td align="center">
            {checkPermission('core_agent_provider_patch') &&
                <Link style={{textDecoration:"none"}} to={`/penyediaEdit/${val.id}`}>
                <i className="fas fa-edit" style={{color:"black",fontSize:"28px",marginRight:"10px"}}/>
                </Link>
            }
            {checkPermission('core_agent_provider_details') &&
                <Link style={{textDecoration:"none"}} to={`/penyediaDetail/${val.id}`}>
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
                             <h2 className="mt-3">Penyedia Agen - List</h2>
                        </div>
                        <div className="col-5 mt-3 ml-5">
                        <div className="input-group">
                        <SearchBar 
                            onChange={this.onBtnSearch}
                            placeholder="Search Nama Penyedia Agen dan Status.."
                            value={this.state.search}
                          />
                        
                        </div>
                        </div>
          </div>
        <hr></hr>
          <table className="table table-hover">
          <thead className="table-warning">
              <tr>
                  <th className="text-center" scope="col">#</th>
                  <th className="text-center" scope="col">Id Penyedia Agen</th>
                  <th className="text-center" scope="col">Nama Penyedia Agen</th>
                  <th  className="text-center" scope="col">Status</th>
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
                showLessItems
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