import React from 'react'
import { Redirect } from 'react-router-dom'
import './../../support/css/DetailComponent.css'
import swal from 'sweetalert';
import DropDown from '../subComponent/DropDown';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TitleBar from '../subComponent/TitleBar';
import { Grid, InputAdornment, FormControlLabel, Checkbox, Button, TextField, IconButton, Tooltip } from '@material-ui/core';
import { editProductFunction, detailProductFunction,detailServiceProductFunction} from './saga';
import { getAllLayananListFunction, getDetailLayananFunction } from '../layanan/saga';
import { getToken } from '../index/token';
import Loader from 'react-loader-spinner';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { constructFees, constructCollaterals, constructSector, constructMandatory, destructFees, destructSector, destructCollaterals, destructMandatory } from './function';
import { checkPermission } from '../global/globalFunction';


class DetailComponent extends React.Component{
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
        tipeBunga:'fixed',
        loading:true,
        checkAuto:true,
        modifyType: false,
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
        listTypeFee:[
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
                id: 'effective_down',
                name: 'Efektif Menurun'
            },
        ]
    };

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
                interest_type: this.state.tipeBunga,
                auto_paid: this.state.checkAuto,
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

            this.productEditBtn(newData)
        }
        
    }
    

    componentDidMount(){
        this._isMounted = true
    }

    componentWillUnmount (){
        this._isMounted = false
    }

    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    renderTextfield = (data, column) => {
        let objectAdornment = null;

        if(column.startAdornment) {
            objectAdornment = {
                startAdornment: <InputAdornment position="start">{column.placeholder}</InputAdornment>,
            }
        } else if(column.endAdornment) {
            objectAdornment = {
                endAdornment: <InputAdornment position="end">{column.placeholder}</InputAdornment>,
            }
        }

        return(
            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                <Grid container>
                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                        {column.label}
                    </Grid>
                    <Grid item xs={column.grid || 4} sm={column.grid || 4} >
                        <TextField
                            id={column.id}
                            value={data}
                            onChange={(e) => column.function(e,column.id)} 
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            disabled={column.disabled}
                            InputProps={objectAdornment}
                        />
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    renderDropDown = (data, column) => {
        return (
            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                <Grid container>
                    <Grid item xs={4} sm={4} style={{paddingTop:'30px'}}>
                        {column.label}
                    </Grid>
                    <Grid item xs={column.grid || 4} sm={column.grid || 4} >
                        <DropDown
                            value={data}
                            label={column.labelName}
                            data={column.data}
                            id={column.labelId}
                            labelName={column.labelName}
                            onChange={(e) => column.function(e,column.id)}
                            fullWidth
                            disabled={column.disabled}
                        />
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    renderCheckBox = (data, column) => {
        return (
            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'20px'}}>
                <Grid container>
                    <Grid item xs={4} sm={4} style={{paddingTop:'10px'}}>
                        {column.label}
                    </Grid>
                    <Grid item xs={column.grid || 4} sm={column.grid || 4} >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data}
                                    onChange={(e) => column.function(e, column.id)}
                                    color={data ? "primary":"default"}
                                    value="default"
                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                />
                            }
                            label={column.placeholder}
                            disabled={column.disabled}
                        />
                        
                    </Grid>
                </Grid>
            </Grid> 
        );
    }

    renderRange = (data, data2, column) => {
        let objectAdornment = null;

        if(column.startAdornment) {
            objectAdornment = {
                startAdornment: <InputAdornment position="start">{column.placeholder}</InputAdornment>,
            }
        } else if(column.endAdornment) {
            objectAdornment = {
                endAdornment: <InputAdornment position="end">{column.placeholder}</InputAdornment>,
            }
        }

        return(
            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                <Grid container>
                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                        {column.label}
                    </Grid>
                    <Grid item xs={column.grid || 3} sm={column.grid || 3} >
                        <TextField
                            id={column.id}
                            value={data}
                            onChange={(e) => column.function(e, column.id, true)} 
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            InputProps={objectAdornment}
                            disabled={column.disabled}
                        />
                    </Grid>
                    <Grid item sm={column.gridDash} xs={column.gridDash} style={{paddingTop:'10px'}}>
                        <hr style={{maxWidth:'10px',borderTop:'1px solid black'}}></hr>
                    </Grid>
                    <Grid item xs={column.grid || 3} sm={column.grid || 3} >
                        <TextField
                            id={column.id2}
                            value={data2}
                            onChange={(e) => column.function(e, column.id2, true)} 
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            InputProps={objectAdornment}
                            disabled={column.disabled}
                        />
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    renderMultipleComponent = (data, column) => {
        return (
            null
        );
    }

    renderFlexible = (data, column) => {
        return (
            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                <Grid container>
                    <Grid item xs={2} sm={2} >
                        {column.label}
                        <IconButton aria-label="delete" disabled={column.disabled} onClick={(e) => column.function(e, column.id)} style={{marginLeft:'5px',outline:'none'}}>
                            <AddIcon />
                        </IconButton>

                    </Grid>

                    <Grid item xs={12} sm={12} style={{marginBottom:'10px'}}>
                        
                        <Grid container>
                        {
                            data.map((dataPerRow, index) => {
                                let indexKey = 0;

                                for(const key in dataPerRow) {
                                    indexKey += 1;
                                }

                                return (
                                    <Grid item xs={column.grid} sm={column.grid} key={index} style={{marginRight:'20px'}}>
                                        <Grid container> 
                                            {
                                                dataPerRow && Object.keys(dataPerRow).map((key) => {
                                                    if(key === 'status' || key === 'type') {
                                                        return (
                                                            <Grid item xs={parseInt(10/(indexKey > 0 ? indexKey : 10))} sm={parseInt(10/(indexKey > 0 ? indexKey : 10))} style={{marginRight:'20px'}}>
                                                                <DropDown
                                                                    value={dataPerRow[key]}
                                                                    label="label"
                                                                    data={column.data[column.id]}
                                                                    id="id"
                                                                    labelName={"label"}
                                                                    onChange={(e) => column.functionChange(e, key, index, column.id)}
                                                                    fullWidth
                                                                    disabled={column.disabled}
                                                                />
                                                            </Grid>  
                                                        );
                                                        
                                                    } else {
                                                        return(
                                                            <Grid item xs={parseInt(10/(indexKey > 0 ? indexKey : 10))} sm={parseInt(10/(indexKey > 0 ? indexKey : 10))} style={{marginRight:'2px',paddingTop:'10px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    onChange={(e) => this.functionChange(e, key, index, column.id)}
                                                                    placeholder={key}
                                                                    value={dataPerRow.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    disabled={column.disabled}
                                                                />
                                                            </Grid>   
                                                        )
                                                    }
                                                    
                                                }, this)
                                            }
                                            <Grid item xs={1} sm={1} style={{paddingTop:'12px'}}>
                                                <IconButton aria-label="delete" disabled={column.disabled} onClick={(e) => column.functionDelete(e,index,'sektor')} style={{outline:'none'}}>
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
        )
    }

    render(){
        
        if(this.props.redirect){
            return <Redirect to={this.props.redirect}/>            
        } else if (this.props.loading){
            return (
                <div className="mt-2">
                 <Loader 
                    type="ThreeDots"
                    color="#00BFFF"
                    height="30"	
                    width="30"
                />  
                </div>
            )
        } else if(getToken()){
            return (
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={this.props.modifyType ? `${this.props.title} - Edit` : `${this.props.title} - Detail`}
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
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                                <Grid container style={{display:'flex', justifyContent:'flex-end', padding:'0'}}>
                                    <Grid item xs={2} sm={2} style={{display:'flex', justifyContent:'flex-end'}}>
                                        
                                        {
                                           this.props.permissionEdit && this.props.modifyType &&
                                            <Tooltip title="Save" style={{outline:'none'}}>
                                                <IconButton aria-label="delete" onClick={this.props.btnSaveProduct} >
                                                    <SaveIcon />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        {
                                            this.props.permissionEdit && !this.props.modifyType &&
                                            <Tooltip title="Edit" style={{outline:'none'}}>
                                                <IconButton aria-label="delete" onClick={this.props.btnEditProduct}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        <Tooltip title="Back" style={{outline:'none'}}>
                                            <IconButton aria-label="delete" onClick={this.props.btnCancel}>
                                                <CancelIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {
                                this.props.columnData && this.props.data && this.props.columnData.map((dataPerRow) => {
                                    if(this.props.data[dataPerRow.id]) {
                                        let dataRow = '';

                                        if(typeof(dataPerRow.id) === 'object') {
                                            dataRow = [];

                                            for(const key in dataPerRow.id) {
                                                dataRow.push(this.props.data[dataPerRow.id[key]])
                                            }
                                        } else {
                                            dataRow = this.props.data[dataPerRow.id] || '';
                                        }

                                        if(!dataPerRow.type || dataPerRow.type === 'textfield') {
                                            return this.renderTextfield(dataRow, dataPerRow)    
                                        } else if(dataPerRow.type === 'dropdown') {
                                            return this.renderDropDown(dataRow, dataPerRow)
                                        } else if(dataPerRow.type === 'checkbox') {
                                            return this.renderCheckBox(dataRow, dataPerRow)
                                        } else if(dataPerRow.type === 'range') {
                                            return this.renderRange(dataRow[0], dataRow[1], dataPerRow)
                                        } else if(dataPerRow.type === 'flexible') {
                                            return this.renderFlexible(dataRow, dataPerRow)
                                        } else if(dataPerRow.type === 'multiple') {
                                            return this.renderMultipleComponent(dataRow, dataPerRow)
                                        } else {
                                            return null;
                                        }

                                    } else {
                                        return null;
                                    }
                                }, this)
                            }
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

export default DetailComponent;