import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import {serverUrl} from './url' 
import Loader from 'react-loader-spinner'


const cookie = new Cookies()

class LayananDetail extends React.Component{
    state={rows:[],imageData:'',loading:true}

    componentDidMount =()=>{
        this.getDetailLayanan()
    }

    getDetailLayanan = () =>{
        var id = this.props.match.params.id
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.get(serverUrl+`admin/services/${id}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({rows:res.data})
            if (this.state.rows.image_id !== undefined || this.state.rows.image_id !== null){
               axios.get(serverUrl+`admin/image/${this.state.rows.image_id}`,config)
                .then((res)=>{
                    this.setState({imageData:res.data.image_string,loading:false})
                })
                .catch((err)=>console.log(err))
            }
        })
        .catch((err)=>console.log(err))
    }
    render(){
        if (this.state.loading){
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
        }else{
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2>Layanan Detail</h2>
                   <hr/>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Layanan</label>
                            <div className="col-sm-8">
                            : {this.state.rows.name}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Gambar</label>
                            <div className="col-sm-8">
                            : <img style={{width:"100px"}}src={`data:image/jpeg;png;base64,${this.state.imageData}`} alt={this.state.rows.name} />
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-8">
                            : {this.state.rows.status ==="active"?"Aktif":"Tidak Aktif"}
                            </div>
                        </div>
                    </form>
                    <div className="form-group row">
                            <label className="col-sm-4 col-form-label">
                                <input type="button" className="btn btn btn-secondary" value="Kembali" onClick={()=>  window.history.back()}/>
                            </label>
                            <div className="col-sm-8">

                            </div>
                        </div>
                </div>
            )
        }
        if(!cookie.get('token')){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }}
}

export default LayananDetail;