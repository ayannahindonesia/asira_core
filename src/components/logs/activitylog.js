import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import { getAllActivityLog } from './saga'
import TableComponent from '../subComponent/TableComponent'

const columnDataUser = [
    {
        id: 'level',
        numeric: false,
        type:'textColor',
        label: 'Level',
    },
    {
        id: 'created_at',
        numeric: false,
        type: 'datetime',
        label: 'Waktu',
    },   
    {
        id: 'client',
        numeric: false,
        label: 'Aplikasi',
    },
    
    {
      id: 'uid',
      numeric: false,
      label: 'User ID',
    },
    {
        id: 'username',
        numeric: false,
        label: 'Username',
    },
    {
        id: 'tag',
        numeric: false,
        label: 'Activity',
    },
    {
        id: 'messages',
        numeric: false,
        align:'justify',
        label: 'Message',
    },
]

class ActivityLog extends React.Component{
    _isMounted = false

    state={
        loading:true,
        errorMessageTanggal:'',
        errorMessage:'',
        errorMessageId:'',
        tanggalAwal:'',
        tanggalAkhir:'',
        searchUserId:'',
        searchActivity:'',
        searchNote:'',
        searchMessage:'',
        searchApplication:'',
        searchLevel:'',
        paging:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:5,
        clientList:[]
    }

    
    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentDidMount(){
        this._isMounted=true
        this.getAllLog({})
        // this.getAllClient()
    }

    getAllLog = async function (param) {
        this.setState({loading:true})
      
        param.page= this.state.page
        param.rows= 10
        
        const data = await getAllActivityLog(param)

        if(data){
            if(!data.error){
                const newDataLog = data.activityLog.data || [];
                for(const key in newDataLog) {
                    newDataLog[key].level = {
                        value: newDataLog[key].level && `${newDataLog[key].level.substring(0,1).toString().toUpperCase()}${newDataLog[key].level.substring(1,newDataLog[key].level.length)}`,
                        color: 
                        newDataLog[key].level && newDataLog[key].level.toString().toLowerCase() === 'trace' ? 'aqua' :
                        newDataLog[key].level && newDataLog[key].level.toString().toLowerCase() === 'debug' ? '#19B5FE' :
                        newDataLog[key].level && newDataLog[key].level.toString().toLowerCase() === 'fatal' ? 'red' :
                        newDataLog[key].level && newDataLog[key].level.toString().toLowerCase() === 'error' ? '#b7472a' :
                        newDataLog[key].level && newDataLog[key].level.toString().toLowerCase() === 'warning' ? '#fce38a' : 
                        newDataLog[key].level && newDataLog[key].level.toString().toLowerCase() === 'info' ? 'green' : 'black',
                    }
                    newDataLog[key].messages = newDataLog[key].messages.slice(0,50)
                }   

                this.setState({
                    rows:newDataLog, 
                    rowsPerPage:data.activityLog.rows,
                    total_data:data.activityLog.total_data,
                    last_page:data.activityLog.last_page,
                    page:data.activityLog.current_page,
                    loading:false})
              }else{
                  this.setState({errorMessage:data.error})
              }
        }
    }

    // getAllClient = async function () {      
    //     const data = await getAllClientsFunction({})
    //     if(data){
    //         if(!data.error){
    //             this.setState({clientList:data.clientList})
    //           }else{
    //               this.setState({errorMessage:data.error})
    //           }
    //     }
    // }
   
