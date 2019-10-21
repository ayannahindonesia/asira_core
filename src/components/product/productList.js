import React from 'react'
import Cookies from 'universal-cookie';
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import { listProductFunction } from './saga';
import {checkPermission} from './../global/globalFunction'
import { Redirect } from 'react-router-dom'

const cookie = new Cookies()

class ProductList extends React.Component{
    _isMounted = false;
    state={
        loading:true
    }
    componentWillUnmount() {
        this._isMounted = false;
      }
    componentDidMount (){
        this._isMounted = true;
        this.getAllProduct()
    }
    getAllProduct = async function () {
        const params ={

        }
        const data = await listProductFunction (params)
        if(data){
            if(!data.error){
                this.setState({loading:false,rows:data.data.data})
            }else{
                console.log(data.error)
            }
        }
    }

    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
                <td align="center" colSpan={5}>
                      <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
              />   
                </td>
              </tr>
            )
        }else{
            if(this.state.rows.length===0){
                return(
                  <tr>
                     <td align="center" colSpan={6}>Data empty</td>
                  </tr>
                )
              }else{
                var jsx = this.state.rows.map((val,index)=>{
                  return (
                      <tr key={index}>
                        <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
                        <td align="center">{val.id}</td>
                        <td align="center">{val.name}</td>
                        <td align="center">{val.status ==="active"?"Aktif":"Tidak Aktif"}</td>               
                        <td align="center">
                      
                         {checkPermission('ServiceProduct_Edit') &&
                        <Link to={`/productedit/${val.id}`} className="mr-2">
                        <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                        </Link>
                        }
                        <Link to={`/productdetail/${val.id}`} >
                         <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                    </Link>
                        </td>
                      </tr>
                  )
              })
               return jsx;
              }   
        }
    }


    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                    <h2>Product - List</h2>
                    <hr></hr>

                    <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">Id Produk</th>
                            <th className="text-center" scope="col">Nama Produk</th>
                            <th className="text-center" scope="col">Status Produk</th>
                            <th className="text-center" scope="col">Action</th>  
                        </tr>     
                    </thead>
                       <tbody>
                          {this.renderJSX()}

                       </tbody>
                   </table>
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

export default ProductList;