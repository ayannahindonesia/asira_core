import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import { getAuditTrailDetailFunction } from './saga'
import Loading from '../subComponent/Loading';
import { Grid, Tooltip, IconButton, TextField } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import TitleBar from '../subComponent/TitleBar'

class AuditTrailDetail extends React.Component{
    _isMounted = false

    state={
        username: '',
        user_id: '',
        client: '',
        entity: '',
        actionAudit: '',
        data:[],
        loading:true,
        diKlik:false
    }

    
    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentDidMount(){
        this._isMounted=true
        this.getAuditDetail()
   
    }

    destructAuditrail = (original, newData) => {
        let newObject = {};

        if(original && newData) {
            for(const key in original) {
                if(!newObject[key]) {
                    newObject[key] = {
                        before: '',
                        after: '',
                    };

                }
                newObject[key].before = original[key]
            }

            for(const key in newData) {
                if(!newObject[key]) {
                    newObject[key] = {
                        before: '',
                        after: '',
                    };

                }
                newObject[key].after = newData[key]
            }
        }
        
        return newObject;
    }

    getAuditDetail = async function () {
        const param = {}
        param.id = this.props.match.params.id
        const data = await getAuditTrailDetailFunction(param);

       if(data){
            if(!data.error){
                let newDataLog = Object.assign({}, data.auditTrailDetail);

                newDataLog = this.destructAuditrail(newDataLog.original && JSON.parse(newDataLog.original), newDataLog.new && JSON.parse(newDataLog.new))

                this.setState({
                    username: data.auditTrailDetail && data.auditTrailDetail.username,
                    user_id: data.auditTrailDetail && data.auditTrailDetail.user_id,
                    actionAudit: data.auditTrailDetail && data.auditTrailDetail.action,
                    client: data.auditTrailDetail && data.auditTrailDetail.client,
                    entity: data.auditTrailDetail && data.auditTrailDetail.entity,
                    data: newDataLog,
                    loading:false
                })
            }
            else{
               this.setState({errorMessage:data.error, loading: false})
            }
       }
    }   

    renderTable = (obj, index) => {

        let color = this.checkDifferent(obj.before, obj.after);
        
        return(
            <Grid item xs={12} sm={12} key={index} style={{borderTop:'1px solid #cfcfcf', minHeight:'45px', wordWrap:'break-word'}}>

                <Grid container style={{backgroundColor: color ? 'orange': 'none', verticalAlign:'bottom'}}>

                    <Grid item xs={2} sm={2} style={{fontWeight: 'bold', padding:'10px 0px 10px 10px', borderRight:'1px solid #cfcfcf', borderLeft:'1px solid #cfcfcf'}}>
                        {index}
                    </Grid>

                    <Grid item xs={5} sm={5} style={{borderRight:'1px solid #cfcfcf'}}>
                        <Grid container>
                            {this.renderPerRowTable(obj.before)}
                        </Grid>
                        
                    </Grid>

                    <Grid item xs={5} sm={5} style={{borderRight:'1px solid #cfcfcf'}}>
                        <Grid container>
                            {this.renderPerRowTable(obj.after)}
                        </Grid>
                    </Grid>

                </Grid>

            </Grid>
        )
    }

    renderPerRowTable = (obj, index) => {

        if(typeof(obj) === 'object' && obj !== null) {
            if(obj.length) {
                return obj.map((objArray, indexArray) => {
                    return(
                        <Grid container key={indexArray} >
                            <Grid item xs={6} sm={6} style={{padding:index ? '10px 10px 10px 30px' : '10px 10px 10px 10px'}}>
                                {indexArray.toString()}
                            </Grid>
                            {this.renderPerRowTable(objArray, indexArray.toString())}
                        </Grid>
                    )
                }, this)
            } else {
                return Object.keys(obj).map((objArray) => {
                    return(
                        <Grid container key={objArray}>
                            <Grid item xs={6} sm={6} style={{padding:index ? '10px 10px 10px 30px' : '10px 10px 10px 10px'}}>
                                {objArray.toString()}
                            </Grid>
                            {this.renderPerRowTable(obj[objArray], objArray.toString())}
                        </Grid>
                    )
                }, this)
            }
        }
        
        return <Grid item xs={6} sm={6} style={{padding:'10px 10px 10px 10px'}}> {obj ? obj.toString() : '-'} </Grid>
    }

