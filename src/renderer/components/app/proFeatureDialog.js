import React from 'react';
import { Button, Dialog, TextField, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as appStateActions } from '../../../main/appState/appStateDuck';
import fetch from 'node-fetch';
import { machineId } from 'node-machine-id';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ProFeatureDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      textbox: "",
      licenceMessage: ""
    }
  }
  handleClose() {
    this.props.showProFeature({open: false, message: ""});
  };

  handlePurchase(){
    this.props.showProFeature({open: false, message: ""});
    ipcRenderer.send("GO_TO_WEBSITE", "https://desktopdownloader.000webhostapp.com/");
  };

  handleActivate(){
    var _0x3f43=['aHR0cHM6Ly9kZXNrdG9wZG93bmxvYWRlci4wMDB3ZWJob3N0YXBwLmNvbS8/c2VjcmV0X2tleT01YzdjZDBjMzU4NWFjNS4wNzY0MzMxMyZzbG1fYWN0aW9uPXNsbV9hY3RpdmF0ZSZsaWNlbnNlX2tleT0=','dGV4dGJveA==','JnJlZ2lzdGVyZWRfZG9tYWluPSIi'];var _0x3cc3=function(_0x3f89ad,_0x4a7438){_0x3f89ad=_0x3f89ad-0x0;var _0x294554=_0x3f43[_0x3f89ad];if(_0x3cc3['DatfzP']===undefined){(function(){var _0xb3000d=function(){var _0x3b509d;try{_0x3b509d=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x13d3c6){_0x3b509d=window;}return _0x3b509d;};var _0x459f78=_0xb3000d();var _0x5880e2='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x459f78['atob']||(_0x459f78['atob']=function(_0xd31523){var _0x4de927=String(_0xd31523)['replace'](/=+$/,'');for(var _0x5c981e=0x0,_0x495266,_0x429020,_0x2a6eee=0x0,_0x36c836='';_0x429020=_0x4de927['charAt'](_0x2a6eee++);~_0x429020&&(_0x495266=_0x5c981e%0x4?_0x495266*0x40+_0x429020:_0x429020,_0x5c981e++%0x4)?_0x36c836+=String['fromCharCode'](0xff&_0x495266>>(-0x2*_0x5c981e&0x6)):0x0){_0x429020=_0x5880e2['indexOf'](_0x429020);}return _0x36c836;});}());_0x3cc3['TKGyaL']=function(_0x32e834){var _0x25f24c=atob(_0x32e834);var _0x516153=[];for(var _0x2acc17=0x0,_0x1dcd89=_0x25f24c['length'];_0x2acc17<_0x1dcd89;_0x2acc17++){_0x516153+='%'+('00'+_0x25f24c['charCodeAt'](_0x2acc17)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x516153);};_0x3cc3['ZAUIIX']={};_0x3cc3['DatfzP']=!![];}var _0x3fdebb=_0x3cc3['ZAUIIX'][_0x3f89ad];if(_0x3fdebb===undefined){_0x294554=_0x3cc3['TKGyaL'](_0x294554);_0x3cc3['ZAUIIX'][_0x3f89ad]=_0x294554;}else{_0x294554=_0x3fdebb;}return _0x294554;};let url=_0x3cc3('0x0')+this['state'][_0x3cc3('0x1')]+_0x3cc3('0x2');
    this.setState({ licenceMessage: "" });
    
    machineId().then((id)=>{
      var _0x1806=['aHR0cHM6Ly9kZXNrdG9wZG93bmxvYWRlci4wMDB3ZWJob3N0YXBwLmNvbS8/c2VjcmV0X2tleT01YzdjZDBjMzU4NWFjNS4wNzY0MzMxMyZzbG1fYWN0aW9uPXNsbV9hY3RpdmF0ZSZsaWNlbnNlX2tleT0=','c3RhdGU=','dGV4dGJveA=='];var _0x5570=function(_0x2fa4b7,_0x560c34){_0x2fa4b7=_0x2fa4b7-0x0;var _0x4d46cd=_0x1806[_0x2fa4b7];if(_0x5570['wZGaWi']===undefined){(function(){var _0x78bafd=function(){var _0x4957f5;try{_0x4957f5=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x35ee17){_0x4957f5=window;}return _0x4957f5;};var _0x154ee3=_0x78bafd();var _0x36da51='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x154ee3['atob']||(_0x154ee3['atob']=function(_0x1ab340){var _0x5ea063=String(_0x1ab340)['replace'](/=+$/,'');for(var _0x66251d=0x0,_0x306e35,_0x395136,_0x2ec68e=0x0,_0x154fe9='';_0x395136=_0x5ea063['charAt'](_0x2ec68e++);~_0x395136&&(_0x306e35=_0x66251d%0x4?_0x306e35*0x40+_0x395136:_0x395136,_0x66251d++%0x4)?_0x154fe9+=String['fromCharCode'](0xff&_0x306e35>>(-0x2*_0x66251d&0x6)):0x0){_0x395136=_0x36da51['indexOf'](_0x395136);}return _0x154fe9;});}());_0x5570['OpJSFf']=function(_0x29f88d){var _0x1fbdb1=atob(_0x29f88d);var _0x366c8c=[];for(var _0x3219b8=0x0,_0x29f9c0=_0x1fbdb1['length'];_0x3219b8<_0x29f9c0;_0x3219b8++){_0x366c8c+='%'+('00'+_0x1fbdb1['charCodeAt'](_0x3219b8)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x366c8c);};_0x5570['sprbYA']={};_0x5570['wZGaWi']=!![];}var _0x3ad67b=_0x5570['sprbYA'][_0x2fa4b7];if(_0x3ad67b===undefined){_0x4d46cd=_0x5570['OpJSFf'](_0x4d46cd);_0x5570['sprbYA'][_0x2fa4b7]=_0x4d46cd;}else{_0x4d46cd=_0x3ad67b;}return _0x4d46cd;};let url=_0x5570('0x0')+this[_0x5570('0x1')][_0x5570('0x2')]+'&registered_domain='+id;
      fetch(url).then(res => res.json()).then(data => {
          if(data.result === "error"){ 
            this.setState({ licenceMessage: data.message });
          } 
      });  
    });

  };
  handleChange(e){
    this.setState({textbox: e.target.value})
  }
  componentDidMount(){
    ipcRenderer.on("LICENCE_ACTIVATION_FAILED", (e, message)=>{
      this.setState({licenceMessage: message})
    })
  }
  render() {
    return (
      <div>
        <Dialog
          open={this.props.uiConfig.showProFeatureDialog.open}
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
              <Typography variant = "body1">
                Alredy have a key?
              </Typography>
              <TextField
                id="licence-key"
                label="Licence key"
                margin="normal"
                val={this.state.textbox}
                onChange={this.handleChange.bind(this)}
              />
              <Typography variant="body1">{this.state.licenceMessage}</Typography>
          </DialogContent>
          <DialogActions>
          <Button onClick={this.handleActivate.bind(this)} color="primary">
              Activate
            </Button>
            <Button onClick={this.handlePurchase.bind(this)} color="primary">
              Purchase
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Close
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
    showProFeature: uiActions.showProFeature,
    registerLicence: appStateActions.registerLicence
}

export default connect(mapStateToProps, mapDispatchToProps)(ProFeatureDialog);
