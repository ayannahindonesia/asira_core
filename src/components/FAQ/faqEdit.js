import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { EditFAQFunction,detailFAQFunction } from './saga';
import { getToken } from '../index/token';

class FAQEdit extends React.Component{
    _isMounted = false;
    state={diKlik:false,errorMessage:'',submit:false,faqDetail:{}}
    
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this._isMounted = true;
        this.detailFAQ()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    detailFAQ = async function () {
        const param={}
        param.id = this.props.match.params.id
        const data = await detailFAQFunction(param)
        if(data){
            if(!data.error){
               this.setState({faqDetail:data.FAQDetail})
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    btnEdit=()=>{
        var title= this.refs.judul.value
        var description = this.refs.deskripsi.value
  
        if (title ===""||title.trim()==="" || description===''|| description.trim()===''){
            this.setState({errorMessage:"Ada field yang kosong - Harap cek ulang"})
        }else{
            this.setState({submit:true})
            const param = {}
            param.id=this.props.match.params.id
            param.newData={title,description}
            this.editFAQ(param)
        }
    }

    editFAQ = async function (params) {
        const data = await EditFAQFunction(params)
        if(data){
            if(!data.error){
                this.setState({submit:false,diKlik:true,errorMessage:""})
                swal("Success","FAQ baru berhasil di perbarui","success")
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-success ml-3 mr-3" value="Ubah" onClick={this.btnEdit} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-success ml-3 mr-3" value="Ubah" onClick={this.btnEdit}/>
        }
    }
    btnCancel =()=>{
        this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to="/FAQ"/>
        }
        if(getToken()){
            return(
                <div className="container mt-3">
                  <h2>FAQ -  Edit {this.state.faqDetail.id}</h2>
                <hr></hr>
                <div className="form-group row">
                 <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                     {this.state.errorMessage}
                  </div>
                </div>
                     <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Judul FAQ</label>
                                                <div className="col-sm-9 btn-group">
                                                <input type="text" className="form-control" ref="judul" defaultValue={this.state.faqDetail.title}  placeholder="Judul FAQ" required autoFocus/>
                                                </div>
                     </div>
                      <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Deskripsi</label>
                                                <div className="col-sm-9">
                                                <textarea rows="5" ref="deskripsi" className="form-control"  defaultValue={this.state.faqDetail.description} placeholder="Description.." required autoFocus/>
                                                </div>
                     </div>
                    <div className="form-group row">
                                                {this.renderBtnSumbit()}
                                                <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                      </div>

                </div>
            )
        }
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default FAQEdit;