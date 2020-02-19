import React from 'react';
import {Route,Switch,Link} from 'react-router-dom'
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { checkPermission } from './../global/globalFunction';
import  globalConstant  from './../global/globalConstant';

import { getToken, getProfileUser } from './../index/token';
import PageNotFound from './../404'
import TambahBank from '../mitra/mitraAdd'
import ListBank from '../mitra/mitraList'
import EditBank from '../mitra/mitraEdit'
import DetailBank from '../mitra/mitraDetail'
import LayananEdit from './../layanan/layananEdit'
import LayananAdd from './../layanan/layananAdd'
import LayananList from './../layanan/layananList'
import LayananDetail from './../layanan/layananDetail'
import Login from './../index/login'
import Home from './../index/main'
import Nasabah from './../nasabah/nasabahList'
import profileNasabahDetail from './../nasabah/nasabahDetail'
import PermintaanPinjaman from '../pinjaman/pinjamanList'
import PermintaanPinjamanDetail from '../pinjaman/pinjamanDetail'
import ProductAdd from './../product/productAdd'
import ProductList from './../product/productList'
import ProductDetail from './../product/productDetail'
import ProductEdit from './../product/productEdit'
import TujuanAdd from './../tujuan/tujuanAdd'
import TujuanList from './../tujuan/tujuanList'
import TujuanEdit from './../tujuan/tujuanEdit'
import TujuanDetail from './../tujuan/tujuanDetail'
import TypeBankAdd from '../tipeMitra/typeAdd'
import TypeBankList from '../tipeMitra/typeList'
import TypeBankEdit from '../tipeMitra/typeEdit'
import TypeBankDetail from '../tipeMitra/typeDetail'
import RoleAdd from './../role/roleAdd'
import RoleList from './../role/roleList'
import RoleDetail from './../role/roleDetail'
import RoleEdit from './../role/roleEdit'
import RoleAddPermission from './../rolePermission/rolePermissionAdd'
import RoleListPermission from './../rolePermission/rolePermissionList'
import RoleDetailPermission from './../rolePermission/rolePermissionDetail'
import RoleEditPermission from './../rolePermission/rolePermissionEdit'
import Report from './../report/report'
import UserAdd from './../user/userAdd'
import UserList from './../user/userList'
import UserDetail from './../user/userDetail'
import UserEdit from './../user/userEdit'
import penyediaAgentAdd from './../penyediaAgent/penyediaAdd'
import penyediaAgentEdit from './../penyediaAgent/penyediaEdit'
import penyediaAgentDetail from './../penyediaAgent/penyediaDetail'
import penyediaAgentList from './../penyediaAgent/penyediaList'
import AgentAdd from './../agent/agentAdd'
import AgentList from './../agent/agentList'
import AgentDetail from './../agent/agentDetail'
import AgentEdit from './../agent/agentEdit'
import CalonNasabahList from './../calonNasabah/calonNasabahList';
import calonNasabahDetail from './../calonNasabah/calonNasabahDetail';
import CalonNasabahArsipList from './../calonNasabah/calonNasabahArsipList';
import CalonNasabahArsipDetail from './../calonNasabah/calonNasabahArsipDetail';
import ChangePassword from './../index/changePassword'
import ActivityLog from './../logs/activitylog'
import ActivityLogDetail from './../logs/activitylogDetail'



const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    backgroundColor: '#2D85E9',
    fontSize:'12px',
    color: 'white',
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    backgroundColor: 'transparent',
    color: 'white',
    shadow: 'rgba(0,0,0,0)',
    [theme.breakpoints.up('sm')]: {
      width: `0px`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    backgroundColor: '#2D85E9',
    fontSize:'12px',
    color: 'white',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.up('xs')]: {
      minWidth:`calc(100vw - ${drawerWidth}px)`,
    },
  },
  textColorHeader: {
    '&:hover': {
      opacity: "100%",
    },
    fontSize:'14px',
    opacity: "100%",
    color:'white',
  },

  textColorChild: {
    paddingLeft: theme.spacing(4),
    '&:hover': {
      opacity: "100%",
    },
    fontSize:'12px',
    opacity: "100%",
    color:'white',
  },
}));

