/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Card, Typography, CardContent, CardMedia, LinearProgress, IconButton } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import StopIcon from '@material-ui/icons/Stop';
import ReplayIcon from '@material-ui/icons/Replay';
import CustomRange from './customRange';

import { FadeLoader  } from 'react-spinners';

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
        top: 0,
        width: "100%",
        height: "100%",
    },
    margin: {
        padding: 0,
        width: "15px",
    },
    FadeLoader:{
        borderColor: theme.palette.primary.dark
    },
    colorSecondary: {
        background: "none"
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
    },
    dragNumber:{
        alignSelf: "center",
        cursor: "all-scroll"
    }
});

const SingleVideo = React.memo(({ 
    thumbnail, 
    title, 
    url, 
    downloaded, 
    handleDelete, 
    handlePauseResume, 
    classes, 
    duration, 
    iPosition, 
    theme, 
    status, 
    setDragAndDropMode, 
    setFromAndTo
})=>{
    let modifiedTitle = title.length > 47 ? `${title.substr(0, 44)}...`: title;
    let buttonToDisplay = <IconButton onClick ={handleDelete.bind(null, url)} className={classes.buttonToDisplay} aria-label="Delete"><DeleteIcon fontSize="small" /></IconButton>
    let stateToDisplay = "";
    let h= Math.floor(duration / 3600);
    let m =  Math.floor(duration % 3600 / 60);
    let s=  Math.floor(duration % 3600 % 60);
    switch (status) {
        case "DONE":
            stateToDisplay = <IconButton className={classes.stateToDisplay} aria-label="Done"><DoneIcon /></IconButton>
            buttonToDisplay = <IconButton onClick ={handleDelete.bind(null, url)}  className={classes.buttonToDisplay} aria-label="Delete"><DeleteIcon fontSize="small" /></IconButton>
            break;
        case "CONVERTING": 
            stateToDisplay = <FadeLoader css={{ transform: "scale(0.5)", position: "absolute!important", top: "7px!important", left: "-20px!important"}} color={theme.palette.secondary.main} loading={true}/>;
            break; 
        case "DOWNLOADING":
            buttonToDisplay = <IconButton className={classes.buttonToDisplay} onClick ={handlePauseResume.bind(null, true, iPosition)} aria-label="Delete"><StopIcon    fontSize="small" /></IconButton>
            break; 
        case "PAUSED":
            buttonToDisplay = <IconButton className={classes.buttonToDisplay} onClick ={handlePauseResume.bind(null, false, iPosition)} aria-label="Delete"><ReplayIcon fontSize="small" /></IconButton>
            break; 
        default:
            break;
    }
    const onDragStartHandler =()=>{
        setDragAndDropMode(true);
        setFromAndTo(iPosition, 1);
    }
    const onDragOverHandler = (e)=>{
        e.preventDefault();
    }

    const onDragEnterHandler =(e)=>{

        setFromAndTo(iPosition, 2);
    }

    const onDragLeaveHandler = ()=>{

    }
    const onDragEndHandler =()=>{

        setDragAndDropMode(false);
        setFromAndTo(iPosition, 3);
    }

    return (
    <div style={{display: "grid", gridTemplateColumns: "25px auto"}} 
    draggable="true" 
    onDragStart={onDragStartHandler} 
    onDragEnter={onDragEnterHandler} 
    onDragEnd={onDragEndHandler}
    onDragOver={onDragOverHandler}
    onDragLeave={onDragLeaveHandler}
    >
        <Typography className={classes.dragNumber} variant="subtitle1" color="inherit">{`${Number.parseInt(iPosition)+1}.`}</Typography>
        <Card className={classes.card}>
            <LinearProgress className={`${classes.progress} ${classes.colorSecondary}`} style={{opacity: status=== "DONE"? 0: 0.65}} color="secondary" variant="determinate" value={downloaded} />
            <CardMedia className={classes.cover} image={thumbnail} title={title} onClick={()=>{ ipcRenderer.send("pauseVideo", iPosition)}}/>
            <CardContent className={classes.content}>
                <div>
                    <Typography variant="body1">{modifiedTitle}</Typography>
                    <Typography variant="body1">{`${h===0 ? "": h>9? h+":": "0"+h+":"}${m>9? m: "0"+m}:${s>9?s: "0"+s}`}</Typography>
                </div>
                <div className={classes.divSt}>
                    {stateToDisplay}
                    {buttonToDisplay} 
                </div>
            </CardContent>
        </Card>
            <div></div>
            <CustomRange duration={duration} index={iPosition} />
    </div>
     
    );
}, (prev, next)=>{
    if(prev.downloaded !== next.downloaded || prev.status !== next.status){
        if(prev.downloaded > next.downloaded && prev.status === next.status){
            return true;
        }
        return false;
    }
    return true;
});

export default withStyles(styles, {withTheme: true})(SingleVideo)