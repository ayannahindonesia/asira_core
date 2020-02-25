import React from 'react'
import { Redirect } from 'react-router-dom'
import { checkPermission } from '../global/globalFunction';
import { getAllFAQListFunction } from './saga';
import { getToken } from '../index/token';
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
    {
        id: 'id',
        numeric: false,
        label: 'ID FAQ',
    },
    {
        id: 'title',
        numeric: false,
        label: 'Judul',
    },
    {
        id: 'description',
        numeric: false,
        label: 'Deskripsi',
    }
  ]
  
class FAQ extends React.Component{
    _isMounted = false;
    
    state={
        loading:true,paging:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,dataPerhalaman:5,
    }
    componentDidMount (){
        this._isMounted=true
        this.getAllList()
    }
    componentWillUnmount(){
        this._isMounted=false
    }
    
    getAllList = async function (){
        const param={
            page: this.state.page,
            rows:10
        }
        const data = await getAllFAQListFunction(param)
        

        if(data){
            if(!data.error){
                this.setState({loading:false,rows:data.listFaq.data,
                    total_data:data.listFaq.total_data,
                    page:data.listFaq.current_page,
                    from:data.listFaq.from,
                    to:data.listFaq.to,
                    last_page:data.listFaq.last_page,
                    dataPerhalaman:data.listFaq.rows,
                })
            }else{
                this.setState({errorMessage:data.error,loading:false})
            }
        }
    }

    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
          if(this.state.paging){
            this.getAllList()
          }
        })
    }

    render(){
        if(getToken()){
            return(
                <div style={{padding:0}}>
                   < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        title={'FAQ - List'}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.rows}
                        page={this.state.page}
                        rowsPerPage={this.state.dataPerhalaman}
                        totalData={this.state.total_data}
                        onChangePage={this.onChangePage}     
                        permissionAdd={ checkPermission('_') ? '/FAQAdd' : null }           
                        permissionDetail={ checkPermission('_') ? '/FAQDetail/' : null}
                        permissionEdit={ checkPermission('_') ? '/FAQEdit/' : null}

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

export default FAQ;