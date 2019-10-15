import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import {serverUrl} from '../url'
import swal from 'sweetalert'
const cookie = new Cookies()

class TypeBankEdit extends React.Component{
    state={diKlik:false,errorMessage:'',rows:[]}
    
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error,rows:[]})
    }
    componentDidMount(){
        this.getDataBankTypebyID()
    }

    getDataBankTypebyID = ()=>{
        var id = this.props.match.params.id
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
    
        axios.get(serverUrl+`admin/bank_types/${id}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({rows:res.data})  
        })
        .catch((err)=>{
            swal("Gagal","Terjadi kesalahan - Coba Ulang Kembali","error")                
            console.log(err)
        })
    }

    btnUpdate=()=>{
        var name= this.refs.typebank.value
        var description = this.refs.deskripsi.value ? this.refs.deskripsi.value :this.refs.deskripsi.placeholder
        var id = this.props.match.params.id

            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
            };
            var newData={name,description}
            axios.patch(serverUrl+`admin/bank_types/${id}`,newData,config)
            .then((res)=>{
                console.log(res)
                this.setState({diKlik:true,errorMessage:""})
                swal("Success","Tipe Bank Berhasil di Ubah","success")
            })
            .catch((err)=>{
                swal("Gagal","Tipe Bank Gagal di Ubah - Coba Ulang Kembali","error")                
                console.log(err)
            })
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
                  <h2>Tipe Bank -  Ubah</h2>
                <hr></hr>
                <div className="form-group row">
                 <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                     {this.state.errorMessage}
                  </div>
                </div>
                     <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">ID Tipe Bank</label>
                                                <div className="col-sm-9 btn-group">
                                                <input disabled type="text" className="form-control" ref="typebank" defaultValue={this.state.rows.id} required autoFocus/>
                                                </div>
                     </div>
                     <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Nama Tipe Bank</label>
                                                <div className="col-sm-9 btn-group">
                                                <input disabled type="text" className="form-control" ref="typebank" defaultValue={this.state.rows.name} required autoFocus/>
                                                </div>
                     </div>
                      <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Deskripsi</label>
                                                <div className="col-sm-9">
                                                <textarea rows="5" ref="deskripsi" className="form-control" placeholder={this.state.rows.description} required autoFocus/>
                                                </div>
                     </div>
                    <div className="form-group row">
                                                <input type="button" value="Ubah" className="btn btn-success" onClick={this.btnUpdate}/>
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

export default TypeBankEdit;