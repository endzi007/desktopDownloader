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

const SingleVideo = ({ thumbnail, title, url, handleChange, classes, iPosition, status})=>{
    let modifiedTitle = title.length > 47 ? `${title.substr(0, 44)}...`: title;
    let displayMessage = thumbnail === "noThumbnail"? <Typography variant="body1">Getting image..</Typography>: <CardMedia image={thumbnail} className={classes.cover}  title={title} />; 
    return (
    <div style={{display: "grid", gridTemplateColumns: "25px auto"}}>
        <Typography style={{alignSelf: "center"}} variant="subtitle1" color="inherit">{`${iPosition+1}.`}</Typography>
        <Card className={classes.card}>
            {displayMessage}
            <CardContent className={classes.content}>
                <div>
                    <Typography variant="body1">{modifiedTitle}</Typography>
                </div>
                <div className={classes.divSt}>
                    <Checkbox 
                        checked={status==="NOT_STARTED"? true: false}
                        onChange={handleChange.bind(null, iPosition)}
                        value={iPosition}
                     />
                </div>
            </CardContent>
        </Card>
    </div>
     
    );
};

export default withStyles(styles, {withTheme: true})(SingleVideo)