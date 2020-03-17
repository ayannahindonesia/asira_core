import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getUserFunction,patchUserAddFunction } from './saga'
import { getAllRoleFunction } from '../rolePermission/saga';
import { getToken } from '../index/token';
import { validateEmail, validatePhone ,checkPermission} from '../global/globalFunction';

import { Grid, TextField,FormControlLabel,Checkbox } from '@material-ui/core';
import ActionComponent from '../subComponent/ActionComponent';


import DialogComponent from '../subComponent/DialogComponent';
import TitleBar from '../subComponent/TitleBar';
import DropDown from '../subComponent/DropDown';

import swal from 'sweetalert'

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

class UserDetail extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      listRole : {},
      username: '',
      password: '',
      email:'',
      phone:'',
      role: 0,
      bank: 0,
      userId: 0,
      loading: true,
      disabled:true,
      status:false,
    };

    componentDidMount(){
      this._isMounted = true;

      this.setState({
        userId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
      
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {
        status: 'active',
      };
      
      const paramUser = {
        userId: this.state.userId,
      };

      const data = await getAllRoleFunction(param);
      const dataUser = await getUserFunction(paramUser);

      if(data && dataUser) {
          if(!data.error && !dataUser.error) {
            const roleUser = (dataUser.dataUser && dataUser.dataUser && dataUser.dataUser.roles && dataUser.dataUser.roles[0]) || 0;
            
            let dataListRole = data.dataRole;
            const listRoleNew = []

            let flagBank = this.isRoleBank(roleUser ,dataListRole);

            for(const key in dataListRole) {
              if(flagBank === this.isRoleBank(dataListRole[key].id, dataListRole)) {
                listRoleNew.push(dataListRole[key])
              }
            }
            
            this.setState({
              listRole: listRoleNew,
              bank: dataUser.dataUser.bank_id || 0,
              bank_name: dataUser.dataUser.bank_name,
              role: roleUser,
              id: dataUser.dataUser.id,
              username: dataUser.dataUser.username,
              password: dataUser.dataUser.password,
              email: dataUser.dataUser.email,
              phone: dataUser.dataUser.phone && dataUser.dataUser.phone.substring(2,dataUser.dataUser.phone.length),
              status: dataUser.dataUser.status==="active" ?true:false,
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: data.error || dataUser.error,
              disabled: true,
              loading: false,
            })
          }      
      }
    }

    findRole = (roleUser, dataRole) => {
      let role = '';
      for(const keyRole in roleUser) {
          for(const key in dataRole) {
              if(dataRole[key].id === roleUser[keyRole]) {
                  if(role.trim().length !== 0) {
                      role += ', ';
                  }
                  role += `${dataRole[key].name} (${dataRole[key].system})`;
              }
          }
      }
      
      return role;
    }
    handleChecked = (e, labelData)=>{
      this.setState({[labelData]:!this.state[labelData]})
    }
    onChangeTextField = (e, labelData,number) => {
      let dataText = e.target.value;

      if(number && isNaN(dataText)) {           
          dataText = this.state[labelData];          
      }
      this.setState({[labelData]:dataText})
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    UNSAFE_componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    onChangeDropDown = (e) => {
      const labelName = e.target.name.toString().toLowerCase();

      this.setState({
        [labelName]: e.target.value,
      })
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

    validate = () => {
      let flag = true;
      let errorMessage = '';
      if (!this.state.username || this.state.username.length === 0) {
        flag = false;
        errorMessage = 'Mohon input username dengan benar'
      } else if (!this.state.role || this.state.role === 0) {
        flag = false;
        errorMessage = 'Mohon input role dengan benar'
      } else if (
          !this.state.email || this.state.email.length === 0 || !validateEmail(this.state.email)
        ) {
        flag = false;
        errorMessage = 'Mohon input email dengan benar'
      } else if (!this.state.phone || this.state.phone.length === 0 || !validatePhone(`62${this.state.phone}`)) {
        flag = false;
        errorMessage = 'Mohon input kontak pic dengan benar'
      } else if ( this.isRoleBank(this.state.role, this.state.listRole) && (!this.state.bank || this.state.bank === 0)) {
        flag = false;
        errorMessage = 'Mohon input Mitra dengan benar'
      } else {
        errorMessage = ''
      }
         
      this.setState({
        errorMessage,
      })

      return flag;
    }

    btnSave=()=>{
      if (this.validate()) {
        const dataUser = {
          roles : [parseInt(this.state.role)],
          bank: this.isRoleBank(this.state.role, this.state.listRole) ? parseInt(this.state.bank) : 0,
          phone : `62${this.state.phone}`,
          email : this.state.email,
          status : this.state.status ? "active":"inactive",
        }

        const param = {
          id: this.state.userId,
          dataUser,
        }

        this.setState({loading: true});
        
        this.patchUser(param)
      }
    }


    patchUser = async function(param) {
      const data = await patchUserAddFunction(param);

      if(data) {
        if(!data.error) {
          swal("Success","User berhasil di ubah","success")
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
    
    btnConfirmationDialog = (e, nextStep, pesan) => {
      this.setState({dialog: !this.state.dialog,messageDialog:pesan})

      if(nextStep && this.state.messageDialog.includes('save')) {
          this.btnSave() 
      }else if(nextStep && this.state.messageDialog.includes('delete')){
          this.btnDelete()
      }
    }
    btnEditPermission=()=>{
      this.setState({modifyType:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/akunList'/>            
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
            return(
                <Grid container>

                       <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                             title={this.state.modifyType ? 'Akun - Ubah':'Akun - Detail'}
                            />
                        </Grid>

                        <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                        >
                          <Grid container>

                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                                <ActionComponent
                                    modifyType={this.state.modifyType}
                                    permissionEdit={ checkPermission('core_user_patch') ? (this.state.modifyType ? ()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?') : this.btnEditPermission) : null}
                                    onCancel={this.btnCancel}
                                />
                          </Grid>

                          </Grid>
                          
                            {/* Error */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                        {this.state.errorMessage}
                                    </Grid>

                          <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   ID Akun
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="userId"
                                                        value={this.state.userId}
                                                        onChange={(e) => this.onChangeTextField(e,'userId')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={true}
                                                    />
                                                </Grid>
                                        </Grid>
                            </Grid>

                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Username
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="username"
                                                        value={this.state.username}
                                                        onChange={(e) => this.onChangeTextField(e,'username')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={true}
                                                    />
                                                </Grid>
                                        </Grid>
                            </Grid>

                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Password
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="password"
                                                        value={"****************************"}
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={true}
                                                    />
                                                </Grid>
                                        </Grid>
                            </Grid>

                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                  Role
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                <DropDown
                                                    value={this.state.role}
                                                    label="Role"
                                                    data={this.state.listRole}
                                                    id="id"
                                                    labelName="name-system"
                                                    onChange={this.onChangeDropDown}
                                                    fullWidth
                                                    disabled={this.state.modifyType ? false : true}
                                                  />
                            
                                                </Grid>
                                        </Grid>
                            </Grid>
                            { this.isRoleBank(this.state.role, this.state.listRole) && 
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                  Mitra
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                <TextField
                                                        id="bank_name"
                                                        value={this.state.bank_name}
                                                        onChange={(e) => this.onChangeTextField(e,'bank_name')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={true}
                                                  />
                                                </Grid>
                                        </Grid>
                            </Grid>}

                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                  Email
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                <TextField
                                                        id="email"
                                                        value={this.state.email}
                                                        onChange={(e) => this.onChangeTextField(e,'email')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={this.state.modifyType ? false : true}

                                                  />
                                                </Grid>
                                        </Grid>
                            </Grid>


                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                  Kontak PIC
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                <TextField
                                                        id="phone"
                                                        value={this.state.phone}
                                                        onChange={(e) => this.onChangeTextField(e,'phone',true)} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={this.state.modifyType ? false : true}
                                                  />
                                                </Grid>
                                        </Grid>
                            </Grid>

                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Status
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.status}
                                                    onChange={(e) => this.handleChecked(e, 'status')}
                                                    color={this.state.status ? "primary":"default"}
                                                    value="default"
                                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                                    
                                                />
                                            }
                                            label={'Aktif'}
                                            disabled={this.state.modifyType ? false : true}
                                        />
                                                </Grid>
                                        </Grid>
                      </Grid>
                        </Grid>
                        <DialogComponent 
                    title={'Confirmation'}
                    message={this.state.messageDialog}
                    type={'textfield'}
                    openDialog={this.state.dialog}
                    onClose={this.btnConfirmationDialog}
                  />
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
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
  // menu: getMenu(),
  // fetching: getFetchStatus(),
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
  )(UserDetail);