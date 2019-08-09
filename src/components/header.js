import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

import Logo from './../support/img/logo.jpeg'
import {Link} from 'react-router-dom'
import './../support/css/header.css'
import {connect} from 'react-redux'
import {resetUser} from './../1.actions/index'
import Cookies from 'universal-cookie';

const kukie =new Cookies()


 class Example extends React.Component {

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
    this.props.resetUser()  
    kukie.remove("tokenClient")
  }
  
  render() {
    return (
      <div className="sideBar">
        <Navbar>
          <NavbarBrand href="/">
              <img src={Logo} alt="Logo" width="100%" className="mb-4" />
          </NavbarBrand>
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
                 <Link to="/" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah </DropdownItem></Link>                   
                 <Link to="/" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem>  </Link>                                  
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