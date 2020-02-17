import React from 'react'
import { listProductFunction } from './saga';
import {checkPermission} from './../global/globalFunction'
import { Redirect } from 'react-router-dom'
import { getToken } from '../index/token';
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
    {
        id: 'id',
        numeric: false,
        label: 'ID Produk',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Nama Produk',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status Produk',
    }
]
class ProductList extends React.Component{
    _isMounted = false;
    state={
        loading:true,paging:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,dataPerhalaman:5,errorMessage:null
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
            page:this.state.page,
            rows:10
        }
        const data = await listProductFunction (params)

        const dataProduct = data.productList && data.productList.data;
        
        for(const key in dataProduct) {
            dataProduct[key].status = dataProduct[key].status && dataProduct[key].status === 'active' ? 'Aktif' : 'Tidak Aktif'
        }
        
        if(data){
            if(!data.error){
                this.setState({loading:false,rows:data.productList.data,
                    total_data:data.productList.total_data,
                    page:data.productList.current_page,
                    from:data.productList.from,
                    to:data.productList.to,
                    last_page:data.productList.last_page,
                    rowsPerPage:data.productList.rows,
                })
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
            if(this.state.paging){
                this.getAllProduct()
            }
        })
    }


    render(){
        if(getToken()){
            return(
                <div style={{padding:0}}>
                    < TableComponent
                        id={"id"}
                        title={'Produk - List'}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.rows}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.total_data}
                        onChangePage={this.onChangePage}         
                        permissionAdd={ checkPermission('core_product_new') ? '/produkAdd' : null }         
                        permissionDetail={ checkPermission('core_product_detail') ? '/produkDetail/' : null}
                        permissionEdit={ checkPermission('core_product_patch') ? '/produkEdit/' : null}

                    /> 

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

export default ProductList;