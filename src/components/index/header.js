import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem 
} from 'reactstrap';
import Logo from './../../support/img/logo.jpeg'
import {Link,Redirect} from 'react-router-dom'
import './../../support/css/header.css'
import {connect} from 'react-redux'
import {resetUser} from './../../1.actions/index'
import Cookies from 'universal-cookie';
import {checkPermission} from './../global/globalFunction'

const kukie =new Cookies()


class Example extends React.Component {
  state={
    isLogin:false
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: true
    };
  }

  componentDidMount() {
    console.log(kukie.get('profileUser'))
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
    kukie.remove('profileUser')
    this.setState({isLogin:true})
  }
  
  render() {
    if(this.state.isLogin){
      return(
        <Redirect to='/' />
      )
    }
    console.log(checkPermission('Bank_Add','Bank_List'))
    return (
      <div className="sideBar">
        <Navbar>
          
          <img src={Logo} alt="Logo" width="100%" className="mb-4" />
         
          <NavbarToggler onClick={this.toggle} style={{display:"none"}}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              
            { checkPermission('Bank_Add','Bank_List') && 
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-university"></i> Bank</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('Bank_Add') && <Link to="/tambahbank" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('Bank_List') && <Link to="/listbank" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem>   </Link>}             
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            { checkPermission('Borrower_List') && <Link to="/profileNasabah" style={{marginBottom:"10px"}} ><label><i className="fas fa-user-friends"></i> Nasabah</label></Link>}
            { checkPermission('Loan_List') && <Link to="/permintaanpinjaman"><label><i className="fas fa-hand-holding-usd"></i> Pinjaman</label></Link>}
            
            { checkPermission('BankService_Add','BankService_List') && 
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-concierge-bell"></i> Layanan</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('BankService_Add') && <Link to="/tambahlayanan" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('BankService_List') && <Link to="/listlayanan" style={{color:"inherit",textDecoration:"none"}}> <DropdownItem>List</DropdownItem></Link> }               
                </DropdownMenu>
              </UncontrolledDropdown>
            }
            
            { checkPermission('ServiceProduct_Add','ServiceProduct_List') &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-money-check-alt"></i> Product</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('ServiceProduct_Add') && <Link to="/tambahproduct" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah </DropdownItem></Link>}                 
                  { checkPermission('ServiceProduct_List') && <Link to="/listproduct" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem>  </Link>}                                 
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            { checkPermission('BankType_Add','BankType_List') &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-sliders-h"></i> Tipe Bank</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('BankType_Add') && <Link to="/tambahtipe" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                  
                  { checkPermission('BankType_List') && <Link to="/listtipe" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem></Link>}                
                </DropdownMenu>
              </UncontrolledDropdown>
            }
              
            { checkPermission('LoanPurposes_Add','LoanPurposes_List') &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-bullseye"></i> Tujuan</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('LoanPurposes_Add') && <Link to="/tambahtujuan" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link> }                  
                  { checkPermission('LoanPurposes_List') && <Link to="/listtujuan" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem></Link> }              
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            { checkPermission('Role_Add','Role_List') &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-handshake"></i> Role</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('Role_Add') && <Link to="/tambahrole" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>     }              
                  { checkPermission('Role_List') && <Link to="/listrole" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link>   }             
                </DropdownMenu>
              </UncontrolledDropdown> 
            }        

            { checkPermission('Permission_Add','Permission_List') &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-user-tag"></i> Role Permission </label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('Permission_Add') && <Link to="/tambahRolePermission" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('Permission_List') && <Link to="/listRolePermission" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link> }               
                </DropdownMenu>
              </UncontrolledDropdown>    
            }

            { checkPermission('User_Add','User_List') &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-user"></i> User </label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('User_Add') && <Link to="/tambahUser" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('User_List') && <Link to="/listUser" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem></Link> }               
                </DropdownMenu>
              </UncontrolledDropdown>
            }
            
            { checkPermission('Report_List') && <Link to="/report" style={{marginBottom:"10px"}}><label><i className="far fa-newspaper"></i> Report</label></Link>}
           
        
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