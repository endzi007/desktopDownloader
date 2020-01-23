import React, { useState, useEffect } from 'react';
import { Button, Dialog, TextField, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as appStateActions } from '../../../main/appState/appStateDuck';
import fetch from 'node-fetch';
import { machineId } from 'node-machine-id';
import persistStore from '../../../main/helpers/persistStore';
import { CHECK_LICENSE_ADDRESS, REGISTER_LICENSE_ADDRESS, DEACTIVATE_LICENSE_ADDRESS } from '../../../appConfig';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const ProFeatureDialog = (props)=> {
  const [ state, setState ] = useState({textbox: "", licenceMessage: "", defaultValue: "", id: ""});
  const handleClose= ()=>{
    props.showProFeature({open: false, message: "", type: "INFO"});
  };

  const handlePurchase =()=>{
    props.showProFeature({open: false, message: ""});
    ipcRenderer.send("GO_TO_WEBSITE", "https://desktopdownloader.000webhostapp.com/");
  };

  const handleActivate =()=>{
    setState({ ...state, licenceMessage: "" });
    //register license
    let url = `${REGISTER_LICENSE_ADDRESS}${state.textbox}&registered_domain=${state.id}`;
    console.log(url);
    fetch(url).then(res => res.json()).then(data => {
      if(data.result === "error"){ 
        setState({ ...state, licenceMessage: data.message });
      } else if (data.result === "success"){
        //set cookie 
        setState({ ...state, licenceMessage: data.message });
        fetch(`${CHECK_LICENSE_ADDRESS}${state.textbox}`).then(response=> response.json()).then(licenseResponse =>{
          const { email, license_key, result } = licenseResponse;
          let cookie = { email, license_key, result};
          persistStore.set("license", JSON.stringify(cookie));
          props.changeLicense(true);
        }).catch((err)=>{
            console.log("error", err);
        })
      }
    });  
  };
  const handleDeactivate =()=>{
    let url = `${DEACTIVATE_LICENSE_ADDRESS}${state.defaultValue}&registered_domain=${state.id}`;
    fetch(url).then(res => res.json()).then((response)=>{
      if(response.result === "success"){
        persistStore.delete("license");
        setState({ ...state, defaultValue: "", textbox: ""});
        props.changeLicense(false);
      }
    }).catch((err)=>{
        console.log(err);
    })
  }
  const handleChange = (e)=>{
    setState({...state, textbox: e.target.value})
  }
  useEffect(()=>{
    machineId().then((id)=>{
      setState({...state, id: id})
    });
    if(props.license.status){
      let key = JSON.parse(persistStore.get("license")).license_key;
      setState({...state, defaultValue: key});
    }
  },[])
    const { showProFeatureDialog } = props.uiConfig;
    let style = {display: showProFeatureDialog.type === "PRO"? "block": "none"}
    let buttonToDisplay;
    if(props.license.status){
      buttonToDisplay = <Button style={style} onClick={handleDeactivate.bind(this)} color="primary"> Deactivate </Button>
    } else {
      buttonToDisplay = <Button style={style} onClick={handleActivate.bind(this)} color="primary"> Activate </Button>
    }
    return (
      <div>
        <Dialog
          open={showProFeatureDialog.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose.bind(this)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
           Notification {`${showProFeatureDialog.type === "PRO"? "PRO Feature": ""}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {props.uiConfig.showProFeatureDialog.message}
            </DialogContentText>
              <Typography style={style} variant = "body1">
                Alredy have a key?
              </Typography>
              <TextField
                style={style}
                id="licence-key"
                label="Licence key"
                margin="normal"
                defaultValue={state.defaultValue}
                val={state.textbox}
                onChange={handleChange.bind(this)}
              />
              <Typography variant="body1">{state.licenceMessage}</Typography>
          </DialogContent>
          <DialogActions>
            {buttonToDisplay}
            <Button style={style} onClick={handlePurchase.bind(this)} color="primary">
              Purchase
            </Button>
            <Button onClick={handleClose.bind(this)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}

function mapStateToProps(store){
    return {
        uiConfig: store.uiConfig,
        license: store.appState.license,
        options:store.options
    }
}

const mapDispatchToProps = {
    showProFeature: uiActions.showProFeature,
    registerLicence: appStateActions.registerLicence,
    changeLicense: appStateActions.changeLicense
}

export default connect(mapStateToProps, mapDispatchToProps)(ProFeatureDialog);
