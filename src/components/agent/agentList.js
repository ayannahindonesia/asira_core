import React from 'react'
import { Redirect } from 'react-router-dom'
import {getAllAgentFunction} from './saga'
import { checkPermission } from '../global/globalFunction';
import { getToken } from '../index/token'
import TableComponent from '../subComponent/TableComponent'
import { destructAgent } from './function';

const columnDataAgent = [
    {
        id: 'id',
        numeric: false,
        label: 'Id Agen',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Nama Agen',
    },
    {
        id: 'category_name',
        numeric: false,
        label: 'Kategori',
    },
    {
        id: 'instansi',
        numeric: false,
        label: 'Instansi',
    },
    { 
        id: 'status', 
        numeric: false, 
        label: 'Status' 
    },
]

class AgentList extends React.Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loading:true, 
            listAgent: [],
            paging: true,
            page: 1,
            rowsPerPage: 10,
            search: '',
        }
    }

    componentDidMount(){
        this._isMounted = true;
        this.refresh()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    changeSearch = (e) => {
        this.setState({
            search: e.target.value,
        })
      }
    
    btnSearch = (e) => {
        this.setState({
            loading:true,
            page: 1,
        }, () => {
            if(this.state.paging){
                this.refresh()

            }
        })
    }

    refresh = async function(){
        const param = {};

        if(this.state.paging) {
            param.rows = this.state.rowsPerPage;
            param.page = this.state.page;
        }

        param.search_all = this.state.search

        const data = await getAllAgentFunction(param);

        if(data) {
            if(!data.error) {
                const dataListAgent = destructAgent(data.dataAgent, true);
                
                this.setState({
                    listAgent: dataListAgent,
                    totalData: data.totalData,
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

    onChangePage = (current) => {
        this.setState({
            loading:this.state.paging,
            page:current,
        }, () => {
            if(this.state.paging) {
                this.refresh()
            };
        })
    }

    render(){

        if(getToken()){
            return(
                <div style={{padding:0}}>

                    < TableComponent
                        id={"id"}
                        search={
                            {
                                value: this.state.search,
                                label: 'Search Nama Agen, ID Agen..',
                                onChange: this.changeSearch,
                                function: this.btnSearch,
                            }
                        }
                        title={'Agen - List'}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataAgent}
                        data={this.state.listAgent}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.totalData}
                        onChangePage={this.onChangePage}       
                        permissionAdd={ checkPermission('core_agent_new') ? '/agenAdd/' : null}      
                        permissionDetail={ checkPermission('core_agent_details') ? '/agenDetail/' : null}
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

export default AgentList;