import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

import Logo from './../support/img/logo.jpeg'
import {Link,Redirect} from 'react-router-dom'
import './../support/css/header.css'
import {connect} from 'react-redux'
import {resetUser} from './../1.actions/index'
import Cookies from 'universal-cookie';

const kukie =new Cookies()


 class Example extends React.Component {
  state={isLogin:false}
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: true
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  //Button log out function  
  logOutBtn =()=>{ 
    kukie.remove("tokenGeo")
    kukie.remove("token")
    kukie.remove("tokenAuth")
    this.setState({isLogin:true})
  }
  
  render() {
    if(this.state.isLogin){
      return(
          <Redirect to='/' />
      )
    }

    return (
      <div className="sideBar">
        <Navbar>
          
          <img src={Logo} alt="Logo" width="100%" className="mb-4" />
         
          <NavbarToggler onClick={this.toggle} style={{display:"none"}}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              
            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-university"></i> Bank</label>
              </DropdownToggle>
              <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                <Link to="/tambahbank" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>                   
                <Link to="/listbank" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link>                
              </DropdownMenu>
            </UncontrolledDropdown>

            <Link to="/profileNasabah" ><label><i className="fas fa-user-friends"></i> Nasabah</label></Link>
            <Link to="/permintaanpinjaman"><label><i className="fas fa-hand-holding-usd"></i> Pinjaman</label></Link>
            
            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-concierge-bell"></i> Layanan</label>
              </DropdownToggle>
              <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                <Link to="/tambahlayanan" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>                   
                <Link to="/listlayanan" style={{color:"inherit",textDecoration:"none"}}> <DropdownItem>List</DropdownItem></Link>                
              </DropdownMenu>
            </UncontrolledDropdown>
            
            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
              <label><i className="fas fa-money-check-alt"></i> Product</label>
              </DropdownToggle>
              <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                <Link to="/tambahproduct" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah </DropdownItem></Link>                   
                <Link to="/listproduct" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem>  </Link>                                  
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-sliders-h"></i> Tipe Bank</label>
              </DropdownToggle>
              <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                <Link to="/tambahtipe" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>                   
                <Link to="/listtipe" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link>                
              </DropdownMenu>
            </UncontrolledDropdown>
              
            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-bullseye"></i> Tujuan</label>
              </DropdownToggle>
              <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                <Link to="/tambahtujuan" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>                   
                <Link to="/listtujuan" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link>                
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-handshake"></i> Role</label>
              </DropdownToggle>
              <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                <Link to="/tambahrole" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>                   
                <Link to="/listrole" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link>                
              </DropdownMenu>
            </UncontrolledDropdown>

            <Link to="/report"><label><i className="far fa-newspaper"></i> Report</label></Link>

            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-user-tag"></i> Role Permission </label>
              </DropdownToggle>
              <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                <Link to="/tambahRolePermission" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>                   
                <Link to="/listRolePermission" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link>                
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-user"></i> User </label>
              </DropdownToggle>
              <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                <Link to="/tambahUser" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>                   
                <Link to="/listUser" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link>                
              </DropdownMenu>
            </UncontrolledDropdown>
           
        
            <p style={{ cursor:"pointer"}} onClick={this.logOutBtn}><label><i className="fas fa-sign-out-alt"></i> Log Out</label></p>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
const mapStateToProp = (state)=>{
  return{
      name:state.user.name,
      address:state.user.address
  }
  
}
export default connect(mapStateToProp,{resetUser})(Example)