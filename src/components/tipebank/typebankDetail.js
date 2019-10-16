import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import {serverUrl} from '../url'

import axios from 'axios'

const cookie = new Cookies()

class TypeBankDetail extends React.Component{
    state = {rows:{}}
    componentDidMount(){
        this.getTypeBankDetail()
    }

    getTypeBankDetail = ()=>{
        var id = this.props.match.params.id
        if(cookie.get('token')){
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
              };
          
            axios.get(serverUrl+`admin/bank_types/${id}`,config)
            .then((res)=>{
                console.log(res.data)
                this.setState({rows:res.data})
            })
            .catch((err)=>console.log(err))
        }
    }
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2>Tipe Bank - Detail</h2>
                   <hr/>
                   
                   <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">ID Tipe Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.id}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Tipe Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.name}
                            

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Deskripsi</label>
                            <div className="col-sm-8">
                            : {this.state.rows.description}
                        
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">
                                <input type="button" className="btn btn btn-secondary" value="Kembali" onClick={()=>  window.history.back()}/>
                            </label>
                            <div className="col-sm-8">

                            </div>
                        </div>

                   </form>
    
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

export default TypeBankDetail;