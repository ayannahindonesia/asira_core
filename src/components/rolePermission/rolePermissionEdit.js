import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../url';
import CheckBox from '../subComponent/CheckBox';
import Loader from 'react-loader-spinner'
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { listAllRolePermission } from '../global/globalConstant'

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

const cookie = new Cookies();


class rolePermissionEdit extends React.Component{
    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission,
      listRolePermission: [],
      listRole : {},
      roleId: 0,
      loading: true,
      disabled:true,
    };

    componentDidMount(){
      this.setState({
        roleId: this.props.match.params.id,
      },() => {
        this.getRole()
      })
    }

    getRole = ()=>{
      const config = {
        headers: {'Authorization': "Bearer " + cookie.get('token')}
      };

      axios.get(serverUrl+`admin/roles/${this.state.roleId}`,config).then((res)=>{
        const listRole = res.data

        this.setState({
          listRole,
        }, () => {
          this.getRolePermission()
        })
      }).catch((err)=>{
          console.log(err.toString())
          this.setState({
            errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
            loading: false,
            disabled: true,
          })
      })
    }

    getRolePermission = ()=>{
      const config = {
        headers: {'Authorization': "Bearer " + cookie.get('token')}
      };

      axios.get(serverUrl+`admin/permission?role_id=${this.state.roleId}`,config)
      .then((res)=>{
        const listPermission = res.data && res.data.data ? res.data.data : res.data;
        const listRole = this.state.listRole;
        let newPermission = [];
        let flag = false;

        for(const keyPermission in listPermission) {
          if(
            listRole.id.toString() === listPermission[keyPermission].role_id.toString() &&
            listPermission[keyPermission].permissions.toString().trim().length !== 0
          ) {
            if(listPermission[keyPermission].permissions.toString().trim().toLowerCase() === 'all') {
              newPermission = this.destructRolePermissionAll();
              flag = true;
              break;
            } else {
              newPermission.push(this.destructRolePermission(listPermission[keyPermission].permissions))
            }
            
          }
        }

        this.setState({
          listRolePermission: newPermission,
          loading: false,
          disabled: flag,
        })

      }).catch((err)=>{
        console.log(err.toString())
        this.setState({
          errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
          loading: false,
          disabled: true,
        })
      })
    }

    destructRolePermissionAll = (permission) => {
      let newPermission = [];

      for(const key in this.state.listAllRolePermission) {
        newPermission.push({
          id: this.state.listAllRolePermission[key].id,
          name: this.state.listAllRolePermission[key].name,
          modules: this.state.listAllRolePermission[key].modules,
        });
      }

      return newPermission
    }

    destructRolePermission = (permission) => {
      let newPermission = {};
      const dataPermission = permission.split('_');

      newPermission = {
        id: this.findIdRolePermission(dataPermission),
        modules: dataPermission[0],
        name: dataPermission[1] || dataPermission[0],
      };
      
      return newPermission
    }

    findIdRolePermission = (dataPermission) => {
      let idPermission = 0;
      
      for(const key in this.state.listAllRolePermission) {
        if(
          this.state.listAllRolePermission[key].modules.toString().toLowerCase().trim() === dataPermission[0].toString().toLowerCase().trim() && 
          dataPermission[1] &&
          this.state.listAllRolePermission[key].name.toString().toLowerCase().trim() === dataPermission[1].toString().toLowerCase().trim()
        ) {
          idPermission = this.state.listAllRolePermission[key].id;
        }
      }

      return idPermission
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    btnSave=()=>{
      const listRolePermission = this.state.listRolePermission;
      const dataRolePermission = {};
      dataRolePermission.role_id = parseInt(this.state.listRole.id);
      dataRolePermission.permissions = this.constructRolePermission(listRolePermission);

      this.setState({loading: true})

      const config = {
        headers: {'Authorization': "Bearer " + cookie.get('token')}
      };
      
      axios.patch(serverUrl+`admin/permission`,dataRolePermission,config).then((res)=>{
        swal("Success","Role Permission berhasil di ubah","success")
        this.setState({diKlik:true})
      }).catch((err)=>{
        console.log(err.toString())
        this.setState({
          errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
          loading: false,
          disabled: false,
        })
      })
        
    }

    constructRolePermission = (rolePermission) => {
      const newPermission = [];

      for(const key in rolePermission) {
        newPermission.push(`${rolePermission[key].modules}_${rolePermission[key].name}`)
      }
      return newPermission;
    }

    checkingRole = (role, idRolePermission) => {
      for (const key in role) {
        if (
          role[key].id.toString().trim() ===
          idRolePermission.toString().trim()
        ) {
          return true;
        }
      }
      return false;
    }

    onChangeCheck = (e) => {
      const profileUserAll = Object.assign({}, this.state.listAllRolePermission);
      const profileUser = Object.assign({}, this.state.listRolePermission);
      const profileUserNew = [];
      let flag = false;
      let name = '';
      let modules = '';
  
      for (const key in profileUserAll) {
        if (
          profileUserAll[key].id.toString().trim() ===
          e.target.value.toString().trim()
        ) {
          name = profileUserAll[key].name;
          modules = profileUserAll[key].modules;

          for(const keyRole in profileUser) {
            if(profileUser[keyRole].id.toString().trim() !== e.target.value.toString().trim()) {
              profileUserNew.push(profileUser[keyRole])
            } else {
              flag = true;
            }
          }
        } 
      }
  
      if (!flag) {
        profileUserNew.push({
          id: e.target.value,
          name: name,
          modules: modules,
        });
      }
      
      this.setState({
        listRolePermission: profileUserNew,
      });
    };

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listRolePermission'/>            
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
        } else if(cookie.get('token')){
            return(
                <div className="container mt-4">
                 <h3>Role Permission - Ubah</h3>
                 
                 <hr/>
                 
                 <form>
                    <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Role Name
                      </label>
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        {this.state.listRole && this.state.listRole.name}
                      </label>               
                    </div>

                    <div className="form-group row">
                        <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                            {this.state.errorMessage}
                        </div>     
                        <div className="col-12" style={{color:"black",fontSize:"15px",textAlign:'left'}}>
                            <CheckBox
                              label="Core - Permission Setup"
                              modulesName="Menu"
                              data={this.state.listAllRolePermission}
                              id="id"
                              labelName="label"
                              modules="menu"      
                              labelPlacement= "top"                       
                              onChange={this.onChangeCheck}
                              onChecked={(id) => this.checkingRole(this.state.listRolePermission, id)}
                              style={{ width: '97%'}}
                            />
                        </div>           
                    </div>
                    
                    <div className="form-group row">
                        <div className="col-sm-12 ml-3 mt-3">
                          <input type="button" value="Ubah" className="btn btn-success" onClick={this.btnSave} />
                          <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                        </div>
                    </div>
                    
                 </form>
                
                </div>
            )
        }else if(!cookie.get('token')){
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
  )(rolePermissionEdit);