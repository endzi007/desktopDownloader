import { dialog } from 'electron';
import fs from 'fs';
import { app } from 'electron';

export default (store)=>(next)=>(action)=>{
    console.log("called show open dialog middleware");
    switch(action.type){
        case "SHOW_OPEN_DIALOG":
            dialog.showOpenDialog(null, {properties: ['openDirectory']}, (directory)=>{
                store.dispatch({type: "CHANGE_SAVE_FOLDER", payload: directory})
            });
            break;            
        default: 
        break;
    }
    next(action);
}