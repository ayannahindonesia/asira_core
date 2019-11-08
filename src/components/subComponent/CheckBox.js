import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import CheckBox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({

  FormControl: {
    display: 'flex',
  },
  formItem :{
    width:'100%',
  }
});

class CheckBoxClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      this.setState({
        error: nextProps.error,
      });
    }
  }

  render() {
    const {
      classes,
      label,
      data,
      id,
      labelName,
      modules,
      modulesName,
      labelPlacement,
    } = this.props;

    let newModules = '';
    let dataJudul = 0;
    
    return (
      <FormControl className={classes.FormControl} error={!!this.state.error}>
        <FormLabel component="legend" style={{color: 'black'}}><h4>{ label }</h4></FormLabel>  
        {
          <FormGroup row >
            <Grid container>              
              {
                data && data.length !== 0 && data.map((object) => {
                  if(dataJudul < 4) {
                    dataJudul += 1
                    if (dataJudul === 1) {
                      return(
                        <Grid item sm={6} xs={12} key={object[id]}>
                          <Grid container>
                            <Grid item sm={7} xs={12} style={{paddingTop:'5vh'}}>
                              <h6>{modulesName}</h6>
                            </Grid>
                            <Grid item sm={5} xs={12} 
                              style={
                                {
                                  paddingLeft: object[labelName].trim().length < 15  ? '3vh' : '0vh',
                                  paddingRight: object[labelName].trim().length >= 15  ? '3vh' : '0vh',
                                  paddingTop:'5vh', 
                                  textAlign: 'left'
                                }
                              }
                            >
                              <h6>{object[labelName]}</h6>
                            </Grid>
                          </Grid>  
                        </Grid>
                        
                      )
                    } 

                    return(
                      <Grid item sm={2} xs={12} key={object[id]}
                        style={
                          {
                            paddingLeft: object[labelName].trim().length < 15 ? (object[labelName].trim().length < 5 ?'3vh' : '1vh') : '0vh',
                            paddingTop:'5vh', 
                            textAlign: 'left'
                          }
                      }>
                        <h6>{object[labelName] || ''}</h6>
                      </Grid>
                    )  
                  } 

                  return 'No Data'
                }, this)
              }
            </Grid>
          </FormGroup>
        }

        {
          <Grid container>
            <FormGroup row >
            {
              data && data.length !== 0 && data.map((object) => {
                
                if(newModules !== object[modules]) {
                  newModules = object[modules];
                  return (
                    <Grid item sm={6} xs={12} key={object[id]}>
                      <Grid container>
                        <Grid item sm={7} xs={12} style={{paddingTop:'2vh'}}>
                          <h6>{newModules}</h6>
                        </Grid>
                        <Grid item sm={5} xs={12} >
                          <FormControlLabel
                            className={(this.props.vertical)?classes.formItem:""}
                            key={object[id]}
                            labelPlacement={labelPlacement}
                            control={                      
                              <CheckBox
                                checked={this.props.onChecked(object[id])}
                                onChange={this.props.onChange}
                                value={object[id].toString().trim()}
                                color="default"                      
                              />                     
                            }
                            disabled={this.props.disabled}
                            // label={object[labelName]}
                          />
                        </Grid>
                      </Grid>
                    </Grid>                       
                  )
                } else {
                  return (
                    <Grid item sm={2} xs={12} key={object[id]}>
                      <FormControlLabel
                        className={(this.props.vertical)?classes.formItem:""}
                        key={object[id]}
                        labelPlacement='top'
                        control={                      
                          <CheckBox
                            checked={this.props.onChecked(object[id])}
                            onChange={this.props.onChange}
                            value={object[id].toString().trim()}
                            color="default"
                          />                     
                        }
                        disabled={this.props.disabled}
                        // label={object[labelName]}
                      />
                    </Grid>
                  )
                }
              }, this)
            }

            </FormGroup>
          </Grid>
        }
        {
          (!data || (data && data.length === 0)) &&
          <FormGroup row >
            No Data
          </FormGroup>
        }
        

        {this.state.error && (
          <FormHelperText>{this.state.error}</FormHelperText>
        )}
      </FormControl>
    );
  }
}

CheckBoxClass.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  modules: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onChecked: PropTypes.func,
  disabled: PropTypes.bool,
  vertical: PropTypes.bool,
  error: PropTypes.string,
  modulesName: PropTypes.string,
  labelPlacement: PropTypes.string,
};

export default withStyles(styles)(CheckBoxClass);
