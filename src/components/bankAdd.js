import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect  } from 'react-router-dom'
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

  

class Main extends React.Component{
      state = {
       jenisProduct:null, jenisLayanan: null, 
       errorMessage: null, diKlik:false,
       typeBank:[],bankService:[],bankProduct:[],
       provinsi:[],
       kabupaten:[],
       idProvinsi:null,
       phone:'',
       adminFeeRadioValue:'potong_plafon',
       convinienceFeeRadioValue:'beban_plafon',
       submit:false
      };



      componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
       }

       handleChangejenisLayanan = (jenisLayanan) => {
        this.setState({ jenisLayanan });
      };

      handleChangejenisProduct = (jenisProduct) => {
        this.setState({ jenisProduct });
      };

      componentDidMount(){
          this.getBankType()
          this.getBankService()
          this.getBankProduct()
          this.getAllProvinsi()
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


      getBankType = () => {
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.get(serverUrl+'admin/bank_types',config)
        .then((res)=>{
            this.setState({typeBank:res.data.data})
        })
        .catch((err)=> console.log(err))
      }

      renderTypeBankJsx = ()=>{
          var jsx = this.state.typeBank.map((val,index)=>{
              return(
                <option key={index} value={val.id}>{val.name}</option>
              )
          })
          return jsx
      }
      btnCancel = ()=>{
        this.setState({diKlik:true})
      }

    btnSaveBank =()=>{
        
        var services =[]
        var products =[]
        var name = this.refs.namaBank.value
        var type = parseInt(this.refs.tipeBank.value)
        var address = this.refs.alamat.value
        var province =  this.refs.provinsi.value.slice(this.refs.provinsi.value.indexOf('-')+1,this.refs.provinsi.value.length)
        var city = this.refs.kota.value
        var pic = this.refs.pic.value
        var phone = this.state.phone
        var adminfee_setup = this.state.adminFeeRadioValue
        var convfee_setup = this.state.adminFeeRadioValue

        if(this.state.jenisLayanan===null || this.state.jenisProduct===null || 
        this.refs.namaBank.value === "" || this.refs.tipeBank.value ==="0" || 
        this.refs.alamat.value ==="" || this.refs.provinsi.value==="0" || 
        this.refs.kota.value==="0" || this.refs.pic.value ===""){
            this.setState({errorMessage:"Harap cek ulang masih ada data yang belum terisi"})
        }
        else if (name.trim() ===""){
            this.setState({errorMessage:"Nama Bank belum terisi - Harap Cek Ulang"}) 
        }else if(pic.trim()===""){
            this.setState({errorMessage:"Nama PIC belum terisi - Harap Cek Ulang"}) 
        }else if(address.trim()===""){
            this.setState({errorMessage:"Nama Alamat belum terisi - Harap Cek Ulang"}) 
        }
        else{
                this.setState({submit:true})
                for (var i=0; i<this.state.jenisLayanan.length;i++){
                    services.push (this.state.jenisLayanan[i].value)
                }
                for ( i=0; i<this.state.jenisProduct.length;i++){
                    products.push (this.state.jenisProduct[i].value)
                }
                var newData = {
                    name,type,address,province,city,pic,phone,services,products,adminfee_setup,convfee_setup
                }
                
                axios.post(serverUrl+'admin/banks',newData,config)
                .then((res)=>{
                    swal("Berhasil","Bank berhasil bertambah","success")
                    this.setState({errorMessage:null,diKlik:true,submit:false})
                })
                .catch((err)=>{
                   console.log(err)
                })
        }


    }
    handleChangeRadioAdmin =(e)=>{
        this.setState({adminFeeRadioValue:e.target.value})
    }
    handleChangeRadioConvience =(e)=>{
        this.setState({convinienceFeeRadioValue:e.target.value})
    }
    renderBtnSumbit =()=>{
       if( this.state.submit) {
        return <input type="button" disabled className="btn btn-primary" value="Simpan" onClick={this.btnSaveBank} style={{cursor:"wait"}}/>
       }else{
       return <input type="button" className="btn btn-primary" value="Simpan" onClick={this.btnSaveBank}/>
       }
    }
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listbank'/>            
        }
        if(cookie.get('token')){
            return(
                <div className="container mt-2">
                     <h3>Bank - Tambah</h3>
                 
                     <hr/>
                     <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>
                                
                     </div>
                    <form>
                        <div className="form-group row">
                            
                        <label className="col-sm-2 col-form-label">Nama Bank</label>
                        <div className="col-sm-10">
                            <input type="text" required className="form-control" ref="namaBank" placeholder="Input Nama Bank.." />
                        </div>
                        
                        </div>
                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tipe Bank</label>
                        <div className="col-sm-10" >
                            <select ref="tipeBank" className="form-control">
                                <option value={0}>====== Pilih Tipe Bank =====</option>
                               {this.renderTypeBankJsx()}
                            </select>
                        </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Alamat Bank</label>
                            <div className="col-sm-10">
                            <textarea rows="5" ref="alamat" className="form-control"  placeholder="Description" required autoFocus/>
                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Provinsi</label>
                            <div className="col-sm-10">
                            <select onChange={()=>{this.getAllKabupaten(this.refs.provinsi.value.slice(0,this.refs.provinsi.value.indexOf('-')))
                             document.getElementById("kota").value = "0";
                             }
                        } ref="provinsi" className="form-control">
                                <option value={0}>===== Pilih Provinsi =====</option>
                               {this.renderProvinsiJsx()}
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Kota</label>
                            <div className="col-sm-10">
                            <select ref="kota" id="kota" className="form-control">
                                <option value={0}>===== Pilih Kota =====</option>
                                {this.renderKabupatenJsx()}
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Admin Fee Setup</label>
                            <div className="col-sm-10">
                            <label className="form-control" style={{border:"none"}}>
                                <input type="radio" name="adminfeeSetup" defaultChecked={true} value="potong_plafon" onChange={this.handleChangeRadioAdmin} /> Potong dari plafond
                                <input type="radio" name="adminfeeSetup" className="ml-3" value="beban_plafon" onChange={this.handleChangeRadioAdmin} /> Bebankan ke cicilan
                            </label> 
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Convinience Fee Setup</label>
                            <div className="col-sm-10">
                            <label className="form-control" style={{border:"none",cursor:"not-allowed"}}>
                                <input type="radio" name="convinienceFeeSetup" disabled="disabled" checked={this.state.adminFeeRadioValue==="potong_plafon"?"checked":"checked"}  value="potong_plafon" /> Potong dari plafond
                                <input type="radio" name="convinienceFeeSetup" disabled="disabled" checked={this.state.adminFeeRadioValue==="beban_plafon"?"checked":""} className="ml-3" value="beban_plafon"  /> Bebankan ke cicilan
                            </label> 
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Layanan</label>
                           
                            <div className="col-sm-10" >
                            <Select
                                value={this.state.jenisLayanan}
                                onChange={this.handleChangejenisLayanan}
                                isMulti={true}
                                options={this.renderJenisLayananJsx()}
                                styles={customStyles}
                                placeholder="Jenis Layanan"
                                
                            />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Produk</label>
                            <div className="col-sm-10">
                                <div>
                                <Select
                                
                                value={this.state.jenisProduct}
                                onChange={this.handleChangejenisProduct}
                                isMulti={true}
                                options={this.renderJenisProductJsx()}
                                styles={customStyles}
                                placeholder="Jenis Produk"
                            />

                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama PIC</label>
                            <div className="col-sm-10">
                            <input type="text" className="form-control" ref="pic" placeholder="Input Nama PIC.." />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">No Telp</label>
                            <div className="col-sm-10">
                            <PhoneInput
                            country="ID"
                            placeholder="Masukan nomor telp.."
                            value={ this.state.phone }
                            onChange={ phone => this.setState({ phone }) } className="form-control" />                                                  
                            </div>
                        </div>
                            {this.renderBtnSumbit()}
                            <input type="button" className="btn btn-secondary ml-2" value="Batal" onClick={this.btnCancel}/>
                            
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

export default Main;