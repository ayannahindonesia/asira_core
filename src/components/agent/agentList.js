import React from 'react'
import { Redirect } from 'react-router-dom'
import {getAllAgentFunction} from './saga'
import { checkPermission } from '../global/globalFunction';
import { getToken } from '../index/token'
import TableComponent from '../subComponent/TableComponent'


const columnDataAgent = [
    {
        id: 'id',
        numeric: false,
        label: 'Id Agen',
    },
    {
        id: 'username',
        numeric: false,
        label: 'Nama Agen',
    },
    {
        id: 'username',
        numeric: false,
        label: 'Kategori',
    },
    {
        id: 'username',
        numeric: false,
        disablePadding: true,
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

    // onBtnSearch = () => {
    //     this.setState({page:1}, () => {
    //         this.refresh()
    //     })
    // }

    changeSearch = (e) => {
        this.setState({
            loading:true,
            page: 1,
            search: e.target.value,
        }, () => {
            this.refresh();
        })
    }

    refresh = async function(){
        const param = {};

        if(this.state.paging) {
            param.rows = this.state.rowsPerPage;
            param.page = this.state.page;
        }

        param.name = this.state.search

        const data = await getAllAgentFunction(param);

        if(data) {
            if(!data.error) {
                const dataListAgent = data.dataAgent || [];

                for(const key in dataListAgent) {
                    dataListAgent[key].status = dataListAgent[key].status.toString().toLowerCase() === 'active' ? 'Aktif' : 'Tidak Aktif'
                }

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
                <div className="container">
                    <div className="row">
                        <div className="col-7">
                            <h2 className="mt-3">Agen - List</h2>
                        </div>
                        <div className="col-8" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                            {this.state.errorMessage}
                        </div>   
                        <div className="col-4">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search" value={this.state.search} onChange={this.changeSearch} style={{width:"150px"}} />
                                <span className="input-group-addon ml-2" style={{border:"1px solid grey",width:"35px",height:"35px",paddingTop:"2px",borderRadius:"4px",paddingLeft:"2px",marginTop:"6px",cursor:"pointer"}} onClick={this.onBtnSearch}> 
                                <i className="fas fa-search" style={{fontSize:"28px"}} ></i></span>
                            </div>
                        </div> 
                    </div>

                    <hr/>

                    < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataAgent}
                        data={this.state.listAgent}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.totalData}
                        onChangePage={this.onChangePage}             
                        permissionEdit={ checkPermission('core_agent_patch') ? '/editAgent/' : null}
                        permissionDetail={ checkPermission('core_agent_details') ? '/detailAgent/' : null}
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