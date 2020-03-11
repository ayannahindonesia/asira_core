import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width:'100%',
    height:'95%',
    '& > *': {
      width:'100%',
      height:'95%',
    },
  },
  input: {
    width:'500px',
    display: 'none',
  },
}));

export default function UploadButtons(props) {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <input
        accept="image/*"
        className={classes.input}
        id="outlined-button-file"
        type="file"
        onChange={props.onChange}
      />
      <label htmlFor="outlined-button-file">
        <Button variant="outlined" component="span" fullWidth style={{height:'inherit'}}>
          {
            !props.file &&
            <img src={require('./../../support/img/default.png')} alt={'-'} style={{maxWidth:'80%', maxHeight:'80%'}} />
          }

          {
            props.file &&
            props.file.name
          }
          
        </Button>
      </label>
    </Grid>
  );
}