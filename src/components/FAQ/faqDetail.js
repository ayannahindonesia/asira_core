import React from 'react'
import { Redirect } from 'react-router-dom'
import { detailFAQFunction } from './saga';
import { getToken } from '../index/token';

class FAQDetail extends React.Component{
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

    render(){
        if(getToken()){
            return(
                <div className="container mt-3">
                  <h2>FAQ -  Detail {this.props.match.params.id}</h2>
                <hr></hr>
                <div className="form-group row">
                 <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                     {this.state.errorMessage}
                  </div>
                </div>
                     <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Judul FAQ</label>
                                                <div className="col-sm-9 btn-group">
                                                : {this.state.faqDetail.title}
                                                </div>
                     </div>
                      <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Deskripsi</label>
                                                <div className="col-sm-9">
                                                : {this.state.faqDetail.description}
                                                </div>
                     </div>
                    <div className="form-group row">
                                                 <input type="button" className="btn btn-outline-primary" value="Kembali" onClick={()=>  window.history.back()}/>

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

export default FAQDetail;