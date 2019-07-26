import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle = {
  position: 'absolute',
  width: '100%',
  height: 42,
  transform: 'translate(0%, -50%)',
  borderRadius: 7,
  cursor: 'pointer',
  // border: '1px solid white',
}

const railInnerStyle = {
  position: 'absolute',
  width: '100%',
  height: 7,
  transform: 'translate(0%, -50%)',
  borderRadius: 7,
  pointerEvents: 'none',
  backgroundColor: 'rgb(155,155,155)',
}

export function SliderRail({ getRailProps }) {
  return (
    <Fragment>
      <div style={railOuterStyle} {...getRailProps()} />
      <div style={railInnerStyle} />
    </Fragment>
  )
}

SliderRail.propTypes = {
  getRailProps: PropTypes.func.isRequired,
}

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
export function Handle({
  domain: [min, max],
  handle: { id, value, percent },
  disabled,
  getHandleProps,
}) {
    const [ showHandle, setShowHandle ] = useState(false);
    let h= Math.floor(value / 3600);
    let m =  Math.floor(value % 3600 / 60);
    let s=  Math.floor(value % 3600 % 60);

  return (
    <Fragment>
      <div
        onMouseOver={()=>{
          setShowHandle(true);
        }}
        onMouseLeave={()=>{
          setShowHandle(false);
        }}
        style={{
          left: `${percent}%`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          WebkitTapHighlightColor: 'rgba(0,0,0,0)',
          zIndex: 5,
          width: 30,
          height: 30,
          cursor: 'pointer',
          // border: '1px solid white',
          backgroundColor: 'none',
          color: "#66bb6a"
        }}
        {...getHandleProps(id)}
      />
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          left: `${percent}%`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: 12,
          height: 12,
          borderRadius: "50%",
          boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.3)',
          backgroundColor: disabled ? '#666' : '#66bb6a',
        }}
      >
        <div style={{ display: showHandle===true? "block": "none", fontFamily: 'Roboto', fontSize: 11, marginTop: -15, marginLeft: -10, backgroundColor:"black", minWidth: "25px", padding: "2px" }}>
          {`${h===0 ? "": h>9? h+":": "0"+h+":"}${m>9? m: "0"+m}:${s>9?s: "0"+s}`}
         </div>
      </div>
    </Fragment>
  )
}

Handle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

Handle.defaultProps = {
  disabled: false,
}

// *******************************************************
// KEYBOARD HANDLE COMPONENT
// Uses a button to allow keyboard events
// *******************************************************
export function KeyboardHandle({
  domain: [min, max],
  handle: { id, value, percent },
  disabled,
  getHandleProps,
}) {
  const [ showHandle, setShowHandle ] = useState(false);
  let h= Math.floor(value / 3600);
  let m =  Math.floor(value % 3600 / 60);
  let s=  Math.floor(value % 3600 % 60);
  return (
      <button
        onMouseOver={()=>{
          setShowHandle(true);
        }}
        onMouseLeave={()=>{
          setShowHandle(false);
        }}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          left: `${percent}%`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: disabled ? '#666' : '#66bb6a',
        }}
        {...getHandleProps(id)}
      >
        <div style={{ position: "absolute", display: showHandle===true? "block": "none", fontFamily: 'Roboto', fontSize: 11, backgroundColor: "white", marginTop: -25, marginLeft: -10, padding: "2px" }}>
          {`${h===0 ? "": h>9? h+":": "0"+h+":"}${m>9? m: "0"+m}:${s>9?s: "0"+s}`}
        </div>
      </button>

  )
}

KeyboardHandle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

KeyboardHandle.defaultProps = {
  disabled: false,
}

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export function Track({ source, target, getTrackProps, disabled }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(0%, -50%)',
        height: 4,
        zIndex: 1,
        backgroundColor: disabled ? '#999' : '#66bb6a',
        borderRadius: 7,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  )
}

Track.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getTrackProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

Track.defaultProps = {
  disabled: false,
}

// *******************************************************
// TICK COMPONENT
// *******************************************************
export function Tick({ tick, count, format }) {
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          marginTop: 14,
          width: 1,
          height: 5,
          backgroundColor: 'rgb(200,200,200)',
          left: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          marginTop: 22,
          fontSize: 10,
          textAlign: 'center',
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        {format(tick.value)}
      </div>
    </div>
  )
}

Tick.propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
  format: PropTypes.func.isRequired,
}

Tick.defaultProps = {
  format: d => d,
}