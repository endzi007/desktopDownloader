import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Card, Typography, CardContent, CardMedia, LinearProgress } from '@material-ui/core';

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
        alignContent: "flex-start"
    },
    progress:{
        position: "absolute",
        bottom: 0,
        width: "100%"
    }
});

const SingleVideo = ({ img, title, url, downloaded, handleDelete, classes})=>{
    return (
        <Card className={classes.card}>
            <LinearProgress className={classes.progress} color="primary" variant="determinate" value={20} />
            <CardMedia className={classes.cover} image={img} title={title}/>
            <CardContent className={classes.content}>
                <Typography>{title}</Typography>
                <Typography>Delete</Typography>
            </CardContent>
        </Card>
    );
};

export default withStyles(styles)(SingleVideo)