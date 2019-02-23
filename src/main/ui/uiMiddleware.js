import { types as optionsTypes } from '../options/optionsDuck';
import { dialog } from 'electron';

export default (store)=>(next)=>(action)=>{

    switch(action.type){
        case optionsTypes.SHOW_OPEN_DIALOG:
            dialog.showOpenDialog(null, {properties: ['openDirectory']}, (directory)=>{
                store.dispatch({type: optionsTypes.CHANGE_SAVE_FOLDER, payload: directory})
            });
            break;            
        default: 
        break;
    }
    next(action);
}