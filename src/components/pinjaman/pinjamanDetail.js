import React from 'react'
import { Redirect } from 'react-router-dom'
import { getDetailFunction } from './saga';
import Loading from '../subComponent/Loading';
import { checkPermission, handleFormatDate, findAmount, formatMoney, decryptImage } from '../global/globalFunction'
import { getTokenAuth, getToken } from '../index/token';
import GridDetail from '../subComponent/GridDetail'
import TitleBar from '../subComponent/TitleBar';
import { Grid } from '@material-ui/core';
import ActionComponent from '../subComponent/ActionComponent';
import TableComponent from '../subComponent/TableComponent';

const columnDataUser = [
    {
        id: 'id',
        label: 'ID Pinjaman',
        hidden: true,
    },
    {
        id: 'period',
        label: 'Period',
    },
    {
        id: 'due_date',
        label: 'Tanggal Jatuh Tempo',
        type:'datetime'
    },
    {
        id: 'total',
        label: 'Total Cicilan',
    },
    {
        id: 'loan_payment_string',
        label: 'Cicilan Pokok',
    },
    {
        id: 'interest_payment_string',
        label: 'Cicilan Bunga',
    },
    {
        id: 'penalty_string',
        label: 'Pinalti',
    },
    {
        id: 'paid_amount_string',
        label: 'Total Pembayaran',
    },
    {
        id: 'paid_date',
        label: 'Tanggal Pembayaran',
        type:'datetime'
    },
    {
        id: 'paid_status_string',
        label: 'Status',
    },
    {
        id: 'note',
        label: 'Catatan',
    },
  
]

class Main extends React.Component{
    _isMounted=false

    state = {
        errorMessage:'',
        endDate:null,
        diterima:false,
        dicairkan: false,
        dipinjam:false,
        ditolak:false,
        loading:true,
        dateApprove:null,
        reason:'',
        dialog: false,
        statusPinjaman: '',
        status:'',
        disburse_status: '',
        payment_status: '',
        paymentNote: '',
        paymentStatus: '',
        title:'',
        rowsPerPage: 12,
        page: 1,
        totalData: 0,
        paging: true,
        loadingPage: false,
        permissionPaidInstallment: false,
        dataListPaid: [
            {
                id: 'processing',
                label: 'Dalam Proses'
            },
            {
                id: 'paid',
                label: 'Telah Lunas'
            },
            {
                id: 'failed',
                label: 'Gagal Bayar'
            },
        ]
    }

    componentDidMount(){
        this._isMounted=true
        this.getDataDetail()
    }

    componentWillUnmount(){
        this._isMounted=false
    }

    getDataDetail =()=>{
        this._isMounted && this.refresh()
    }

    permissionBtnPaid = () => {
        let flag = false;

        if(
            checkPermission('lender_loan_installment_approve') &&
            this.state.status && this.state.status === 'approved' &&
            this.state.disburse_status && this.state.disburse_status === 'confirmed' &&
            this.state.payment_status && this.state.payment_status === 'processing'
        ) {
            flag = true;
        }

        return flag
    }

    refresh = async function(){
        const param = {}
        param.id = this.props.match.params.idLoan 

        const data = await getDetailFunction (param)

        if(data){
            if(!data.error){                    
                const rows = data.dataLender;
     
                const pinjamanInfo = this.getPinjamanInfo(rows);
                const detailInfo = this.getDetailInfo(rows);
                const feesInfo = this.getFeesInfo(data.dataLender && data.dataLender.fees, rows && rows.loan_amount)
                const formInfo = this.getFormInfo(data.dataLender && data.dataLender.form_info && (typeof(data.dataLender.form_info) !== 'object' ? JSON.parse(data.dataLender.form_info) : data.dataLender.form_info))
                const borrowerInfo = this.getBorrowerInfo(data.dataLender && data.dataLender.borrower_info);                 
                const allInstallment = data.dataLender && data.dataLender.installment_details;

                this.getInstallmentInfo(data.dataLender.installment_details);
                
                this.setState({
                    pinjamanInfo,
                    formInfo,
                    feesInfo,
                    borrowerInfo,
                    detailInfo,
                    allInstallment,
                    status: rows && rows.status,
                    disburse_status: rows && rows.disburse_status,
                    payment_status: rows && rows.payment_status,
                    paymentStatus: rows && rows.payment_status,
                    paymentNote: rows && rows.payment_note,
                    loading:false,
                    loadingPage: false,
                })
                
            }else{
                this.setState({errorMessage:data.error, loading:false, loadingPage: false,})
            }
        }
    }