    checkDifferent = (before, after) => {
        let flag = false;
        
        if(
            typeof(before) === typeof(after) && 
            typeof(before) === 'object' && 
            after !== null && before !== null
        ) {
            for(const key in before) {
                flag = this.checkDifferent(before[key], after[key]);

                if(flag) {
                    break;
                }
            }
        } else if(before !== after) {
            flag = true;
        }

        return flag;
    }

    
    render(){   
        if(this.state.diKlik){
            return(
                <Redirect to="/auditTrail"></Redirect>
            )
        } else if(this.state.loading){
            return(
                <Loading
                    title={'Audit Trail - Detail'}
                />
            )
        } else if(getToken()){
            
            return (
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={'Audit Trail - Detail'}
                        />

                    </Grid>
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                        <Grid container>
                            {/* Action Button */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                                <Grid container style={{display:'flex', justifyContent:'flex-end', padding:'0'}}>
                                    <Grid item xs={2} sm={2} style={{display:'flex', justifyContent:'flex-end'}}>

                                        <Tooltip title="Back" style={{outline:'none'}}>
                                            <IconButton aria-label="cancel" onClick={() => {this.setState({diKlik:true})}}>
                                                <CancelIcon style={{width:'35px',height:'35px'}}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Error */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                {this.state.errorMessage}
                            </Grid>

                            <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'10px'}}>
                                <Grid container>

                                    <Grid item sm={4} xs={4} style={{padding:'25px 0px 0px 10px'}}>
                                        User
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="user"
                                            value={`${this.state.username || '-'} (id : ${this.state.user_id || '-'})`}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            disabled
                                        />
                                        
                                    </Grid>

                                </Grid>

                            </Grid>
                            <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'10px'}}>
                                <Grid container>

                                    <Grid item sm={4} xs={4} style={{padding:'25px 0px 0px 10px'}}>
                                        Client
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="client"
                                            value={this.state.client || '-'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            disabled
                                        />
                                        
                                    </Grid>

                                </Grid>

                            </Grid>

                            <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'10px'}}>
                                <Grid container>

                                    <Grid item sm={4} xs={4} style={{padding:'25px 0px 0px 10px'}}>
                                        Entity
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="entity"
                                            value={this.state.entity || '-'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            disabled
                                        />
                                        
                                    </Grid>

                                </Grid>

                            </Grid>

                            <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'20px'}}>
                                <Grid container>

                                    <Grid item sm={4} xs={4} style={{padding:'25px 0px 0px 10px'}}>
                                        Action
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="entity"
                                            value={this.state.actionAudit || '-'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            disabled
                                        />
                                        
                                    </Grid>

                                </Grid>

                            </Grid>

                            <Grid item sm={12} xs={12} style={{textAlign:'center', fontSize:'20px', marginBottom:'10px', border:'1px solid #cfcfcf'}}>
                                <Grid container>

                                    <Grid item sm={2} xs={2} style={{padding:'10px'}}>
                                        Nama Kolom
                                    </Grid>

                                    <Grid item sm={5} xs={5} style={{padding:'10px', borderLeft:'1px solid #cfcfcf'}}>
                                        Sebelum
                                    </Grid>

                                    <Grid item sm={5} xs={5} style={{padding:'10px', borderLeft:'1px solid #cfcfcf'}}>
                                        Sesudah
                                    </Grid>

                                </Grid>

                            </Grid>

                            {
                                this.state.data && Object.keys(this.state.data).map((index) => {

                                    return(
                                        this.renderTable(this.state.data[index], index)
                                    )
                                    
                                }, this)
                            }
                        
                        </Grid>
                    </Grid>
                </Grid>
            );
        }
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }

    }
    
}

export default AuditTrailDetail