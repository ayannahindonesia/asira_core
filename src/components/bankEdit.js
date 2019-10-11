import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import {serverUrl,serverUrlGeo} from './url'
import axios from 'axios'
import swal from 'sweetalert'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const cookie = new Cookies()
var config = {
    headers: {'Authorization': "Bearer " + cookie.get('token')}
  };
  var configGeo = {
    headers: {'Authorization': "Bearer " + cookie.get('tokenGeo')}
  };

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' },
//   ];
const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'grey',
      padding: 20,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: "50%",float:"left", marginLeft:"112px",
      border:"0.5px solid #CED4DA", borderRadius:"2px"
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

class BankEdit extends React.Component{
    state = {
        productID:[],serviceID:[],
        errorMessage: null, diKlik:false,
        typeBank:[],bankService:[],bankProduct:[],
        provinsi:[],kabupaten:[],idProvinsi:null,dataBank:[],phone:'',provinsiEdit:null,namaTipeBank:'',adminFeeRadioValue:'',convinienceFeeRadioValue:'',
        serviceName:null,productName:null,submit:false
    };
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
       }
    handleChangejenisLayanan = (jenisLayanan) => {
        this.setState({ serviceName: jenisLayanan });
      };

    handleChangejenisProduct = (jenisProduct) => {
        this.setState({ productName:jenisProduct });
    };
    
    componentDidMount(){
        this.getBankProduct()
        this.getAllProvinsi()
        this.getBankDataById()
    }
    getBankDataById = ()=>{
        var id = this.props.match.params.id
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
       // axios.get(serverUrl+'admin/banks/[bank_id]',config)
        axios.get(serverUrl+`admin/banks/${id}`,config)
        .then((res)=>{
            this.setState({dataBank:res.data,productID:res.data.products,serviceID:res.data.services})
           if (this.state.dataBank){
             this.getTypeBank()
             this.getBankService()
             this.getServiceDataSudahTerpilih(id)
             this.getProductDataSudahTerpilih(id)
           }
        })
        .catch((err)=> console.log(err))

    }

    getAllProvinsi = () =>{
        configGeo = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenGeo')}
          };
        axios.get(serverUrlGeo+`client/provinsi`,configGeo)
        .then((res)=>{
            this.setState({provinsi:res.data.data})
           
        })
        .catch((err)=> console.log(err))
      }

    getAllKabupaten = (id) =>{
        axios.get(serverUrlGeo+`client/provinsi/${id}/kota`,configGeo)
        .then((res)=>{
            this.setState({kabupaten:res.data.data})
           
        })
        .catch((err)=> console.log(err))
      }
    getBankProduct = ()=>{
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
      axios.get(serverUrl+'admin/products',config)
      .then((res)=>{
          this.setState({bankProduct:res.data.data})
      })
      .catch((err)=> console.log(err))
    }

    getTypeBank = ()=>{
        axios.get(serverUrl+`admin/bank_types/${this.state.dataBank.type}`,config)
      .then((res)=>{
            this.setState({namaTipeBank:res.data.name})
      })
      .catch((err)=> console.log(err))
    }

    getBankService = ()=>{
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
      axios.get(serverUrl+'admin/services',config)
      .then((res)=>{
          this.setState({bankService:res.data.data})
      })
      .catch((err)=> console.log(err))
    }

    getServiceDataSudahTerpilih = (id)=>{  
      var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
      axios.get(serverUrl+`admin/bank_services?bank_id=${id}`,config)
      .then((res)=>{
         var resultServiceID = res.data.data.map((val)=>{
             return val.service_id
         })
         axios.get(serverUrl+`/admin/services?id=${resultServiceID.toString()}`,config)
         .then((res)=>{
             var serviceName = res.data.data.map((val)=>{
                 return {value:val.id,label:val.name}
             })
             this.setState({serviceName:serviceName})
         })
      })
      .catch((err)=> console.log(err))
    }

    getProductDataSudahTerpilih = (id)=>{  
        var config = {
              headers: {'Authorization': "Bearer " + cookie.get('token')}
            };
        axios.get(serverUrl+`admin/bank_products?bank_id=${id}`,config)
        .then((res)=>{
           var resultProductID = res.data.data.map((val)=>{
               return val.product_id
           })
           axios.get(serverUrl+`/admin/products?id=${resultProductID.toString()}`,config)
           .then((res)=>{
               var productName = res.data.data.map((val)=>{
                   return {value:val.id,label:val.name}
               })
               this.setState({productName:productName})
           })
        })
        .catch((err)=> console.log(err))
      }

    renderProvinsiJsx = ()=>{
        var jsx = this.state.provinsi.map((val,index)=>{
            return (
                <option key={index} value={val.id+"-"+val.name} > {val.name} </option>
                
            )
        })
        return jsx
    }
    renderKabupatenJsx = ()=>{
        var jsx = this.state.kabupaten.map((val,index)=>{
            return (
                <option key={index} value={val.name}>{val.name}</option>
            )
        })
        return jsx
    }

    renderJenisLayananJsx = ()=>{
        var jsx = this.state.bankService.map((val,index)=>{
            return {id:val.id, value: val.id, label: val.name}
        })
        return jsx
    }
    renderJenisProductJsx = ()=>{
        var jsx = this.state.bankProduct.map((val,index)=>{
            return {id:val.id, value: val.id, label: val.name}
        })
        return jsx
    }

    handleChangeRadioAdmin =(e)=>{
        this.setState({adminFeeRadioValue:e.target.value})
    }
    handleChangeRadioConvience =(e)=>{
        this.setState({convinienceFeeRadioValue:e.target.value})
    }

    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-primary" value="Simpan" onClick={this.btnEdit} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-primary" value="Simpan" onClick={this.btnEdit}/>
        }
     }
    btnEdit = ()=>{
        var services =[]
        var products =[]
        var id=this.refs.idBank.value
        var name = this.refs.namaBank.value
        var type = parseInt(this.refs.tipeBank.value)
        var address = this.refs.alamat.value ? this.refs.alamat.value:this.refs.alamat.placeholder
        var province = this.refs.provinsi.value.includes("-") ? this.refs.provinsi.value.slice(this.refs.provinsi.value.indexOf('-')+1,this.refs.provinsi.value.length) : this.refs.provinsi.value
        var city = this.refs.kota.value.includes("-") ? this.refs.kota.value.slice(this.refs.provinsi.value.indexOf('-')+1,this.refs.provinsi.length):this.refs.kota.value
        var pic = this.refs.pic.value ? this.refs.pic.value:this.refs.pic.placeholder
        var phone = this.state.phone ? String(this.state.phone):String(this.state.dataBank.phone)
        var adminfee_setup = this.state.adminFeeRadioValue ? this.state.adminFeeRadioValue : this.state.dataBank.adminfee_setup
        var convfee_setup =  this.state.adminFeeRadioValue ? this.state.adminFeeRadioValue : this.state.dataBank.adminfee_setup
       
        if(city === "0" || city === null){
            this.setState({errorMessage:"Kota Kosong - Harap cek ulang"})
        }else if (pic.trim()===""){
            this.setState({errorMessage:"PIC Kosong - Harap cek ulang"})
        }else if(address.trim()===""){
            this.setState({errorMessage:"Alamat Kosong - Harap cek ulang"})
        }else{
            this.setState({submit:true})
             if(this.state.serviceName){
                for (var i=0; i<this.state.serviceName.length;i++){
                    services.push (this.state.serviceName[i].value)
                }
            }else{
                services = []
            }
            
            if(this.state.productName){
                for ( i=0; i<this.state.productName.length;i++){
                    products.push (this.state.productName[i].value)
                }
            }else{
                products = []
            }
            
            var newData = {
                name,type,address,province,city,services,products,pic,phone,adminfee_setup,convfee_setup
            }
        
           
            axios.patch(serverUrl+`admin/banks/${id}`,newData,config)
            .then((res)=>{
                swal("Success","Data berhasil di edit","success")
                this.setState({diKlik:true,errorMessage:null,submit:false})
            })
            .catch((err)=> console.log(err))
           
       }
    }
    
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listbank'/>            
        }
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2>Bank - Edit</h2>
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>
                     </div>
                   
                   <form>
                       <fieldset disabled>
                       <div className="form-group row">
                            <label className="col-sm-2 col-form-label">ID Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="idBank" defaultValue={this.state.dataBank.id} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="namaBank" defaultValue={this.state.dataBank.name}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Tipe Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="tipeBank"  defaultValue={this.state.namaTipeBank}/>
                            </div>
                        </div>
                       </fieldset>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Alamat Bank</label>
                            <div className="col-sm-10">
                            <textarea rows="6" ref="alamat" placeholder={this.state.dataBank.address} className="form-control"  autoFocus/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Provinsi</label>
                            <div className="col-sm-10">
                            <select id="provinsi" onChange={()=>{this.getAllKabupaten(this.refs.provinsi.value.slice(0,this.refs.provinsi.value.indexOf('-')))
                            document.getElementById("kota").value ="0"
                        }} ref="provinsi" className="form-control">
                           
                               {this.state.provinsiEdit===null?     <option value={this.state.dataBank.province}>{this.state.dataBank.province}</option>:null} 
                               <optgroup label="_________________________">
                               {this.renderProvinsiJsx()}
                               </optgroup>
                            </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Kota</label>
                            <div className="col-sm-10">
                            <select ref="kota" id="kota" className="form-control">
                              {this.state.provinsiEdit===null? <option value={this.state.dataBank.city}>{this.state.dataBank.city}</option>:
                           null
                            }  <option value={0}>========= PILIH KOTA =========</option>
                               
                                {this.renderKabupatenJsx()}
                           
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Admin Fee Setup</label>
                            <div className="col-sm-10">
                                {this.state.dataBank.adminfee_setup === 'beban_plafon' ?
                                <label className="form-control" style={{border:"none"}}>
                                    <input type="radio" name="adminfeeSetup"  value="potong_plafon" onClick={this.handleChangeRadioAdmin} /> Potong dari plafond
                                    <input type="radio" name="adminfeeSetup" defaultChecked={true} className="ml-3" value="beban_plafon" onClick={this.handleChangeRadioAdmin} /> Bebankan ke cicilan
                                </label> 
                                    :
                                <label className="form-control" style={{border:"none"}}>
                                    <input type="radio" name="adminfeeSetup" defaultChecked={true} value="potong_plafon" onClick={this.handleChangeRadioAdmin} /> Potong dari plafond
                                    <input type="radio" name="adminfeeSetup"  className="ml-3" value="beban_plafon" onClick={this.handleChangeRadioAdmin} /> Bebankan ke cicilan
                                </label> 
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Convinience Fee Setup</label>
                            <div className="col-sm-10">
                                <div className="form-control" style={{border:"none",cursor: "not-allowed"}}>
                                    <input type="radio" disabled="disabled" checked={this.state.adminFeeRadioValue==="potong_plafon"?"checked":""} name="convinienceFeeSetup" readOnly value="potong_plafon"  /> Potong dari plafond
                                    <input type="radio" disabled="disabled" checked={this.state.adminFeeRadioValue==="beban_plafon"?"checked":""} name="convinienceFeeSetup" readOnly className="ml-3" value="beban_plafon" /> Bebankan ke cicilan
                                </div> 
                         
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Layanan</label>
                           
                            <div className="col-sm-10" >
                            <Select
                                value={this.state.serviceName}
                                onChange={this.handleChangejenisLayanan}
                                isMulti={true}
                                options={this.renderJenisLayananJsx()}
                                styles={customStyles}
                            />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Produk</label>
                            <div className="col-sm-10">
                                <div>
                            <Select
                                value={this.state.productName}
                                onChange={this.handleChangejenisProduct}
                                isMulti={true}
                                options={this.renderJenisProductJsx()}
                                styles={customStyles}
                            />

                        </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama PIC</label>
                            <div className="col-sm-10">
                            <input type="text" className="form-control" ref="pic" placeholder={this.state.dataBank.pic} />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">No Telp</label>
                            <div className="col-sm-10">
                          
                            <PhoneInput
                            country="ID"
                            ref="telp"
                            placeholder={this.state.dataBank.phone} 
                            value={ this.state.phone }
                            onChange={ phone => this.setState({ phone }) } className="form-control" />                                                       
                            </div>
                        </div>
                        {this.renderBtnSumbit()}
                       
                        <input type="button" className="btn btn-secondary ml-2" value="Batal" onClick={()=>this.setState({diKlik:true})}/>

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

export default BankEdit;