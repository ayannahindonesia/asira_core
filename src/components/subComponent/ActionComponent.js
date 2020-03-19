import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

class ActionComponent extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        errorText: '',
      };
    }

    render() {
        const {
            modifyType,
            permissionAdd,
            permissionDelete,
            permissionEdit,
            onCancel,
        } = this.props;
        
        return ( 
            <Grid container style={{display:'flex', justifyContent:'flex-end', padding:'0'}}>
                <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                    
                    {
                        permissionAdd && !permissionEdit &&
                        <Tooltip title="Tambah" style={{outline:'none'}}>
                            <IconButton aria-label="save" onClick={permissionAdd} >
                                <SaveIcon style={{width:'35px',height:'35px'}} />
                            </IconButton>
                        </Tooltip>
                    }

                    {
                        permissionEdit && modifyType &&
                        <Tooltip title="Simpan" style={{outline:'none'}}>
                            <IconButton aria-label="save" onClick={permissionEdit} >
                                <SaveIcon style={{width:'35px',height:'35px'}}/>
                            </IconButton>
                        </Tooltip>
                    }

                    {
                        permissionEdit && !modifyType &&
                        <Tooltip title="Ubah" style={{outline:'none'}}>
                            <IconButton aria-label="edit" onClick={permissionEdit}>
                                <EditIcon style={{width:'35px',height:'35px'}}/>
                            </IconButton>
                        </Tooltip>
                    }

                    {   permissionDelete &&
                        <Tooltip title="Hapus" style={{outline:'none'}}>
                            <IconButton aria-label="Delete" onClick={permissionDelete}>
                                <DeleteIcon style={{width:'35px',height:'35px'}}/>
                            </IconButton>
                        </Tooltip>
                    }

                    <Tooltip title="Kembali" style={{outline:'none'}}>
                        <IconButton aria-label="cancel" onClick={onCancel}>
                            <CancelIcon style={{width:'35px',height:'35px'}} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    }
}
  
export default withStyles(styles)(ActionComponent);