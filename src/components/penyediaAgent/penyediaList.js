import React from 'react';
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import './../../support/css/pagination.css'
import { getToken } from '../index/token';
import { checkPermission } from '../global/globalFunction';
import { getPenyediaAgentListFunction } from './saga';
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
  {
      id: 'id',
      numeric: false,
      label: 'ID Penyedia Agen',
  },
  {
      id: 'name',
      numeric: false,
      label: 'Nama Penyedia Agen',
  },
  {
      id: 'status',
      numeric: false,
      label: 'Status',
  },
]

class profileNasabah extends React.Component {
  state = {
    rows: [], searchRows:'',
    page: 1,
    rowsPerPage: 5,
    isEdit: false,
    editIndex:Number,
    total_data:0,
    last_page:1,
    loading:true,
    bankID:0,bankName:'',paging:true
  
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
      const dataAgent = data.dataListAgent && data.dataListAgent.data
      for (const key in dataAgent){
        dataAgent[key].status = dataAgent[key].status ==='active'?"Aktif":"Tidak Aktif"
      }
      if(data){
        if(!data.error){
          this.setState({loading:false,rows:data.dataListAgent.data,
            rowsPerPage:data.dataListAgent.rows,
            jumlahBaris:null,
            total_data:data.dataListAgent.total_data,
            last_page:data.dataListAgent.last_page,
            page:data.dataListAgent.current_page})
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
          this.getAllData()

        }
      })
  }

 onChangePage = (current) => {
  this.setState({loading:true,page:current},()=>{
    if(this.state.paging){
      this.getAllData()
    }
  })
}
  
render() {   
if(getToken()){
    return (
      <div style={{padding:0}}>
        < TableComponent
          id={"id"}
          search={
            {
              value: this.state.searchRows,
              label: 'Search Penyedia Agen, ID Penyedia Agen..',
              onChange: this.changeSearch,
              function: this.btnSearch,
            }
          }
          title={'Penyedia Agen - List'}
          paging={this.state.paging}
          loading={this.state.loading}
          columnData={columnDataUser}
          data={this.state.rows}
          page={this.state.page}
          rowsPerPage={this.state.rowsPerPage}
          totalData={this.state.total_data}
          onChangePage={this.onChangePage}  
          permissionAdd={ checkPermission('core_agent_provider_new') ? '/penyediaAdd/' : null}           
          permissionEdit={ checkPermission('core_agent_provider_patch') ? '/penyediaEdit/' : null}
          permissionDetail={ checkPermission('core_agent_provider_details') ? '/penyediaDetail/' : null}

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