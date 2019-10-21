import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import {serverUrl} from '../url'
import Moment from 'react-moment'
import Loader from 'react-loader-spinner'
import axios from 'axios'
import { getBankDetailFunction } from './saga';
import {DetailTipeBankFunction} from './../tipebank/saga'

const cookie = new Cookies()
var config = {
    headers: {'Authorization': "Bearer " + cookie.get('token')}
  };
class BankDetail extends React.Component{
    state = {rows:[],layanan:[],produk:[],tipe:0,namaTipeBank:'',serviceName:null,productName:null,diKlik:false,loading:true}
    componentDidMount(){
        this.getBankDetail()
    }

    getBankDetail = async function () {
        var id = this.props.match.params.id
        const param ={id}
        const data = await getBankDetailFunction(param)

        if(data){
            if(!data.error){
                this.setState({rows:data,layanan:data.services,tipe:data.type,produk:data.products})
                if (this.state.rows){
                    this.getTypeBank()
                    this.getBankServiceId()
                    this.getProductId()
                }
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    getBankServiceId= () =>{
             var id = this.props.match.params.id
             config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
              };
          
                axios.get(serverUrl+`admin/bank_services?bank_id=${id}`,config)
                .then((res)=>{
                var serviceId = res.data.data.map((val)=>{
                    return val.service_id
                })
                axios.get(serverUrl+`/admin/services?id=${serviceId.toString()}`,config)
                .then((res)=>{
                    var serviceName = res.data.data.map((val)=>{
                        return val.name
                    })
                    this.setState({serviceName:serviceName.toString()})
                })
            })
            .catch((err)=>console.log(err))
    }

    getProductId= () =>{
        var id = this.props.match.params.id
        config = {
           headers: {'Authorization': "Bearer " + cookie.get('token')}
         };
     
       axios.get(serverUrl+`admin/bank_products?bank_id=${id}`,config)
       .then((res)=>{
           console.log(res.data)
           var productID = res.data.data.map((val)=>{
               return val.product_id
           })
           axios.get(serverUrl+`/admin/products?id=${productID.toString()}`,config)
           .then((res)=>{
               var productName = res.data.data.map((val)=>{
                   return val.name
               })
               this.setState({productName:productName.toString(),loading:false})
           })
       })
       .catch((err)=>console.log(err))
    }

    getTypeBank = async function () {
        const param = {id:this.state.tipe}
        const data = await DetailTipeBankFunction(param)

        if(data){
            if(!data.error){
                this.setState({namaTipeBank:data.name})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    } 

    render(){
        if(this.state.diKlik){
            return <Redirect to="/listbank"/>
        }
        if(this.state.loading){
            return(
                <Loader 
                type="ThreeDots"
                color="#00BFFF"
                height="30"	
                width="30"
                />  
            )
        }
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2>Bank - Detail</h2>
                   <hr/>
                   <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">ID Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.id}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.name}
                            

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Tipe Bank</label>
                            <div className="col-sm-8">
                            : {this.state.namaTipeBank}
                        
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Alamat Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.address}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Provinsi</label>
                            <div className="col-sm-8">
                            : {this.state.rows.province}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Kota</label>
                            <div className="col-sm-8">
                            : {this.state.rows.city}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Admin Fee setup</label>
                            <div className="col-sm-8">
                            : {this.state.rows.adminfee_setup === "potong_plafon"? "Potong dari plafond" : "Bebankan ke cicilan"}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Convinience Fee setup</label>
                            <div className="col-sm-8">
                            : {this.state.rows.convfee_setup === "potong_plafon"? "Potong dari plafond" : "Bebankan ke cicilan"}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jenis Layanan</label>
                            <div className="col-sm-8">
                            : {this.state.serviceName === null ? "-" :this.state.serviceName.toString()}


                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jenis Product</label>
                            <div className="col-sm-8">
                            : {this.state.productName === null ? "-" :this.state.productName.toString()}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama PIC</label>
                            <div className="col-sm-8">
                            : {this.state.rows.pic}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">No Telp</label>
                            <div className="col-sm-8">
                            : {this.state.rows.phone}

                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Tanggal Bergabung</label>
                            <div className="col-sm-8">
                            :  <Moment date={this.state.rows.join_date} format=" DD  MMMM  YYYY" />                         

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">
                                <input type="button" className="btn btn btn-secondary" value="Kembali" onClick={()=> this.setState({diKlik:true})}/>
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

export default BankDetail;