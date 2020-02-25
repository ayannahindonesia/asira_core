import React from 'react'
import { Redirect } from 'react-router-dom'
import './../../support/css/productAdd.css'
import swal from 'sweetalert'
import { addProductFunction} from './saga';
import { getToken } from '../index/token';
import { getAllLayananListFunction } from '../layanan/saga';
import TextField from '@material-ui/core/TextField';
import { Grid, InputAdornment, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import DropDown from '../subComponent/DropDown';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TitleBar from '../subComponent/TitleBar';
import { constructFees, constructCollaterals, constructSector, constructMandatory } from './function';


class ProductAdd extends React.Component{
    _isMounted = false;
    state = {
        namaProduct: '', 
        errorMessage:null,
        bankService:[],
        diKlik:false,
        check:true,
        asuransi: '',
        rentangFrom:'',
        rentangTo:'',
        timeFrom: '',
        timeTo: '',
        layanan:0,
        interest:'',
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
        listType:[
            {
                id:'textfield',
                label:'Text Field'
            },
            {
                id:'dropdown',
                label:'Drop Down'
            },
            
        ],
        listTypeFee:[
            {
                id:'percent',
                label:'Percent (%)'
            },
            {
                id:'rupiah',
                label:'Rupiah (IDR)'
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

    btnSaveProduct = ()=>{

        if(this.validate()) {
            let newData = {
                name: this.state.namaProduct,
                service_id: this.state.layanan,
                min_timespan: this.state.timeFrom,
                max_timespan: this.state.timeTo,
                interest: this.state.interest,
                min_loan: this.state.rentangFrom,
                max_loan: this.state.rentangTo,
                status: this.state.check ? 'active':'nonactive',
            }

            let fees = constructFees(this.state.fee || []);
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
                newData.mandatory = mandatory;
            }

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
                this.setState({errorMessage:null,diKlik:true})
            }else{
                this.setState({errorMessage:data.error})
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

    handleChecked = ()=>{
        this.setState({check:!this.state.check})
    }

    changeFlexibleData = (e, stringLabel, index, labelData, numeric) => {
        const arrayMandatory = this.state[labelData];

        if(numeric && isNaN(e.target.value)) {           
                      
        } else {
            arrayMandatory[index][stringLabel] = e.target.value;
        }

        this.setState({[labelData]: arrayMandatory})
    }

    btnTambahFlexibleData = (e, labelData) => {
        const arrayMandatory = this.state[labelData];

        arrayMandatory.push(
            {
                label: '',
                type: labelData === 'mandatory' ? 'textfield' : labelData === 'fee' ? 'percent' : '',
                value: '',
            }
        )

        this.setState({[labelData]:arrayMandatory});
    }

    deleteFlexibleData = (e, index, labelData) => {
        
        const arrayMandatory = this.state[labelData];
        const newArray = [];

        for(const key in arrayMandatory) {
            
            if(key.toString() !== index.toString() || (key.toString() === '0' && arrayMandatory.length === 1)) {
                newArray.push(arrayMandatory[key])
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
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Bunga
                                    </Grid>
                                    <Grid item xs={1} sm={1} >
                                        <TextField
                                            id="interest"
                                            value={this.state.interest}
                                            onChange={(e) => this.onChangeTextField(e,'interest', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>                       
                            {/* Jangka Waktu */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Jangka Waktu
                                    </Grid>
                                    <Grid item xs={1} sm={1} >
                                        <TextField
                                            id="timeFrom"
                                            value={this.state.timeFrom}
                                            onChange={(e) => this.onChangeTextField(e, 'timeFrom', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
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
                                    <Grid item xs={3} sm={3} >
                                        <TextField
                                            id="rentangFrom"
                                            value={this.state.rentangFrom}
                                            onChange={(e) => this.onChangeTextField(e, 'rentangFrom', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"> Rp </InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item sm={2} xs={2} style={{paddingTop:'10px'}}>
                                        <hr style={{maxWidth:'10px',borderTop:'1px solid black'}}></hr>
                                    </Grid>
                                    <Grid item xs={3} sm={3} >
                                        <TextField
                                            id="rentangTo"
                                            value={this.state.rentangTo}
                                            onChange={(e) => this.onChangeTextField(e, 'rentangTo', true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"> Rp </InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Asuransi */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'25px'}}>
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
                            {/* Status */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'25px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'10px'}}>
                                        Status
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.check}
                                                    onChange={this.handleChecked}
                                                    color="default"
                                                    value="default"
                                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                                />
                                            }
                                            label={this.state.check ? 'Aktif' : 'Tidak Aktif'}
                                        />
                                        
                                    </Grid>
                                </Grid>
                            </Grid>    
                            {/* Sektor Pembiayaan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={2} sm={2} >
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
                                                            
                                                            <Grid item xs={3} sm={3} style={{marginRight:'20px'}}>
                                                                <DropDown
                                                                    value={feePerData.type}
                                                                    label="label"
                                                                    data={this.state.listTypeFee}
                                                                    id="id"
                                                                    labelName={"label"}
                                                                    onChange={(e) => this.changeFlexibleData(e,'type', index, 'fee')}
                                                                    fullWidth
                                                                />
                                                            </Grid>                                      
                                                        
                                                            
                                                            <Grid item xs={3} sm={3} style={{marginRight:'10px',paddingTop:'12px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    onChange={(e) => this.changeFlexibleData(e,'value', index, 'fee', true)}
                                                                    placeholder={'Amount'}
                                                                    value={feePerData.value}
                                                                    margin="dense"
                                                                    variant="outlined"
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
                                                            
                                                            <Grid item xs={3} sm={3} style={{marginRight:'20px'}}>
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
                                                        
                                                            {
                                                                mandatoryPerData.type === 'dropdown' &&
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
                            
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Button variant='contained' onClick={this.btnSaveProduct} style={{backgroundColor:"green",color:"white",marginRight:'20px'}}>Simpan</Button>
                                <Button variant='contained' onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}>Batal</Button>
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