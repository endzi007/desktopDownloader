import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/lab';

const styles = theme => ({
  root: {
    width: "100%",
  },
  slider: {
    padding: '22px 0px'
  },
  trackDanger: {
      backgroundColor: theme.palette.error.dark
  },
  trackRegular: {
    backgroundColor: theme.palette.secondary.dark
  }
});

const StepSlider = ({ classes, parallelDownloads, setParallelDownloads})=> {

    const handleChange = (event, value) => {
        setParallelDownloads(value);
    };

    return (
      <div className={classes.root}>
        <Slider
          classes={{ 
            container: classes.slider, 
            track: parallelDownloads> 4 ? classes.trackDanger : classes.trackRegular,
            thumb: parallelDownloads> 4 ? classes.trackDanger : classes.trackRegular
         }}
          value={parallelDownloads}
          min={1}
          max={7}
          step={1}
          onChange={handleChange}
        />
      </div>
    );
}

StepSlider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StepSlider);
