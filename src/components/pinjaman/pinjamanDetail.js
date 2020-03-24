import React from 'react'
import { Redirect } from 'react-router-dom'
import { GlobalFunction } from '../globalFunction'
import {  handleFormatDate,formatNumber, findAmount} from './../global/globalFunction'

import { getDetailFunction } from './saga';
import { getToken } from '../index/token';
import { Grid} from '@material-ui/core';
import TitleBar from '../subComponent/TitleBar';
import GridDetail from './../subComponent/GridDetail'
import ActionComponent from '../subComponent/ActionComponent';

class Main extends React.Component{
    state = {rows:{},
    items:[],
    borrowerDetail:{},
    formInfo:[],
    status:'',
    borrower_info:{},
    productInfo:{},
    redirecting:false,
    errorMessage:'',
    installment:[]
    }
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
            let newFormatInstallmentDetail = data.data.installment_details
            let newFormInfo = JSON.parse(data.data.form_info)
            for (const key in newFormatInstallmentDetail){
                newFormatInstallmentDetail[key].due_date = handleFormatDate(newFormatInstallmentDetail[key].due_date)
                newFormatInstallmentDetail[key].loan_payment = GlobalFunction.formatMoney(newFormatInstallmentDetail[key].loan_payment)
                newFormatInstallmentDetail[key].interest_payment = GlobalFunction.formatMoney(newFormatInstallmentDetail[key].interest_payment)
                newFormatInstallmentDetail[key].created_at = handleFormatDate(newFormatInstallmentDetail[key].created_at)
                newFormatInstallmentDetail[key].paid_date =  newFormatInstallmentDetail[key].paid_date ?handleFormatDate(newFormatInstallmentDetail[key].paid_date):"-"
                newFormatInstallmentDetail[key].penalty =  newFormatInstallmentDetail[key].penalty? GlobalFunction.formatMoney(newFormatInstallmentDetail[key].penalty):"-"
                newFormatInstallmentDetail[key].paid_amount = newFormatInstallmentDetail[key].paid_amount? GlobalFunction.formatMoney(newFormatInstallmentDetail[key].paid_amount):"-"
                newFormatInstallmentDetail[key].underpayment = newFormatInstallmentDetail[key].underpayment? GlobalFunction.formatMoney(newFormatInstallmentDetail[key].underpayment):"-"
                newFormatInstallmentDetail[key].paid_status = newFormatInstallmentDetail[key].paid_status?"Sudah Bayar":" - "
            }

            
            console.log(data)

