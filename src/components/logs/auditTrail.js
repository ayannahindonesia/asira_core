import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import { getAllAuditTrailFunction } from './saga'
import TableComponent from '../subComponent/TableComponent'
import { checkPermission } from '../global/globalFunction'

const columnDataUser = [
  
    {
        id: 'created_at',
        numeric: false,
        type: 'datetime',
        label: 'Waktu',
    },   
    {
        id: 'client',
        numeric: false,
        label: 'Client',
    },
    
    {
      id: 'user_id',
      numeric: false,
      label: 'User ID',
    },
    {
        id: 'roles',
        numeric: false,
        label: 'Role',
    },
    {
        id: 'username',
        numeric: false,
        label: 'Username',
    },
    {
        id: 'entity',
        numeric: false,
        label: 'Entity',
    }
    ,
    {
        id: 'action',
        numeric: false,
        label: 'Action',
    }
]

class AuditTrail extends React.Component{
    _isMounted = false

    state={
        loading:true,
        errorMessageTanggal:'',
        errorMessage:'',
        errorMessageId:'',
        tanggalAwal:'',
        tanggalAkhir:'',
        searchUserId:'',
        searchEntityId:'',
        searchAction:'',
        searchUsername:'',
        searchEntity:'',
        searchClient:'',
        paging:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:5,
    }

    
    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentDidMount(){
        this._isMounted=true
        this.getAuditTrail({})
    }

    getAuditTrail = async function (param) {
        this.setState({loading:true})
      
        param.page= this.state.page
        param.rows= 10
        
        const data = await getAllAuditTrailFunction(param)

        if(data){
            if(!data.error){
                const newDataLog = data.auditTrail.data || [];
                
                this.setState({
                    rows:newDataLog, 
                    rowsPerPage:data.auditTrail.rows,
                    total_data:data.auditTrail.total_data,
                    last_page:data.auditTrail.last_page,
                    page:data.auditTrail.current_page,
                    loading:false})
              }else{
                  this.setState({errorMessage:data.error})
              }
        }
    }

   
   
    formatSearchingDate = (dateData, endSearch) => {

        if(dateData) {
            const startDate = dateData;
    

            let startMonth =''+ (startDate.getMonth()+1),
            startDay = '' + startDate.getDate(),
            startYear = startDate.getFullYear();
        
            if (startMonth.length < 2) startMonth = '0' + startMonth;
            if (startDay.length < 2) startDay = '0' + startDay;
        
            let newFormatStartDate = startYear+"-"+startMonth+"-"+startDay;
            newFormatStartDate += endSearch ? "T23:59:59.999Z" : "T00:00:00.000Z"
        
            return newFormatStartDate;
        }

        return dateData
        
      }
    
    // HANDLE TANGGAL UNTUK SEARCH
    handleStartChange = (date)=>{
        this.setState({tanggalAwal:date.target.value})
    }
    handleEndChange = (date)=>{
        this.setState({tanggalAkhir:date.target.value})
    }

    //SEARCH
    onChangeSearch = (e, label) => {
        if(label) {
            this.setState({[label]:e.target.value})
        }
    }

    // HANDLE UNTUK BUTTON FILTER SEARCH LOG
    searchLog = ()=>{
        const {
            searchUserId,
            tanggalAkhir,
            tanggalAwal,
            searchEntity,
            searchEntityId,
            searchAction,
            searchUsername,
            searchClient
        } = this.state

        let param = false

        let dateAwal = (tanggalAwal.toString().length !== 0 && new Date(tanggalAwal).getTime())
        let dateAkhir = (tanggalAkhir.toString().length !== 0 && new Date(tanggalAkhir).getTime())
        
        if(dateAwal && dateAkhir && (dateAwal > dateAkhir)){
            this.setState({errorMessage:"Range Tanggal Salah - Harap Check ulang"})
        }else if(isNaN(searchUserId)){
            this.setState({errorMessage:"User ID harus angka - Harap Check ulang"})
        }else if(isNaN(searchEntityId)) {
            this.setState({errorMessage:"Entity ID harus angka - Harap Check ulang"})
        }
        else{
            param = {};

            if(searchAction.trim().length > 0){
                param.action = searchAction
            }
            if(tanggalAwal && tanggalAkhir && dateAwal<=dateAkhir){
                param.start_date = this.formatSearchingDate(tanggalAwal)
                param.end_date = this.formatSearchingDate(tanggalAkhir, true)
            }
            if(searchEntity.trim().length>0){
                param.entity = searchEntity
            }
            if(searchClient.trim().length>0){
                param.client = searchClient
            }
            if(searchUsername.trim().length>0){
                param.username = searchUsername
            }
            if (!isNaN(searchEntityId) && searchEntityId.trim().length>0){
                param.entity_id = searchEntityId
            }
            if (!isNaN(searchUserId) && searchUserId.trim().length>0){
                param.uid = searchUserId;
            }
            this.setState({errorMessage:false,errorMessageTanggal:"",errorMessageId:''})
        }
        
         return param
    }

    searching = ()=>{
        if(this.searchLog()) {
            this.setState({page:1},()=>{
                const param = this.searchLog() || {};
                this.getAuditTrail(param)
            })
        }
       
    }

    // HANDLE UNTUK RESET FILTER SEARCH LOG
    resetLog = ()=>{
        this.setState({
            errorMessage:false,
            errorMessageTanggal:"",
            page:1,
            tanggalAwal:'',
            tanggalAkhir:'',
            searchUserId:'',
            searchEntityId:'',
            searchAction:'',
            searchEntity:'',
            searchClient:'',
            searchUsername:'',
            errorMessageId:''
        },()=>{
            this.getAuditTrail({})
        })
    }

   

    onChangePage = (current) => {
        this.setState({page:current},()=>{
          if(this.state.paging){
            this.getAuditTrail(this.searchLog())
          }
        })
    }

    render(){   
        if(getToken()){
            return(
                <div style={{padding:0}}>
                    < TableComponent
                        id={"id"}
                        title={'Audit Trail - List'}
                        advancedSearch={[
                            {
                                id:'searchUserId',
                                value: this.state.searchUserId,
                                label: 'User ID',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchEntityId',
                                value: this.state.searchEntityId,
                                label: 'Entity ID',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchEntity',
                                value: this.state.searchEntity,
                                label: 'Entity',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchAction',
                                value: this.state.searchAction,
                                label: 'Action',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchUsername',
                                value: this.state.searchUsername,
                                label: 'Username',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchClient',
                                value: this.state.searchClient,
                                label: 'Client',
                                function: this.onChangeSearch,
                            }

                        ]}
                        searchDate={
                            {
                              value:[this.state.tanggalAwal, this.state.tanggalAkhir],
                              label: 'Waktu Transaksi',
                              function: [this.handleStartChange, this.handleEndChange],
                            }
                        }
                        advancedButton={
                            [
                                {
                                  label:'Filter',
                                  color:'#20B889',
                                  function:this.searching
                                },
                                {
                                  label:'Reset',
                                  color:'#EE6969',
                                  function:this.resetLog
                                },
                            ]
                        }
                        errorMessage={this.state.errorMessage}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.rows}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.total_data}
                        onChangePage={this.onChangePage}    
                        permissionDetail={checkPermission('core_auditrail_detail') ? '/auditTrailDetail/' : null}         
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

export default AuditTrail