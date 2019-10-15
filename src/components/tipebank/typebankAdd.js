import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import {serverUrl} from './../url'
import swal from 'sweetalert'
const cookie = new Cookies()

class TypeBank extends React.Component{
    state={diKlik:false,errorMessage:''}
    
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    btnSave=()=>{
        var name= this.refs.typebank.value
        var description = this.refs.deskripsi.value
  
        if (name ===""||name.trim()===""){
            this.setState({errorMessage:"Nama Tipe Bank Kosong - Harap cek ulang"})
        }else{
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
            };
            var newData={name,description}
            axios.post(serverUrl+`admin/bank_types`,newData,config)
            .then((res)=>{
                console.log(res)
                this.setState({diKlik:true,errorMessage:""})
                swal("Success","Tipe Bank Berhasil di Tambah","success")
            })
            .catch((err)=>{
                swal("Gagal","Tipe Bank Gagal di Tambah - Coba Ulang Kembali","error")                
                console.log(err)
            })
        }
    }

    btnCancel =()=>{
        this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to="/listtipe"/>
        }
        if(cookie.get('token')){
            return(
                <div className="container mt-3">
                  <h2>Tipe Bank -  Tambah</h2>
                <hr></hr>
                <div className="form-group row">
                 <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                     {this.state.errorMessage}
                  </div>
                </div>
                     <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Nama Tipe Bank</label>
                                                <div className="col-sm-9 btn-group">
                                                <input type="text" className="form-control" ref="typebank" placeholder="Nama Tipe Bank.." required autoFocus/>
                                                </div>
                     </div>
                      <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Deskripsi</label>
                                                <div className="col-sm-9">
                                                <textarea rows="5" ref="deskripsi" className="form-control"  placeholder="Description.." required autoFocus/>
                                                </div>
                     </div>
                    <div className="form-group row">
                                                <input type="button" value="Simpan" className="btn btn-success" onClick={this.btnSave}/>
                                                <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                      </div>

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

export default TypeBank;