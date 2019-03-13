import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Card, Typography, CardContent, CardMedia, LinearProgress, IconButton, CircularProgress } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import PauseIcon from '@material-ui/icons/Pause';
<<<<<<< HEAD
import ReplayIcon from '@material-ui/icons/Replay';

=======
>>>>>>> e351e67c766bf51b8c9f450af2650a2938d8ef55
import { FadeLoader  } from 'react-spinners';
import { ipcRenderer } from 'electron';

const styles = (theme) => ({
    card: { 
        display: "flex",
        marginBottom: "5px",
        flexGrow: "1",
        maxHeight: "60px",
        position: "relative"
    },
    cover: {
        minWidth: "120px" 
      },
    content: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignContent: "center",
        padding: "0 20px"
    },
    progress:{
        position: "absolute",
        bottom: 0,
        width: "100%"
    },
    margin: {
        padding: 0,
        width: "15px",
    },
    FadeLoader:{
        borderColor: theme.palette.primary.dark
    },
    divSt: {
        width: "20px",
        height: "20px",
        position: "relative",
        padding: "0",
        marginRight: "10px"
    },
    stateToDisplay: {
        left: "-20px"
    },
    buttonToDisplay: {
        position: "absolute", 
        top: "1px",
        left: "10px"
    }
});

<<<<<<< HEAD
const SingleVideo = ({ thumbnail, title, url, downloaded, handleDelete, handlePauseResume, classes, duration, iPosition, theme, status})=>{
    let modifiedTitle = title.length > 47 ? `${title.substr(0, 44)}...`: title;
    let buttonToDisplay = <IconButton className={classes.buttonToDisplay} aria-label="Delete"><DeleteIcon onClick ={handleDelete.bind(null, url)} fontSize="small" /></IconButton>
    let stateToDisplay = ""; 
    switch (status) {
        case "DONE":
            stateToDisplay = <IconButton className={classes.stateToDisplay} aria-label="Done"><DoneIcon /></IconButton>
            buttonToDisplay = <IconButton className={classes.buttonToDisplay} aria-label="Delete"><DeleteIcon onClick ={handleDelete.bind(null, url)} fontSize="small" /></IconButton>
            break;
        case "CONVERTING": 
            stateToDisplay = <FadeLoader css={{transform: "scale(0.5)", transform: "scale(0.5)", position: "absolute!important", top: "7px!important", left: "-20px!important"}} color={theme.palette.secondary.main} loading={true}/>;
            break; 
        case "DOWNLOADING":
            buttonToDisplay = <IconButton className={classes.buttonToDisplay} onClick ={handlePauseResume.bind(null, true, iPosition)} aria-label="Delete"><PauseIcon fontSize="small" /></IconButton>
            break; 
        case "PAUSED":
            buttonToDisplay = <IconButton className={classes.buttonToDisplay} onClick ={handlePauseResume.bind(null, false, iPosition)} aria-label="Delete"><ReplayIcon fontSize="small" /></IconButton>
            break; 
        default:
            break;
    }

=======
const SingleVideo = ({ thumbnail, title, url, downloaded, handleDelete, classes, duration, iPosition, theme, status})=>{
    let modifiedTitle = title.length > 47 ? `${title.substr(0, 44)}...`: title;
    let buttonToDisplay; 
    let statusToDisplay;

    if(status === "downloading"){
        buttonToDisplay = <IconButton style={{ position: "absolute"}} aria-label="Done" onClick={()=>{ ipcRenderer.send("PAUSE_VIDEO", iPosition)}}><PauseIcon /></IconButton>
    } else {
        buttonToDisplay = <IconButton style={{ position: "absolute"}} aria-label="Delete"><DeleteIcon onClick ={handleDelete.bind(null, url)} fontSize="small" /></IconButton> 
    }
    if(status === "converting"){
        statusToDisplay = <FadeLoader css={{
            transform: "scale(0.5)", 
            position: "absolute!important", 
            top: "7px!important", 
            left: "-20px!important",
            display: status === "converting"? "block": "none"
            }} 
            color={theme.palette.secondary.main} 
            loading={true}
        />
    } else if (status === "converting"){
        statusToDisplay = <DoneIcon />;
    } else {
        statusToDisplay = "";
    }
>>>>>>> e351e67c766bf51b8c9f450af2650a2938d8ef55
    return (
    <div style={{display: "grid", gridTemplateColumns: "15px auto"}}>
        <Typography style={{alignSelf: "center"}} variant="subheading" color="inherit">{`${iPosition+1}.`}</Typography>
        <Card className={classes.card}>
            <LinearProgress className={classes.progress} color="secondary" variant="determinate" value={downloaded} />
<<<<<<< HEAD
            <CardMedia className={classes.cover} image={thumbnail} title={title} onClick={()=>{ ipcRenderer.send("pauseVideo", iPosition)}}/>
=======
            <CardMedia className={classes.cover} image={thumbnail} title={title} />
>>>>>>> e351e67c766bf51b8c9f450af2650a2938d8ef55
            <CardContent className={classes.content}>
                <div>
                    <Typography>{modifiedTitle}</Typography>
                    <Typography>{duration}</Typography>
                </div>
                <div className={classes.divSt}>
<<<<<<< HEAD

                    {stateToDisplay}
=======
                    {statusToDisplay}
>>>>>>> e351e67c766bf51b8c9f450af2650a2938d8ef55
                    {buttonToDisplay} 
                </div>
            </CardContent>
        </Card>
    </div>
     
    );
};

export default withStyles(styles, {withTheme: true})(SingleVideo)