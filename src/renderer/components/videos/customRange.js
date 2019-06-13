import React, { Component } from 'react'
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { SliderRail, Handle, Track } from './sliderComponents' // example render components - source below

const sliderStyle = {
  position: 'relative',
  width: '100%',
  touchAction: 'none',
}

const domain = [0, 300]
const defaultValues = [0, 50, 300]

class Example extends Component {
    constructor (props){
        super(props);
        this.state = {
          values: defaultValues.slice(),
          update: defaultValues.slice(),
        }
        this.onChange = this.onChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdate(update){
        this.setState({ update })
        
    }

    onChange (values) {
        this.setState({ values })
    }

  render() {
    const {
      state: { values, update },
    } = this
    let durationArr = this.props.duration.split(":").reverse();
    let newValue = 1; 
    for(let x in durationArr){
      newValue += Number.parseInt(durationArr[x])* Math.pow(60, x);
    }
    return (
      <div style={{height: 10, width: '100%', marginTop: "-8px"}}>
        <Slider
          mode={2}
          step={1}
          domain={[0, newValue]}
          rootStyle={sliderStyle}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={[0, newValue]}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
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
}

export default Example