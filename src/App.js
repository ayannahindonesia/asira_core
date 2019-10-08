import React from 'react';
import './App.css';
import {Route,withRouter,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {keepLogin} from './1.actions'
import {serverUrl} from './components/url'


import Testing from './components/testing'

import PageNotFound from './components/404'

import TambahBank from './components/bankAdd'
import ListBank from './components/bankList'
import EditBank from './components/bankEdit'
import DetailBank from './components/bankDetail'


import LayananEdit from './components/layananEdit'
import LayananAdd from './components/layananAdd'
import LayananList from './components/layananList'
import LayananDetail from './components/layananDetail'


import Login from './components/login'
import Home from './components/main'
import Nasabah from './components/profileNasabah'
import ScrollTop from './components/scrollToTop'
import Header from './components/header'
import profileNasabahDetail from './components/profileNasabahDetail'
import PermintaanPinjaman from './components/permintaanPinjaman'
import PermintaanPinjamanDetail from './components/permintaanPinjamanDetail'
import PinjamanSetuju from './components/pinjamanSetuju'
import PinjamanRejected from './components/pinjamanRejected'

import ProductAdd from './components/productAdd'
import ProductList from './components/productList'
import ProductDetail from './components/productDetail'

import ProductEdit from './components/productEdit'
import Cookies from 'universal-cookie';
import TypeBankAdd from './components/typebankAdd'
import TypeBankList from './components/typebankList'
import TujuanAdd from './components/tujuanAdd'
import TujuanList from './components/tujuanList'
import TujuanEdit from './components/tujuanEdit'
import TujuanDetail from './components/tujuanDetail'

import TypeBankEdit from './components/typebankEdit'
import TypeBankDetail from './components/typebankDetail'

import RoleAdd from './components/roleAdd'
import RoleList from './components/roleList'
import RoleDetail from './components/roleDetail'
import RoleEdit from './components/roleEdit'

import Report from './components/report/report'
import RoleAddPermission from './components/rolePermission/rolePermissionAdd'
import RoleListPermission from './components/rolePermission/rolePermissionList'
import RoleDetailPermission from './components/rolePermission/rolePermissionDetail'
import RoleEditPermission from './components/rolePermission/rolePermissionEdit'

import UserAdd from './components/user/userAdd'
import UserList from './components/user/userList'
import UserDetail from './components/user/userDetail'
import UserEdit from './components/user/userEdit'

import axios from 'axios'
const kukie =new Cookies()



class App extends React.Component {
  state ={loading : true , tokenClient : null , Token : null}
  componentDidMount(){
    this.getAuth()
  
  
    }
  getAuth = ()=>{
    var url =serverUrl+"clientauth"
    axios.get(url ,{
        auth : {
            username : 'reactkey',
            password : 'reactsecret'
        }
    })
        .then((res)=>{
            var date = new Date();
            date.setTime(date.getTime() + (res.data.expires*1000));
            kukie.set('tokenAuth',res.data.token,{expires: date})
            this.setState({loading : false})
           
        })
        .catch((err)=>{
          console.log(err)
          setTimeout(function(){ alert("Coba reload halaman/ cek koneksi internet"); }, 5000);
        }
           
        )
  }
  render() {  
    if(this.state.loading){
      return(
        <p> loading ....</p>
      )
    }
      return (
      
        <div>
          <ScrollTop>
            <div className="row">
            {
                kukie.get('token') ? 
              <div className="col-2 col-md-3">
              <Header/>
              </div>
              :
              null
            }
              <div className="col-10 col-md-9">
              <Switch> 
                    <Route path='/test' component={Testing}></Route>
                    <Route path='/' component={Home} exact></Route>
                    <Route path='/profileNasabah' component={Nasabah}></Route>
                    <Route path="/profileNasabahDetail/:id" component={profileNasabahDetail}></Route>
                    <Route path="/permintaanpinjaman" component={PermintaanPinjaman}></Route>
                    <Route path="/permintaanpinjamanDetail/:idLoan/:idBorrower" component={PermintaanPinjamanDetail}></Route>
                    <Route path='/pinjamansetuju' component={PinjamanSetuju}></Route>
                    <Route path='/pinjamanrejected' component={PinjamanRejected}></Route>

                    <Route path='/tambahbank' component={TambahBank}></Route>
                    <Route path='/listbank' component={ListBank}></Route>
                    <Route path='/bankedit/:id' component={EditBank}></Route>
                    <Route path='/bankdetail/:id' component={DetailBank}></Route>

                    <Route path='/tambahproduct' component={ProductAdd}></Route>
                    <Route path='/listproduct' component={ProductList}></Route>
                    <Route path='/productdetail/:id' component={ProductDetail}></Route>
                  
                    <Route path='/layananedit/:id' component={LayananEdit}></Route>
                    <Route path='/productedit/:id' component={ProductEdit}></Route>
                    <Route path='/tambahlayanan' component={LayananAdd}></Route>
                    <Route path='/listlayanan' component={LayananList}></Route>
                    <Route path='/layanandetail/:id' component={LayananDetail}></Route>


                    <Route path='/tambahtipe' component={TypeBankAdd}></Route>
                    <Route path='/listtipe' component={TypeBankList}></Route>
                    <Route path='/banktypedetail/:id' component={TypeBankDetail}></Route>

                    <Route path='/banktypeedit/:id' component={TypeBankEdit}></Route>
                    <Route path='/tambahtujuan' component={TujuanAdd}></Route>
                    <Route path='/listtujuan' component={TujuanList}></Route>
                    <Route path='/tujuanedit/:id' component={TujuanEdit}></Route>
                    <Route path='/tujuandetail/:id' component={TujuanDetail}></Route>
                    
                    <Route path='/tambahrole' component={RoleAdd}></Route>
                    <Route path='/listrole' component={RoleList}></Route>
                    <Route path='/editrole/:id' component={RoleEdit}></Route>
                    <Route path='/detailrole/:id' component={RoleDetail}></Route>


                    <Route path='/report' component={Report}></Route>

                    <Route path='/tambahRolePermission' component={RoleAddPermission}></Route>
                    <Route path='/listRolePermission' component={RoleListPermission}></Route>
                    <Route path='/editRolePermission/:id' component={RoleEditPermission}></Route>
                    <Route path='/detailRolePermission/:id' component={RoleDetailPermission}></Route>

                    <Route path='/tambahUser' component={UserAdd}></Route>
                    <Route path='/listUser' component={UserList}></Route>
                    <Route path='/editUser/:id' component={UserEdit}></Route>
                    <Route path='/detailUser/:id' component={UserDetail}></Route>

                    {kukie.get('token') ?  <Route path="/login" component={Home}></Route>:  <Route path="/login" component={Login}></Route>} 

                    <Route path='*' component={PageNotFound} />
              </Switch>
              </div>
            </div>
          </ScrollTop>
        </div>
     
         );
    
  
     
 
  }
}
  
const mapStateToProps = (state)=>{
  return {
      id : state.user.id

  }
}

export default withRouter(connect(mapStateToProps,{keepLogin}) (App));