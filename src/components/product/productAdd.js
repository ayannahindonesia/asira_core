import React from 'react'
import { Redirect } from 'react-router-dom'
import './../../support/css/productAdd.css'
import swal from 'sweetalert'
import { addProductFunction} from './saga';
import { getToken } from '../index/token';
import { getAllLayananListFunction } from '../layanan/saga';
import { Grid, InputAdornment, FormControlLabel, Checkbox, TextField, IconButton, Tooltip } from '@material-ui/core';
import DropDown from '../subComponent/DropDown';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TitleBar from '../subComponent/TitleBar';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { constructFees, constructCollaterals, constructSector, constructMandatory } from './function';
import DialogComponent from '../subComponent/DialogComponent';
import { checkPermission } from '../global/globalFunction';
import NumberFormatCustom from '../subComponent/NumberFormatCustom';


class ProductAdd extends React.Component{
    _isMounted = false;
    state = {
        namaProduct: '', 
        errorMessage:null,
        bankService:[],
        diKlik:false,
        check:true,
        checkAuto:true,
        asuransi: '',
        rentangFrom:'',
        rentangTo:'',
        timeFrom: '',
        timeTo: '',
        layanan:0,
        interest:'',
        tipeBunga:'fixed',
        dialog: false,
        feeType:'deduct_loan',
        listTypeFee:[
            {
                id: 'deduct_loan',
                name: 'Potong dari Plafon'
            },
            {
                id: 'charge_loan',
                name: 'Tambah ke Cicilan'
            },
        ],
        agunan:[
            {
                label: '',
                type: '',
                value: '',
            }
        ],
        sektor:[
            {
                label: '',
                type: '',
                value: '',
            }
        ],
        fee:[
            {
                label: '',
                type: 'percent',
                value: '',
            }
        ],
        mandatory:[
            {
                label: '',
                type: 'textfield',
                value: '',
            }
        ],
        listRequired:[
            {
                id:'required',
                label:'Required'
            },
            {
                id:'optional',
                label:'Optional'
            },
            
        ],
        listType:[
            {
                id:'textfield',
                label:'Text Field'
            },
            {
                id:'dropdown',
                label:'Drop Down'
            },
            {
                id:'checkbox',
                label:'Checkbox'
            },    
            {
                id:'image',
                label:'Image'
            },      
        ],
        listInterestType:[
            {
                id:'percent',
                label:'Percent (%)'
            },
            {
                id:'rupiah',
                label:'Rupiah (IDR)'
            },
            
        ],
        listBunga:[
            {
                id: 'fixed',
                name: 'Fixed Anually'
            },
            {
                id: 'flat',
                name: 'Flat'
            },
            {
                id: 'onetimepay',
                name: 'One Time Loan'
            },
            {
                id: 'efektif_menurun',
                name: 'Efektif Menurun'
            },
        ]
    };

