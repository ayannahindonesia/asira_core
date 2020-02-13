import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import SearchBar from './../subComponent/SearchBar'
import DatePickers from './../subComponent/DatePicker'
import { getAllActivityLog, getAllClientsFunction } from './saga'
// import TableComponent from '../subComponent/TableComponent'
import Pagination from 'rc-pagination';
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import Loader from 'react-loader-spinner';

// const columnDataUser =[
//     {
//         id: 'level',
//         numeric: false,
//         label: 'Level',   
//     },
//     {
//         id: 'created_at',
//         numeric: false,
//         label: 'Time',   
//     },
//     {
//         id: 'level',
//         numeric: false,
//         label: 'Application',   
//     },
//     {
//         id: 'id',
//         numeric: false,
//         label: 'User ID',   
//     },
//     {
//         id: 'level',
//         numeric: false,
//         label: 'User Name',   
//     },
    
//     {
//         id: 'level',
//         numeric: false,
//         label: 'Full Name',   
//     },
//     {
//         id: 'level',
//         numeric: false,
//         label: 'Activity',   
//     },
//     {
//         id: 'messages',
//         numeric: false,
//         label: 'Message',   
//     }
// ]

class ActivityLog extends React.Component{
    _isMounted = false

    state={
        loading:true,
        errorMessageTanggal:'',
        errorMessage:false,
        errorMessageId:'',
        tanggalAwal:'',
        tanggalAkhir:'',
        search:'',
        searchActivity:'',
        searchNote:'',
        searchMessage:'',
        dropDownApp:'blank',
        dropDownLevel:'blank',
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
        this.getAllClient()
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
                    newDataLog[key].created_at = newDataLog[key].created_at.replace("T"," ").slice(0,newDataLog[key].created_at.indexOf("."))
                    // newDataLog[key].messages = JSON.parse(newDataLog[key].messages)
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
    getAllClient = async function () {      
        const data = await getAllClientsFunction({})
        if(data){
            if(!data.error){
                this.setState({clientList:data.clientList})
              }else{
                  this.setState({errorMessage:data.error})
              }
        }
    }
   
    
    handleDropDownLog = (e)=>{
        this.setState({dropDownApp:e.target.value})

    }
    handleDropDownLevelLog = (e)=>{
        this.setState({dropDownLevel:e.target.value})
    }

    // HANDLE TANGGAL UNTUK SEARCH
    handleStartChange = (e)=>{
        this.setState({tanggalAwal:e.target.value.toString().trim().length !== 0 ? e.target.value : '',errorMessage:false})
    }
    handleEndChange = (e)=>{
        this.setState({tanggalAkhir:e.target.value.toString().trim().length !== 0 ? e.target.value : '',errorMessage:false})
    }

    //SEARCH
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
        const {search,tanggalAkhir,tanggalAwal,dropDownApp,dropDownLevel,searchActivity,searchNote,searchMessage} = this.state
        let param ={}

        let dateAwal = new Date(tanggalAwal).getTime()
        let dateAkhir = new Date(tanggalAkhir).getTime()

        if(dateAwal > dateAkhir){
            this.setState({errorMessage:true,errorMessageTanggal:"Range Tanggal Salah"})
            
        }else if(isNaN(search)){
            this.setState({errorMessageId:"ID Harus Angka"})
        }
        else{
            if(dropDownLevel !=='blank'){
                param.level = dropDownLevel
            }
            if(dropDownApp !== 'blank'){
                param.client = dropDownApp
            }if(searchMessage.trim().length>0){
                param.message = searchMessage
            }
            if(dateAwal<dateAkhir){
                param.start_date = tanggalAwal
                param.end_date = tanggalAkhir
            }
            if(searchActivity.trim().length>0){
                param.tag = searchActivity
            }
            if(searchNote.trim().length>0){
                param.note = searchNote
            }
            if (!isNaN(search) && search.trim().length>0){
                param.uid = search;
            }
            this.setState({errorMessage:false,errorMessageTanggal:"",errorMessageId:''})

            return param

        }
        
         
    }

    searching = ()=>{
        if(this.searchLog()){
            this.setState({page:1},()=>{
                this.getAllLog(this.searchLog())
            })
        }
       
    }

