import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, DialogActions, Button, DialogContent} from '@material-ui/core';
import {connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';

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

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [

];


function mapStateToProps(state){
    return {
      show: state.uiConfig.showChannels
    }
}
const mapDispatchToProps = {
    showChannelsDialog: uiActions.showChannelsDialog
}
function SimpleTable(props) {
  const { classes } = props;
  const handleClose = ()=>{
    props.showChannelsDialog(false);
  }
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
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </Paper>
            </DialogContent>
            <DialogActions>
              <Button>Save</Button>
              <Button onClick={()=>{props.showChannelsDialog(false)}}>Close</Button>
            </DialogActions>
        </Dialog>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SimpleTable));
