import React from 'react'
import { Redirect } from 'react-router-dom'
import CheckBoxClass from '../subComponent/CheckBox';
import Loader from 'react-loader-spinner'
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getRoleFunction, patchRolePermissionFunction } from './saga'
import { constructRolePermission, checkingRole, checkingSystem } from './function'
import { getToken } from '../index/token';
import { destructRolePermission } from './function';
import {  Grid  } from '@material-ui/core';

import DialogComponent from '../subComponent/DialogComponent';
import { checkPermission } from '../global/globalFunction';
import TitleBar from '../subComponent/TitleBar';
import ActionComponent from '../subComponent/ActionComponent';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });


class RolePermissionDetail extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission: [],
      listRolePermission: [],
      listRole : {},
      roleId: 0,
      nameRole: '',
      dialog: false,
      modifyType:false,
      system: '',
      loading: true,
      disabled:true,
    };

    componentDidMount(){
      this._isMounted = true;
      this.setState({
        roleId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
    }
    
    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {};
      param.roleId = this.state.roleId;

      const data = await getRoleFunction(param);

      if(data) {
          const newListAllRolePermission = checkingSystem(this.state.roleId, [data.dataRole]);
          const listRolePermission = destructRolePermission((data.dataRole && data.dataRole.permissions) || [], newListAllRolePermission)

          if(!data.error) {
            this.setState({
              listRole: data.dataRole,
              nameRole: data.dataRole.name,
              system: data.dataRole.system,
              listRolePermission,
              listAllRolePermission: newListAllRolePermission,
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: data.error,
              disabled: true,
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

    btnSave = () =>{ 
      this.setState({loading: true})

      const listRolePermission = this.state.listRolePermission;
      const dataRolePermission = {};
      
      dataRolePermission.id = parseInt(this.state.listRole.id);
      dataRolePermission.name = this.state.nameRole;
      dataRolePermission.system = this.state.system
      dataRolePermission.permissions = constructRolePermission(listRolePermission);

      const param = {
        roleId: parseInt(this.state.listRole.id),
        dataRolePermission,
      };
      
      this.patchRolePermission(param)
        
    }

    patchRolePermission = async function(param) {
      const data = await patchRolePermissionFunction(param)

      if(data) {
        if(!data.error) {
          swal("Success","Role Permission berhasil di ubah","success")
          this.setState({
            diKlik: true,
            loading: false,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            disabled: true,
            loading: false,
          })
        }      
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

    btnConfirmationDialog = (e, nextStep) => {
      this.setState({dialog: !this.state.dialog})

      if(nextStep) {
          this.btnSave()
      }
    }

    btnEditPermission = () => {
      this.setState({modifyType: true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/permissionList'/>            
        } else if (this.state.loading){
          return  (
            <div  key="zz">
              <div align="center" colSpan={6}>
                <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
              </div>
            </div>
          )
        } else if(getToken()){
          return (
            <Grid container>

              <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                  
                <TitleBar
                  title={this.state.modifyType ? 'Permission - Ubah':'Permission - Detail'}
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
                        <ActionComponent
                            modifyType={this.state.modifyType}
                            permissionEdit={ checkPermission('core_permission_patch') ? (this.state.modifyType ? this.btnConfirmationDialog: this.btnEditPermission) : null}
                            onCancel={this.btnCancel}
                        />
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

                      <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                        Role Name
                      </Grid>

                      <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                          {this.state.listRole && this.state.listRole.name}
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
  // menu: getMenu(),
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
  )(RolePermissionDetail);