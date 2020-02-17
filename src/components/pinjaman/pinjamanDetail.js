import React from 'react'
import { Redirect } from 'react-router-dom'
import Moment from 'react-moment';
import { GlobalFunction } from '../globalFunction'
import { getDetailFunction } from './saga';
import { getToken } from '../index/token';

class Main extends React.Component{
    state = {rows:{},items:[],borrowerDetail:{},status:'',borrower_info:{},productInfo:{},redirecting:false,errorMessage:''}
    _isMounted = false
    componentDidMount(){
        this._isMounted=true
        this.getDataDetail()
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    getDataDetail = async function () {
        const param={
            id:this.props.match.params.idLoan
        }
        const data = await getDetailFunction(param)

        if(data){
            if(!data.error){
                this.setState({borrowerDetail:data.data.borrower_info,rows:data.data,items:data.data.fees,status:data.data.status})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

 
    renderAdminFee = ()=>{
        var jsx = this.state.items.map((val,index)=>{
            return (
            <tr key={index}>
                <td>{val.description}</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>{String(val.amount).includes("%")?
                    val.amount:
                    parseFloat(parseInt(val.amount)/parseInt(this.state.rows.loan_amount) * 100).toFixed(2) +"%"
                
                }</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>{String(val.amount).includes("%")  ?
                    GlobalFunction.formatMoney(parseInt(val.amount.slice(0,val.amount.indexOf("%")))*this.state.rows.loan_amount/100):
                    GlobalFunction.formatMoney(parseInt(val.amount))}</td>
            </tr>
            )
        })
        return jsx
    }
    


    btnBack = ()=>{
        this.setState({redirecting:true})
    }

    getBiayaAdmin =()=>{
        var jsx = this.state.items
        .map((val,index)=>{
            return (
                    <tr key={index}>
                    <td>{val.description}</td>
                    <td>: {GlobalFunction.formatMoney(parseInt(val.amount))}</td>
                    </tr>
            )
        })
         return jsx;
    }

    render(){
        if (this.state.redirecting){
            return <Redirect to="/pinjamanList"/>
        }
        if(getToken()){
            return(
                <div>

                    <h2>Pinjaman - Detail</h2>
                    <hr></hr>

                    {/* -----------------------------------------------------FIRST ROW----------------------------------------------------------------- */}
                    <div className="row" style={{marginTop:"20px", background:"#f7f7f7f7"}}>
                        <div className="col col-md col-xs">
                            <table style={{width:"100%"}}>
                                <tbody>
                                    <tr>
                                        <td>ID Pinjaman</td>
                                        <td>: {this.state.rows.id}</td>
                                        <td>Rekening Peminjam</td>
                                        <td>: {this.state.rows.bank_account}</td>
                                        <td>Kategori</td>
                                        <td>: {this.state.borrowerDetail.category ==="account_executive"?"Account Executive" :this.state.borrowerDetail.category === "agent"?"Agent":"Personal"}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama Nasabah</td>
                                        <td>: {this.state.rows.borrower_name}</td>
                                        <td>Status Pinjaman</td>
                                        <td>: {
                                    this.state.status === "processing"?
                                        <label style={{color:"blue"}}>Dalam Proses</label>
                                    : this.state.status === "approved"?
                                    <label style={{color:"green"}}>Diterima</label>:
                                    <label style={{color:"red"}}>Ditolak</label>
                                    
                                    }</td>
                                        <td>Agen/ AE</td>
                                        <td>: {this.state.borrowerDetail.agent_name?this.state.borrowerDetail.agent_name:"-"} ({this.state.borrowerDetail.agent_provider_name?this.state.borrowerDetail.agent_provider_name:"-"})</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                       

                    </div>
             {/* -----------------------------------------------------SECOND ROW----------------------------------------------------------------- */}
             <div className="row mt-4" >
                        <div className="col-12 col-md-6">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Pinjaman Pokok</td>
                                    <td>: {GlobalFunction.formatMoney(parseInt(this.state.rows.loan_amount))}</td>
                                </tr>
                                <tr>
                                    <td>Tenor (Bulan)</td>
                                    <td>: {this.state.rows.installment}</td>
                                </tr>
                                <tr>
                                    <td>Total Pinjaman</td>
                                    <td>: {GlobalFunction.formatMoney(parseInt(this.state.rows.total_loan))}</td>
                                </tr>
                                <tr>
                                    <td>Angsuran Perbulan</td>
                                    <td>: {GlobalFunction.formatMoney(parseInt(this.state.rows.layaway_plan))}</td>
                                </tr>
                                </tbody>
                                
                            </table>
                            <table className="mt-2">
                                <thead>
                                <tr >
                                    <th className="text-center" ></th>
                                    <th></th>
                                    <th className="text-center">(%)</th>
                                    <th></th>
                                    <th className="text-center">(Jumlah)</th>
                                </tr>   
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Imbal Hasil/ Bunga</td>
                                        <td></td>
                                        <td>{parseInt(this.state.rows.interest).toFixed(2)}%</td>
                                        <td></td>
                                        <td>{this.state.rows &&  this.state.rows.interest && this.state.rows.loan_amount?GlobalFunction.formatMoney(parseInt(this.state.rows.interest)*parseInt(this.state.rows.loan_amount)/100) :null}</td>
                                    </tr>
                                    {this.renderAdminFee()}
                                    
                                </tbody>
                            </table>
                        </div>
                        <div className="col-12 col-md-6">
                            <table>
                                <tbody>
                                {/* <tr>
                                    <td>Product</td>
                                    <td>: {this.state.borrowerDetail.idcard_number}</td>
                                </tr>
                                <tr>
                                    <td>Layanan</td>
                                    <td>: {this.state.rows.status}</td>
                                </tr> */}
                                <tr>
                                    <td>Tujuan Pinjaman</td>
                                    <td>: {this.state.rows.loan_intention}</td>
                                </tr>
                                <tr>
                                    <td>Detail Tujuan</td>
                                    <td>: {this.state.rows.intention_details}</td>
                                </tr>
                                <tr>
                                    <td>Tanggal Pengajuan</td>
                                    <td>: 
                                    <Moment date={this.state.rows.created_at} format=" DD  MMMM  YYYY" />
                                    </td>
                                </tr>
                              
                                </tbody>
                                
                            </table>

                        </div>
                        

                 </div>
             {/* -----------------------------------------------------THIRD ROW----------------------------------------------------------------- */}
             <h2 className="mt-4">Info Penghasilan Saat Pengajuan</h2>
            
             <div className="row">
                        <div className="col-12 col-md-12">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Pendapatan perbulan</td>
                                    <td>: {this.state.borrowerDetail.monthly_income ?
                                        GlobalFunction.formatMoney(parseInt(this.state.borrowerDetail.monthly_income))
                                        : 0
                                        }</td>
                                </tr>
                                <tr>
                                    <td>Penghasilan lain lain(jika ada)</td>
                                    <td>: {this.state.borrowerDetail.other_income ?
                                        GlobalFunction.formatMoney(parseInt(this.state.borrowerDetail.other_income)):0}</td>
                                </tr>
                                <tr>
                                    <td>Sumber Penghasilan lain lain</td>
                                    <td>: {this.state.borrowerDetail.other_incomesource}</td>
                                </tr>
                                {this.state.status === 'rejected'?
                                <tr>
                                    <td>Alasan ditolak</td>
                                    <td>: {this.state.rows.reject_reason}</td>
                                </tr>
                                :this.state.status === "approved" ?
                                <tr>
                                    <td>Tanggal Pencairan</td>
                                    <td>: 
                                    <Moment date={this.state.rows.disburse_date} format=" DD  MMMM  YYYY" />                               
                                    </td>
                                </tr>
                                :null}
                                
                               
                                </tbody>
                            </table>
                            <input type="button" onClick={this.btnBack}  className="mt-2 btn btn-secondary" value="Kembali"></input>
                        </div>
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

export default Main;