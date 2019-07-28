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
    paddingTop: theme.spacing.unit/4,
    paddingBottom: theme.spacing.unit/4,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
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

class ConfigModal extends React.Component {
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleChangeFormat = this.handleChangeFormat.bind(this);
        this.handleChangeQuality = this.handleChangeQuality.bind(this);
        this.handleAutoNumbering = this.handleAutoNumbering.bind(this);
        this.handleAutoNumberingBlur = this.handleAutoNumberingBlur.bind(this);
        this.handleAutoUpdate = this.handleAutoUpdate.bind(this);
        this.handleCustomRange = this.handleCustomRange.bind(this);
      }

  handleClose (setStorage) {
    if(setStorage){
      this.props.showConfigPanel(false);
      try {
        persistStore.set("options", JSON.stringify(this.props.options))
      } catch (error) {
        console.log("error");
      }
    } else {
      this.props.showConfigPanel(false);
    }
  };

  handleChangeFormat(e){
    this.props.changeDownloadFormat(e.target.value);
  }

  handleChangeQuality(e){
    this.props.changeDownloadQuality(e.target.value);
  }

  handleAutoNumbering(e){
    const { autoNumbering } = this.props.options;
    if(e.target.id === "autoNumberingSwitch"){
      this.props.autoNumbering({ numbering: !autoNumbering.numbering, value: autoNumbering.value})
    } else {
      let regEx = new RegExp(/^(\d){0,5}$/);
      let test = regEx.test(e.target.value);
      if(test){
        this.props.autoNumbering({ numbering: autoNumbering.numbering, value: e.target.value})
      }
    }
    
  }
    handleAutoNumberingBlur(e){
      if(e.target.value === ""){
        this.props.autoNumbering({numbering: this.props.options.autoNumbering.numbering, value: 0})
      }
    }
    handleAutoUpdate(e){
      persistStore.set("allowUpdates", !this.props.appState.updates);
      this.props.allowUpdates(!this.props.appState.updates);
    }
    handleCustomRange(e){
      this.props.enableCustomRange(!this.props.options.customRange);
    }
  render() {
    const { classes } = this.props;
    const { downloadFormat } = this.props.options;
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
          open={this.props.uiConfig.showConfig}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton  onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6"  className={classes.flex}>
                Config
              </Typography>
              <Button onClick={this.handleClose.bind(null, true)}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem className={classes.listItem}>
              <Button  onClick={()=>{
                this.props.showOpenDialog(true);
              }} variant="contained" size="small">
                  <FolderIcon className={classes.icon}/>
              </Button>
              <Typography variant="body1">
                {this.props.options.downloadFolder || "Choose folder where items will be downloaded"}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem className={classes.listItem}>
            <Typography variant="body1">Download format: </Typography>
              <Select
                value={downloadFormat.type}
                onChange={this.handleChangeFormat}
              >
                <MenuItem value="">
                  <em>Select format</em>
                </MenuItem>
                <MenuItem value="mp3">MP3</MenuItem>
                <MenuItem value="mp4">MP4</MenuItem>
              </Select>
              <Select
                  value={downloadFormat.quality}
                  onChange={this.handleChangeQuality}
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
              onChange={this.handleAutoNumbering} checked={this.props.options.autoNumbering.numbering}/>
                <Input
                  id="autoNumberingField"
                  placeholder="enter numeric value"
                  className={`${classes.dense}`}
                  onChange={this.handleAutoNumbering}
                  onBlur={this.handleAutoNumberingBlur}
                  margin="dense"
                  value={this.props.options.autoNumbering.value}
                  disabled={!this.props.options.autoNumbering.numbering}
                />
            </ListItem>
            <Divider />
            <ListItem className={classes.listItem}>
              <Typography variant="body1">Enable custom range download</Typography>
              <Switch id="customRangeSwitch" onChange={this.handleCustomRange} checked={this.props.options.customRange}/>
            </ListItem>
            <ListItem className={classes.listItem}>
              <Typography variant="body1">Allow updates (recommended):</Typography>
              <Switch id="autoUpdateSwitch" onChange={this.handleAutoUpdate} checked={this.props.appState.updates}/>
            </ListItem>
          </List>
        </Dialog>
      </div>
    );
  }
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