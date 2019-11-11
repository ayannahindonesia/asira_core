import React from 'react'
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import swal from 'sweetalert'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { getProvinsiFunction, getKabupatenFunction, getBankDetailFunction, getBankTypesFunction, editBankFunction } from './saga';
import { listProductFunction } from './../product/saga'
import { getToken } from '../index/token';
import { getAllLayananListFunction } from '../layanan/saga';

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
    _isMounted=false;
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

    handleChangejenisLayanan = (jenisLayanan) => {
        this.setState({ serviceName:jenisLayanan , productName: null}, (() => {
            let stringServiceId = '';
            if(this.state.serviceName) {
                for(let key = 0; key < this.state.serviceName.length; key++) {
                    stringServiceId += `${this.state.serviceName[key].value}`;
                    if(this.state.serviceName[key + 1]) {
                        stringServiceId += ',';
                    }
                }
                this.getBankProduct(stringServiceId)
            }
        }));

    };

    handleChangejenisProduct = (jenisProduct) => {
        this.setState({ productName:jenisProduct });
    };
    componentDidMount(){
        this._isMounted=true
        this.getAllProvinsi()
        this.getBankDataById()
    }
    componentWillUnmount(){
        this._isMounted=false
    }

    getAllProvinsi = async function(){
        const data = await getProvinsiFunction()
        
        if(data){
            if(!data.error){
                this.setState({provinsi:data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    getAllKabupaten = async function (params) {
        const data = await getKabupatenFunction(params)
        if(data){
            if(!data.error){
                this.setState({kabupaten:data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    getBankProduct = async function (stringServiceId) {
        const param ={
            service_id: stringServiceId || '',
        }

        const data = await listProductFunction(param)
        if (data){
            if(!data.error){
                this.setState({bankProduct:data.productList.data, productName: null})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    getBankService = async function () {
        const data = await getAllLayananListFunction({})

        if(data){
            if(!data.error){
                this.setState({bankService:data.listLayanan.data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    } 


    getBankDataById = async function (){
        const param = {
            id:this.props.match.params.id
        }

        const data = await getBankDetailFunction(param)

        if(data){
            if(!data.error){
                this.setState({dataBank:data,productID:data.products,serviceID:data.services})
                if (this.state.dataBank){
                  this.getTypeBank()
                  this.getBankService()
                  this.getServiceDataSudahTerpilih()
                  this.getProductDataSudahTerpilih()
                }
            }else{
                this.setState({errorMessage:data.error})
            }
        }

    }

    getTypeBank = async function (){
        const param = {
            type: this.state.dataBank.type
        }
        const data = await getBankTypesFunction(param)

        if(data){
            if(!data.error){
                this.setState({namaTipeBank:data.data.name})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
   
    }

   

    getServiceDataSudahTerpilih = async function(){
        let param = {
            id:this.state.dataBank.products.toString()
        }

        const data = await getAllLayananListFunction(param)

        if(data){
            if(!data.error){
                var serviceName = data.listLayanan.data.map((val)=>{
                    return {value:val.id,label:val.name,id:val.id}
                })
                this.setState({serviceName:serviceName})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
   
    getProductDataSudahTerpilih = async function(){
        let param = {
            id:this.state.dataBank.products.toString()
        }
        const data = await listProductFunction(param)

        if(data){
            if(!data.error){
                let productName = data.productList.data.map((val)=>{
                    return {value:val.id,label:val.name}
                })
                this.setState({productName:productName})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
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
        var jsx = this.state.bankProduct.map((val)=>{
                return {id:val.id, value: val.id, label: " [ "+this.findServiceName(val.service_id)+" ] "+val.name }
        })
        return jsx
    }

    findServiceName = (service_id) => {
        let stringService = '';
        console.log(this.state.serviceName)
        for(const key in this.state.serviceName) {
            if(this.state.serviceName[key].id.toString() === service_id.toString()) {
                stringService = this.state.serviceName[key].label
            }
        }
        return stringService;
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
            const param = {
                id:id,
                newData
            }
           
            this.editBankBtn(param)
           
       }
    }

    editBankBtn = async function (param){
        const data = await editBankFunction(param)
        if(data){
            if(!data.error){
                swal("Success","Data berhasil di edit","success")
                this.setState({diKlik:true,errorMessage:null,submit:false})
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listbank'/>            
        }
        if(getToken()){
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
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default BankEdit;