    getInstallmentInfo = (installmentParam) => {
        const installment = installmentParam || this.state.allInstallment;
        const installmentInfo = [];
        const page = this.state.page;
        const rowsPerPage = this.state.rowsPerPage;
        let totalData = 0;
        
        if(installment) {
            for(const key in installment) {
                if(parseInt(key) >= (rowsPerPage * (page-1)) && parseInt(key) < (rowsPerPage * page)) {
                    const newInstallment = installment[key];
                    
                    newInstallment.paid_status_string = newInstallment.paid_status ? 'Sudah Bayar' : 'Belum Bayar';
                    newInstallment.paid_amount_string = formatMoney(parseFloat(newInstallment.paid_amount || 0))
                    newInstallment.interest_payment_string = formatMoney(parseFloat(newInstallment.interest_payment || 0))
                    newInstallment.loan_payment_string = formatMoney(parseFloat(newInstallment.loan_payment || 0))
                    newInstallment.penalty_string = formatMoney(parseFloat(newInstallment.penalty || 0))
                    newInstallment.total = formatMoney(Math.ceil(parseFloat(newInstallment.loan_payment + newInstallment.interest_payment + newInstallment.penalty)))
                    installmentInfo.push(installment[key])
                }
                totalData += 1;
            }
        }
        
        this.setState({totalData, loadingPage: false, installmentInfo})
        
    }

    getDetailInfo = (rows) => {
        let pinjamanInfo = null;

        if(rows) {
            pinjamanInfo = {
                title: [
                    ['ID Pinjaman','Nasabah', 'Rekening'],
                    ['Status Pinjaman','Kategori', 'Agen/ AE'],
                ],
                value: [
                    [
                        rows.id,
                        `${rows.borrower_name || '-'} ( ${rows.borrower || '-'} )`,
                        rows.bank_account,
                    ],
                    [
                        rows.status &&   rows.status === "processing" ? {value:"Dalam Proses", color:'blue'} : 
                        rows.status === "approved" && rows.disburse_status ==="confirmed" ? {value:"Telah Dicairkan", color:'blue'} :
                        rows.status ==='rejected'? {value:"Ditolak", color:'red'} :
                        rows.status === 'approved'? {value:"Diterima", color:'green'} : null,
                        rows.category === ""? "Personal":
                        rows.category==="account_executive"?"Account Executive":"Agent",
                        `${rows.agent_name?rows.agent_name:"-"} (${rows.agent_provider_name?rows.agent_provider_name:"-"})`
                    ],
                ],
            }

            if(rows.status === 'approved' && rows.disburse_status === 'confirmed') {
                pinjamanInfo.title[0].push('Status Pembayaran')
                pinjamanInfo.value[0].push(rows.payment_status && (rows.payment_status === 'processing' ? {value:"Dalam Proses", color:'blue'}  : rows.payment_status === 'paid' ? {value:"Telah Lunas", color:'green'}  : rows.payment_status === 'failed' ? {value:"Gagal Bayar", color:'red'} : '-'))
                pinjamanInfo.title[1].push('Catatan Pembayaran')
                pinjamanInfo.value[1].push(rows.payment_note)
            }
        }
        

        return pinjamanInfo;
    }

    getBorrowerInfo = (borrower) => {
        let borrowerInfo = null;

        if(borrower) {
            borrowerInfo = {
                title: [
                    ['Tanggal lahir','Nomor Telepon', 'Nomor KTP', 'Nomor NPWP'],
                    ['Pendapatan', 'Sumber Pendapatan', 'Pendapatan Lainnya','Sumber Pendapatan Lainnya'],
                ],
                value: [
                    [handleFormatDate(borrower.birthday), borrower.phone, borrower.idcard_number, borrower.taxid_number ],
                    [formatMoney(borrower.monthly_income), borrower.occupation, formatMoney(borrower.other_income), borrower.other_incomesource]
                ],
            }
        }

        return borrowerInfo;
    }

    getPinjamanInfo = (rows) => {
        let pinjamanInfo = null;

        if(rows) {
            pinjamanInfo = {
                title: [
                    ['Total Pinjaman','Pinjaman Pokok', 'Tenor'],
                    ['Produk', 'Bunga', 'Tujuan Pinjaman','Keterangan'],
                    ['Tanggal Pengajuan']
                ],
                value: [
                    [formatMoney(rows.total_loan),formatMoney(rows.loan_amount), rows.installment],
                    [rows.product,`${rows.interest}%`, rows.loan_intention, rows.intention_details],
                    [handleFormatDate(rows.created_at)]
                ],
            }
    
            if(rows.status === 'approved') {
                pinjamanInfo.title[0].push('Total Pencairan')
                pinjamanInfo.value[0].push(formatMoney(rows.disburse_amount))
                pinjamanInfo.title[2].push('Tanggal Penerimaan')
                pinjamanInfo.value[2].push(handleFormatDate(rows.approval_date))
                pinjamanInfo.title[2].push('Tanggal Pencairan')
                pinjamanInfo.value[2].push(`${handleFormatDate(rows.disburse_date)} ${rows.disburse_date_changed ? '(Telah Diubah)' : ''}`)
            } else if(rows.status === 'rejected') {
                pinjamanInfo.title[2].push('Tanggal Penolakan')
                pinjamanInfo.value[2].push(handleFormatDate(rows.approval_date))
                pinjamanInfo.title[2].push('Alasan Penolakan')
                pinjamanInfo.value[2].push(rows.reject_reason)
            }
        }
        

        return pinjamanInfo;
    }

