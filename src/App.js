import React from 'react';
import './App.css';
import {Route,withRouter,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {keepLogin} from './1.actions'
import {serverUrl} from './components/url'
import {checkPermission} from './components/global/globalFunction'

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


import Login from './components/index/login'
import Header from './components/index/header'
import Home from './components/index/main'
import Nasabah from './components/profileNasabah'
import ScrollTop from './components/scrollToTop'
import profileNasabahDetail from './components/profileNasabahDetail'
import PermintaanPinjaman from './components/permintaanPinjaman'
import PermintaanPinjamanDetail from './components/permintaanPinjamanDetail'

import ProductAdd from './components/product/productAdd'
import ProductList from './components/product/productList'
import ProductDetail from './components/product/productDetail'

import ProductEdit from './components/product/productEdit'
import Cookies from 'universal-cookie';
import TypeBankAdd from './components/tipebank/typebankAdd'
import TypeBankList from './components/tipebank/typebankList'
import TujuanAdd from './components/tujuan/tujuanAdd'
import TujuanList from './components/tujuan/tujuanList'
import TujuanEdit from './components/tujuan/tujuanEdit'
import TujuanDetail from './components/tujuan/tujuanDetail'

import TypeBankEdit from './components/tipebank/typebankEdit'
import TypeBankDetail from './components/tipebank/typebankDetail'

import RoleAdd from './components/role/roleAdd'
import RoleList from './components/role/roleList'
import RoleDetail from './components/role/roleDetail'
import RoleEdit from './components/role/roleEdit'

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
  state = {
    loading : true , 
  }

  componentDidMount(){
    this.getAuth()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.pathname === '/login' && this.props.location.pathname === '/') {
      this.getAuth()
    }
    
  }

  getAuth = ()=>{
    var url =serverUrl+"clientauth"
    axios.get(url ,{
        auth : {
          username : 'reactkey',
          password : 'reactsecret'
        }
    }).then((res)=>{
        var date = new Date();
        date.setTime(date.getTime() + (res.data.expires*1000));
        kukie.set('tokenAuth',res.data.token,{expires: date})
        
        this.setState({loading : false})   
    }).catch((err)=>{
      console.log(err)
      setTimeout(function(){ alert("Coba reload halaman/ cek koneksi internet"); }, 5000);
    })
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
              <Header />
            </div>
            :
            null
          }
            <div className="col-10 col-md-9">
            <Switch> 
                  <Route path='/test' component={Testing}></Route>
                  <Route path='/' component={Home} exact></Route>

                  { checkPermission('Borrower_List') && <Route path='/profileNasabah' component={Nasabah}></Route>}
                  { checkPermission('Borrower_List') && <Route path="/profileNasabahDetail/:id" component={profileNasabahDetail}></Route>}

                  { checkPermission('Loan_List') && <Route path="/permintaanpinjaman" component={PermintaanPinjaman}></Route>}
                  { checkPermission('Loan_List') && <Route path="/permintaanpinjamanDetail/:idLoan/:idBorrower" component={PermintaanPinjamanDetail}></Route>}

                  { checkPermission('Bank_Add') && <Route path='/tambahbank' component={TambahBank}></Route>}
                  { checkPermission('Bank_List') && <Route path='/listbank' component={ListBank}></Route>}
                  { checkPermission('Bank_Edit') && <Route path='/bankedit/:id' component={EditBank}></Route>}
                  { checkPermission('Bank_List') && <Route path='/bankdetail/:id' component={DetailBank}></Route>}

                  { checkPermission('ServiceProduct_Add') && <Route path='/tambahproduct' component={ProductAdd}></Route>}
                  { checkPermission('ServiceProduct_List') && <Route path='/listproduct' component={ProductList}></Route>}
                  { checkPermission('ServiceProduct_Edit') && <Route path='/productedit/:id' component={ProductEdit}></Route>}
                  { checkPermission('ServiceProduct_List') && <Route path='/productdetail/:id' component={ProductDetail}></Route>}
                
                                    
                  { checkPermission('BankService_Add') && <Route path='/tambahlayanan' component={LayananAdd}></Route>}
                  { checkPermission('BankService_List') && <Route path='/listlayanan' component={LayananList}></Route>}
                  { checkPermission('BankService_Edit') && <Route path='/layananedit/:id' component={LayananEdit}></Route>}
                  { checkPermission('BankService_List') && <Route path='/layanandetail/:id' component={LayananDetail}></Route>}


                  { checkPermission('BankType_Add') && <Route path='/tambahtipe' component={TypeBankAdd}></Route>}
                  { checkPermission('BankType_List') && <Route path='/listtipe' component={TypeBankList}></Route>}
                  { checkPermission('BankType_Edit') && <Route path='/banktypeedit/:id' component={TypeBankEdit}></Route>}
                  { checkPermission('BankType_List') && <Route path='/banktypedetail/:id' component={TypeBankDetail}></Route>}
                  
                  { checkPermission('LoanPurposes_Add') && <Route path='/tambahtujuan' component={TujuanAdd}></Route>}
                  { checkPermission('LoanPurposes_List') && <Route path='/listtujuan' component={TujuanList}></Route>}
                  { checkPermission('LoanPurposes_Edit') && <Route path='/tujuanedit/:id' component={TujuanEdit}></Route>}
                  { checkPermission('LoanPurposes_List') && <Route path='/tujuandetail/:id' component={TujuanDetail}></Route>}
                  
                  { checkPermission('Role_Add') && <Route path='/tambahrole' component={RoleAdd}></Route>}
                  { checkPermission('Role_List') && <Route path='/listrole' component={RoleList}></Route>}
                  { checkPermission('Role_Edit') && <Route path='/editrole/:id' component={RoleEdit}></Route>}
                  { checkPermission('Role_List') && <Route path='/detailrole/:id' component={RoleDetail}></Route>}

                  { checkPermission('Permission_Add') && <Route path='/tambahRolePermission' component={RoleAddPermission}></Route>}
                  { checkPermission('Permission_List') && <Route path='/listRolePermission' component={RoleListPermission}></Route>}
                  { checkPermission('Permission_Edit') && <Route path='/editRolePermission/:id' component={RoleEditPermission}></Route>}
                  { checkPermission('Permission_List') && <Route path='/detailRolePermission/:id' component={RoleDetailPermission}></Route>}

                  { checkPermission('User_Add') && <Route path='/tambahUser' component={UserAdd}></Route>}
                  { checkPermission('User_List') && <Route path='/listUser' component={UserList}></Route>}
                  { checkPermission('User_Edit') && <Route path='/editUser/:id' component={UserEdit}></Route>}
                  { checkPermission('User_List') && <Route path='/detailUser/:id' component={UserDetail}></Route>}

                  { checkPermission('Report_List') && <Route path='/report' component={Report}></Route>}

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