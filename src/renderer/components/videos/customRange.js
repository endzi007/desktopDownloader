import React, { useState, useEffect} from 'react';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { SliderRail, Handle, Track, KeyboardHandle } from './sliderComponents' // example render components - source below
import { connect } from 'react-redux';
import { creators as videoActions } from '../../../main/videos/videoDuck';

const sliderStyle = {
  position: 'relative',
  width: '100%',
  touchAction: 'none',
}

const domain = [0, 300]
const defaultValues = [0, 50, 300]

const Example = (props)=> {

    const [values, setValues] = useState(defaultValues.slice());
    const [update, setUpdate ] = useState(defaultValues.slice());

    const onUpdate = (update)=>{
        setUpdate(update);
    }

    const onChange = (values)=> {

        setValues(values)
        let obj = { status: true, range: [values[0], values[1]-values[0]], index: props.index}
        if(values[0] === 0 && values[1] === props.duration){
          obj.status = false; 
        }
        props.handleCustomRange(obj);

    }
    useEffect(()=>{
      console.log(props, "props");
    },[]);
    let newValue = props.duration; 

    return (
      <div style={{height: 5, width: '100%', marginTop: "-8px", display: props.customRange === true? "block": "none" }}>
        <Slider
          mode={1}
          step={1}
          domain={[0, newValue]}
          rootStyle={sliderStyle}
          onUpdate={onUpdate}
          onChange={onChange}
          values={[0, newValue]}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <KeyboardHandle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks left ={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
        </Slider>
      </div>
    )
}
function mapStateToProps(state){
  return {
    customRange: state.options.customRange
  }
}

const mapDispatchToProps = {
  handleCustomRange: videoActions.customRangeDownload
}
export default connect(mapStateToProps, mapDispatchToProps)(Example);