    componentDidMount(){
        this._isMounted=true;
        this.getBankService()
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    btnConfirmationDialog = (e, nextStep) => {
        this.setState({dialog: !this.state.dialog})

        if(nextStep) {
            this.btnSaveProduct()
        }
    }

    btnSaveProduct = ()=>{

        if(this.validate()) {
            let newData = {
                name: this.state.namaProduct,
                service_id: parseInt(this.state.layanan),
                min_timespan: parseInt(this.state.timeFrom),
                max_timespan: parseInt(this.state.timeTo),
                interest: parseFloat(this.state.interest),
                min_loan: parseFloat(this.state.rentangFrom),
                max_loan: parseFloat(this.state.rentangTo),
                interest_type: this.state.tipeBunga,
                auto_paid: this.state.checkAuto,
                status: this.state.check ? 'active':'nonactive',
            }

            let fees = constructFees(this.state.fee || [], this.state.feeType);
            let agunan = constructCollaterals(this.state.agunan || []);
            let sektor = constructSector(this.state.sektor || []);
            let mandatory = constructMandatory(this.state.mandatory || []);

            if(this.state.asuransi && this.state.asuransi.toString().trim().length !== 0) {
                newData.assurance = this.state.asuransi
            }

            if(fees) {
                newData.fees = fees;
            }

            if(sektor) {
                newData.financing_sector = sektor;
            }

            if(agunan) {
                newData.collaterals = agunan;
            }

            if(mandatory) {
                newData.form = mandatory;
            }

            this.setState({loading: true})

            this.productAddBtn(newData)
        }
        
    }

    validate = () => {
        let flag = true;

        if(!this.state.namaProduct || this.state.namaProduct.trim().length === 0) {
            flag = false;
            this.setState({errorMessage: 'Mohon isi Nama Produk dengan benar'})
        } else if(!this.state.layanan || this.state.layanan === 0) {
            flag = false;
            this.setState({errorMessage: 'Mohon pilih layanan dengan benar'})
        } else if(!this.state.interest || this.state.interest === 0 || this.state.interest.toString().trim().length === 0) {
            flag = false;
            this.setState({errorMessage: 'Mohon isi bunga dengan benar'})
        } else if(
            !this.state.rentangFrom || this.state.rentangFrom === 0 || this.state.rentangFrom.toString().trim().length === 0 ||
            !this.state.rentangTo || this.state.rentangTo === 0 || this.state.rentangTo.toString().trim().length === 0 ||
            parseFloat(this.state.rentangFrom) > parseFloat(this.state.rentangTo)
        ) {
            flag = false;
            this.setState({errorMessage: 'Mohon isi Rentang Nilai Pengajuan dengan benar'})
        } else if(
            !this.state.timeFrom || this.state.timeFrom === 0 || this.state.timeFrom.toString().trim().length === 0 ||
            !this.state.timeTo || this.state.timeTo === 0 || this.state.timeTo.toString().trim().length === 0 ||
            parseFloat(this.state.timeFrom) > parseFloat(this.state.timeTo)
        ) {
            flag = false;
            this.setState({errorMessage: 'Mohon isi jangka waktu dengan benar'})
        }

        return flag
    }

    productAddBtn = async function (params) {
        const data = await addProductFunction(params)
        if(data){
            if(!data.error){
                swal("Berhasil","Produk berhasil bertambah","success")
                this.setState({errorMessage:null,diKlik:true, loading: false})
            }else{
                this.setState({errorMessage:data.error, loading: false})
            }
        }
    }
    
    getBankService = async function () {
        const data = await getAllLayananListFunction({})
        if(data){

            if(!data.error){
                let serviceNew = 0;

                if(data && data.listLayanan && data.listLayanan.data && data.listLayanan.data.length && data.listLayanan.data.length > 0) {
                    serviceNew = data.listLayanan.data[0].id;
                }

                this.setState({bankService:data.listLayanan.data, layanan: serviceNew})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    handleChecked = (e, labelData)=>{
        this.setState({[labelData]:!this.state[labelData]})
    }

    changeFlexibleData = (e, stringLabel, index, labelData, numeric) => {
        const arrayData = this.state[labelData];

        if(numeric && isNaN(e.target.value)) {           
                      
        } else {
            arrayData[index][stringLabel] = e.target.value;
        }

        this.setState({[labelData]: arrayData})
    }

    btnTambahFlexibleData = (e, labelData) => {
        const arrayData = this.state[labelData];

        const dataNew = {
            label: '',
            type: labelData === 'mandatory' ? 'textfield' : labelData === 'fee' ? 'percent' : '',
            value: '',
        }

        if(labelData === 'mandatory') {
            dataNew.status='required';
        }

        arrayData.push(dataNew)

        

        this.setState({[labelData]:arrayData});
    }

    deleteFlexibleData = (e, index, labelData) => {
        
        const arrayData = this.state[labelData];
        const newArray = [];

        for(const key in arrayData) {
            
            if(key.toString() !== index.toString() || (key.toString() === '0' && arrayData.length === 1)) {
                newArray.push(arrayData[key])
            }

        }
        
        this.setState({[labelData]: newArray});
    }

    onChangeTextField = (e, labelData, number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }

        this.setState({[labelData]:dataText})
    }

    changeDropDown = (e, labelData) => {
        let newData = e.target.value;

        this.setState({[labelData]: newData})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/produkList'/>            

        } else if(getToken()){
            return (
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={'Produk - Tambah'}
                        />

                    </Grid>
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                        <Grid container>
                            {/* Dialog */}
                            <DialogComponent 
                                title={'Confirmation'}
                                message={'Are you sure want to save this data ?'}
                                type={'textfield'}
                                openDialog={this.state.dialog}
                                onClose={this.btnConfirmationDialog}
                            />
                            {/* Action Button */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                                <Grid container style={{display:'flex', justifyContent:'flex-end', padding:'0'}}>
                                    <Grid item xs={2} sm={2} style={{display:'flex', justifyContent:'flex-end'}}>
                                        
                                        {
                                           checkPermission('core_product_new') &&
                                            <Tooltip title="Save" style={{outline:'none'}}>
                                                <IconButton aria-label="save" onClick={this.btnConfirmationDialog} >
                                                    <SaveIcon style={{width:'35px',height:'35px'}} />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        <Tooltip title="Back" style={{outline:'none'}}>
                                            <IconButton aria-label="cancel" onClick={this.btnCancel}>
                                                <CancelIcon style={{width:'35px',height:'35px'}} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Error */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                {this.state.errorMessage}
                            </Grid>
                            {/* Nama Produk */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Nama Produk
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="namaProduct"
                                            value={this.state.namaProduct}
                                            onChange={(e) => this.onChangeTextField(e,'namaProduct')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Layanan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'30px'}}>
                                        Layanan
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <DropDown
                                            value={this.state.layanan}
                                            label="name"
                                            data={this.state.bankService}
                                            id="id"
                                            labelName={"name"}
                                            onChange={(e) => this.changeDropDown(e,'layanan')}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Bunga */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'30px'}}>
                                        Bunga
                                    </Grid>
                                    <Grid item xs={1} sm={1} style={{paddingTop:'12px', marginRight:'20px'}}>
                                        <TextField
                                            id="interest"
                                            value={this.state.interest}
                                            onChange={(e) => this.onChangeTextField(e,'interest', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3} >
                                        <DropDown
                                            value={this.state.tipeBunga}
                                            label="name"
                                            data={this.state.listBunga}
                                            id="id"
                                            labelName={"name"}
                                            onChange={(e) => this.changeDropDown(e,'tipeBunga')}
                                            fullWidth

                                        />
                                    </Grid>
                                </Grid>
                            </Grid>                       
                            {/* Jangka Waktu */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Jangka Waktu (Bulan)
                                    </Grid>
                                    <Grid item xs={1} sm={1} >
                                        <TextField
                                            id="timeFrom"
                                            value={this.state.timeFrom}
                                            onChange={(e) => this.onChangeTextField(e, 'timeFrom', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item sm={1} xs={1} style={{paddingTop:'10px'}}>
                                        <hr style={{maxWidth:'10px',borderTop:'1px solid black'}}></hr>
                                    </Grid>
                                    <Grid item xs={1} sm={1} >
                                        <TextField
                                            id="timeTo"
                                            value={this.state.timeTo}
                                            onChange={(e) => this.onChangeTextField(e, 'timeTo', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Rentang Nilai Pengajuan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Rentang Nilai Pengajuan
                                    </Grid>
                                    <Grid item xs={2} sm={2} >
                                        <TextField
                                            id="rentangFrom"
                                            value={this.state.rentangFrom}
                                            onChange={(e) => this.onChangeTextField(e, 'rentangFrom', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                                startAdornment: <InputAdornment position="start"> Rp </InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item sm={1} xs={1} style={{paddingTop:'10px'}}>
                                        <hr style={{maxWidth:'10px',borderTop:'1px solid black'}}></hr>
                                    </Grid>
                                    <Grid item xs={2} sm={2} >
                                        <TextField
                                            id="rentangTo"
                                            value={this.state.rentangTo}
                                            onChange={(e) => this.onChangeTextField(e, 'rentangTo', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                                startAdornment: <InputAdornment position="start"> Rp </InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Asuransi */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Asuransi
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="asuransi"
                                            value={this.state.asuransi}
                                            onChange={(e) => this.onChangeTextField(e,'asuransi')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>   
                             {/* Tipe Fee */}
                             <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'25px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'30px'}}>
                                        Tipe Fee
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <DropDown
                                            value={this.state.feeType}
                                            label="name"
                                            data={this.state.listTypeFee}
                                            id="id"
                                            labelName={"name"}
                                            onChange={(e) => this.changeDropDown(e,'feeType')}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Auto Paid */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'20px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'10px'}}>
                                        Auto Paid
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.checkAuto}
                                                    onChange={(e) => this.handleChecked(e, 'checkAuto')}
                                                    color={this.state.checkAuto ? "primary":"default"}
                                                    value="default"
                                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                                />
                                            }
                                            label={'Auto Paid'}
                                        />
                                        
                                    </Grid>
                                </Grid>
                            </Grid>      
                            {/* Status */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'20px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'10px'}}>
                                        Status
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.check}
                                                    onChange={(e) => this.handleChecked(e, 'check')}
                                                    color={this.state.check ? "primary":"default"}
                                                    value="default"
                                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                                />
                                            }
                                            label={'Aktif'}
                                        />
                                        
                                    </Grid>
                                </Grid>
                            </Grid>   
                            {/* Sektor Pembiayaan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={3} sm={3} >
                                        Sektor Pembiayaan
                                        <IconButton aria-label="delete" onClick={(e) => this.btnTambahFlexibleData(e, 'sektor')} style={{marginLeft:'5px',outline:'none'}}>
                                            <AddIcon />
                                        </IconButton>

                                    </Grid>

                                    <Grid item xs={12} sm={12} style={{marginBottom:'10px'}}>
                                        
                                        <Grid container>
                                        {
                                            this.state.sektor.map((sektorPerData, index) => {
                                                return (
                                                    <Grid item xs={3} sm={3} key={index} style={{marginRight:'20px'}}>
                                                        <Grid container> 
                                                            <Grid item xs={10} sm={10} style={{marginRight:'2px',paddingTop:'10px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    onChange={(e) => this.changeFlexibleData(e,'label', index, 'sektor')}
                                                                    placeholder={'Sektor Pembiayaan'}
                                                                    value={sektorPerData.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                />
                                                            </Grid> 
                                                            <Grid item xs={1} sm={1} style={{paddingTop:'12px'}}>
                                                                <IconButton aria-label="delete" onClick={(e) => this.deleteFlexibleData(e,index,'sektor')} style={{outline:'none'}}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Grid>  
                                                        </Grid>
                                                         
                                                    </Grid> 
                                                )
                                            },this)
                                        }
                                        </Grid>
                                        
                                    </Grid>                                         
                                    
                                </Grid>
                            </Grid>

                            {/* Agunan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={2} sm={2} >
                                        Agunan
                                        <IconButton aria-label="delete" onClick={(e) => this.btnTambahFlexibleData(e, 'agunan')} style={{marginLeft:'5px',outline:'none'}}>
                                            <AddIcon />
                                        </IconButton>

                                    </Grid>

                                    <Grid item xs={12} sm={12} style={{marginBottom:'10px'}}>
                                        
                                        <Grid container>
                                        {
                                            this.state.agunan.map((agunanPerData, index) => {
                                                return (
                                                    <Grid item xs={3} sm={3} key={index} style={{marginRight:'20px'}}>
                                                        <Grid container> 
                                                            <Grid item xs={10} sm={10} style={{marginRight:'2px',paddingTop:'10px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    onChange={(e) => this.changeFlexibleData(e,'label', index, 'agunan')}
                                                                    placeholder={'Nama Agunan'}
                                                                    value={agunanPerData.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                />
                                                            </Grid> 
                                                            <Grid item xs={1} sm={1} style={{paddingTop:'12px'}}>
                                                                <IconButton aria-label="delete" onClick={(e) => this.deleteFlexibleData(e,index,'agunan')} style={{outline:'none'}}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Grid>  
                                                        </Grid>
                                                         
                                                    </Grid> 
                                                )
                                            },this)
                                        }
                                        </Grid>
                                        
                                    </Grid>                                         
                                    
                                </Grid>
                            </Grid>
                            
                            {/* Fee */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={2} sm={2} >
                                        Fee
                                        <IconButton aria-label="delete" onClick={(e) => this.btnTambahFlexibleData(e, 'fee')} style={{marginLeft:'5px',outline:'none'}}>
                                            <AddIcon />
                                        </IconButton>

                                    </Grid>

                                    {
                                        this.state.fee.map((feePerData, index) => {
                                            return (
                                                <Grid item xs={12} sm={12} key={index} style={{marginBottom:'10px'}}>
                                                    {
                                                        <Grid container>
                                                            <Grid item xs={3} sm={3} style={{marginRight:'20px',paddingTop:'12px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    onChange={(e) => this.changeFlexibleData(e,'label', index, 'fee')}
                                                                    placeholder={'Nama Fee'}
                                                                    value={feePerData.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                />
                                                            </Grid> 
                                                            
                                                            <Grid item xs={2} sm={2} style={{marginRight:'20px'}}>
                                                                <DropDown
                                                                    value={feePerData.type}
                                                                    label="label"
                                                                    data={this.state.listInterestType}
                                                                    id="id"
                                                                    labelName={"label"}
                                                                    onChange={(e) => this.changeFlexibleData(e,'type', index, 'fee')}
                                                                    fullWidth
                                                                />
                                                            </Grid>                                      
                                                        
                                                            
                                                            <Grid item xs={2} sm={2} style={{marginRight:'10px',paddingTop:'12px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    onChange={(e) => this.changeFlexibleData(e,'value', index, 'fee', true)}
                                                                    placeholder={'Amount'}
                                                                    value={feePerData.value}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    InputProps={{
                                                                        inputComponent: NumberFormatCustom,
                                                                    }}
                                                                />
                                                            </Grid> 
                                                            

                                                            <Grid item xs={1} sm={1} style={{marginRight:'20px', paddingTop:'12px'}}>
                                                                <IconButton aria-label="delete" onClick={(e) => this.deleteFlexibleData(e,index,'fee')} style={{outline:'none'}}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Grid>         
                                                            
                                                        </Grid>
                                                    }
                                                </Grid>
                                            )

                                        },this)
                                    }
                                </Grid>
                            </Grid>
                            {/* Mandatory */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px',marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={2} sm={2}>
                                        Mandatory
                                        <IconButton aria-label="delete" onClick={(e) => this.btnTambahFlexibleData(e, 'mandatory')} style={{marginLeft:'5px',outline:'none'}}>
                                            <AddIcon />
                                        </IconButton>

                                    </Grid>
                        

                                    {
                                        this.state.mandatory.map((mandatoryPerData, index) => {
                                            return (
                                                <Grid item xs={12} sm={12} key={index} style={{marginBottom:'10px'}}>
                                                    {
                                                        <Grid container>
                                                            <Grid item xs={3} sm={3} style={{marginRight:'20px',paddingTop:'12px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    onChange={(e) => this.changeFlexibleData(e,'label', index, 'mandatory')}
                                                                    placeholder={'Judul Pertanyaan'}
                                                                    value={mandatoryPerData.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                />
                                                            </Grid> 
                                                            
                                                            <Grid item xs={2} sm={2} style={{marginRight:'20px'}}>
                                                                <DropDown
                                                                    value={mandatoryPerData.type}
                                                                    label="label"
                                                                    data={this.state.listType}
                                                                    id="id"
                                                                    labelName={"label"}
                                                                    onChange={(e) => this.changeFlexibleData(e,'type', index, 'mandatory')}
                                                                    fullWidth
                                                                />
                                                            </Grid> 

                                                            <Grid item xs={2} sm={2} style={{marginRight:'20px'}}>
                                                                <DropDown
                                                                    value={mandatoryPerData.status}
                                                                    label="label"
                                                                    data={this.state.listRequired}
                                                                    id="id"
                                                                    labelName={"label"}
                                                                    onChange={(e) => this.changeFlexibleData(e,'status', index, 'mandatory')}
                                                                    fullWidth
                                                                />
                                                            </Grid>                                      
                                                        
                                                            {
                                                                (mandatoryPerData.type === 'dropdown' || mandatoryPerData.type === 'checkbox')  &&
                                                                <Grid item xs={3} sm={3} style={{marginRight:'10px',paddingTop:'12px'}}>
                                                                    <TextField 
                                                                        fullWidth
                                                                        onChange={(e) => this.changeFlexibleData(e,'value', index, 'mandatory')}
                                                                        placeholder={'Pilihan Pertanyaan ex:albert,ganteng'}
                                                                        value={mandatoryPerData.value}
                                                                        margin="dense"
                                                                        variant="outlined"
                                                                    />
                                                                </Grid> 
                                                            }

                                                            <Grid item xs={1} sm={1} style={{marginRight:'20px', paddingTop:'10px'}}>
                                                                <IconButton aria-label="delete" onClick={(e) => this.deleteFlexibleData(e,index,'mandatory')} style={{outline:'none'}}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Grid>         
                                                            
                                                        </Grid>
                                                    }
                                                </Grid>
                                            )

                                        },this)
                                    }
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>
            )
            
            
        } else if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        } else {
            return null;
        }
       
    }
}

export default ProductAdd;