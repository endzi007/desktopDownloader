import { types as optionsTypes } from '../options/optionsDuck';
import { types as uiTypes } from '../ui/uiDuck';
import { dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default (store)=>(next)=>(action)=>{

    switch(action.type){
        case uiTypes.SHOW_OPEN_DIALOG:
            dialog.showOpenDialog(null, {properties: ['openDirectory']}, (directory)=>{
                if(directory === undefined){
                    let currDate = new Date();
                    let folderName = `${currDate.getDate()}_${currDate.getMonth()}_${currDate.getTime()}`;
                    let paths = path.join(os.homedir(), "Desktop", folderName);
                    fs.mkdir(paths, (err)=>{
                        if (err){
                            console.log(err);
                        } else {
                            console.log("FOLDER CREATED SUCCESSFULLY");
                        }
                    });
                    store.dispatch({type: optionsTypes.CHANGE_SAVE_FOLDER, payload: paths})
                } else {
                    store.dispatch({type: optionsTypes.CHANGE_SAVE_FOLDER, payload: directory})
                }
            });
            break;            
        default: 
        break;
    }
    next(action);
}