    formatSearchingDate = (dateData, endSearch) => {
        //const startDate = dateData || new Date();
    
        // let startMonth =''+ (startDate.getMonth()+1),
        // startDay = '' + startDate.getDate(),
        // startYear = startDate.getFullYear();
    
        // if (startMonth.length < 2) startMonth = '0' + startMonth;
        // if (startDay.length < 2) startDay = '0' + startDay;
    
        let newFormatStartDate = dateData
        newFormatStartDate += endSearch ? "T23:59:59.999Z" : "T00:00:00.000Z"
    
        return newFormatStartDate;
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

    fieldSearch = (e) =>{
        this.setState({search:e.target.value})
    }
    fieldSearchNoted = (e) =>{
        this.setState({searchNote:e.target.value})
    }
    fieldSearchMessage = (e) =>{
        this.setState({searchMessage:e.target.value})
    }
    fieldSearchActivity = (e) =>{
        this.setState({searchActivity:e.target.value})
    }

    // HANDLE UNTUK BUTTON FILTER SEARCH LOG
    searchLog = ()=>{
        const {
            searchUserId,
            tanggalAkhir,
            tanggalAwal,
            searchActivity,
            searchNote,
            searchMessage,
            searchApplication,
            searchLevel,
        } = this.state

        let param = false

        let dateAwal = (tanggalAwal.toString().length !== 0 && new Date(tanggalAwal).getTime())
        let dateAkhir = (tanggalAkhir.toString().length !== 0 && new Date(tanggalAkhir).getTime())
        
        if(dateAwal && dateAkhir && (dateAwal > dateAkhir)){
            this.setState({errorMessage:"Range Tanggal Salah - Harap Check ulang"})
        }else if(isNaN(searchUserId)){
            this.setState({errorMessage:"ID harus angka - Harap Check ulang"})
        } else{
            param = {};

            if(searchLevel.trim().length > 0){
                param.level = searchLevel
            }
            if(searchApplication.trim().length > 0){
                param.client = searchApplication
            }if(searchMessage.trim().length > 0){
                param.messages = searchMessage
            }
            if(tanggalAwal && tanggalAkhir && dateAwal<=dateAkhir){
                param.start_date = this.formatSearchingDate(tanggalAwal)
                param.end_date = this.formatSearchingDate(tanggalAkhir, true)
            }
            if(searchActivity.trim().length>0){
                param.tag = searchActivity
            }
            if(searchNote.trim().length>0){
                param.note = searchNote
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

                this.getAllLog(param)
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
            searchActivity:'',
            searchLevel:'',
            searchApplication:'',
            searchNote:'',
            searchMessage:'',
            errorMessageId:''
        },()=>{
            this.getAllLog({})
        })
    }

    onChangePage = (current) => {
        this.setState({page:current},()=>{
          if(this.state.paging){
            this.getAllLog(this.searchLog())
          }
        })
    }

    renderJSX = ()=>{
        var jsx  = this.state.rows.map((val,index)=>{
            return(
                <tr key={index}>
                       <td align="center">
                        {val.level ==="trace" ? <input type="button" className="btn btn-outline-secondary" value="Trace"/>:
                            val.level ==='debug' ?<input type="button" className="btn btn-outline-success" value="Debug"/>:
                            val.level ==='fatal' ?<input type="button" className="btn btn-danger" value="Fatal"/>:
                            val.level ==='error' ?<input type="button" className="btn btn-outline-danger" value="Error"/>:
                            val.level ==='warning' ?<input type="button" className="btn btn-outline-warning" value="Warning"/>:
                                            <input type="button" className="btn btn-outline-info" value="Info"/>
                       }</td>
                       <td align="left">{val.created_at}</td>
                        <td align="center">{val.client}</td>
                        <td align="center">{val.uid}</td>
                        <td align="center">{val.username}</td>
                        <td align="center">{val.tag}</td>          
                        <td align="left">{val.messages}</td>
                </tr>
            )
        })
        return jsx
    }
    
    render(){   
        if(getToken()){
            return(
                <div style={{padding:0}}>
                    < TableComponent
                        id={"id"}
                        title={'Activity Log - List'}
                        advancedSearch={[
                            {
                                id:'searchUserId',
                                value: this.state.searchUserId,
                                label: 'User ID',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchNote',
                                value: this.state.searchNote,
                                label: 'Note',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchMessage',
                                value: this.state.searchMessage,
                                label: 'Message',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchActivity',
                                value: this.state.searchActivity,
                                label: 'Activity',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchApplication',
                                value: this.state.searchApplication,
                                label: 'Application',
                                function: this.onChangeSearch,
                            },
                            {
                                id:'searchLevel',
                                value: this.state.searchLevel,
                                label: 'Level',
                                function: this.onChangeSearch,
                            }

                        ]}
                        searchDate={
                            {
                              value:[this.state.tanggalAwal, this.state.tanggalAkhir],
                              label: 'Waktu Transaksi',
                              function: [this.handleStartChange, this.handleEndChange],
                              button: [
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
                        permissionDetail={'/activityLogDetail/'}         
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

export default ActivityLog