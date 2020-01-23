import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import WarningIcon from '@material-ui/icons/Warning';
import AddListIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import DetailsIcon from '@material-ui/icons/Details';
import ApprovalIcon from '@material-ui/icons/CheckCircle';
import RejectIcon from '@material-ui/icons/DeleteForever';

class SubTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      order,
      orderBy,
      rowCount,
      columnData,
      actionColumn,
      sortBy,
    } = this.props;

    return (
      <TableHead>
        <TableRow style={{ height: '30px', backgroundColor: 'orange' }}>
          {columnData.map(
            (column) => (
              <TableCell
                align={'center'}
                key={column.id}
                numeric={column.numeric.toString()}
                boolean={column.boolean}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    <h5 style={{color: 'black'}}>{column.label}</h5>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
          {actionColumn && (
            <TableCell style={{ textalign: 'center' }}>Action</TableCell>
          )}
        </TableRow>
      </TableHead>
    );
  }
}

SubTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnData: PropTypes.array.isRequired,
  actionColumn: PropTypes.bool,
  sortBy: PropTypes.string,
};

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  // highlight:
  //   theme.palette.type === 'light'
  //     ? {
  //       color: theme.palette.secondary.main,
  //       backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  //     }
  //     : {
  //       color: theme.palette.text.primary,
  //       backgroundColor: theme.palette.secondary.dark,
  //     },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
    fontSize: '18px',
    width: '50vw',
    fontWeight: '800',
  },
});

