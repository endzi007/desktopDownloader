import { types as optionsTypes } from '../options/optionsDuck';
import { types as uiTypes } from '../ui/uiDuck';
import { dialog } from 'electron';

export default (store)=>(next)=>(action)=>{

    switch(action.type){
        case uiTypes.SHOW_OPEN_DIALOG:
            dialog.showOpenDialog(null, {properties: ['openDirectory']}, (directory)=>{
                store.dispatch({type: optionsTypes.CHANGE_SAVE_FOLDER, payload: directory})
            });
            break;            
        default: 
        break;
    }
    next(action);
}