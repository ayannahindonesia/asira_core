import React from 'react'
import { getToken } from '../index/token'
import { Redirect } from 'react-router-dom'
import { getAllActivityLogDetailFunction } from './saga'
import { Grid, Tooltip, IconButton, TextField } from '@material-ui/core'
import Loading from '../subComponent/Loading';
import CancelIcon from '@material-ui/icons/Cancel';
import TitleBar from '../subComponent/TitleBar'

class ActivityLogDetail extends React.Component{
    _isMounted = false

    state={
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:5,
        errorMessage:'',
        messages:{},
        diKlik: false,
        loading:true,
    }

    
    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentDidMount(){
        this._isMounted=true
        this.getAllLogDetail()
   
    }

    getAllLogDetail = async function () {
        const param = {}
        param.id = this.props.match.params.id
        const data = await getAllActivityLogDetailFunction(param)

        if(data){
            if(!data.error){
                const newDataLog = data.activityLogDetail ;
                const messages = newDataLog && newDataLog.messages && JSON.parse(newDataLog.messages)

                newDataLog.created_at = newDataLog.created_at.replace("T"," - ")
                newDataLog.updated_at = newDataLog.updated_at.replace("T"," - ")
                
                this.setState({rows:newDataLog,messages, loading:false})
            }else{
                this.setState({errorMessage:data.error, loading:false})
            }
        }
    }

    
    renderTable = (obj, index) => {
        
        return(
            <Grid item xs={12} sm={12} key={index} style={{ minHeight:'45px', wordWrap:'break-word', maxWidth:'80vw', border:'1px solid #cfcfcf', marginLeft:'10px'}}>

                <Grid container style={{verticalAlign:'bottom'}}>

                    <Grid item xs={2} sm={2} style={{fontWeight: 'bold', padding:'10px 0px 10px 10px', borderRight:'1px solid #cfcfcf'}}>
                        {index}
                    </Grid>

                    <Grid item xs={10} sm={10} >
                        <Grid container>
                            {this.renderPerRowTable(obj)}
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
                        <Grid container key={indexArray} style={{borderTop:'1px solid #cfcfcf'}}>
                            <Grid item xs={4} sm={4} style={{padding:index ? '10px 10px 10px 30px' : '10px 10px 10px 10px'}}>
                                {indexArray.toString()}
                            </Grid>
                            {this.renderPerRowTable(objArray, indexArray.toString())}
                        </Grid>
                    )
                }, this)
            } else {
                
                return Object.keys(obj).map((objArray) => {
                    return(
                        <Grid container key={objArray} style={{borderTop:'1px solid #cfcfcf'}}>
                            <Grid item xs={4} sm={4} style={{padding:index ? '10px 10px 10px 30px' : '10px 10px 10px 10px'}}>
                                {objArray.toString() || '-'}
                            </Grid>
                            {this.renderPerRowTable(obj[objArray], objArray.toString())}
                        </Grid>
                    )
                }, this)
            }
        }
        
        return <Grid item xs={8} sm={8} style={{padding:'10px 10px 10px 10px'}}> {obj ? obj.toString() : '-'} </Grid>
    }

    
    render(){   
        if(this.state.diKlik){
            return(
                <Redirect to="/activityLog"></Redirect>
            )
        } else if(this.state.loading){
            return(
                <Loading
                    title={'Activity Log - Detail'}
                />
            )
        } else if(getToken()){
            return (
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={'Activity Log - Detail'}
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
                                        ID
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="idLog"
                                            value={(this.state.rows && this.state.rows.id) || '-'}
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
                                        User
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="user"
                                            value={`${(this.state.rows && this.state.rows.username) || '-'} (id : ${(this.state.rows && this.state.uid) || '-'})`}
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
                                        Created
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="created_at"
                                            value={(this.state.rows && this.state.rows.created_at) || '-'}
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
                                        Updated
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="updated_at"
                                            value={(this.state.rows && this.state.rows.updated_at) || '-'}
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
                                        Deleted
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="deleted_at"
                                            value={(this.state.rows && this.state.rows.deleted_at) || '-'}
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
                                            value={(this.state.rows && this.state.rows.client) || '-'}
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
                                        Tag
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="tag"
                                            value={(this.state.rows && this.state.rows.tag) || '-'}
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
                                        Note
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="note"
                                            value={(this.state.rows && this.state.rows.note) || '-'}
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
                                        Level
                                    </Grid>

                                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                                        < TextField
                                            id="level"
                                            value={(this.state.rows && this.state.rows.level) || '-'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            disabled
                                        />
                                        
                                    </Grid>

                                </Grid>

                            </Grid>

                            <Grid item sm={12} xs={12} style={{margin:'30px 36px 0px 10px', padding:'10px', border:'2px solid #cfcfcf', fontSize:'20px', textAlign:'center'}}>
                                Messages

                            </Grid>

                            {
                                this.state.messages && Object.keys(this.state.messages).map((index) => {
                                    
                                    return(
                                        this.renderTable(this.state.messages[index], index)
                                    )
                                    
                                }, this)
                            }
                        
                        </Grid>
                    </Grid>
                </Grid>
            );
        } else if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }

    }
    
}

export default ActivityLogDetail