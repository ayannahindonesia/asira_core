import React from 'react';
import PropTypes from 'prop-types';
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import Pagination from 'rc-pagination';
import {Link} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { formatNumber } from '../global/globalFunction';
import CheckBox from '@material-ui/core/Checkbox';


class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      page: 1,
      rowsPerPage: 10,
    };
  }

  onChecked = (id, arrayCheckedBox) => {
    let flag = false;

    for(const key in arrayCheckedBox) {
      if(arrayCheckedBox[key].toString() === id.toString()) {
        flag = true;
        break;
      }
    }

    return flag;
  }

  render() {
    return (
      <div>
        <table className="table table-hover">
          <thead className="table-warning">
            <tr >
              {
                this.props.checkBoxAction &&
                <th className="text-center" scope="col" key={'CheckBox'}>
                  <i class="fas fa-check-square"></i>
                </th>
              }
              <th className="text-center" scope="col" key={'#'}>#</th>
              {
                this.props.columnData.map((data,index) => {
                  return (
                    <th className="text-center" scope="col" key={index}>{data.label}</th>
                  );
                },this) 
              }
              <th className="text-center" scope="col">Action</th>
            </tr>     
          </thead>
          <tbody>
            {
              
              this.props.loading &&
              <tr  key="zz">
                <td align="center" colSpan={this.props.columnData.length + 2}>
                  <Loader 
                    type="Circles"
                    color="#00BFFF"
                    height="40"	
                    width="40"
                  />   
                </td>
              </tr>
            }

            {
              !this.props.loading && (!this.props.data || (this.props.data &&  this.props.data.length === 0 )) &&
              <tr  key="failed"><td align="center" colSpan={this.props.columnData.length + 2}>{'No Data'}</td></tr>
            }
          
            {
              !this.props.loading && this.props.data && this.props.data.length > 0 && this.props.data.map((dataTable,index) => {  

                if(this.props.paging || (index >= ((this.props.page-1) * (this.props.rowsPerPage)) && index <= (this.props.rowsPerPage * this.props.page) - 1 )) {   
                  return (
                    <tr key={index}> 
                      {
                        this.props.checkBoxAction &&
                        <td align="center" style={{paddingTop: '0px'}}>
                          <CheckBox
                            checked={this.onChecked(dataTable[this.props.id], this.props.arrayCheckBox)}
                            onClick={this.props.checkBoxAction}
                            value={dataTable[this.props.id]}
                            color="default"
                          />
                        </td>
                      }
                     
                      <td align="center">{this.props.paging ? (index+1 + this.props.rowsPerPage*(this.props.page-1)) : index+1}</td>
                      {
                        this.props.columnData.map((dataRow, indexRow) => {                         
                          return(
                            <td align={dataRow.numeric ? "right" : "center"} key={indexRow}>
                              {dataRow.numeric ? formatNumber(dataTable[dataRow.id]) : (dataTable[dataRow.id] || '-')}
                            </td>
                          );               
                        }, this)
                      }
                      <td align="center">
                        { this.props.permissionEdit &&
                          <Link to={`${this.props.permissionEdit}${dataTable[this.props.id]}`} className="mr-2">
                            <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                          </Link>
                        }
                        { this.props.permissionDetail &&
                          <Link to={`${this.props.permissionDetail}${dataTable[this.props.id]}`} >
                            <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                          </Link>
                        }
                      </td>
                    

                    </tr>
                  )
                } else {
                  return null
                }
              }, this)
            }
          </tbody>
        </table>
        <hr></hr>
        <nav className="navbar" style={{float:"right"}}> 

          <Pagination className="ant-pagination"  
            current={this.props.page}
            showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
            total={this.props.totalData}
            showLessItems
            pageSize={this.props.rowsPerPage}
            onChange={this.props.onChangePage}
            locale={localeInfo}
          />     
        </nav>
    
      </div>
    );
  }
}

TableComponent.propTypes = {
  paging:PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onChangePage: PropTypes.func,
  totalData: PropTypes.number,
  disabled: PropTypes.bool,
  permissionEdit: PropTypes.string,
  permissionDetail: PropTypes.string,
  id: PropTypes.string,
  loading: PropTypes.bool,
};

export default (TableComponent);
