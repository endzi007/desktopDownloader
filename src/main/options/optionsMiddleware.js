import { types as optionsTypes, creators as optionsActions } from './optionsDuck';

import path from 'path';
import os from 'os';

export default (store)=>(next)=>(action)=>{
    switch (action.type) {
        case optionsTypes.GET_SAVE_FOLDER:
            let paths = path.join(os.homedir(), "Desktop");
            store.dispatch(optionsActions.changeSaveFolder(paths))
            break;
    
        default:
            break;
    }
    next(action);   
}