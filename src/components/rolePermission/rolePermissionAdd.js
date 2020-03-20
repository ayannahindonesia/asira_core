import React from 'react'
import { Redirect } from 'react-router-dom'
import Loading from '../subComponent/Loading'
import CheckBoxClass from '../subComponent/CheckBox';
import DropDown from '../subComponent/DropDown';
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getAllRoleFunction, patchRolePermissionFunction } from './saga'
import { constructRolePermission, checkingSystem, checkingRole, findRoleName, findSystem } from './function'
import { getToken } from '../index/token';
import DialogComponent from '../subComponent/DialogComponent';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { IconButton, Tooltip, Grid } from '@material-ui/core';
import TitleBar from '../subComponent/TitleBar';

const styles = (theme) => ({
  container: {
    flexGrow: 1,
  },
});



class rolePermissionAdd extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission: [],
      listRolePermission: [],
      disabled: false,
      role : 0,
      nameRole: '',
      system: '',
      listRole: [],
      loading: true,
    };

    componentDidMount(){
      this._isMounted = true;
      this.refresh()
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {};

      const data = await getAllRoleFunction(param);

      if(data) {
        if(!data.error) {
          const listRole = [];
          const dataRole = data.dataRole;
          let role = 0;

          for(const key in dataRole) {
            if(!dataRole[key].permissions || (dataRole[key].permissions && dataRole[key].permissions.length === 0)) {
              listRole.push(dataRole[key]);
              role = dataRole[key].id;
            }
          }

          if(listRole.length !== 0) {
            this.setState({
              listRole,
              role,
              system: findSystem(role, listRole),
              nameRole: findRoleName(role, listRole),
              listAllRolePermission:checkingSystem(role,listRole),
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: 'Data Role yang belum di setup tidak ditemukan',
              disabled: true,
              loading: false,
            })
          }
          
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    UNSAFE_componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave = () => {
      if(this.state.listRolePermission.length === 0) {
        this.setState({errorMessage:"ERROR : Data Role Permission Tidak Boleh Kosong"})
      } else if(this.state.listRole.length === 0 || this.state.role === 0) {
        this.setState({errorMessage:"ERROR : Data Role Tidak Boleh Kosong"})
      } else{
        
        this.setState({loading: true})

        const listRolePermission = this.state.listRolePermission;
        const dataRolePermission = {};
        dataRolePermission.id = parseInt(this.state.role);
        dataRolePermission.name = this.state.nameRole;
        dataRolePermission.system = this.state.system;
        dataRolePermission.permissions = constructRolePermission(listRolePermission) || [];

        const param = {
          roleId: parseInt(this.state.role),
          dataRolePermission,
        };
  
        this.postRolePermission(param);
        
      }
    }

    isRoleBank = (role) => {
      let flag = false;
      const dataRole = this.state.listRole;

      if(role && role !== 0) {
        for(const key in dataRole) {
          if(dataRole[key].id.toString() === role.toString() && dataRole[key].system.toString().toLowerCase().includes('dashboard')) {
            flag = true;
            break;
          }
        }
        
      } 

      return flag;
    }

    postRolePermission = async function (param) {
      const data = await patchRolePermissionFunction(param)

      if(data) {
        if(!data.error) {
          swal("Success","Role Permission berhasil di tambah","success")
          this.setState({
            diKlik: true,
            loading: false,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }

    onChangeCheck = (e) => {
      const profileUser = Object.assign({}, this.state.listRolePermission);
      let profileUserNew = [];

      let modules = e.target.value;
      let flag = true;
      
      if(modules) {
        for(const key in profileUser) {
          if(
            e.target.value.toString() !== profileUser[key].id.toString()
          ) {
            profileUserNew.push(profileUser[key])
          } else {
            flag = false;
          }
        }
      }

      if(flag && modules) {
        let newModules = modules.split('-')[1];
        newModules = newModules.split(' ');

        for(const key in newModules) {
          profileUserNew.push({
            id: e.target.value,
            modules: newModules[key],
          });
        }
      }
      
      this.setState({
        listRolePermission: profileUserNew,
      });
    };

    onChangeDropDown = (e) => {
      this.setState({
        role: e.target.value,
        system: findSystem(e.target.value, this.state.listRole),
        nameRole: findRoleName(e.target.value, this.state.listRole),
        listAllRolePermission: checkingSystem(e.target.value,this.state.listRole)
      })
    }

    btnConfirmationDialog = (e, nextStep) => {
      this.setState({dialog: !this.state.dialog})

      if(nextStep) {
          this.btnSave()
      }
    }

    render(){
        if(this.state.diKlik){
          return <Redirect to='/permissionList'/>            
        } else if (this.state.loading){
          return  (
            <Loading title={'Permission - Tambah'}/>
          )
        } else if(getToken()){
          return (
            <Grid container>

              <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                  
                <TitleBar
                  title={'Permission - Tambah'}
                />

              </Grid>
              
              <Grid
                item
                sm={12} xs={12}
                style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
              >
                <Grid container>
                  {/* Action Button */}
                  <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                    <Grid container style={{display:'flex', justifyContent:'flex-end', padding:'0'}}>
                      <Grid item xs={2} sm={2} style={{display:'flex', justifyContent:'flex-end'}}>

                        <Tooltip title="Save" style={{outline:'none'}}>
                          <IconButton aria-label="save" onClick={this.btnConfirmationDialog} >
                            <SaveIcon style={{width:'35px',height:'35px'}}/>
                          </IconButton>
                        </Tooltip>
                        

                        <Tooltip title="Back" style={{outline:'none'}}>
                          <IconButton aria-label="cancel" onClick={this.btnCancel}>
                            <CancelIcon style={{width:'35px',height:'35px'}}/>
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Dialog */}
                  <DialogComponent 
                    title={'Confirmation'}
                    message={'Are you sure want to save this data ?'}
                    type={'textfield'}
                    openDialog={this.state.dialog}
                    onClose={this.btnConfirmationDialog}
                  />

                  {/* Error */}
                  <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                      {this.state.errorMessage}
                  </Grid>

                  <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'10px'}}>
                    <Grid container>

                      <Grid item sm={4} xs={4} style={{padding:'25px 0px 0px 10px'}}>
                        Role
                      </Grid>

                      <Grid item sm={4} xs={4}>
                        <DropDown
                          value={this.state.role}
                          label="Role"
                          data={this.state.listRole}
                          id="id"
                          labelName="name-system"
                          onChange={this.onChangeDropDown}
                          fullWidth
                          error={this.state.roleHelper}
                          disabled={this.state.disabled}
                        />
                      </Grid>

                    </Grid>

                  </Grid>

                  <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'10px'}}>
                    
                    <CheckBoxClass
                      label={`${this.state.system} - Permission Setup`}
                      modulesName="Menu"
                      data={this.state.listAllRolePermission}
                      id="id"
                      labelName="label"
                      modules="menu"      
                      labelPlacement= "top"                       
                      onChange={this.onChangeCheck}
                      onChecked={(id) => checkingRole(this.state.listRolePermission, id)}
                      style={{ width: '97%'}}
                      disabled={!this.state.modifyType}
                    />
                  </Grid>



                </Grid>
              </Grid>
            </Grid>
          )
        } else if(!getToken()){
          return (
              <Redirect to='/login' />
          )    
        }
       
    }
}

export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(rolePermissionAdd);