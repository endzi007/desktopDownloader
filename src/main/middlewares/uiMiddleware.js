import { CHANGE_SAVE_FOLDER, SHOW_OPEN_DIALOG } from '../actions/optionsActions';
import { dialog } from 'electron';

export default (store)=>(next)=>(action)=>{

    switch(action.type){
        case SHOW_OPEN_DIALOG:
            dialog.showOpenDialog(null, {properties: ['openDirectory']}, (directory)=>{
                store.dispatch({type: CHANGE_SAVE_FOLDER, payload: directory})
            });
            break;            
        default: 
        break;
    }
    next(action);
}