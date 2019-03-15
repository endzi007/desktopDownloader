import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ProFeatureDialog extends React.Component {


  handleClose() {
    this.props.showProFeature({open: false, message: ""});
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.uiConfig.showProFeatureDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose.bind(this)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            PRO Licence Notification
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.props.uiConfig.showProFeatureDialog.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(store){
    return {
        uiConfig: store.uiConfig
    }
}

const mapDispatchToProps = {
    showProFeature: uiActions.showProFeature
}

export default connect(mapStateToProps, mapDispatchToProps)(ProFeatureDialog);
