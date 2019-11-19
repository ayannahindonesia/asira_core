import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({

  gridDetail: {
    fontSize: '0.85em',
    marginBottom: '5px',
  },
});

class GridDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorText: '',
    };
  }

  // componentDidMount() {
  //   if(this.props.data) {
  //     this.refresh(this.props.data)
  //   }
  // }

  renderDataColumn = (dataColumn, dataLabel) => {
    let tester = '';
    
    tester = dataColumn && dataColumn.map((dataRow, index) => {
      return(
        <Grid item sm={parseInt(12 / dataColumn.length)} xs={parseInt(12 / dataColumn.length)} key={index}>
          <Grid container style={{marginBottom:'10px'}}> 
            {this.renderDataRow(dataRow, dataLabel && dataLabel[index], index)}
          </Grid>
        </Grid>
      )
    }, this)
      
    

    return tester
  }

  lengthGridLabel = (lengthLabel) => {
    let pjgLabel = 6;

    if(lengthLabel) {
      pjgLabel = lengthLabel
    }

    return pjgLabel
  }

  lengthGridValue = (lengthLabel) => {
    let pjgValue = 6;

    if(lengthLabel) {
      pjgValue = 12 - lengthLabel
    }

    return pjgValue
  }

  renderDataRow = (dataRow, dataPerLabel, indexColumn) => {
    let tester = '';

    tester = dataRow && dataRow.map((dataPerRow, index) => {
      return (
        <Grid item sm={12} xs={12} key={index}>

          <Grid container style={{marginBottom:'5px'}}> 
            <Grid item sm={this.lengthGridLabel(this.props.gridLabel && this.props.gridLabel[indexColumn])} xs={this.lengthGridLabel(this.props.gridLabel && this.props.gridLabel[indexColumn])}>
              { dataPerLabel && dataPerLabel[index] }
            </Grid>

            <Grid item sm={this.lengthGridValue(this.props.gridLabel && this.props.gridLabel[indexColumn])} xs={this.lengthGridValue(this.props.gridLabel && this.props.gridLabel[indexColumn])}>
              {dataPerRow ? `: ${dataPerRow}` : ': -'}
            </Grid>
          </Grid>

        </Grid>
      )
    }, this);
      
    return tester
  }

  render() {
    const {
      classes,
      title,
      label,
      data,
    } = this.props;
    
    return ( 
      <Grid container 
        className={classes.gridDetail} 
        style={
          {
            backgroundColor: this.props.background ? '#F7F7F7' : 'none', 
            padding: this.props.background ? '10px 0px 0px 10px' : '0px 0px 0px 10px',
            fontWeight: this.props.background ? 'bold' : 'normal',
          }
        }
      >
        {
          title && 
          <Grid item sm={12} xs={12} style={{marginBottom:'5px'}}>
            <h6> {title} </h6>
          </Grid>
        }
        

        {data && label && this.renderDataColumn(data, label)}

      </Grid>
    );
  }
}

GridDetails.propTypes = {
  title: PropTypes.string,
  label: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(GridDetails);