            if(!data.error){
                this.setState({
                    formInfo:newFormInfo,
                    installment:newFormatInstallmentDetail,
                    borrowerDetail:data.data.borrower_info,
                    rows:data.data,
                    items:data.data.fees,
                    status:data.data.status})
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

    renderFormInfoJsx = ()=>{
        var jsx = this.state.formInfo.map((val,index)=>{
            return(
                <Grid item xs={12} sm={12} key={index} style={{marginBottom:"10px"}}>
                   <Grid container>
                    <Grid item xs={4} sm={4}>
                        <b>
                       {val.type==='dropdown'? val.label : 
                       val.type ==='checkbox' || val.type ==='textfield'? val.label :
                       "Gambar"}
                         </b>
                   </Grid> 
                   <Grid item xs={6} sm={6} style={{marginRight:'20px',flexWrap:"wrap"}} >
                     <b>{val.type==='image'?null:" : "}</b>
                     {val.type ==='image'?  
                     <img src={`data:image/png;base64,${val.answers}`} style={{width:"100px",height:"auto"}} alt="Gambar Profile" />
                     :val.answers ? val.answers: " - "
                    }
                    </Grid> 
                   </Grid>
             </Grid>

            )
        })
        return jsx
    }

    renderInstallmentJsx = ()=>{
        var installment = this.state.installment.map((val,index)=>{
            return(
                <tr key={index}>
                   <td className="text-center">{val.period}</td>
                   <td className="text-center">{val.loan_payment}</td>
                   <td className="text-center">{val.interest_payment}</td>
                   <td className="text-center">{val.paid_date}</td>
                   <td className="text-center">{val.paid_status}</td>
                   <td className="text-center">{val.paid_amount}</td>
                   <td className="text-center">{val.underpayment}</td>
                   <td className="text-center">{val.penalty}</td>
                   <td className="text-center">{val.due_date}</td>
                   <td className="text-center">{val.note}</td>
                </tr>
            )
        })
        return installment
    }

    desctructFormInfo = (array)=>{
        var newArray=[]

        for(var i=0;i<array.length;i++){
            for (const key in array[i]){
                newArray.push(key)
            }
        }

        return newArray
    }

    render(){
        if (this.state.redirecting){
            return <Redirect to="/pinjamanList"/>
        }
        if(getToken()){
            return(
                <Grid container className="containerDetail">
         
                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                    
                        <TitleBar
                            title={'Pinjaman - Detail'}
                        />

                    </Grid>

                    <Grid
                    item
                    sm={12} xs={12}
                    style={{padding:10, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >

                      {/* Action Button */}
                  <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                        <ActionComponent
                            onCancel={this.btnBack}
                        />
                 </Grid>

                    {/* -----------------------------------------------------FIRST ROW----------------------------------------------------------------- */}

                    <GridDetail
                        gridLabel={[5,5,3]}
                        noTitleLine
                        background
                        label={[
                            ['ID Pinjaman','Nama Nasabah'],
                            ['Rekening Pinjaman','Status Pinjaman'],
                            ['Kategori', 'Agen/ AE'],
                        ]}
                        data={this.state.rows && [
                            [
                            this.state.rows.id,
                            this.state.rows.borrower_name
                            ],
                            [
                            this.state.rows.bank_account,
                            this.state.status &&   this.state.status === "processing"?
                                {value:"Dalam Proses", color:'blue'}
                                : this.state.status === "approved" && this.state.rows.disburse_status ==="confirmed"?
                                {value:"Telah Dicairkan", color:'blue'}:
                                this.state.status ==='rejected'?
                                {value:"Ditolak", color:'red'}:
                                this.state.status === 'approved'?
                                {value:"Diterima", color:'green'}:
                                null
                            ],
                            [
                            this.state.rows.category===""?"Personal":this.state.rows.category==="account_executive"?"Account Executive":"Agent",
                            `${this.state.rows.agent_name?this.state.rows.agent_name:"-"} (${this.state.rows.agent_provider_name?this.state.rows.agent_provider_name:"-"})`
                            ],
                        ]}                 
                    />

                          {/* -----------------------------------------------------SECOND ROW----------------------------------------------------------------- */}
                          <GridDetail
                        gridLabel={[5,5]}
                        label={
                        [
                            
                            ['Pinjaman Pokok','Tenor (Bulan)','Total Pinjaman','Angsuran Perbulan'],
                            this.state.status==='processing'? 
                            ['Tujuan Pinjaman','Detail Tujuan','Tanggal Pengajuan']   :
                            ['Tujuan Pinjaman','Detail Tujuan','Tanggal Pengajuan',
                            this.state.status==='approved'?"Tanggal Persetujuan":"Tanggal Ditolak"]
                        ] 
                        }
                        data={this.state.rows && [
                            [
                                GlobalFunction.formatMoney(parseInt(this.state.rows.loan_amount)),
                                this.state.rows.installment,
                                GlobalFunction.formatMoney(parseInt(this.state.rows.total_loan)),
                                GlobalFunction.formatMoney(parseInt(this.state.rows.layaway_plan)),
                            ],
                            this.state.status==='processing'?
                            [
                                this.state.rows.loan_intention,
                                this.state.rows.intention_details,
                                handleFormatDate(this.state.rows.created_at)          
                            ] :
                            [
                                this.state.rows.loan_intention,
                                this.state.rows.intention_details,
                                handleFormatDate(this.state.rows.created_at),
                                handleFormatDate(this.state.rows.updated_at)           
                            ],
                            []
                        ]}                 
                    />

                      {/* Fee Section */}
                      <GridDetail
                        gridLabel={[8]}
                        noEquals
                        label={[
                            ['','Imbal Hasil/ Bunga','Admin Fee','Convenience Fee'],
                            [
                                '(Jumlah)',
                                "Rp. "+formatNumber(this.state.rows && this.state.rows.loan_amount && this.state.rows.interest && parseFloat(this.state.rows.interest * this.state.rows.loan_amount / 100).toFixed(0), true),
                                "Rp. "+formatNumber(findAmount(this.state.rows && this.state.rows.fees, 'Admin Fee',this.state.rows && this.state.rows.loan_amount,false), true),
                                "Rp. "+formatNumber(findAmount(this.state.rows && this.state.rows.fees, 'Convenience Fee',this.state.rows && this.state.rows.loan_amount,false), true)
            
            
                            ],
                            ['','','','']
                    
                        ]}
                        data={this.state.rows && [
                            [
                                '<b>(%)',
                                `<b>${parseFloat(this.state.rows.interest).toFixed(2)}%`,
                                `<b>${findAmount(this.state.rows && this.state.rows.fees, 'Admin Fee',this.state.rows && this.state.rows.loan_amount,true)}%`,
                                `<b>${findAmount(this.state.rows && this.state.rows.fees, 'Convenience Fee',this.state.rows && this.state.rows.loan_amount,true)}%`
                            ],
                            [' ',' ',' ',' '],
                            [' ',' ',' ',' '],
                            [' ',' ',' ',' '],
                        ]}   
                    />

                 {/* -----------------------------------------------------THIRD ROW----------------------------------------------------------------- */}
            
                    <GridDetail
                        title={'Info Penghasilan Saat Pengajuan'}
                        gridLabel={[3]}
                        label={[
                            ['Pendapatan perbulan','Penghasilan lain-lain (jika ada)','Sumber Penghasilan lain-lain',
                            this.state.status==='rejected'?"Alasan Ditolak":this.state.status==="approved"?"Tanggal Pencairan":"Alasan/ Tanggal Pencairan"
                            ]
                        ]}
                        data={this.state.rows && this.state.borrowerDetail&& [
                            [
                            this.state.borrowerDetail.monthly_income?
                            GlobalFunction.formatMoney(parseInt(this.state.borrowerDetail.monthly_income))
                            :0,
                            this.state.borrowerDetail.other_income?GlobalFunction.formatMoney(parseInt(this.state.borrowerDetail.other_income)):0,
                            this.state.borrowerDetail.other_incomesource,
                            this.state.status==='rejected'? this.state.rows.reject_reason : this.state.status==="approved"? handleFormatDate(this.state.rows.disburse_date) :""
                            ],
                            
                        ]}                 
                    />

                 {/* -----------------------------------------------------FORM ROW----------------------------------------------------------------- */}
                        <GridDetail
                            title={'Form'}
                            data={[]}
                            label={[]}
                        />
                       
                        <Grid container
                        style={
                            {
                              padding: '0px 0px 0px 10px',
                              fontWeight: 'normal',
                              borderRadius:'5px',
                              flexGrow:"1",
                              fontSize:"14px",
                              marginBottom:"10px"
                            }
                          }
                        
                        >
                            
                        {this.state.formInfo &&this.renderFormInfoJsx()}

                        </Grid>



                    <GridDetail
                        title={'Installment'}
                        data={[]}
                        label={[]}
                    />
                    <Grid container>
                         <Grid item sm={12} xs={12}>
                         <table className="table table-hover">
                             <thead style={{border:'none'}}>
                                    <tr>
                                        <td className="text-center">Period</td>
                                        <td className="text-center">Loan Payment</td>
                                        <td className="text-center">Interest Payment</td>
                                        <td className="text-center">Paid Date</td>
                                        <td className="text-center">Paid Status</td>
                                        <td className="text-center">Paid Amount</td>
                                        <td className="text-center">Underpayment</td>
                                        <td className="text-center">Penalty</td>
                                        <td className="text-center">Due Date</td>
                                        <td className="text-center">Note</td>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.state.installment&& this.renderInstallmentJsx()}
                                </tbody>
                            </table>
                         </Grid>
                    </Grid>

                    
                    </Grid>
                </Grid>

              
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