    // HANDLE UNTUK RESET FILTER SEARCH LOG
    resetLog = ()=>{
        this.setState({
        errorMessage:false,
        errorMessageTanggal:"",
        page:1,
        dropDownApp:'blank',
        dropDownLevel:'blank',
        tanggalAwal:'',
        tanggalAkhir:'',
        search:'',
        searchActivity:'',
        searchNote:'',
        searchMessage:'',
        errorMessageId:''
    },()=>{
            this.getAllLog({})
        })
        document.getElementById("dropDown").value = "blank"
        document.getElementById('dropDownLevel').value = 'blank'
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
                <div className="container-fluid">
                     <div className="row">
                        <div className="col col-md col-xs">
                             <h2 className="mt-3">Activity Log {this.state.message}</h2>
                             <hr></hr>
                        </div>
                        
                    </div>
                    <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                {this.state.errorMessageTanggal}
                                {this.state.errorMessageId}
                            </div>      
                     </div>
                    <div className="form-group row">
                    <div className="col-3 col-md-3 col-xs-3">
                        <SearchBar 
                            onChange={this.fieldSearch}
                            placeholder="Input User ID"
                            value={this.state.search}
                            id="searchField"
                        />
                        </div>
                        <div className="col-3 col-md-3 col-xs-3">
                        <SearchBar 
                            onChange={this.fieldSearchNoted}
                            placeholder="Input Note"
                            value={this.state.searchNote}
                            id="searchFieldNoted"
                        />
                        </div>
                        <div className="col-3 col-md-3 col-xs-3">
                        <SearchBar 
                            onChange={this.fieldSearchMessage}
                            placeholder="Input Message"
                            value={this.state.searchMessage}
                            id="searchFieldMessage"
                        />
                        </div>
                        <div className="col-3 col-md-3 col-xs-3">
                        <SearchBar 
                            onChange={this.fieldSearchActivity}
                            placeholder="Input Activity"
                            value={this.state.searchActivity}
                            id="searchFieldActivity"
                        />
                        </div>
                     </div>
                    <div className="form-group row">
                        
                        <div className=" col col-md col-xs form-inline">
                                    <DatePickers
                                        id="tanggalAwal"
                                        label = 'Dari Tanggal'
                                        onChange ={this.handleStartChange}
                                        value= {this.state.tanggalAwal}
                                        error={this.state.errorMessage  && true}
                                        helperText={this.state.errorMessageTanggal && this.state.errorMessageTanggal.trim().length !== 0}
                                    />
                                    <i className="fas fa-arrow-right mr-3 ml-3"></i>
                                    <DatePickers
                                        id="tanggalAkhir"
                                        label = 'Sampai Tanggal'
                                        onChange ={this.handleEndChange}
                                        value= {this.state.tanggalAkhir}
                                        error={this.state.errorMessage && true}
                                        helperText={this.state.errorMessageTanggal && this.state.errorMessageTanggal.trim().length !== 0}

                                    />

                                    <select id="dropDown" onChange={this.handleDropDownLog} className="form-control" style={{border:"1px solid black",marginLeft:"20px",width:"150px"}}>
                                        <option value="blank">--- App Filter ---</option>
                                        {this.state.clientList && this.state.clientList.map((val,index)=>{
                                            return (
                                                <option key={index} value={val}>{val}</option>
                                            )
                                        },this)}
                                    
                                    </select>
                                    <select id="dropDownLevel" onChange={this.handleDropDownLevelLog} className="form-control" style={{border:"1px solid black",marginLeft:"20px",width:"150px"}}>
                                        <option value="blank">--- Level Filter ---</option>
                                        <option value="trace">Trace</option>
                                        <option value="info">Info</option>
                                        <option value="debug">Debug</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                        <option value="fatal">Fatal</option>
                                    </select>
                                    <input type="button" style={{marginLeft:"5px",marginTop:"5px"}} onClick={this.searching} className="form-control btn btn-success" value="Filter"></input>
                                    <input type="button" style={{marginLeft:"5px",marginTop:"5px"}} onClick={this.resetLog} className="form-control btn btn-danger" value="Reset"></input>
                        </div>
                    </div>

                    <div>
                        
                        <table className="table table-hover">
                                <thead className="table-warning">
                                <tr>
                                        <th className="text-center" scope="col">Level</th>
                                        <th className="text-center" scope="col">Time</th>
                                        <th className="text-center" scope="col">Application</th>
                                        <th className="text-center" scope="col">User ID</th>
                                        <th className="text-center" scope="col">User Name</th>  
                                        <th className="text-center" scope="col">Activity</th> 
                                        <th className="text-center" scope="col">Message</th> 
                                </tr>   
                               
                        </thead>
                                <tbody>
                                {this.state.loading?
                                        <tr align="center">
                                        <th colSpan={7}>
                                        <Loader 
                                            type="Circles"
                                            color="#00BFFF"
                                            height="40"	
                                            width="40"
                                        />  
                                        </th>
                                    </tr>
                                :this.state.rows.length===0?
                                    <tr align="center">
                                        <th colSpan={7}>
                                        <p style={{marginRight:"50px"}}>DATA KOSONG</p>
                                        </th>
                                    </tr>
                                    :this.renderJSX()} 
                                
                                </tbody>
                        
                        </table>
                        <div className="float-right">
                        <Pagination className="ant-pagination"  
                            current={this.state.page}
                            showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                            total={this.state.total_data}
                            showLessItems
                            pageSize={this.state.rowsPerPage}
                            onChange={this.onChangePage}
                            locale={localeInfo}
                        />  
                        </div>


                        {/* <TableComponent
                               id={"id"}
                               paging={this.state.paging}
                               loading={this.state.loading}
                               columnData={columnDataUser}
                               data={this.state.rows}
                               page={this.state.page}
                               rowsPerPage={this.state.rowsPerPage}
                               totalData={this.state.total_data}
                               onChangePage={this.onChangePage}             
                        /> */}


                        </div>
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