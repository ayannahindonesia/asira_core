import React from 'react'
import { Redirect } from 'react-router-dom'
import CheckBox from '../subComponent/CheckBox';
import Loader from 'react-loader-spinner'
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { listAllRolePermission } from '../global/globalConstant'
import { getRoleFunction, getRolePermissionFunction, patchRolePermissionFunction } from './saga'
import { constructRolePermission } from './function'
import { getToken } from '../index/token';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });


class rolePermissionEdit extends React.Component{
    _isMounted = false;

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
      param.listAllRolePermission = this.state.listAllRolePermission;

      const data = await getRoleFunction(param, getRolePermissionFunction);
      
      if(data) {
        if(!data.error) {
          this.setState({
            listRole: data.dataRole,
            listRolePermission: data.dataRolePermission,
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
    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave = () =>{
      const listRolePermission = this.state.listRolePermission;
      const dataRolePermission = {};
      dataRolePermission.role_id = parseInt(this.state.listRole.id);
      dataRolePermission.permissions = constructRolePermission(listRolePermission);

      const param = {
        dataRolePermission,
      };

      this.patchRolePermission(param)
        
    }

    patchRolePermission = async function(param) {
      const data = await patchRolePermissionFunction(param)

      this.setState({loading: true})

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
        } else if(getToken()){
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
  )(rolePermissionEdit);