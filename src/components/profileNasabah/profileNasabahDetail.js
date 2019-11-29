import React from 'react'
import './../../support/css/profilenasabahdetail.css'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Moment from 'react-moment';
import BrokenLink from './../../support/img/default.png'
import Loader from 'react-loader-spinner'
import {getProfileNasabahDetailFunction, getImageFunction} from './saga'
import { getToken } from '../index/token';
import { getBankDetailFunction } from '../bank/saga';


class profileNasabahDetail extends React.Component{
    state={rows:[],modalKTP:false,modalNPWP:false,npwp:null,ktp:null,gambarKTP:null,gambarNPWP:null,
        bankID:0,bankName:'',diKlik:false,progress:false,errorMessage:''}
    
    _isMounted = false
    componentDidMount(){
        this.getDataDetail()  
        this._isMounted = true
       
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    getDataDetail = async function () {
        const param = {
            id:this.props.match.params.id
        }

        const data = await getProfileNasabahDetailFunction(param)
        if(data){
            console.log(data)
            if(!data.error){
                this.setState({rows:data.data,ktp:data.data.idcard_image,npwp:data.data.taxid_image, bankID:data.data.bank.Int64})
                  //KTP WAJIB KALO NPWP OPTIONAL
                    this.getBankName() 
                    this.getImage(this.state.ktp,'gambarKTP')
                    this.getImage(this.state.npwp,'gambarNPWP')
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    getBankName = async function(){
        const param = {
            id:this.state.bankID
        }
        const data = await getBankDetailFunction(param)

        if(data){
            if(!data.error){
                this.setState({bankName:data.name})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
        return this.state.bankName
    }

    getImage =  async function(idImage, stringStates){
        const param ={
            id:idImage
        }

        const data = await getImageFunction(param)

        if(data){
            if(!data.error){
            this.setState({[stringStates]:data.data.image_string,progress:false})
            }else{
            this.setState({progress:false,errorMessage:'ID Gambar KTP dalam Database Tidak ditemukan'})                  
            }
        }
    }
    
    formatMoney=(number)=>
    { return number.toLocaleString('in-RP', {style : 'currency', currency: 'IDR'})}


    btnModalKTP =()=>{
        this.setState({modalKTP:true})
        
    }
    btnModalNPWP =()=>{
        this.setState({modalNPWP:true})
       
    }
    btnModalCancelKTP=()=>{
        this.setState({modalKTP:false})
    }
    btnModalCancelNPWP=()=>{
        this.setState({modalNPWP:false})
    }  
    render(){
        if (this.state.progress){
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
            
        
        if(this.state.diKlik){
            return(
                <Redirect to="/profileNasabah"></Redirect>
            )
        }
        if(getToken()){
            return(
                <div className="container-fluid">
   {/* ------------------------------------------------------FOTO KTP------------------------------------------------------ */}

   <Modal isOpen={this.state.modalKTP} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>KTP Detail</ModalHeader>
          <ModalBody>
              {this.state.ktp ===0 || this.state.gambarKTP === '' ?"Gambar KTP Tidak ada":
             <img width="100%" height="300px" alt="KTP" onError={(e)=>{
                e.target.attributes.getNamedItem("src").value = BrokenLink
             }} src={`data:image/*;base64,${this.state.gambarKTP}`}></img>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.btnModalCancelKTP}>Close</Button>
          </ModalFooter>
        </Modal>
        

    {/* ------------------------------------------------------FOTO NPWP------------------------------------------------------ */}
    
    <Modal isOpen={this.state.modalNPWP} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>NPWP Detail</ModalHeader>
          <ModalBody>
            {this.state.npwp ===0 || this.state.gambarNPWP === '' ?"Gambar NPWP Tidak ada":
                <img width="100%" height="300px" alt="NPWP" onError={(e)=>{
                    e.target.attributes.getNamedItem("src").value = BrokenLink
                 }} src={`data:image/*;base64,${this.state.gambarNPWP}`}></img>}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.btnModalCancelNPWP}>Close</Button>
          </ModalFooter>
        </Modal>
        
        
                <h2>Nasabah - Detail</h2>
                <div style={{color:'red'}}>
                    {this.state.errorMessage}
                </div>
                <hr/>
                   <input style={{width:"120px"}} type="button" className="btn btn-primary" value="KTP Detail" onClick={this.btnModalKTP}></input>
                   <input style={{width:"120px"}} type="button" className="ml-2 btn btn-primary" value="NPWP Detail" onClick={this.btnModalNPWP}></input>
    
              <hr/>
                    {/* =========================================FIRST================================ */}
                    <div className="row firstrow">
                        <div className="col col-md col-xs">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Id Nasabah</td>
                                    <td>: {this.state.rows.id}</td>
                                    <td>Rekening Pinjaman</td>
                                    <td>: {this.state.rows.bank_accountnumber}</td>
                                    <td>Status Nasabah</td>
                                    <td>: {this.state.rows.loan_status ==="inactive"?"Tidak Aktif":"Aktif"}</td>
                                   
                                </tr>
                                <tr>
                                    <td>Bank Nasabah</td>
                                    <td>: {this.state.bankName}</td>
                                    <td>Pinjaman ke-</td>
                                    <td>: {this.state.rows.loan_count} </td>
                                    <td>Tanggal Register</td>
                                    <td>: <Moment date={this.state.rows.created_time} format=" DD  MMMM  YYYY" /></td>
                                   
                                </tr>
                                <tr>
                                <td>Kategori Pinjaman</td>
                                    <td>: {this.state.rows.category ==="account_executive"?"Account Executive" :
                                           this.state.rows.category === "agent"?"Agent":"Personal"}</td>
                                <td>Agen/AE</td>
                                    <td>: {this.state.rows.agent_name ===""?"-":this.state.rows.agent_name} ( {this.state.rows.agent_provider_name ===""?"-":this.state.rows.agent_provider_name} ) </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* ==============================SECOND===================================== */}
                    <h5 className="mt-4">Informasi Pribadi</h5>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Nama</td><td>: {this.state.rows.fullname}</td>
                                </tr>
                                <tr>
                                    <td>Jenis Kelamin</td><td>: {this.state.rows.gender}</td>
                                </tr>
                                <tr>
                                    <td>No KTP</td><td>: {this.state.rows.idcard_number}</td>
                                </tr>
                                <tr>
                                    <td>No NPWP</td><td>: {this.state.rows.taxid_number}</td>
                                </tr>
                                <tr>
                                    <td>Email</td><td>: {this.state.rows.email}</td>
                                </tr>

                                </tbody>
                              
                            </table>
    
                        </div>
                        <div className="col-12 col-md-4">
                        <table>
                            <tbody>
                            <tr>
                                    <td>Tanggal Lahir</td><td>: {String(this.state.rows.birthday).substr(0, String(this.state.rows.birthday).indexOf('T'))}</td>
                                </tr>
                                <tr>
                                    <td>Tempat Lahir</td><td>: {this.state.rows.birthplace}</td>
                                </tr>
                                <tr>
                                    <td>Pendidikan</td><td>: {this.state.rows.last_education}</td>
                                </tr>
                                <tr>
                                    <td>Nama Ibu Kandung</td><td>: {this.state.rows.mother_name}</td>
                                </tr>
                                <tr>
                                    <td>No HP</td><td>: {this.state.rows.phone}</td>
                                </tr>
                            </tbody>
                         
                            </table>
    
                        </div>
                        
                        <div className="col-12 col-md-4">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Status Pernikahan</td><td>: {this.state.rows.marriage_status}</td>
                                </tr>
                                <tr>
                                    <td>Nama Pasangan</td><td>: {this.state.rows.marriage_status==="Menikah"?this.state.rows.spouse_name:"-"}</td>
                                </tr>
                                <tr>
                                    <td>Tanggal lahir Pasangan</td><td>: {this.state.rows.marriage_status==="Menikah"?String(this.state.rows.spouse_birthday).substr(0, String(this.state.rows.spouse_birthday).indexOf('T')):"-"}</td>
                                </tr>
                                <tr>
                                    <td>Pendidikan Pasangan</td><td>: {this.state.rows.marriage_status==="Menikah"?this.state.rows.spouse_lasteducation:"-"}</td>
                                </tr>
                                <tr>
                                    <td>Tanggungan (Orang)</td><td>: {this.state.rows.marriage_status==="Menikah"?this.state.rows.dependants:"-"}</td>
                                </tr>

                            </tbody>
                             
                            </table>
                        </div>
                   
    
                    </div>
                    {/* ==============================THIRD===================================== */}
                    <h5 className="mt-4">Data Tempat Tinggal</h5>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <table>
                                <tbody>
                                 <tr>
                                        <td>Alamat</td><td>: {this.state.rows.address}</td>
                                    </tr>
                                    <tr>
                                        <td>Provinsi</td><td>: {this.state.rows.province}</td>
                                    </tr>
                                    <tr>
                                        <td>Kota</td><td>: {this.state.rows.city}</td>
                                    </tr>
                                    <tr>
                                        <td>RT/ RW</td><td>: {this.state.rows.neighbour_association}/{this.state.rows.hamlets} </td>
                                    </tr>
                                    <tr>
                                        <td>No Telp Rumah</td><td>: {this.state.rows.home_phonenumber}</td>
                                    </tr>

                                </tbody>
                                  
                                </table>
                        </div>
                        <div className="col-12 col-md-6">
                            <table>
                                <tbody>
                                <tr>
                                        <td>Kecamatan</td><td>: {this.state.rows.subdistrict}</td>
                                    </tr>
                                    <tr>
                                        <td>Kelurahan</td><td>: {this.state.rows.urban_village}</td>
                                    </tr>
                                    <tr>
                                        <td>Status Tempat Tinggal</td><td>: {this.state.rows.home_ownership}</td>
                                    </tr>
                                    <tr>
                                        <td>Lama Menempati Rumah</td><td>: {this.state.rows.lived_for} Tahun</td>
                                    </tr>
                                </tbody>
                                    
                                 
                                </table>
                        </div>
                        <div className="col-12 col-md-4">
                            <table>
                                   
                                   
                                   
                                </table>
                        </div>
                    </div>
                      {/* ==============================FOURTH===================================== */}
                    <h5 className="mt-4">Info Pekerjaan</h5>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <table>
                                <tbody>   
                                <tr>
                                    <td>Jenis Pekerjaan</td><td>: {this.state.rows.occupation}</td>
                                </tr>
                                <tr>
                                    <td>No Induk Pegawai</td><td>: {this.state.rows.employee_id}</td>
                                </tr>
                                <tr>
                                    <td>Nama Instansi</td><td>: {this.state.rows.employer_name}</td>
                                </tr>
                                <tr>
                                    <td>Alamat Kantor</td><td>: {this.state.rows.employer_address}</td>
                                </tr>

                                </tbody>
                             
                            </table>
    
                        </div>
                        <div className="col-12 col-md-4">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Jabatan</td><td>: {this.state.rows.department}</td>
                                </tr>
                                <tr>
                                    <td>Lama Bekerja (Tahun)</td><td>: {this.state.rows.been_workingfor}</td>
                                </tr>
                                <tr>
                                    <td>Nama Atasan</td><td>: {this.state.rows.direct_superiorname}</td>
                                </tr>
                                <tr>
                                    <td>No Tlp Kantor</td><td>: {this.state.rows.employer_number}</td>
                                </tr>
                            </tbody>
                              
                            </table>
    
                        </div>
                        
                        <div className="col-12 col-md-4">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Gaji (Perbulan)</td><td>: {this.state.rows.monthly_income ? this.formatMoney(parseInt(this.state.rows.monthly_income)): 0}</td>
                                </tr>
                                <tr>
                                    <td>Pendapatan Lain</td><td>: {this.state.rows.other_income?this.formatMoney(parseInt(this.state.rows.other_income)):0}</td>
                                </tr>
                                <tr>
                                    <td>Sumber Lain</td><td>: {this.state.rows.other_incomesource}</td>
                                </tr>
                            </tbody>
                               
                              
                            </table>
                        </div>
                   
    
                    </div>
                     {/* ==============================FIFTH===================================== */}
                     <h5 className="mt-4">Lain - Lain</h5>
                    <div className="row">
                        <div className="col-12 col-md-12">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Nama Orang Tidak Serumah yang bisa di hubungi</td><td>: {this.state.rows.related_personname}</td>
                                </tr>
                                <tr>
                                    <td>Hubungan</td><td>: {this.state.rows.related_relation}</td>
                                </tr>
                                <tr>
                                    <td>Alamat Rumah</td><td>: {this.state.rows.related_address}</td>
                                </tr>
                                <tr>
                                    <td>No Telp Rumah</td><td>: {this.state.rows.related_homenumber}</td>
                                </tr>
                                <tr>
                                    <td>No HP</td><td>: {this.state.rows.related_phonenumber}</td>

                                </tr>
                                
                                </tbody>
                                
                            </table>
                            <input style={{width:"120px", float:"left"}} type="button" className="mt-3 btn btn-secondary" value="Kembali" onClick={()=> this.setState({diKlik:true})}></input>
    
                        </div>
                       
                        
                        
                   
    
                    </div>
                    
                </div>
            )
                                    }
        }
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
        
    }
}
const mapStateToProp = (state)=>{
    return{
        name:state.user.name
        
    }
    
  }
export default connect(mapStateToProp) (profileNasabahDetail);