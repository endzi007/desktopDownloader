import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { ipcRenderer } from 'electron';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit * 0.25,
  },
});

const SimpleSnackbar = (props)=> {
  const handleClose = (e, reason)=>{
    if(reason==="clickaway"){
      return;
    }
    props.handleClose.bind(null, false)
  }
    const { classes } = props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={props.open}
          onClose={handleClose.bind(this)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Update will be installed after program is terminated</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={props.handleClose.bind(null, false)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSnackbar);
