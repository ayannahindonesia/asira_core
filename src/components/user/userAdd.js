import React from 'react'
import { Redirect } from 'react-router-dom'
import Loading from '../subComponent/Loading'
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getAllRoleFunction } from './../rolePermission/saga'
import { postUserAddFunction } from './saga';
import { getToken } from '../index/token';
import { getAllMitraList } from '../mitra/saga';
import ActionComponent from '../subComponent/ActionComponent';
import { validateEmail, validatePhone ,checkPermission} from '../global/globalFunction';


import DialogComponent from '../subComponent/DialogComponent';
import TitleBar from '../subComponent/TitleBar';
import DropDown from '../subComponent/DropDown';
import { Grid, TextField,FormControlLabel,Checkbox,InputAdornment } from '@material-ui/core';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
    textField: {
      border: '1px solid',
    },
  });


class userAdd extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      role : 0,
      bank: 0,
      listRole: [],
      listBank: [],
      loading: true,
      status: true,
      username: '',
      phone:'',
      email:'',
    };

    componentDidMount(){
      this._isMounted = true;
      this.refresh()
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = { 
        status: 'active',
      };
      
      const data = await getAllRoleFunction(param);
      
      if(data) {
        if(!data.error) {
          this.setState({
            listRole: data.dataRole,
            role: (data.dataRole && data.dataRole[0] && data.dataRole[0].id) || 0,
          }, () => { this.getMitraList() })
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }

    getMitraList = async function() {
      const roleBank = this.isRoleBank(this.state.role); 
      const data = await getAllMitraList({}) ;

      if(data) {
        if(!data.error) {
          this.setState({
            listBank: data.mitraList.data,
            bank: (roleBank && data.mitraList && data.mitraList.data && data.mitraList.data[0] && data.mitraList.data[0].id) || 0,
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
 
    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    UNSAFE_componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave=()=>{
      if (this.validate()) {
        const dataUser = {
          username : this.state.username,
          roles : [parseInt(this.state.role)],
          bank: this.isRoleBank(this.state.role) ? parseInt(this.state.bank) : 0,
          phone : `62${this.state.phone}`,
          email : this.state.email,
          status : this.state.status ? 'active' : 'inactive',
        }
        
        const param = {
          dataUser,
        }

        this.setState({loading: true});
        
        this.postUser(param)
      }
    }

    postUser = async function(param) {
      const data = await postUserAddFunction(param);

      if(data) {
        if(!data.error) {
          swal("Success","User berhasil di tambah","success")
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


    handleChecked = (e, labelData)=>{
      this.setState({[labelData]:!this.state[labelData]})
    }

    onChangeTextField = (e) => {
      let value = e.target.value;
      let labelName = e.target.id;
      let flag = true;

      if(value.includes(' ') || value.includes('\'') || value.includes('"') || value.includes(',') ) {
        flag = false
      }

      if(labelName === 'phone' && isNaN(value)) {    
        flag = false 
      }
      
      if(flag) {
        this.setState({
          [labelName]: value,
        })
      } 
    }

    onChangeDropDown = (e) => {
      const labelName = e.target.name.toString().toLowerCase();

      const roleBank = this.isRoleBank(e.target.value); 
      
      if(labelName === 'role') {
        this.setState({
          bank: (roleBank && this.state.listBank && this.state.listBank[0] && this.state.listBank[0].id) || 0,
        })
      }

      this.setState({
        [labelName]: e.target.value,

      })
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
      } else if (this.isRoleBank(this.state.role) && (!this.state.bank || this.state.bank === 0)) {
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

    btnConfirmationDialog = (e, nextStep, pesan) => {
      this.setState({dialog: !this.state.dialog,messageDialog:pesan})

      if(nextStep && this.state.messageDialog.includes('save')) {
          this.btnSave() 
      }
    }

    render(){
        if(this.state.diKlik){
          return <Redirect to='/akunList'/>            
        } else if (this.state.loading){
          return  (
         <Loading 
            title={'Akun - Tambah'}
         />
          )
        } else if(getToken()){
          return(
            <Grid container>

            <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                 <TitleBar
                  title={'Akun - Tambah'}
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
                         permissionAdd={ checkPermission('core_user_new') ?  ()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?') : null}
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
                                     <DropDown
                                         value={this.state.bank}
                                         label="Bank"
                                         data={this.state.listBank}
                                         id="id"
                                         labelName="name"
                                         onChange={this.onChangeDropDown}
                                         disabled={!this.isRoleBank(this.state.role)}
                                         fullWidth
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
                                             InputProps={{
                                              startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                                            }}
                                             fullWidth
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
        } else if(getToken()){
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
  )(userAdd);