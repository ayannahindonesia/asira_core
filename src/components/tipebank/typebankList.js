import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {ListTipeBankFunction} from './saga'
import { checkPermission } from '../global/globalFunction';
import { getToken } from '../index/token';
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import Pagination from 'rc-pagination';

class TambahBankList extends React.Component{
    _isMounted = false;

    state={
        loading:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,dataPerhalaman:5,
    }
    componentDidMount (){
        this._isMounted = true;
        this.getAllList()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    getAllList = async function () {
        const param = {
            page:this.state.page,
            rows:10
        };
        const data  = await ListTipeBankFunction(param)
        if(data){
            if(!data.error){
                this.setState({loading:false,
                    rows:data.listBankType.data,
                    total_data:data.listBankType.total_data,
                    page:data.listBankType.current_page,
                    from:data.listBankType.from,
                    to:data.listBankType.to,
                    last_page:data.listBankType.last_page,
                    dataPerhalaman:data.listBankType.rows,
                })
            }else{
                this.setState({loading:false,errorMessage:data.error})
            }
        }
        
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
          this.getAllList()
        })
    }
  
    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
                <td align="center" colSpan={4}>
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
                     <td align="center" colSpan={4}>Data empty</td>
                  </tr>
                )
              }else{
                var jsx = this.state.rows.map((val,index)=>{
                  return (
                      <tr key={index}>
                        <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
                        <td align="center">{val.id}</td>
                        <td align="center">{val.name}</td>
                         
                        <td align="center">
                        {   checkPermission('core_bank_type_patch') &&
                           <Link to={`/banktypeedit/${val.id}`} className="mr-2">
                           <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                           </Link>
                        }
                        {   checkPermission('core_bank_type_detail') &&
                           <Link to={`/banktypedetail/${val.id}`} >
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

    render(){
        if(getToken()){
            return(
                <div className="container">
                   <h2 className="mt-3">Tipe Bank - List</h2>
                   <hr/>
                   <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">Id Tipe Bank</th>
                            <th className="text-center" scope="col">Nama Tipe Bank</th>
                            <th className="text-center" scope="col">Action</th>  
                        </tr>     
                    </thead>
                       <tbody>
                          {this.renderJSX()}

                       </tbody>
                   </table>
                   <hr></hr>
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

export default TambahBankList;