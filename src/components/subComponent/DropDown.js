import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = (theme) => ({
  selectField: {
    minWidth: 120,
    display: 'flex',
    flexWrap: 'wrap', 
    marginTop: '1em',
  },
});

class DropDown extends React.Component {
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
      fullWidth,
      label,
      data,
      id,
      labelName,
      value,
    } = this.props;
    
    return (
      <FormControl className={classes.selectField} error={!!this.state.error}>
        <NativeSelect
          value={value}
          onChange={this.props.onChange}
          fullWidth={fullWidth}
          style={{border: '1px solid #ced4da', paddingLeft:'5px'}}
          inputProps={{
            name: label,
            id: label,
          }}
          disabled={this.props.disabled}
        >
          {data &&
            Object.keys(data).length &&
            data.map((object) => {
              const idObject = object[id];
              const labelNames = labelName.split('-');
              let labelObject = '';
              if (labelNames.length > 1) {
                for (let i = 0; i < labelNames.length; i++) {
                  labelObject = `${labelObject } - ${ object[labelNames[i]]}`;
                }
                labelObject = labelObject.substr(3);
              } else {
                labelObject = object[labelNames];
              }

              return (
                <option value={idObject} key={idObject}>
                  {labelObject}
                </option>
              );
            })} 
        </NativeSelect>
        {this.state.error && (
          <FormHelperText>{this.state.error}</FormHelperText>
        )}
      </FormControl>
    );
  }
}

DropDown.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

export default withStyles(styles)(DropDown);
