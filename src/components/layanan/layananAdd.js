import React from 'react'
import './../../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import DialogComponent from '../subComponent/DialogComponent';
import { addLayananFunction } from './saga';
import { getToken } from '../index/token';
import Loading from '../subComponent/Loading';
import { Grid, IconButton, Tooltip, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import TitleBar from '../subComponent/TitleBar';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { checkPermission } from '../global/globalFunction';
import UploadFile from '../subComponent/UploadFile';
// import UploadFileDropzone from '../subComponent/UploadFileDropzone';

class LayananAdd extends React.Component{
    _isMounted = false;

    state={
        selectedFile:null,
        base64img:null,
        errorMessage:'',
        diKlik:false,
        check:false,submit:false
    }
    componentDidMount(){
        this._isMounted=true
    }
    componentWillUnmount(){
        this._isMounted=false
    }

    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    
    onChangeHandler = (event)=>{
        //untuk mendapatkan file image
        console.log(event.target.files)
        this.setState({selectedFile:event.target.files[0]})
    }
    valueHandler = ()=>{
        
        return  this.state.selectedFile ? this.state.selectedFile.name :"Browse Image"
        
    }

    btnSimpanLayanan = ()=>{
        var name =this.refs.namaLayanan.value
        var description = this.refs.deskripsi.value
        this.setState({submit:true})
        if(name==="" || this.state.selectedFile===null){
            this.setState({errorMessage:"Nama Layanan atau Gambar kosong",submit:false})
        }else if(name.trim() === ""){
            this.setState({errorMessage:"Nama Layanan kosong - Harap Cek ulang",submit:false})
        }else if(this.state.selectedFile.size > 1000000){
            this.setState({errorMessage:"Gambar tidak boleh lebih dari 1 MB - Harap Cek ulang",submit:false})
        }else if(description.length >250){
            this.setState({errorMessage:"Deskripsi layanan terlalu panjang maksimal 250 karakter - Harap Cek ulang",submit:false})
        }
        else{
            var pic = this.state.selectedFile
            var reader = new FileReader();
            reader.readAsDataURL(pic);
            reader.onload =  () => {   
                var arr = reader.result.split(",")   
                var image = arr[1].toString()
                var status = this.state.check ? "active": "inactive"
                var newData = {name,status,image,description}

                this.addLayananBtn(newData)
            };
            reader.onerror = function (error) {
              this.setState({errorMessage:"Gambar gagal tersimpan"})
            };
        }
        
    }

    addLayananBtn = async function (param){
        const data = await addLayananFunction(param)
        if(data){
            if(!data.error){
                swal("Success","Layanan berhasil di tambah","success")
                this.setState({errorMessage:null,diKlik:true})
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    handleChecked = (e, labelData)=>{
        this.setState({[labelData]:!this.state[labelData]})
    }

    renderBtnSumbit =()=>{
        if( this.state.submit) {
            return <input type="button" disabled className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnSimpanLayanan} style={{cursor:"wait"}}/>
        }else{
            return   <input type="button" className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnSimpanLayanan}/>
     
        }
     }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/layananList'/>            

        } else if(this.state.loading) {
            return(
                <Loading
                    title={'Layanan - Tambah'}
                />
            )
            
             
        } else if(getToken()){
            return(
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={'Layanan - Tambah'}
                        />

                    </Grid>
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                        <Grid container>
                            {/* Dialog */}
                            < DialogComponent 
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
                                           checkPermission('core_service_new') &&
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
                            {/* Nama Layanan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'20px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Nama Layanan
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="namaLayanan"
                                            value={this.state.namaLayanan}
                                            onChange={(e) => this.onChangeTextField(e,'namaLayanan')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Deskripsi Layanan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'25px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Deskripsi
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="description"
                                            value={this.state.description}
                                            onChange={(e) => this.onChangeTextField(e,'description')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Gambar Layanan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'30px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Gambar
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <UploadFile
                                            file={this.state.selectedFile}
                                            onChange={this.onChangeHandler}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* <Grid item md={12}>
                                <UploadFileDropzone
                                    onDrop={(files, key) => { this.onDrop(files, files[0].name); }}
                                    maxSize={2000}
                                    value={this.state.selectedFile && this.state.selectedFile.name}
                                    multiple={false}
                                    acceptedFile={'image/*'}
                                    label={this.state.selectedFile && this.state.selectedFile.name}
                                />
                            </Grid> */}

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


                        </Grid>
                    </Grid>
                </Grid>
                
            )

            return(
                <div className="container">
                   <h2 className="mt-3">Layanan Tambah</h2>
                  
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>   
                    </div>
                   <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nama Layanan</label>
                            <div className="col-sm-9">
                            <input type="text" placeholder="Masukan Nama Layanan" style={{width:"50%",marginLeft:"13%"}} className="form-control" ref="namaLayanan"></input>                            
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Deskripsi Layanan</label>
                            <div className="col-sm-9">
                            <textarea rows="5" ref="deskripsi" className="form-control"  style={{width:"50%",marginLeft:"13%"}} placeholder="Description" required autoFocus/>
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Gambar</label>
                            <div className="col-sm-9">
                            <input className="AddStyleButton btn btn-primary" type="button" onClick={()=>this.refs.input.click()} value={this.valueHandler()}></input>
                            <input ref="input" style={{display:"none"}} type="file" accept="image/*" onChange={this.onChangeHandler}></input>             
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" type="checkbox" onChange={this.handleChecked} defaultChecked={this.state.check} /> 
                            <label style={{position:"relative",left:"18%",paddingTop:"3px"}}>{this.state.check ? 'Aktif' : 'Tidak Aktif'}</label>           
                            </div>
                    </div>
                    <div className="form-group row">
                            {this.renderBtnSumbit()}
                            <input type="button" className="btn btn-warning" value="Batal" onClick={this.btnCancel}/>

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

export default LayananAdd;