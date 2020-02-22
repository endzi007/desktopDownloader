import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, DialogActions, Button, DialogContent} from '@material-ui/core';
import {connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as optionActions } from '../../../main/options/optionsDuck';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    width: "100%",
  },
});

function mapStateToProps(state){
    return {
      show: state.uiConfig.showChannels,
      channels: state.options.channels
    }
}
const mapDispatchToProps = {
    showChannelsDialog: uiActions.showChannelsDialog,
    updateChannels: optionActions.updateChannels
}
function SimpleTable(props) {
  const { classes } = props;
  const handleClose = ()=>{
    props.showChannelsDialog(false);
  }
  const [rows, setRows] = useState([]);

  useEffect(()=>{
      setRows(...props.channels);
  },[]);

  useEffect(()=>{
    props.updateChannels(rows);
  },[rows]);

  return (
      <Dialog 
        open={props.show}
        onClose={handleClose}
        fullScreen
      >
        <DialogContent>
         <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">URL</TableCell>
                    <TableCell align="right">Start Value (sec)</TableCell>
                    <TableCell align="right">End Value (sec)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map(row => (
                    <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.url}</TableCell>
                    <TableCell align="right">{row.startValue}</TableCell>
                    <TableCell align="right">{row.endValue}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>{setRows((oldRows)=>{
                  oldRows.push()
              })}}>Save</Button>
              <Button onClick={()=>{props.showChannelsDialog(false)}}>Close</Button>
            </DialogActions>
        </Dialog>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SimpleTable));