let SubTableToolbar = (props) => {
  const { classes, onAddPressed, onSubmitPressed, headerTitle } = props;

  return (
    <Toolbar className={classes.root}>
      <div>
        <Typography  id="tableTitle" className={classes.title}>
          {headerTitle}
        </Typography>
      </div>
      <div className={classes.spacer} />
      {onAddPressed && (
        <div className={classes.actions}>
          <Tooltip title="Add New Data">
            <IconButton
              aria-label="Add New Data"
              onClick={onAddPressed}
            // style={{ width: '20px', height: '20px' }}
            >
              <AddListIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {onSubmitPressed && (
        <div className={classes.actions}>
          <Tooltip title="Submit Data">
            <IconButton
              aria-label="Submit Data"
              onClick={onSubmitPressed}
            // style={{ width: '20px', height: '20px' }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
};

SubTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  headerTitle: PropTypes.string,
  onAddPressed: PropTypes.func,
};

SubTableToolbar = withStyles(toolbarStyles)(SubTableToolbar);

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: '100%',
  },
  tableWrapper: {
    overflowX: 'auto',
    padding: '0px 15px 0px 15px',
    position: 'relative',
    top: '-1vh',
  },
  dataNotFound: {
    textalign: 'center',
    color: '#aaa',
  },
  dataNotFoundIcon: {
    fontSize: '50px',
  },
  block: {
    display: 'block',
  },
  tableRow: {
    height: '24px',
  },
  tableRowClicked: {
    height: '24px',
    cursor: 'pointer',
  },
  tableRowPagination: {
    minHeight: '45px',
    fontSize: '0.75rem',
  },
});

class SubTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: props.data,
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  // isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      let newData = nextProps.data;
      const sortBy = nextProps.sortBy;
      if (sortBy && nextProps.data && nextProps.data.length > 0) {
        newData = nextProps.data.sort((a, b) => b[sortBy] - a[sortBy]);
        if (sortBy === 'createDate' || 'updateDate') {
          newData = nextProps.data.sort(
            (a, b) => new Date(b[sortBy]) - new Date(a[sortBy])
          );
        }
      }
      this.setState({
        data: newData,
      });
    }
  }

  isValidDate = (date) =>
    date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date);

  converterDateTime = (dateTime) => {
    const newDate = new Date(dateTime);
    const formatDate = newDate.getTime() - 7 * 60 * 60 * 1000;
    const finalDate = new Date(formatDate);

    return finalDate;
  };

  render() {
    const {
      classes,
      onAddFunction,
      onSubmitFunction,
      onApproveFunction,
      onRejectFunction,
      headerTitle,
      search,
      disabled,
      columnData,
      idKey,
      onDeleteFunction,
      onViewFunction,
      disablePaging,
      mapping,
      mappingBoolean,
      sortBy,
      onRowClickedFunction,
    } = this.props;
    const { data, order, orderBy } = this.state;
    // If page from props
    let page = this.props.page;
    if (!page) {
      page = this.state.page;
    }
    // If rows per page from props
    const rowsPerPage = disablePaging ? data.length : this.state.rowsPerPage;
    // If total length from props
    let totalDataLength = this.props.totalDatalength || 0;
    if (!totalDataLength && this.props.data) {
      totalDataLength = this.props.data.length;
    }
    if (totalDataLength === undefined) {
      totalDataLength = 0;
    }
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, totalDataLength - page * rowsPerPage);
    let action = !!(onDeleteFunction || onViewFunction || onApproveFunction || onRejectFunction);
    if (onRowClickedFunction) {
      action = false;
    }
    return (
      <Paper className={classes.root}>
        <SubTableToolbar
          headerTitle={headerTitle}
          onAddPressed={onAddFunction}
          onSubmitPressed={onSubmitFunction}
        />
        <div className={classes.tableWrapper}>
          {search && search}
          <Table className={classes.table} aria-labelledby="tableTitle">
            <SubTableHead
              order={order}
              orderBy={orderBy}
              rowCount={totalDataLength}
              onRequestSort={this.handleRequestSort}
              columnData={columnData}
              actionColumn={action}
            />
            <TableBody style={{textalign:'center !important'}}>
              {data &&
                data.length > 0 &&
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n, index) => {
                    // const isSelected = this.isSelected(n.id);
                    if (!disabled && onRowClickedFunction) {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          // aria-checked={isSelected}
                          textalign='center'
                          tabIndex={-1}
                          key={index}
                          // selected={isSelected}
                          onClick={() => {
                            onRowClickedFunction(n[idKey]);
                          }}
                          disabled={disabled}
                          className={
                            onRowClickedFunction
                              ? classes.tableRowClicked
                              : classes.tableRow
                          }
                        >
                          {Object.keys(columnData).map((key, i) => {
                            const currentKey = columnData[key].id;
                            let currentValue = n[columnData[key].id];
                            if (
                              mapping &&
                              mapping[currentKey] &&
                              mapping[currentKey][currentValue]
                            ) {
                              currentValue = mapping[currentKey][currentValue];
                            }
                            // else if (
                            //   mappingBoolean &&
                            //   mappingBoolean[currentKey] &&
                            //   mappingBoolean[currentKey][currentValue]
                            // ) {
                            // currentValue = mapping[currentKey][currentValue];
                            // Check if key exist
                            //   currentValue =
                            //     mappingBoolean[currentKey][currentValue];
                            // }

                            // For boolean type
                            /* if (mappingBoolean) {
                              const exist = false;
                              const keyNotFound = "";
                              Object.keys(mappingBoolean).map(dataKey => {
                                if (dataKey === currentKey) {
                                  if (currentValue === undefined) {
                                    currentValue = false;
                                  }
                                  currentValue =
                                    mappingBoolean[currentKey][currentValue];
                                }
                              });
                            }*/
                            if (columnData[key].time) {
                              const moment = require('moment');
                              const newDate = this.converterDateTime(
                                currentValue
                              );
                              const date = `${moment(newDate).format(
                                'DD MMM YYYY'
                              )} ${newDate.toLocaleTimeString()}`;

                              return (
                                <TableCell align={'center'} padding="none" key={i}>
                                  {date}
                                </TableCell>
                              );
                            } else if (columnData[key].date) {
                              const moment = require('moment');

                              let date = '';
                              if (currentValue) {
                                date = moment(currentValue).format(
                                  'DD MMM YYYY'
                                );
                              }
                              return (
                                <TableCell align={'center'} padding="none" key={i}>
                                  {date}
                                </TableCell>
                              );
                            } else if (columnData[key].boolean) {
                              return (
                                <TableCell align={'center'} padding="none" key={i}>
                                  {currentValue ? 'Yes' : 'No'}
                                </TableCell>
                              );
                            } else if (!columnData[key].numeric) {
                              return (
                                <TableCell align={'center'} padding="none" key={i}>
                                  {currentValue}
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell align={'center'} numeric={columnData[key].numeric} key={i}>
                                {currentValue}
                              </TableCell>
                            );
                          })}
                          {(onDeleteFunction || onViewFunction) && (
                            <TableCell style={{ textalign: 'center' }}>
                              {onViewFunction && (
                                <Tooltip
                                  title="View"
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                  }}
                                  placement="left-end"
                                >
                                  <IconButton
                                    aria-label="View"
                                    onClick={() => {
                                      onViewFunction(n[idKey]);
                                    }}
                                    style={{ width: '20px', height: '20px' }}
                                  >
                                    <DetailsIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {onDeleteFunction && (
                                <Tooltip
                                  title="Delete"
                                  style={{ width: '20px', height: '20px' }}
                                  placement="right-end"
                                >
                                  <IconButton
                                    aria-label="Delete"
                                    onClick={() => {
                                      onDeleteFunction(n[idKey]);
                                    }}
                                    style={{ width: '20px', height: '20px' }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    }
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        // aria-checked={isSelected}
                        tabIndex={-1}
                        textalign='center'
                        key={index}
                        // selected={isSelected}
                        // onClick={() => {
                        //   onRowClickedFunction(n[idKey]);
                        // }}
                        disabled={disabled}
                        className={
                          onRowClickedFunction
                            ? classes.tableRowClicked
                            : classes.tableRow
                        }
                      >
                        {Object.keys(columnData).map((key, i) => {
                          const currentKey = columnData[key].id;
                          let currentValue = n[columnData[key].id];
                          if (
                            mapping &&
                            mapping[currentKey] &&
                            mapping[currentKey][currentValue]
                          ) {
                            currentValue = mapping[currentKey][currentValue];
                          }
                          // else if (
                          //   mappingBoolean &&
                          //   mappingBoolean[currentKey] &&
                          //   mappingBoolean[currentKey][currentValue]
                          // ) {
                          // currentValue = mapping[currentKey][currentValue];
                          // Check if key exist
                          //   currentValue =
                          //     mappingBoolean[currentKey][currentValue];
                          // }

                          // For boolean type
                          /* if (mappingBoolean) {
                            const exist = false;
                            const keyNotFound = '';
                            Object.keys(mappingBoolean).map((dataKey) => {
                              if (dataKey === currentKey) {
                                if (currentValue === undefined) {
                                  currentValue = false;
                                }
                                currentValue =
                                  mappingBoolean[currentKey][currentValue];
                              }
                            });
                          }*/
                          if (columnData[key].time) {
                            const moment = require('moment');
                            const newDate = this.converterDateTime(
                              currentValue
                            );
                            const date = `${moment(newDate).format(
                              'DD MMM YYYY'
                            )} ${newDate.toLocaleTimeString()}`;

                            return (
                              <TableCell align={'center'} padding="none" key={i}>
                                {date}
                              </TableCell>
                            );
                          } else if (columnData[key].date) {
                            const moment = require('moment');

                            let date = '';
                            if (currentValue) {
                              date = moment(currentValue).format('DD MMM YYYY');
                            }
                            return (
                              <TableCell align={'center'} padding="none" key={i}>
                                {date}
                              </TableCell>
                            );
                          } else if (columnData[key].boolean) {
                            return (
                              <TableCell align={'center'} padding="none" key={i}>
                                {currentValue ? 'Yes' : 'No'}
                              </TableCell>
                            );
                          } else if (!columnData[key].numeric) {
                            return (
                              <TableCell align={'center'} padding="none" key={i}>
                                {currentValue}
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell align={'center'} numeric={columnData[key].numeric} key={i}>
                              {currentValue}
                            </TableCell>
                          );
                        })}
                        {(onDeleteFunction || onViewFunction || onApproveFunction || onRejectFunction) && (
                          <TableCell align={'center'} style={{ textalign: 'center' }}>
                            {onViewFunction && (
                              <Tooltip
                                title="View"
                                style={{
                                  width: '20px',
                                  height: '20px',
                                }}
                                placement="left-end"
                              >
                                <IconButton
                                  aria-label="View"
                                  onClick={() => {
                                    onViewFunction(n[idKey]);
                                  }}
                                  style={{ width: '20px', height: '20px' }}
                                >
                                  <DetailsIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onApproveFunction && (
                              <Tooltip
                                title="Approve"
                                style={{ width: '20px', height: '20px' }}
                                placement="left-end"
                              >
                                <IconButton
                                  aria-label="Approve"
                                  onClick={() => {
                                    onApproveFunction(n[idKey]);
                                  }}
                                  style={{ width: '20px', height: '20px' }}
                                >
                                  <ApprovalIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onRejectFunction && (
                              <Tooltip
                                title="Reject"
                                style={{ width: '20px', height: '20px' }}
                                placement="right-end"
                              >
                                <IconButton
                                  aria-label="Reject"
                                  onClick={() => {
                                    onRejectFunction(n[idKey]);
                                  }}
                                  style={{ width: '20px', height: '20px' }}
                                >
                                  <RejectIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onDeleteFunction && (
                              <Tooltip
                                title="Delete"
                                style={{ width: '20px', height: '20px' }}
                                placement="right-end"
                              >
                                <IconButton
                                  aria-label="Delete"
                                  onClick={() => {
                                    onDeleteFunction(n[idKey]);
                                  }}
                                  style={{ width: '20px', height: '20px' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
              {emptyRows === rowsPerPage && (
                <TableRow>
                  <TableCell align={'center'} colSpan={12} className={classes.dataNotFound}>
                    <div>
                      <WarningIcon className={classes.dataNotFoundIcon} />
                    </div>
                    <div>
                      <span>Data Not Found</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {disablePaging && <div style={{ paddingBottom: '20px' }} />}
        {!disablePaging && (
          <TablePagination
            component="div"
            count={totalDataLength}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            className={classes.tableRowPagination}
          />
        )}
      </Paper>
    );
  }
}

SubTable.propTypes = {
  classes: PropTypes.object.isRequired,
  onAddFunction: PropTypes.func,
  onSubmitFunction: PropTypes.func,
  onApproveFunction: PropTypes.func,
  onRejectFunction: PropTypes.func,
  headerTitle: PropTypes.string,
  columnData: PropTypes.array.isRequired,
  onDeleteFunction: PropTypes.func,
  onViewFunction: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  totalDataLength: PropTypes.number,
  disablePaging: PropTypes.bool,
  disabled: PropTypes.bool,
  mapping: PropTypes.object,
  mappingBoolean: PropTypes.object,
  sortBy: PropTypes.string,
  onRowClickedFunction: PropTypes.func,
};

export default withStyles(styles)(SubTable);
