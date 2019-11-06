import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {getAllBankList} from './saga'
import { checkPermission } from '../global/globalFunction';
import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination';
import './../../support/css/pagination.css'
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import { getToken } from '../index/token';

class BankList extends React.Component{
    _isMounted=false;
    state={
        loading:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,dataPerhalaman:5,
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
          if(!isNaN(hasil)){
              param.id = hasil
          }else{
              param.name = hasil
          }
        }
        
        
        const data = await getAllBankList(param)
        if(data){
          if(!data.error){
            this.setState({
              rows:data.data.data,
              total_data:data.data.total_data,
              page:data.data.current_page,
              from:data.data.from,
              to:data.data.to,
              last_page:data.data.last_page,
              dataPerhalaman:data.data.rows,
              loading:false})
          }else{
              this.setState({errorMessage:data.error})
          }
        }
    }

    onBtnSearch = ()=>{
      this.setState({loading : true, page:1},()=>{
        this.getAllBankData()
      })
    }

    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
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
            if(this.state.rows.length===0){
                return(
                  <tr>
                     <td align="center" colSpan={6}>Data empty</td>
                  </tr>
                )
              }else{
                var jsx = this.state.rows.map((val,index)=>{
                    return(
                        <tr key={index}>
                        <td align="center">{this.state.page >1 ? index+1 + (this.state.dataPerhalaman*(this.state.page -1)) : index+1}</td>
                        <td align="center">{val.id}</td>
                        <td align="center">{val.name}</td>
                        {/* <td align="center">{val.type}</td> */}
                        <td align="center">{val.pic}</td>
                        <td align="center">
                          {   checkPermission('core_bank_patch') &&
                              <Link to={`/bankedit/${val.id}`} className="mr-2">
                                  <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                              </Link>
                          }
                          {   checkPermission('core_bank_detail') &&
                              <Link to={`/bankdetail/${val.id}`} >
                              <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
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

    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
          this.getAllBankData()
        })
    }

    changeSearch = (e) => {
      console.log(e.target.value)
      this.setState({search: e.target.value})
    }
 
    render(){
        if(getToken()){
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">List - Bank</h2>
                        </div>
                        <div className="col-4 mt-3 ml-5">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="search" placeholder="Search Bank.."  onChange={this.changeSearch} value={this.state.search}/>
                            <span className="input-group-addon ml-2" style={{border:"1px solid grey",width:"35px",height:"35px",paddingTop:"2px",borderRadius:"4px",paddingLeft:"2px",marginTop:"6px",cursor:"pointer"}} onClick={this.onBtnSearch}> 
                            <i className="fas fa-search" style={{fontSize:"28px"}} ></i></span>
                        </div>
                        </div>
                    </div>
                   <hr/>
                   <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">Bank ID</th>
                            <th className="text-center" scope="col">Bank Name</th>
                            {/* <th className="text-center" scope="col">Bank Type</th> */}
                            <th className="text-center" scope="col">PIC</th>
                            <th className="text-center" scope="col">Action</th>
                        </tr>     
                    </thead>
                       <tbody>
                          {this.renderJSX()}
                       </tbody>
                   </table>
                   <hr/>
                <nav style={{float:"right",color:"black"}}> 

            <Pagination 
                className="ant-pagination"  
                showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                total={this.state.total_data}
                pageSize={this.state.dataPerhalaman}
                onChange={this.onChangePage}
                locale={localeInfo}
                current={this.state.page}
                showLessItems
            />
                </nav>
               
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

export default BankList;