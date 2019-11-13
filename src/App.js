import React from 'react';
import './App.css';
import {Route,withRouter,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {keepLogin} from './1.actions'
import {serverUrl} from './components/url'
import {checkPermission} from './components/global/globalFunction'

import Testing from './components/testing'

import PageNotFound from './components/404'

import TambahBank from './components/bank/bankAdd'
import ListBank from './components/bank/bankList'
import EditBank from './components/bank/bankEdit'
import DetailBank from './components/bank/bankDetail'


import LayananEdit from './components/layanan/layananEdit'
import LayananAdd from './components/layanan/layananAdd'
import LayananList from './components/layanan/layananList'
import LayananDetail from './components/layanan/layananDetail'


import Login from './components/index/login'
import Header from './components/index/header'
import Home from './components/index/main'
import Nasabah from './components/profileNasabah/profileNasabah'
import ScrollTop from './components/scrollToTop'
import profileNasabahDetail from './components/profileNasabah/profileNasabahDetail'
import PermintaanPinjaman from './components/permintaanPinjaman/permintaanPinjaman'
import PermintaanPinjamanDetail from './components/permintaanPinjaman/permintaanPinjamanDetail'

import ProductAdd from './components/product/productAdd'
import ProductList from './components/product/productList'
import ProductDetail from './components/product/productDetail'
import ProductEdit from './components/product/productEdit'

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

import penyediaAgentAdd from './components/penyediaAgent/penyediaAdd'
import penyediaAgentEdit from './components/penyediaAgent/penyediaEdit'
import penyediaAgentDetail from './components/penyediaAgent/penyediaDetail'
import penyediaAgentList from './components/penyediaAgent/penyediaList'

import AgentAdd from './components/agent/agentAdd'
import AgentList from './components/agent/agentList'
import AgentDetail from './components/agent/agentDetail'
import AgentEdit from './components/agent/agentEdit'

import axios from 'axios'
import { getToken, setTokenAuth, getProfileUser } from './components/index/token';

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

        setTokenAuth(res.data.token);
        
        this.setState({loading : false})   
    }).catch((err)=>{
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
            getToken() && getProfileUser() ? 
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

                  { checkPermission('core_borrower_get_all') && <Route path='/profileNasabah' component={Nasabah}></Route>}
                  { checkPermission('core_borrower_get_details') && <Route path="/profileNasabahDetail/:id" component={profileNasabahDetail}></Route>}

                  { checkPermission('core_loan_get_all') && <Route path="/permintaanpinjaman" component={PermintaanPinjaman}></Route>}
                  { checkPermission('core_loan_get_details') && <Route path="/permintaanpinjamanDetail/:idLoan/:idBorrower" component={PermintaanPinjamanDetail}></Route>}

                  { checkPermission('core_bank_new') && <Route path='/tambahbank' component={TambahBank}></Route>}
                  { checkPermission('core_bank_list') && <Route path='/listbank' component={ListBank}></Route>}
                  { checkPermission('core_bank_patch') && <Route path='/bankedit/:id' component={EditBank}></Route>}
                  { checkPermission('core_bank_detail') && <Route path='/bankdetail/:id' component={DetailBank}></Route>}

                  { checkPermission('core_product_new') && <Route path='/tambahproduct' component={ProductAdd}></Route>}
                  { checkPermission('core_product_list') && <Route path='/listproduct' component={ProductList}></Route>}
                  { checkPermission('core_product_patch') && <Route path='/productedit/:id' component={ProductEdit}></Route>}
                  { checkPermission('core_product_detail') && <Route path='/productdetail/:id' component={ProductDetail}></Route>}
                
                                    
                  { checkPermission('core_service_new') && <Route path='/tambahlayanan' component={LayananAdd}></Route>}
                  { checkPermission('core_service_list') && <Route path='/listlayanan' component={LayananList}></Route>}
                  { checkPermission('core_service_patch') && <Route path='/layananedit/:id' component={LayananEdit}></Route>}
                  { checkPermission('core_service_detail') && <Route path='/layanandetail/:id' component={LayananDetail}></Route>}


                  { checkPermission('core_bank_type_new') && <Route path='/tambahtipe' component={TypeBankAdd}></Route>}
                  { checkPermission('core_bank_type_list') && <Route path='/listtipe' component={TypeBankList}></Route>}
                  { checkPermission('core_bank_type_patch') && <Route path='/banktypeedit/:id' component={TypeBankEdit}></Route>}
                  { checkPermission('core_bank_type_detail') && <Route path='/banktypedetail/:id' component={TypeBankDetail}></Route>}
                  
                  { checkPermission('core_loan_purpose_new') && <Route path='/tambahtujuan' component={TujuanAdd}></Route>}
                  { checkPermission('core_loan_purpose_list') && <Route path='/listtujuan' component={TujuanList}></Route>}
                  { checkPermission('core_loan_purpose_patch') && <Route path='/tujuanedit/:id' component={TujuanEdit}></Route>}
                  { checkPermission('core_loan_purpose_detail') && <Route path='/tujuandetail/:id' component={TujuanDetail}></Route>}
                  
                  { checkPermission('core_role_new') && <Route path='/tambahrole' component={RoleAdd}></Route>}
                  { checkPermission('core_role_list') && <Route path='/listrole' component={RoleList}></Route>}
                  { checkPermission('core_role_patch') && <Route path='/editrole/:id' component={RoleEdit}></Route>}
                  { checkPermission('core_role_details') && <Route path='/detailrole/:id' component={RoleDetail}></Route>}

                  { checkPermission('core_permission_new') && <Route path='/tambahRolePermission' component={RoleAddPermission}></Route>}
                  { checkPermission('core_permission_list') && <Route path='/listRolePermission' component={RoleListPermission}></Route>}
                  { checkPermission('core_permission_patch') && <Route path='/editRolePermission/:id' component={RoleEditPermission}></Route>}
                  { checkPermission('core_permission_detail') && <Route path='/detailRolePermission/:id' component={RoleDetailPermission}></Route>}

                  { checkPermission('core_user_new') && <Route path='/tambahUser' component={UserAdd}></Route>}
                  { checkPermission('core_user_list') && <Route path='/listUser' component={UserList}></Route>}
                  { checkPermission('core_user_patch') && <Route path='/editUser/:id' component={UserEdit}></Route>}
                  { checkPermission('core_user_details') && <Route path='/detailUser/:id' component={UserDetail}></Route>}

                  { checkPermission('convenience_fee_report') && <Route path='/report' component={Report}></Route>}

                  { checkPermission('core_agent_provider_new') && <Route path='/penyediaAdd' component={penyediaAgentAdd}></Route>}
                  { checkPermission('core_agent_provider_list') && <Route path='/penyediaList' component={penyediaAgentList}></Route>}
                  { checkPermission('core_agent_provider_patch') && <Route path='/penyediaEdit/:id' component={penyediaAgentEdit}></Route>}
                  { checkPermission('core_agent_provider_details') && <Route path='/penyediaDetail/:id' component={penyediaAgentDetail}></Route>}

                  { checkPermission('core_agent_new') && <Route path='/tambahAgent' component={AgentAdd}></Route>}
                  { checkPermission('core_agent_list') && <Route path='/listAgent' component={AgentList}></Route>}
                  { checkPermission('core_agent_patch') && <Route path='/editAgent/:id' component={AgentEdit}></Route>}
                  { checkPermission('core_agent_details') && <Route path='/detailAgent/:id' component={AgentDetail}></Route>}

                  {getToken() && getProfileUser() ?  <Route path="/login" component={Home}></Route>:  <Route path="/login" component={Login}></Route>} 

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