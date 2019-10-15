import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import {serverUrl} from './url'
import NumberFormat from 'react-number-format';
const cookie = new Cookies()

class ProductDetail extends React.Component{
    state = {rows:[],fees:[ {
        "description": "Admin Fee",
        "amount": "2500"
      }, {
        "description": "Admin Fee",
        "amount": "2500"
      }],collaterals:["c","d","s"],financing_sector:["a","b","c"],layanan:""}
    componentDidMount(){
        this.getDetailProduct()
     
    }
    getDetailProduct = ()=>{
        var id = this.props.match.params.id
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
     
      axios.get(serverUrl+`admin/products/${id}`,config)
        .then((res)=>{
            this.setState({rows:res.data,fees:res.data.fees,collaterals:res.data.collaterals,financing_sector:res.data.financing_sector})

            if (this.state.rows.service !== undefined || this.state.rows.service !== null){
                var layananid = this.state.rows.service_id
                var config = {
                    headers: {'Authorization': "Bearer " + cookie.get('token')}
                  };
                
                  axios.get(serverUrl+`admin/services/${layananid}`,config)
                .then((res)=>{
                    this.setState({layanan:res.data.name})
                })
                .catch((err)=>console.log(err)) 
            }

        })
        .catch((err)=>console.log(err)) 
    
    }
  
    renderAdminFee = ()=>{
      
        var jsx = this.state.fees.map((val,index)=>{
            return(
                <div className="form-group row" key={index}>
                            <label className="col-sm-4 col-form-label">{val.description} </label>
                            <div className="col-sm-8">
                            : {val.amount} 
                            </div>
                        </div>
            )
        })
        return jsx
    }
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2>Produk - Detail</h2>
                    <hr></hr>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Produk</label>
                            <div className="col-sm-8">
                            : {this.state.rows.name}

                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jangka Waktu (Bulan)</label>
                            <div className="col-sm-8">
                            : {this.state.rows.min_timespan} s/d {this.state.rows.max_timespan}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Imbal Hasil</label>
                            <div className="col-sm-8">
                            : {this.state.rows.interest}%
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Rentang Pengajuan</label>
                            <div className="col-sm-8">
                            : <NumberFormat thousandSeparator={true} thousandsGroupStyle="Rupiah" prefix={'Rp.'} displayType={'text'} value={this.state.rows.min_loan}/> s/d  <NumberFormat thousandSeparator={true} displayType={'text'} thousandsGroupStyle="Rupiah" prefix={'Rp.'} value={this.state.rows.max_loan}/>
                            </div>
                        </div>
                    </form>
                    <form>
                        {this.state.fees.length === 0 ? 
                            
                            <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Admin Fee</label>
                            <div className="col-sm-8">
                            : -
                            </div>
                        </div>
                    </form>
                            :this.renderAdminFee()}
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Layanan</label>
                            <div className="col-sm-8">
                            : {this.state.layanan}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Agunan</label>
                            <div className="col-sm-8">
                            : {this.state.collaterals === undefined ?  "-" :this.state.collaterals.toString()}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Sektor Pembiayaan</label>
                            <div className="col-sm-8">
                            : {this.state.financing_sector === undefined?"-":this.state.financing_sector.toString()}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Asuransi</label>
                            <div className="col-sm-8">
                            : {this.state.rows.assurance}
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
       
    }
}

export default ProductDetail;