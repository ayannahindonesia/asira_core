import React from 'react'
import swal from 'sweetalert'
import PhoneInput from 'react-phone-number-input'
import { Redirect  } from 'react-router-dom'
import { getToken } from '../index/token';
import './../../support/css/penyediaAgent.css'


class PenyediaDetail extends React.Component{
    state = {
        diKlik:false,
        phone:'',
        submit:false,
        check:false
    };

    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    handleChecked=(e)=>{
        this.setState({check:!this.state.check})
    }


    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-primary" value="Simpan" onClick={this.btnSaveAgen} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-primary" value="Simpan" onClick={this.btnSaveAgen}/>
        }
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    btnSaveAgen =()=>{
        let status = this.state.check ? "active": "inactive"
        let alamat = this.refs.alamat.value
        let name = this.refs.namaAgent.value
        let pic = this.refs.pic.value
        let phone = this.state.phone

        if(this.state.phone ===''){
            this.setState({errorMessage:"Nomor Telepon Kosong - Harap cek kembali"})
        }else if(name.trim().length ===0){
            this.setState({errorMessage:"Nama Penyedia Agen Kosong - Harap cek kembali"})
        }else if(pic.trim().length ===0){
            this.setState({errorMessage:"Nama PIC Kosong - Harap cek kembali"})
        }else if(alamat.trim().length ===0){
            this.setState({errorMessage:"Alamat Kosong - Harap cek kembali"})
        }else if(this.state.phone===''){
            this.setState({errorMessage:"Nomor Telepon Kosong - Harap cek kembali"})
        }else{
            swal("WOI","NUNGGUIN API","warning")
           
        }
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/penyediaList'/>            
        }
        if(getToken()){
            return(
                <div className="container mt-2">
                     <h3>Penyedia Agen - Detail</h3>
                        {this.state.errorMessage}
                     <hr/>
                     <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>
                     </div>
                    <form>
                        <div className="form-group row">
                                <label className="col-sm-3 col-form-label">Id Penyedia Agen</label>
                                <div className="col-sm-9">
                                    
                                </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nama Penyedia Agen</label>
                            <div className="col-sm-9">
                                
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">PIC</label>
                            <div className="col-sm-9">
                                               
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nomor Telepon</label>
                            <div className="col-sm-9">
                                                                         
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Alamat</label>
                            <div className="col-sm-9">
                            
                            </div>
                        </div>
                      
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">

                            </div>
                        </div>
                    
                   
                        <input type="button" className="btn btn-secondary" value="Kembali" onClick={this.btnCancel}/>
                        
                    </form>
                    
                   
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

export default PenyediaDetail;