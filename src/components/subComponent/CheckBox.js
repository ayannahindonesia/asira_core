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
        'List',
        'Add',
        'Edit',
        'Approval',
        'Disburse',
        'Download',
      ],
      label: this.props.label,
      dataModul: [],
    };
  }

  componentDidMount() {
    if(this.props.data) {
      this.refresh(this.props.data)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(this.props.data !== nextProps.data) {
      this.refresh(nextProps.data)
    }

    if (nextProps.label !== this.props.label) {
      this.setState({
        label: nextProps.label,
      });
    }

    if (nextProps.error !== this.props.error) {
      this.setState({
        error: nextProps.error,
      });
    }
  }

  refresh = (data) => {
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

  lengthGrid = () => {
    let pjgGrid = parseInt(12 / (this.state.dataJudul.length + 1))
    return pjgGrid;
  }

  lengthJudul = () => {
    let pjgGrid = 12 - (this.lengthGrid() * this.state.dataJudul.length);
    if(pjgGrid > 3) {
      pjgGrid = 4
    }
    return pjgGrid;
  }

  renderData = (data, classes) => {
    const judul = this.state.dataJudul;
    let tester = '';
    
    if(data && data.length !== 0) {
      tester = data.map((dataPerMenu) => {

        let dataDesignPerMenu = '';
        const dataAction = dataPerMenu.action || {};

        dataDesignPerMenu = judul.map((perJudul, index) => {
          let flag = false;
          let dataTable = {};

          for(const keyAction in dataAction) {
            if(perJudul.toLowerCase().includes(keyAction)) {
              dataTable = `${dataPerMenu.label}-${dataAction[keyAction]}`;
              flag = true;
              break;
            }
          }

          if(flag) {
            
            return(
              <Grid item sm={this.lengthGrid() } xs={this.lengthGrid() } key={dataTable} style={{textAlign: 'center'}}>
                <FormControlLabel
                  className={(this.props.vertical)?classes.formItem : null}
                  key={dataTable}
                  labelPlacement={this.props.labelPlacement}
                  control={                      
                    <CheckBox
                      checked={this.props.onChecked(dataTable)}
                      onChange={this.props.onChange}
                      value={dataTable.toString().trim()}
                      color="default"
                    />                     
                  }
                  disabled={this.props.disabled}
                />
              </Grid>
            ) 
          } else {
            return(
              <Grid item sm={this.lengthGrid() } xs={this.lengthGrid() } key={index} style={{textAlign: 'center'}}>
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
        

        return (
          <Grid container key={dataPerMenu.label}> 
            <Grid item sm={this.lengthJudul()} style={{paddingTop:'10px'}}>
              <h6>{dataPerMenu.label}</h6> 
            </Grid>
            {dataDesignPerMenu}
          </Grid>
        );
      }, this)
      
    }

    return tester
  }

  render() {
    const {
      classes,
      data,
      modulesName,
    } = this.props;
    
    return (
      <FormControl className={classes.FormControl} error={!!this.state.error}>
        <FormLabel component="legend" style={{color: 'black'}}><h3>{ this.state.label }</h3></FormLabel>  

        { data && data.length !== 0 &&
          <FormGroup row >
            <Grid container> 
              <Grid item sm={this.lengthJudul()} xs={this.lengthJudul()} key={'menu'}>
                <h5><b>{modulesName}</b></h5>
              </Grid>   
              {
                this.state.dataJudul.map((data) => {
                  return (
                    <Grid item sm={this.lengthGrid()} xs={this.lengthGrid()} key={data} style={{textAlign:'center'}}>
                      <h5><b>{data}</b></h5>
                    </Grid>
                  )
                
                }, this)
              } 
            </Grid>
          </ FormGroup>
        }

        {
          data && data.length !== 0 && 
          this.renderData(data, classes)
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
