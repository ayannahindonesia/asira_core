import React from 'react'
import { Redirect } from 'react-router-dom'
import { GlobalFunction } from '../globalFunction'
import {  handleFormatDate,formatNumber, findAmount} from './../global/globalFunction'

import { getDetailFunction } from './saga';
import { getToken } from '../index/token';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import TitleBar from '../subComponent/TitleBar';
import GridDetail from './../subComponent/GridDetail'

class Main extends React.Component{
    state = {rows:{},items:[],borrowerDetail:{},formInfo:[],status:'',borrower_info:{},productInfo:{},redirecting:false,errorMessage:''}
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
            console.log(data)
            if(!data.error){
                this.setState({
                    formInfo:data.data.form_info,
                    borrowerDetail:data.data.borrower_info,rows:data.data,items:data.data.fees,status:data.data.status})
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
                <GridDetail
                key={index}
                gridLabel={[3,7]}
                label={
                [
                    
                    [val.label]
                ] 
                }
                data={this.state.rows && [
                    [this.desctructFormInfo(val.answers).toString()]
                ]}                 
                />
            )
        })
        return jsx
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

                    <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                        <Tooltip title="Back" style={{outline:'none'}}>
                            <IconButton aria-label="cancel" onClick={this.btnBack}>
                                <CancelIcon style={{width:'35px',height:'35px'}}/>
                            </IconButton>
                        </Tooltip>       
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
                    {this.renderFormInfoJsx()}


                    
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