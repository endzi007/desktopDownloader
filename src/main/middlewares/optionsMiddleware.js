import { GET_SAVE_FOLDER, changeSaveFolder} from '../actions/optionsActions';
import path from 'path';
import os from 'os';

export default (store)=>(next)=>(action)=>{
    switch (action.type) {
        case GET_SAVE_FOLDER:
            let paths = path.join(os.homedir(), "Desktop");
            console.log(paths, "paths");
            store.dispatch(changeSaveFolder(paths))
            break;
    
        default:
            break;
    }
    next(action);   
}