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
    padding: theme.spacing.unit / 4,
  },
});

class SimpleSnackbar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.props.open}
          onClose={this.props.handleClose.bind(null, false)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Update available</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={()=>{ipcRenderer.send("QUIT_AND_INSTALL")}}>
              Update
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.props.handleClose.bind(null, false)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSnackbar);
