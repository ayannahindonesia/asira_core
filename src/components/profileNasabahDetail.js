import React from 'react'
import Axios from 'axios';
import {serverUrlBorrower} from './url'
// import {serverUrlBorrower} from './url'
import Cookies from 'universal-cookie';
import './../support/css/profilenasabahdetail.css'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Moment from 'react-moment';

const kukie = new Cookies()

class profileNasabahDetail extends React.Component{
    state={rows:[],modalKTP:false,modalNPWP:false,npwp:null,ktp:null,gambarKTP:null,gambarNPWP:null}

    componentDidMount(){
        this.getDataDetail()  
    }
    formatMoney=(number)=>
    { return number.toLocaleString('in-RP', {style : 'currency', currency: 'IDR'})}

    getDataDetail =()=>{
         var id = this.props.match.params.id
        if (kukie.get('token')){
            var config = {
                headers: {'Authorization': "Bearer " + kukie.get('token')}
              };
              Axios.get(serverUrlBorrower+`admin/borrower/${id}`,config)
              .then((res)=>{
                  console.log(res.data)
                  this.setState({rows:res.data,ktp:res.data.idcard_image.Int64,npwp:res.data.taxid_image.Int64})
              })
              .catch((err)=>{
                  console.log(err)
              })
        }
        
    }

    btnModalKTP =()=>{
        this.setState({modalKTP:true})
       
        if(this.state.ktp){
            var config = {
                headers: {'Authorization': "Bearer " + kukie.get('token')}
              };
              Axios.get(serverUrlBorrower+`admin/image/${this.state.ktp}`,config)
              .then((res)=>{
                  console.log(res.data)
                  this.setState({gambarKTP:res.data.image_string})
              })
              .catch((err)=>{
                  console.log(err)
              })
        }else{
            this.setState({gambarKTP:'Gambar KTP kosong'})
        }
          
        
        
    }
    btnModalNPWP =()=>{
        this.setState({modalNPWP:true})
       
        if(this.state.npwp){
            var config = {
                headers: {'Authorization': "Bearer " + kukie.get('token')}
              };
              Axios.get(serverUrlBorrower+`admin/image/${this.state.ktp}`,config)
              .then((res)=>{
                  console.log(res.data)
                  this.setState({gambarNPWP:res.data.image_string})
                  console.log(res.data.image_string)
              })
              .catch((err)=>{
                  console.log(err)
              })
        }else{
            this.setState({gambarNPWP:'Gambar NPWP kosong'})
        }
    }
    btnModalCancelKTP=()=>{
        this.setState({modalKTP:false})
    }
    btnModalCancelNPWP=()=>{
        this.setState({modalNPWP:false})
    }
  
    render(){
        if(kukie.get('token')){
            return(
                <div className="container">
   {/* ------------------------------------------------------FOTO KTP------------------------------------------------------ */}
        <Modal isOpen={this.state.modalKTP} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>KTP Detail</ModalHeader>
          <ModalBody>
             {/* <img width="100%" alt="KTP" src={`data:image/jpeg;base64,${this.state.image}`}></img> */}
             {this.state.ktp?<div>
                <img width="100%" alt="KTP" src={`data:image/jpeg;png;base64,${this.state.gambarKTP}`}></img>
             </div>:<div>{this.state.gambarKTP}</div>}
            
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.btnModalCancelKTP}>Close</Button>
          </ModalFooter>
        </Modal>

    {/* ------------------------------------------------------FOTO NPWP------------------------------------------------------ */}
         <Modal isOpen={this.state.modalNPWP} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>NPWP Detail</ModalHeader>
          <ModalBody>
             {/* <img width="100%" alt="NPWP" src={`data:image/jpeg;base64,${this.state.image}`}></img> */}
             {this.state.npwp?<div>
                <img width="100%" alt="NPWP" src={`data:image/jpeg;png;base64,${this.state.gambarNPWP}`}></img>
             </div>:<div>{this.state.gambarNPWP}</div>}

             {/* <img width="100%" alt="NPWP" src="https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,q_auto:best,w_640/v1516958492/npwp_ayvbmi.jpg"></img> */}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.btnModalCancelNPWP}>Close</Button>
          </ModalFooter>
        </Modal>
        
                <h2>Nasabah - Detail</h2>
                <hr/>
                   <input style={{width:"120px"}} type="button" className="btn btn-primary" value="KTP Detail" onClick={this.btnModalKTP}></input>
                   <input style={{width:"120px"}} type="button" className="ml-2 btn btn-primary" value="NPWP Detail" onClick={this.btnModalNPWP}></input>
    
              <hr/>
                    {/* =========================================FIRST================================ */}
                    <div className="row firstrow">
                        <div className="col-12 col-md-4">
                            <table>
                                <tbody>
                                    <tr>
                                    <td>Id Nasabah</td>
                                    <td>: {this.state.rows.id}</td>
                                </tr>
                                <tr>
                                    <td>Bank Nasabah</td>
                                    <td>: {this.props.name}</td>
                                </tr>

                                </tbody>
                                
                            </table>
    
                        </div>
                        <div className="col-12 col-md-4">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Rekening Peminjam</td>
                                    <td style={{fontSize:"13px"}}>: {this.state.rows.bank_accountnumber}</td>
                                </tr>
                                <tr>
                                    {/* <td>Pinjaman ke</td>
                                    <td>: NO DATA</td> */}
                                </tr>
                                </tbody>
                                
                            </table>
    
                        </div>
                        
                        <div className="col-12 col-md-4">
                        <table>
                            <tbody>
                                 <tr>
                                    {/* <td>Status Pinjaman</td>
                                    <td>: {this.state.rows.status}</td> */}
                                </tr>
                                <tr>
                                    <td>Tanggal Register </td>
                                    <td>: 
                                    <Moment date={this.state.rows.created_time} format=" DD  MMMM  YYYY" />
                                    
{/*                                     
                                    {String(this.state.rows.created_time).substr(0, String(this.state.rows.created_time).indexOf('T'))}
                                     */}
                                    </td>
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
                                    <td>Nama Pasangan</td><td>: {this.state.rows.spouse_name}</td>
                                </tr>
                                <tr>
                                    <td>Tanggal lahir Pasangan</td><td>: {String(this.state.rows.spouse_birthday).substr(0, String(this.state.rows.spouse_birthday).indexOf('T'))}</td>
                                </tr>
                                <tr>
                                    <td>Pendidikan Pasangan</td><td>: {this.state.rows.spouse_lasteducation}</td>
                                </tr>
                                <tr>
                                    <td>Tanggungan (Orang)</td><td>: {this.state.rows.dependants}</td>
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
                            <input style={{width:"120px", float:"left"}} type="button" className="mt-3 btn btn-secondary" value="Back" onClick={()=> window.history.back()}></input>
    
                        </div>
                       
                        
                        
                   
    
                    </div>
                    
                </div>
            )
        
        }
        if(!kukie.get('token')){
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