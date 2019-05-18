import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Card, Typography, CardContent, CardMedia, IconButton, Checkbox} from '@material-ui/core';
import { ipcRenderer } from 'electron';
import DeleteIcon from '@material-ui/icons/Delete';

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

const SingleVideo = ({ thumbnail, title, url, handleChange, classes, iPosition, checked})=>{
    let modifiedTitle = title.length > 47 ? `${title.substr(0, 44)}...`: title;
    return (
    <div style={{display: "grid", gridTemplateColumns: "25px auto"}}>
        <Typography style={{alignSelf: "center"}} variant="subtitle1" color="inherit">{`${iPosition+1}.`}</Typography>
        <Card className={classes.card}>
            <CardMedia className={classes.cover} image={`file://${thumbnail}`} title={title} onClick={()=>{ ipcRenderer.send("pauseVideo", iPosition)}}/>
            <CardContent className={classes.content}>
                <div>
                    <Typography variant="body1">{modifiedTitle}</Typography>
                </div>
                <div className={classes.divSt}>
                    <Checkbox 
                        checked={checked}
                        onChange={handleChange.bind(null)}
                        value={iPosition}
                     />
                </div>
            </CardContent>
        </Card>
    </div>
     
    );
};

export default withStyles(styles, {withTheme: true})(SingleVideo)