    getFeesInfo = (fees, loanAmount) => {
        let feesInfo = null
        
        if(fees) {
            feesInfo = {
                title: [],
                value: [],
            }

            let arrayFee = 0;

            for(const key in fees) {
                if(arrayFee === 2) {
                    arrayFee = 0;
                }

                if(!feesInfo.title[arrayFee]) {
                    feesInfo.title[arrayFee] = []
                };
                feesInfo.title[arrayFee].push(fees[key].description)

                if(!feesInfo.value[arrayFee]) {
                    feesInfo.value[arrayFee] = []
                };
                feesInfo.value[arrayFee].push(findAmount(fees[key] && fees[key].amount, loanAmount))

                arrayFee += 1;
            }
        }

        return feesInfo;
    }

    getFormInfo = (form) => {
        let formInfo = null;
        
        if(form) { 
            formInfo = {
                title: [],
                value: [],
            }

            let arrayForm = 0;

            for(const key in form) {
                if(arrayForm === 3) {
                    arrayForm = 0
                }

                if(!formInfo.title[arrayForm]) {
                    formInfo.title[arrayForm] = []
                };
                formInfo.title[arrayForm].push(form[key].label)

                if(!formInfo.value[arrayForm]) {
                    formInfo.value[arrayForm] = []
                };

                if(form[key].type === 'image') {
                    formInfo.value[arrayForm].push({
                        type:'image',
                        value: form[key].answers && decryptImage(form[key].answers),
                    })
                } else {
                    formInfo.value[arrayForm].push(form[key].answers)
                }

                arrayForm += 1;
            }
        }
        
        return formInfo;
    }

    btnBack = ()=>{
        this.setState({diKlik: true})
    }

    constructDate = (date) => {
        let newDate = date;

        if(typeof(date) === 'object') {
            newDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}`: date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`
        } 

        return newDate;
    }

    onChangePage = (current) => {
        this.setState({loadingPage:true,page:current},()=>{
            this.getInstallmentInfo(this.state.allInstallment)
        })
    }

    render(){
        if(this.state.loading){
            return(
                <Loading
                    title={'Pinjaman - Detail'}
                /> 
            )
        } else if(this.state.diKlik){
            return (
                <Redirect to='/pinjamanList' />
            )   
        } else if(getTokenAuth() && getToken()){
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
                    
                    <Grid container>

                        <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                            <ActionComponent
                                onCancel={this.btnBack}
                            />
                        </Grid> 

                        <Grid item sm={12} xs={12} style={{color:'red'}}>
                            {this.state.errorMessage}
                        </Grid>

                        {/* Detail Pinjaman */}
                        {   this.state.detailInfo && 
                            <GridDetail
                                gridLabel={[4,5]}
                                noTitleLine
                                background
                                label={this.state.detailInfo.title}
                                data={this.state.detailInfo.value}                 
                            />
                        }
                        

                        {/* Pinjaman Section */}
                        {   this.state.pinjamanInfo &&
                            <GridDetail
                                title={'Informasi Pinjaman'}
                                gridLabel={[5,5]}
                                label={ this.state.pinjamanInfo.title }
                                data={ this.state.pinjamanInfo.value }                 
                            />
                        }

                        {/* Nasabah Section */}
                        {   this.state.borrowerInfo &&
                            <GridDetail
                                title={'Informasi Nasabah'}
                                gridLabel={[4,6]}
                                label={this.state.borrowerInfo.title}
                                data={this.state.borrowerInfo.value}                 
                            />
                        }

                        {/* Fee Section */}
                        {
                            this.state.feesInfo &&
                            <GridDetail
                                gridLabel={[4,4]}
                                title={'Informasi Biaya'}
                                label={this.state.feesInfo.title}
                                data={this.state.feesInfo.value}   
                            />
                        }
                        
                        
                        {/* Form Section */}
                        {   this.state.formInfo && 
                            <GridDetail
                                gridLabel={[4,4]}
                                title={'Informasi Form'}
                                label={this.state.formInfo.title}
                                data={this.state.formInfo.value}   
                            />
                        }

                        {   this.state.installmentInfo &&
                            <GridDetail
                                gridLabel={[4,4]}
                                title={'Informasi Cicilan'}
                                label={[]}
                                data={[]}   
                            />
                        }

                        {   this.state.installmentInfo &&
                            < TableComponent
                                id={'id'}
                                paging={this.state.paging}
                                loading={this.state.loadingPage}
                                columnData={columnDataUser}
                                data={this.state.installmentInfo}
                                page={this.state.page}
                                rowsPerPage={this.state.rowsPerPage}
                                totalData={this.state.totalData}
                                onChangePage={this.onChangePage}     
                            /> 
                        }
                                

                    </Grid>
                </Grid>
            </Grid>
        )} else {
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default Main;