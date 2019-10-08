import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import CheckBox from '../subComponent/CheckBox';
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { listAllRolePermission } from '../global/globalConstant'
import {getRoleFunction, getRolePermissionFunction} from './saga'

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

const cookie = new Cookies();

class rolePermissionDetail extends React.Component{
    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission,
      listRolePermission: [],
      listRole: {},
      role : {},
      roleId: 0,
      disabled: true,
      loading: true,
    };

    componentDidMount(){
      this.setState({
        roleId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
      
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
                 <h3>Role Permission - Detail</h3>
                 
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
                            onChecked={(id) => this.checkingRole(this.state.listRolePermission, id)}
                            style={{ width: '97%'}}
                            disabled={this.state.disabled}
                          />
                        </div>           
                    </div>
                    
                    <div className="form-group row">
                        <div className="col-sm-12 mt-3">
                          <input type="button" value="Batal" className="btn" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                        </div>
                    </div>
                    
                 </form>
                
                </div>
            )
        } else if(!cookie.get('token')){
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
  )(rolePermissionDetail);