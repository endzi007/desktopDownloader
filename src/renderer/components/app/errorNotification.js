import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  close: {
    padding: theme.spacing.unit * 0.25,
  },
});

const SimpleSnackbar = (props)=> {
    const { classes } = props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={props.error.status}
          onClose={props.closeErrorNotification}
        >
        <SnackbarContent
          className={classes.error}
          aria-describedby="client-snackbar"
          
          message={
            <span id="client-snackbar" className={classes.message}>
              
              {props.error.message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={props.closeErrorNotification}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        </Snackbar>
      </div>
    );
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSnackbar);


