import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import SearchBar from './../subComponent/SearchBar'
import DatePickers from './../subComponent/DatePicker'

class ActivityLog extends React.Component{
    _isMounted = false

    state={
        errorMessage:'',
        tanggalAwal:null,
        tanggalAkhir:null,
        search:'',
        dropDownApp:'blank'
    }
    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentDidMount(){
        this._isMounted=true
    }

    

    handleDropDownLog = (e)=>{
        this.setState({dropDownApp:e.target.value})

    }

    // HANDLE TANGGAL UNTUK SEARCH
    handleStartChange = (e)=>{
        this.setState({tanggalAwal:e.target.value.toString().trim().length !== 0 ? e.target.value : null,errorMessage:''})
    }
    handleEndChange = (e)=>{
        this.setState({tanggalAkhir:e.target.value.toString().trim().length !== 0 ? e.target.value : null,errorMessage:''})
    }
    fieldSearch = (e) =>{
        this.setState({search:e.target.value})
    }
    // HANDLE UNTUK BUTTON FILTER SEARCH LOG
    searchLog = ()=>{
        const {search,tanggalAkhir,tanggalAwal,dropDownApp} = this.state
        let param ={}
       
        if(dropDownApp !== 'blank'){
            // filter += `&client=${dropDownApp}`
            param.client = dropDownApp
        }if (!isNaN(search) && search.trim().length>0){
            // filter += `&id=${search}`
            param.id = search
        }if (tanggalAkhir && tanggalAwal){
            // filter +=`start_date=${tanggalAwal}&end_date=${tanggalAkhir}`
            param.start_date = tanggalAwal
            param.end_date = tanggalAkhir
        }

        
    }

    // HANDLE UNTUK RESET FILTER SEARCH LOG
    resetLog = ()=>{
        this.setState({errorMessage:"",tanggalAkhir:'01-01-2020',tanggalAwal:'01-02-2020'})
        document.getElementById("dropDown").value = "blank"



    }


    render(){   
        if(getToken()){
            return(
                <div className="container">
                     <div className="row">
                        <div className="col col-md col-xs">
                             <h2 className="mt-3">Activity Log</h2>
                             <hr></hr>
                        </div>
                        
                    </div>
                    <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                {this.state.errorMessageField}
                            </div>      
                     </div>
                    <div className="form-group row">
                        <div className="col-4 col-md-4 col-xs-4">
                        <SearchBar 
                            onChange={this.fieldSearch}
                            placeholder="User ID"
                            value={this.state.search}
                            id="searchField"
                        />
                        </div>
                        <div className=" col-8 col-md-8 col-xs-8 form-inline">
                                    <DatePickers
                                        id="tanggalAwal"
                                        label = 'Dari Tanggal'
                                        onChange ={this.handleStartChange}
                                        value= {this.state.tanggalAwal}
                                        error={this.state.errorMessage && this.state.errorMessage.trim().length !== 0 && true}
                                    />
    
                                    <DatePickers
                                        id="tanggalAkhir"
                                        label = 'Sampai Tanggal'
                                        onChange ={this.handleEndChange}
                                        value= {this.state.tanggalAkhir}
                                        error={this.state.errorMessage && this.state.errorMessage.trim().length !== 0 && true}
                                    />

                                    <select id="dropDown" onChange={this.handleDropDownLog} className="form-control" style={{border:"1px solid black",marginLeft:"20px",width:"150px"}}>
                                        <option value="blank">--- App Filter ---</option>
                                        <option value="all">All</option>
                                        <option value="m">Mobile App</option>
                                        <option value="bd">Bank Dashboard</option>
                                        <option value="c">Core</option>
                                    </select>

                                    <input type="button" style={{marginLeft:"5px",marginTop:"5px"}} onClick={this.searchLog} className="form-control btn btn-success" value="Filter"></input>
                                    <input type="button" style={{marginLeft:"5px",marginTop:"5px"}} onClick={this.resetLog} className="form-control btn btn-danger" value="Reset"></input>

                        </div>
                    </div>

                    <div>
                        <table className="table table-hover">
                                <thead className="table-warning">
                                <tr >
                                        <th className="text-center" scope="col">Level</th>
                                        <th className="text-center" scope="col">Time</th>
                                        <th className="text-center" scope="col">Application</th>
                                        <th className="text-center" scope="col">User ID</th>
                                        <th className="text-center" scope="col">User Name</th>  
                                        <th className="text-center" scope="col">Full Name</th>  
                                        <th className="text-center" scope="col">Activity</th> 
                                        <th className="text-center" scope="col">Message</th> 
                                </tr>   
                        </thead></table>

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