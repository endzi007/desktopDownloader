import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Card, Typography, CardContent, CardMedia, LinearProgress, IconButton } from '@material-ui/core';
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
        marginTop: "15px"
    }
});

const SingleVideo = ({ thumbnail, title, url, downloaded, handleDelete, classes, duration})=>{
    let modifiedTitle = title.length > 50 ? `${title.substr(0, 47)}...`: title;
    return (
        <Card className={classes.card}>
            <LinearProgress className={classes.progress} color="primary" variant="determinate" value={downloaded} />
            <CardMedia className={classes.cover} image={thumbnail} title={title}/>
            <CardContent className={classes.content}>
                <div>
                    <Typography>{modifiedTitle}</Typography>
                    <Typography>Video duration: {duration}</Typography>
                </div>
                <IconButton aria-label="Delete" className={classes.margin}>
                    <DeleteIcon onClick ={handleDelete.bind(null, url)} fontSize="small" />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default withStyles(styles)(SingleVideo)