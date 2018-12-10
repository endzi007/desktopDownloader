import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core';
import * as actions from '../../actions';

class Dropzone extends React.Component{
    constructor(){
        super();
        this.state = {
            style: {
                border: "3px dashed gray",
                background: "none"
            }
        }
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
    }
    onDrop(e){
        let droppedItems = e.dataTransfer.items;
        this.setState((state, props)=>{
            return {
                style: {...state.style, background: "transparent"}
            }
        });
        if(droppedItems){
            for(let x of droppedItems){
                if(x.type==="text/plain"){
                    x.getAsString((s)=>{
                        this.props.addVideo(s);
                    });
                }
            }
        }

    }
    onDragStart(e){
        console.log("on drag stgart");

    }
    onDragOver(e){
        e.preventDefault();
    }
    onDragEnter(e){
        e.preventDefault();
        let newState = {...this.state.style};

        this.setState((old, newState)=>{
            return {
                style: {
                    ...old.style, 
                    background: "red"
                }
            }
        });
    }
    onDragLeave(e){
        console.log("on drag leave");
        e.preventDefault();
        this.setState((old, newState)=>{
            return {
                style: {
                    ...old.style, 
                    background: "transparent"
                }
            }
        });
    }
    render(){
        const { classes } = this.props;
        return (
                <div
                    style={{
                        position: "fixed",
                        width: "100%",
                        height: "100%",
                        border: "1px dotted black",
                        backgroundColor: this.state.style.background
                    }} 
                    onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver} onDragLeave = {this.onDragLeave}> 
                </div>
        );
    }
}
function mapStateToProps(store){
    return{
        test: store.test
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions, dispatch);
}
export default  withStyles(null,{withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(Dropzone));