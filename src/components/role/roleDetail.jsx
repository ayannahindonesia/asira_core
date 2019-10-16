import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { DetailRoleFunction } from './saga';
const cookie = new Cookies()

class RoleDetail extends React.Component{
    _isMounted = false;
    state= {diklik:false,rows:[],errorMessage:''}
 
    componentDidMount(){
        this._isMounted=true;
        this.getDetailLayanan()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    getDetailLayanan = () =>{
        const id = this.props.match.params.id
        const param ={
            id,
        }
        this.detailRole(param)

    }

    detailRole = async function (params) {
        const data = await DetailRoleFunction(params);
        if(data){
            if(!data.error){
                this.setState({rows:data.data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    btnBack = ()=>{
        this.setState({diklik:true})
    }
    render(){
        if(this.state.diklik){
            return <Redirect to="/listrole"></Redirect>
        }
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2>Role - Detail</h2>
                   <hr/>
                   <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Role ID</label>
                            <div className="col-sm-8">
                            : {this.state.rows.id}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Role</label>
                            <div className="col-sm-8">
                            : {this.state.rows.name}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Sistem</label>
                            <div className="col-sm-8">
                            : {this.state.rows.system}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Deskripsi</label>
                            <div className="col-sm-8">
                            : {this.state.rows.description}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-8">
                            : {this.state.rows.status ?"Aktif":"Tidak Aktif"}
                            </div>
                        </div>
                    </form>
                    <div className="form-group row">
                            <label className="col-sm-4 col-form-label">
                                <input type="button" className="btn btn btn-secondary" value="Kembali" onClick={this.btnBack}/>
                            </label>
                            <div className="col-sm-8">
                            </div>
                        </div>
    
                </div>
            )
        }
        if(!cookie.get('token')){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default RoleDetail;