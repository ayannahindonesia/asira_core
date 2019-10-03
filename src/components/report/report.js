import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import DatePickers from './../subComponent/DatePicker'
import {serverUrl,serverUrlBorrower} from './../url'
import axios from 'axios'


const cookie = new Cookies()

  const styles = (theme) => ({
    // root: theme.mixins.gutters({
    //   paddingTop: 16,
    //   paddingBottom: 16,
    //   marginTop: theme.spacing.unit * 3,
    // }),
    heading: {
      flex: '0 0 auto',
      fontSize: '18px',
      width: '50vw',
      fontWeight: '800',
    },
    container: {
      flexGrow: 1,
    },
    textField: {
      width: '90%',
      position: 'relative',
      top: '0.275vh',
      marginBottom: '1vh',
    },
    textFieldModify: {
      width: '97.5%',
      marginBottom: '1vh',
    },
    textfieldName: {
      width: '90%',
      marginBottom: '1vh',
      position: 'relative',
      top: '0.2vh',
    },
  });

class Report extends React.Component{
    
    state ={munculinTable:false,pilihReport:false, tanggalAwal:null,tanggalAkhir:null,errorMessage:'',errorMessageBank:'',dataBank:[],namaBank:null}
    componentDidMount(){
        this.getDataBankList()
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error,errorMessageBank:newProps.error})
    }
    getAllLoanData = (tanggalAwal,tanggalAkhir,namaBank)=>{
       var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
          var newLink =`admin/loan?orderby=id`
          axios.get(serverUrlBorrower+newLink,config)
          .then((res)=>{
              console.log(res.data)
              this.setState({})
          })
          .catch((err)=>{
              console.log(err)
          })
    
      }
    //----------------------- GET DATA LIST BANK ---------------------
    getDataBankList = () =>{
       var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        var newLink =`admin/banks?orderby=id&sort=ASC`
        axios.get(serverUrl+newLink,config)
          .then((res)=>{
              console.log(res.data.data)
              this.setState({dataBank:res.data.data})
          })
          .catch((err)=>console.log(err))
    }

    renderBankList = () =>{
        var jsx = this.state.dataBank.map((val,index)=>{
            return (
                <option key={index} value={val.id}>{val.name}</option>
            )
        })
        return jsx
    }
    handleBank = (e)=>{
        console.log(e.target.value)
        this.setState({namaBank:e.target.value})
    }
    //---------------------- HANDLE CONVINIENCE FEE ---------------------
    handleChangeFee = (e)=>{
        if(e.target.value === "1"){
            this.setState({pilihReport:true})
        }else{
            this.setState({pilihReport:false})
        }
    }
    //---------------------- HANDLE TANGGAL ---------------------
    handleEndChange = (e)=>{
        this.setState({tanggalAkhir:e.target.value.toString().trim().length !== 0 ? e.target.value : null,errorMessage:''})
    }
    handleStartChange = (e)=>{
        this.setState({tanggalAwal:e.target.value.toString().trim().length !== 0 ? e.target.value : null,errorMessage:''})
    }
    //---------------------- HANDLE BUTTON PROSES ---------------------
    btnShowReport = ()=>{
       const {tanggalAkhir,tanggalAwal,namaBank} = this.state
       var dateAwal = new Date(tanggalAwal).getTime()
       var dateAkhir = new Date(tanggalAkhir).getTime()
        if(tanggalAwal === null || tanggalAkhir ===null){
            this.setState({errorMessage:"Tanggal ada yang kosong - Harap cek ulang"})
        }else if(dateAwal > dateAkhir){
            this.setState({errorMessage:"Range tanggal tidak benar - Harap cek ulang"})
        }else if(namaBank === "0" || namaBank === null){
            this.setState({errorMessageBank:"Bank Kosong - Harap cek ulang"})
        }
        else{
            var newTanggalAwal = tanggalAwal+"T00:00:00.000Z"
            var newTanggalBack = tanggalAkhir+"T23:59:59.000Z"
            this.getAllLoanData(newTanggalAwal,newTanggalBack,namaBank)
            this.setState({errorMessage:"",errorMessageBank:'',munculinTable:true})
        }

    }
    btnReset = ()=>{
        this.setState({errorMessage:"",errorMessageBank:'',munculinTable:false,namaBank:null})
        document.getElementById("bankName").value ="0"
    }
    render(){
        if(cookie.get('token')){
            return(
                <div className="container mt-2">
                    <h2>Report</h2>
                    <hr></hr>
                    <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}{this.state.errorMessageBank} 
                            </div>      
                     </div>
                    <div className="form-group row">
                            
                        <label className="col-sm-2 col-form-label">Nama Report</label>
                        <div className="col-sm-10">
                        <select ref="convfee" onChange={this.handleChangeFee} id="report" className="form-control">
                                <option value={0}>======== Pilih Report ========</option>
                                <option value="1">Convenience Fee Report</option>                                
                        </select>
                        </div>
                    </div>
                     {this.state.pilihReport?
                        <form>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama Bank</label>
                            <div className="col-sm-10">
                            <select ref="bankName" id="bankName" onChange={this.handleBank} className="form-control">
                                <option value={0}>======== Pilih Bank ========</option>
                                {this.renderBankList()}
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Tanggal Pinjaman Disetujui</label>
                            <div className="col-sm-10 form-inline pl-5">
                            <div className="col-sm-1 form-inline"></div>
                                <div className="col-sm-3 form-inline">
                                    <DatePickers
                                        label = 'Dari Tanggal'
                                        onChange ={this.handleStartChange}
                                        value={this.state.tanggalAwal}
                                        error={this.state.errorMessage.trim().length !== 0}
                                    />
                                </div>
                                <div className="form-inline mr-3 ml-3"><i className="fas fa-long-arrow-alt-right"></i></div>
                                <div className="col-sm-3 form-inline">
                                    <DatePickers
                                        label = 'Sampai Tanggal'
                                        onChange ={this.handleEndChange}
                                        value={this.state.tanggalAwal}
                                        error={this.state.errorMessage.trim().length !== 0}
                                    />
                                </div>
                            </div>
                    
                        </div>
                      
                        <input type="button" className="btn btn-success" value="Proses" onClick={this.btnShowReport}/>
                        <input type="button" className="btn btn-secondary ml-2" value="Reset" onClick={this.btnReset}/>
                    </form>
                    :null}

                    {this.state.munculinTable ?
                      <div>
                      <hr/>
                             <table className="table table-hover">
                             <thead className="table-warning">
                                     <tr >
                                         <th className="text-center" scope="col">#</th>
                                         <th className="text-center" scope="col">Nama Bank</th>
                                         <th className="text-center" scope="col">Layanan</th>
                                         <th className="text-center" scope="col">Produk</th>
                                         <th className="text-center" scope="col">Loan Id</th>  
                                         <th className="text-center" scope="col">Plafond</th>  
                                         <th className="text-center" scope="col">Convinience Fee Amount</th> 
                                     </tr>     
                                 </thead>
                                 <tbody>
                                     

                                 </tbody>
                             </table>
                 </div>    
                    :null}
                  
                   
    
               
                    
               
                  
                </div>
            )
        }
        if(!cookie.get('token')){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}