function ResponsiveDrawer(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  
  const menu = globalConstant.dataMenu;

  const handleOpenMenu = (menu) => {
    const arrayMenu = [];
    for(const key in menu) {
      if(!arrayMenu[menu[key].label]) {
        arrayMenu[menu[key].label] = false;
      }
    }
    
    return arrayMenu
  }

  const [open, setOpen] = React.useState(handleOpenMenu(globalConstant.dataMenu));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const checkOpen = (label) => {
    return open[label];
  }

  const handleClick = (label) => {
    open[label] = !open[label];
    setOpen(open);
    forceUpdate()
  };

  const logOutBtn = () =>{ 
    localStorage.clear();
  }

  const drawer = (
    <div>
      <List style={{padding:0}}>
        <Link to={'/'}  style={{textDecoration:'none', color:'white'}}>
          <ListItem style={{padding:'0px'}}>
            <img src={require(`./../../support/icons/LogoAsira.png`)} alt='' style={{textAlign:'center', backgroundColor:'white', width:'100%'}} />
          </ListItem>
        </Link>
        {
          
          menu.map((menuParent, index) => {
            
            if (menuParent.system && menuParent.system === 'Core') {
              
              if(!menuParent.child && (checkPermission(menuParent.action && menuParent.action.list) || menuParent.label === 'Keluar')) {

                return (
                  <div key={`${menuParent.label}-${index}`} className={classes.textColorHeader} >
                    <Link to={menuParent.link || '/'}  style={{textDecoration:'none', color:'white'}}>
                      <ListItem button onClick={menuParent.label === 'Keluar' ? logOutBtn : null}>
                        <ListItemIcon style={{minWidth:30}}>{<img src={require(`./../../support/icons/${menuParent.logo && menuParent.logo.trim().length !== 0 ? menuParent.logo : 'pinjaman.svg'}`)} alt='' style={{maxWidth:20, height: 'auto'}} />}</ListItemIcon>
                        <ListItemText primary={<Typography style={{fontSize:'14px'}}> {menuParent.label} </Typography>} />
                      </ListItem>
                    </Link>
                  </div>
                  
                )
              } else {
                const childMenu = menuParent.child;
                const newPermission = []

                for(const key in childMenu) {
                  if(childMenu[key] && childMenu[key].action && childMenu[key].action.list && childMenu[key].action.list.split(' ')[0]) {
                    newPermission.push(childMenu[key].action.list.split(' ')[0])
                  }
                }
                
                if(checkPermission(newPermission)) {
                  return(
                    <div key={menuParent.label}>
                      <ListItem button onClick={() => handleClick(menuParent.label)} className={classes.textColorHeader}>
                        <ListItemIcon style={{minWidth:30}}>{<img src={require(`./../../support/icons/${menuParent.logo && menuParent.logo.trim().length !== 0 ? menuParent.logo : 'pinjaman.svg'}`)} alt='' style={{maxWidth:20, height: 'auto'}} />}</ListItemIcon>
                        <ListItemText primary={<Typography style={{fontSize:'14px'}}> {menuParent.label} </Typography>} />
                        {checkOpen(menuParent.label) ? <ExpandLess /> : <ExpandMore />}
                      
                      </ListItem>
                      <Collapse in={checkOpen(menuParent.label)} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          {
                            menuParent.child.map((menuChild) => {
                              if(checkPermission(menuChild.action && menuChild.action.list)) {
                                return(
                                  <div key={`${menuChild.label}-${index}`} className={classes.textColorChild} >
                                    <Link to={menuChild.link || '/'}  style={{textDecoration:'none', color:'white'}}>
                                      <ListItem button >
                                        <ListItemIcon style={{minWidth:30}}>{<img src={require(`./../../support/icons/${menuChild.logo && menuChild.logo.trim().length !== 0 ? menuChild.logo : 'pinjaman.svg'}`)} alt='' style={{maxWidth:20, height: 'auto'}} />}</ListItemIcon>
                                        <ListItemText primary={<Typography style={{fontSize:'12px'}}> {menuChild.label} </Typography> } />
                                      </ListItem>
                                    </Link>
                                  </div>
                                );
                              }
  
                              return null;
  
                            }, this)
                          }
                          
                        </List>
                      </Collapse>
                    </div>                 
                  );
                } else {
                  return null;
                }
                
              }
            }

            return null;

          }, this)
        }
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon style={{backgroundColor:'#2D85E9', borderRadius:'3px'}} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
            
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            
            {drawer}

          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        {/* <div className={classes.toolbar} /> */}
        <Grid item xs={12} sm={12} style={{padding:'25px 25px 10px'}}>
          <Switch> 
            <Route path='/' component={Home} exact></Route>


            { checkPermission('core_borrower_get_all') && <Route path='/nasabahList' component={Nasabah}></Route>}
            { checkPermission('core_borrower_get_details') && <Route path="/nasabahDetail/:id" component={profileNasabahDetail}></Route>}

            { checkPermission('core_loan_get_all') && <Route path="/pinjamanList" component={PermintaanPinjaman}></Route>}
            { checkPermission('core_loan_get_details') && <Route path="/pinjamanDetail/:idLoan" component={PermintaanPinjamanDetail}></Route>}

            { checkPermission('core_bank_new') && <Route path='/mitraAdd' component={TambahBank}></Route>}
            { checkPermission('core_bank_list') && <Route path='/mitraList' component={ListBank}></Route>}
            { checkPermission('core_bank_patch') && <Route path='/mitraEdit/:id' component={EditBank}></Route>}
            { checkPermission('core_bank_detail') && <Route path='/mitraDetail/:id' component={DetailBank}></Route>}

            { checkPermission('core_product_new') && <Route path='/produkAdd' component={ProductAdd}></Route>}
            { checkPermission('core_product_list') && <Route path='/produkList' component={ProductList}></Route>}
            { checkPermission('core_product_patch') && <Route path='/produkEdit/:id' component={ProductEdit}></Route>}
            { checkPermission('core_product_detail') && <Route path='/produkDetail/:id' component={ProductDetail}></Route>}
          
                              
            { checkPermission('core_service_new') && <Route path='/layananAdd' component={LayananAdd}></Route>}
            { checkPermission('core_service_list') && <Route path='/layananList' component={LayananList}></Route>}
            { checkPermission('core_service_patch') && <Route path='/layananEdit/:id' component={LayananEdit}></Route>}
            { checkPermission('core_service_detail') && <Route path='/layananDetail/:id' component={LayananDetail}></Route>}


            { checkPermission('core_bank_type_new') && <Route path='/tipeAdd' component={TypeBankAdd}></Route>}
            { checkPermission('core_bank_type_list') && <Route path='/tipeList' component={TypeBankList}></Route>}
            { checkPermission('core_bank_type_patch') && <Route path='/tipeEdit/:id' component={TypeBankEdit}></Route>}
            { checkPermission('core_bank_type_detail') && <Route path='/tipeDetail/:id' component={TypeBankDetail}></Route>}
            
            { checkPermission('core_loan_purpose_new') && <Route path='/tujuanAdd' component={TujuanAdd}></Route>}
            { checkPermission('core_loan_purpose_list') && <Route path='/tujuanList' component={TujuanList}></Route>}
            { checkPermission('core_loan_purpose_patch') && <Route path='/tujuanEdit/:id' component={TujuanEdit}></Route>}
            { checkPermission('core_loan_purpose_detail') && <Route path='/tujuanDetail/:id' component={TujuanDetail}></Route>}
            
            { checkPermission('core_role_new') && <Route path='/roleAdd' component={RoleAdd}></Route>}
            { checkPermission('core_role_list') && <Route path='/roleList' component={RoleList}></Route>}
            { checkPermission('core_role_patch') && <Route path='/roleEdit/:id' component={RoleEdit}></Route>}
            { checkPermission('core_role_details') && <Route path='/roleDetail/:id' component={RoleDetail}></Route>}

            { checkPermission('core_permission_new') && <Route path='/permissionAdd' component={RoleAddPermission}></Route>}
            { checkPermission('core_permission_list') && <Route path='/permissionList' component={RoleListPermission}></Route>}
            { checkPermission('core_permission_patch') && <Route path='/permissionEdit/:id' component={RoleEditPermission}></Route>}
            { checkPermission('core_permission_detail') && <Route path='/permissionDetail/:id' component={RoleDetailPermission}></Route>}

            { checkPermission('core_user_new') && <Route path='/akunAdd' component={UserAdd}></Route>}
            { checkPermission('core_user_list') && <Route path='/akunList' component={UserList}></Route>}
            { checkPermission('core_user_patch') && <Route path='/akunEdit/:id' component={UserEdit}></Route>}
            { checkPermission('core_user_details') && <Route path='/akunDetail/:id' component={UserDetail}></Route>}

            { checkPermission('convenience_fee_report') && <Route path='/report' component={Report}></Route>}

            { checkPermission('core_agent_provider_new') && <Route path='/penyediaAdd' component={penyediaAgentAdd}></Route>}
            { checkPermission('core_agent_provider_list') && <Route path='/penyediaList' component={penyediaAgentList}></Route>}
            { checkPermission('core_agent_provider_patch') && <Route path='/penyediaEdit/:id' component={penyediaAgentEdit}></Route>}
            { checkPermission('core_agent_provider_details') && <Route path='/penyediaDetail/:id' component={penyediaAgentDetail}></Route>}

            { checkPermission('core_agent_new') && <Route path='/agenAdd' component={AgentAdd}></Route>}
            { checkPermission('core_agent_list') && <Route path='/agenList' component={AgentList}></Route>}
            { checkPermission('core_agent_patch') && <Route path='/agenEdit/:id' component={AgentEdit}></Route>}
            { checkPermission('core_agent_details') && <Route path='/agenDetail/:id' component={AgentDetail}></Route>}

            { checkPermission('core_borrower_get_all') && <Route path='/calonNasabahList' component={CalonNasabahList}></Route>}
            { checkPermission('core_borrower_get_details') && <Route path='/calonNasabahDetail/:id' component={calonNasabahDetail}></Route>}

            { checkPermission('core_borrower_get_all') && <Route path='/calonNasabahArsipList' component={CalonNasabahArsipList}></Route>}
            { checkPermission('core_borrower_get_details') && <Route path='/calonNasabahArsipDetail/:id' component={CalonNasabahArsipDetail}></Route>}

            <Route path='/activityLog' component={ActivityLog}></Route>
            <Route path="/activityLogDetail/:id" component={ActivityLogDetail}></Route>
            {getToken() && getProfileUser() ?  <Route path="/login" component={Home}></Route>:  <Route path="/login" component={Login}></Route>} 
            <Route path='/ubahpassword' component={ChangePassword} />
            <Route path='*' component={PageNotFound} />
          </Switch>
        
        </Grid>

        <Grid item xs={12} sm={12} style={{textAlign:'right', paddingRight:'30px'}}>
          <img src={require('./../../support/icons/powered.svg')} alt='Ayannah' style={{width:'auto',maxHeight:50}}/>
        </Grid>

      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
};


export default ResponsiveDrawer;