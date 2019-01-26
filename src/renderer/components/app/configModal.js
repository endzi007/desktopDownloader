import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Dialog, Select, ListItem, MenuItem, List, Divider, AppBar, Toolbar, IconButton, Typography, Slide } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import FolderIcon from '@material-ui/icons/Folder';
import { connect } from 'react-redux';
import { showOpenDialog, showConfigPanel } from '../../../main/actions/uiActions';
import { changeDownloadFormat, saveToLocalStorage, changeDownloadQuality } from '../../../main/actions/optionsActions';



const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  listItem: {
    display: "grid",
    gridTemplateColumns: "60px auto",
    gridGap: "20px"
  },
  format:{
    display: "grid",
    gridTemplateColumns: "60px 100px auto",
    gridGap: "20px"

  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ConfigModal extends React.Component {
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleChangeFormat = this.handleChangeFormat.bind(this);
        this.handleChangeQuality = this.handleChangeQuality.bind(this);
      }

  handleClose (setStorage) {
    if(setStorage){
      this.props.showConfigPanel(false);
      try {
        console.log(this.props);
        localStorage.setItem("options", JSON.stringify(this.props.options));
      } catch (error) {
        console.log(error, "my error");
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

  
  render() {
    const { classes } = this.props;
    const { downloadFormat } = this.props.options;
    let quality = downloadFormat[downloadFormat.type].map((quality)=>{
      return <MenuItem value={quality}>{quality}</MenuItem>
    });
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
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Config
              </Typography>
              <Button color="inherit" onClick={this.handleClose.bind(null, true)}>
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
              {this.props.options.downloadFolder || "Choose folder where items will be downloaded"}
            </ListItem>
            <Divider />
            <ListItem className={classes.format}>
              Download format: 
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
        store: state
    }
}

const mapDispatchToProps = {
    showOpenDialog: showOpenDialog,
    showConfigPanel: showConfigPanel,
    changeDownloadFormat: changeDownloadFormat,
    saveToLocalStorage: saveToLocalStorage,
    changeDownloadQuality: changeDownloadQuality
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ConfigModal));