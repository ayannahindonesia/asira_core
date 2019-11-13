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
      dataJudul: [
        'List and Detail',
        'Add',
        'Edit',
        'Approval',
      ],
      dataModul: [],
    };
  }

  componentDidMount() {
    if(this.props.data) {
      console.log(this.props.data);
      const data = this.props.data;
      const dataModul = [];
      let newModules = '';

      for(const key in data) {
        if(newModules !== data[key][this.props.modules]) {
          newModules = data[key][this.props.modules];
          dataModul.push(data[key][this.props.modules])
        }
      }

      this.setState({dataModul})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      this.setState({
        error: nextProps.error,
      });
    }

    
  }

  renderData = (object, data, classes) => {
    let tester = '';
    let dataRow = {}
    let index = 0;
    
    if(data && data.length !== 0) {
      tester = this.state.dataJudul.map((dataTable) => {
        index += 1;
        const judul = dataTable;
        let flag = false;

        for(const key in data) {
          if(data[key][this.props.modules] === object && judul === data[key][this.props.labelName]) {
            flag = true;
            dataRow = data[key];
            break;
          }
        }

        if(flag) {
          return(
            <Grid item sm={parseInt(12 / (this.state.dataJudul.length + 1)) } xs={parseInt(12 / (this.state.dataJudul.length + 1)) } key={dataRow[this.props.id]} style={{textAlign: 'center'}}>
              <FormControlLabel
                className={(this.props.vertical)?classes.formItem : null}
                key={dataRow[this.props.id]}
                labelPlacement={this.props.labelPlacement}
                control={                      
                  <CheckBox
                    checked={this.props.onChecked(dataRow[this.props.id])}
                    onChange={this.props.onChange}
                    value={dataRow[this.props.id].toString().trim()}
                    color="default"
                  />                     
                }
                disabled={this.props.disabled}
              />
            </Grid>
          ) 
        } else {
          return(
            <Grid item sm={parseInt(12 / (this.state.dataJudul.length + 1)) } xs={parseInt(12 / (this.state.dataJudul.length + 1)) } key={index} style={{textAlign: 'center'}}>
              <FormControlLabel
                className={(this.props.vertical)?classes.formItem : null}
                key={index}
                labelPlacement={this.props.labelPlacement}
                control={                      
                  <CheckBox
                    checked={false}
                    value={index.toString().trim()}
                    color="default"
                    indeterminate
                  />                     
                }
                disabled
              />
            </Grid>
          ) 
        }
      }, this)
      
    }

    return tester
  }

  render() {
    const {
      classes,
      label,
      data,
      modulesName,
    } = this.props;
    
    return (
      <FormControl className={classes.FormControl} error={!!this.state.error}>
        <FormLabel component="legend" style={{color: 'black'}}><h4>{ label }</h4></FormLabel>  

        { data && data.length !== 0 &&
          <FormGroup row >
            <Grid container> 
              <Grid item sm={parseInt(12 / (this.state.dataJudul.length + 1)) + 1} xs={parseInt(12 / (this.state.dataJudul.length + 1))} key={'menu'}>
                <h6><b>{modulesName}</b></h6>
              </Grid>   
              {
                this.state.dataJudul.map((data) => {
                  return (
                    <Grid item sm={parseInt(12 / (this.state.dataJudul.length + 1))} xs={parseInt(12 / (this.state.dataJudul.length + 1))} key={data} style={{textAlign:'center'}}>
                      <h6><b>{data}</b></h6>
                    </Grid>
                  )
                
                }, this)
              } 
            </Grid>
          </ FormGroup>
        }

        {
          data && data.length !== 0 && this.state.dataModul && this.state.dataModul.length !== 0 && this.state.dataModul.map((object) => {
            
            return(
              <Grid container key={object}> 
                <Grid item sm={parseInt(12 / (this.state.dataJudul.length + 1)) + 1} style={{paddingTop:'10px'}}>
                  <h6>{object}</h6> 
                </Grid>
                {
                  this.renderData(object, data, classes)             
                }
              </Grid>
            )
          }, this)
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
