import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Dialog, Select, ListItem, MenuItem, List, Divider, AppBar, Toolbar, IconButton, Typography, Slide, Switch, Input} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FolderIcon from '@material-ui/icons/Folder';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as optionsActions } from '../../../main/options/optionsDuck';
import { creators as appStateActions } from '../../../main/appState/appStateDuck';
import persistStore from '../../../main/helpers/persistStore';



const styles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: theme.palette.background.default
  },
  flex: {
    flex: 1,
  },
  listItem: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gridGap: "20px",
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing()
  },
  format:{
    display: "grid",
    gridTemplateColumns: "60px 100px auto",
    gridGap: "20px"
  },
  dense: {

  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const ConfigModal = (props)=> {
  const handleClose = (setStorage)=> {
    if(setStorage){
      props.showConfigPanel(false);
      try {
        persistStore.set("options", JSON.stringify(props.options))
      } catch (error) {
        console.log("error in saving to local storage");
      }
    } else {
      props.showConfigPanel(false);
    }
  };

  const handleChangeFormat = (e)=>{
    props.changeDownloadFormat(e.target.value);
  }

  const handleChangeQuality = (e)=>{
    props.changeDownloadQuality(e.target.value);
  }

  const handleAutoNumbering = (e)=>{
    const { autoNumbering } = props.options;
    if(e.target.id === "autoNumberingSwitch"){
      props.autoNumbering({ numbering: !autoNumbering.numbering, value: autoNumbering.value})
    } else {
      let regEx = new RegExp(/^(\d){0,5}$/);
      let test = regEx.test(e.target.value);
      if(test){
        props.autoNumbering({ numbering: autoNumbering.numbering, value: e.target.value})
      }
    }
    
  }
    const handleAutoNumberingBlur = (e)=>{
      if(e.target.value === ""){
        props.autoNumbering({numbering: props.options.autoNumbering.numbering, value: 0})
      }
    }
    const handleAutoUpdate = (e)=>{
      console.log("allowUpdates", !props.appState.updates);
      persistStore.set("allowUpdates", !props.appState.updates);
      props.allowUpdates(!props.appState.updates);
    }
    const handleCustomRange =(e)=>{
      props.enableCustomRange(!props.options.customRange);
    }
    const { classes } = props;
    const { downloadFormat } = props.options;
    let quality = "";

    if(downloadFormat[downloadFormat.type] !== null){
      quality = downloadFormat[downloadFormat.type].map((quality, i)=>{
        return <MenuItem key={`${quality}_${i}`} value={quality}>{quality} <span style={{marginLeft: "7px", fontStyle: "italic"}}>{quality==="1080"? "Pro": ""}</span> </MenuItem>
      });
    }
    
    return (
      <div>
        <Dialog
          fullScreen
          open={props.uiConfig.showConfig}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton  onClick={handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6"  className={classes.flex}>
                Config
              </Typography>
              <Button onClick={handleClose.bind(null, true)}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem className={classes.listItem}>
              <Button  onClick={()=>{
                props.showOpenDialog(true);
              }} variant="contained" size="small">
                  <FolderIcon className={classes.icon}/>
              </Button>
              <Typography variant="body1">
                {props.options.downloadFolder || "Choose folder where items will be downloaded"}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem className={classes.listItem}>
            <Typography variant="body1">Download format: </Typography>
              <Select
                value={downloadFormat.type}
                onChange={handleChangeFormat}
              >
                <MenuItem value="">
                  <em>Select format</em>
                </MenuItem>
                <MenuItem value="mp3">MP3</MenuItem>
                <MenuItem value="mp4">MP4</MenuItem>
              </Select>
              <Select
                  value={downloadFormat.quality}
                  onChange={handleChangeQuality}
              >
                <MenuItem value="">
                  <em>Select quality</em>
                </MenuItem>
                {quality}
              </Select>
            </ListItem>
            <Divider />
            <ListItem className={classes.listItem}>
              <Typography variant="body1">Automatic numbering: </Typography>
              <Switch id="autoNumberingSwitch" 
              onChange={handleAutoNumbering} checked={props.options.autoNumbering.numbering}/>
                <Input
                  id="autoNumberingField"
                  placeholder="enter numeric value"
                  className={`${classes.dense}`}
                  onChange={handleAutoNumbering}
                  onBlur={handleAutoNumberingBlur}
                  margin="dense"
                  value={props.options.autoNumbering.value}
                  disabled={!props.options.autoNumbering.numbering}
                />
            </ListItem>
            <Divider />
            <ListItem className={classes.listItem}>
              <Typography variant="body1">Enable custom range download</Typography>
              <Switch id="customRangeSwitch" onChange={handleCustomRange} checked={props.options.customRange}/>
            </ListItem>
            <ListItem className={classes.listItem}>
              <Typography variant="body1">Allow updates (recommended):</Typography>
              <Switch id="autoUpdateSwitch" onChange={handleAutoUpdate} checked={props.appState.updates}/>
            </ListItem>
          </List>
        </Dialog>
      </div>
    );

}

ConfigModal.propTypes = {
  classes: PropTypes.object.isRequired,
  uiConfig: PropTypes.object.isRequired
};

function mapStateToProps(state){
    return {
        uiConfig: state.uiConfig,
        options: state.options,
        store: state,
        appState: state.appState
    }
}

const mapDispatchToProps = {
    showOpenDialog: uiActions.showOpenDialog,
    showConfigPanel: uiActions.showConfigPanel,
    changeDownloadFormat: optionsActions.changeDownloadFormat,
    saveToLocalStorage: optionsActions.saveToLocalStorage,
    changeDownloadQuality: optionsActions.changeDownloadQuality,
    autoNumbering: optionsActions.autoNumbering,
    allowUpdates: appStateActions.allowUpdates,
    enableCustomRange: optionsActions.enableCustomRange
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ConfigModal));