export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   },
    //   getApplication: () => {
    //     dispatch(applicationRequest());
    //   },
    //   getSecurityAdministrator: (application) => {
    //     dispatch(securityAdministratorRequest(application));
    //   },
    //   getToken: (application) => {
    //     dispatch(rpsTokenRequest(application));
    //   },
    //   getTokenUpdate: (application) => {
    //     dispatch(rpsTokenUpdateRequest(application));
    //   },
    //   getAction: (application) => {
    //     dispatch(rpsActionRequest(application));
    //   },
    //   getProfileUserId: (application) => {
    //     dispatch(profileUserIdRequest(application));
    //   },
    //   getCurrency: () => {
    //     dispatch(currencyRequest());
    //   },
    //   getKanwil: () => {
    //     dispatch(kanwilRequest());
    //   },
    //   getKCU: (kanwil) => {
    //     dispatch(kcuRequest(kanwil));
    //   },
    //   getBranch: (kodeKcu) => {
    //     dispatch(branchRequest(kodeKcu));
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    //   handleCreaterpsTransaction: (rpsTransaction) => {
    //     dispatch(rpsTransactionCreate(rpsTransaction));
    //   },
    //   handleUpdaterpsTransaction: (rpsTransaction) => {
    //     dispatch(rpsTransactionUpdate(rpsTransaction));
    //   },
    //   handleGetrpsUserIdDetail: (rpsUserId) => {
    //     dispatch(rpsUserIdDetail(rpsUserId));
    //   },
    //   handleGetDetailProfileUser: (rpsUserId) => {
    //     dispatch(rpsProfileUserDetail(rpsUserId));
    //   },
    //   handleDelete: (rpsUserId) => {
    //     dispatch(rpsUserIdDelete(rpsUserId));
    //   },
    //   handleSetMessage: (message) => {
    //     dispatch(setAlert(message));
    //   },
    };
  }
  
  export const mapStateToProps = createStructuredSelector({
    // user: getUserState(),
    // menu: getMenu(),
    // rpsUserIdDetailNew: getrpsUserIdDetail(),
    // profileUserDetail: getrpsProfileUserDetail(),
    // listSourceTransaction: getListSourceTransaction(),
    // listAction: getListAction(),
    // listToken: getListToken(),
    // listEmployee: getListEmployee(),
    // listBranch: getListBranch(),
    // listApplication: getListApplication(),
    // listSecurityAdministrator: getListSecurityAdministrator(),
    // listCurrency: getListCurrency(),
    // listprofileUserId: getListProfileUserId(),
    // listKanwil: getListKanwil(),
    // listKCU: getListKCU(),
    // message: getMessageValue(),
    // redirect: getRedirectValue(),
    // fetching: getFetchStatus(),
  });

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);
// const withReducer = injectReducer({ key: 'rpsTransaction', reducer });
// const withSaga = injectSaga({ key: 'rpsTransaction', saga });

export default compose(
    // withReducer,
    withConnect,
    // withSaga,
    withStyle,
    withRouter
  )(Report);
// export default RoleAdd;

