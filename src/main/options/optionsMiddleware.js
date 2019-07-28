import { types as optionsTypes, creators as optionsActions } from './optionsDuck';
import { types as uiTypes } from '../ui/uiDuck';
import path from 'path';
import os from 'os';

export default (store)=>(next)=>(action)=>{
    
    switch (action.type) {
        case optionsTypes.GET_SAVE_FOLDER:
            let paths = path.join(os.homedir(), "Desktop");
            store.dispatch(optionsActions.changeSaveFolder(paths))
            break;
        case optionsTypes.CHANGE_DOWNLOAD_QUALITY: 
            const { customRange } = store.getState().options;
            if(customRange){
                if(action.payload === "1080"){
                    store.dispatch({type: uiTypes.SHOW_CONFIG_PANEL, payload: false});
                    action.type = uiTypes.SHOW_PRO_FEATURE;
                    action.payload = {open: true, message: "You can't download 1080 videos while custom range is enabled. Please disable custom range in config to download", type: "INFO"};
                }
            }
            break; 
        case optionsTypes.ENABLE_CUSTOM_RANGE: 
            const { quality } = store.getState().options.downloadFormat;
            if(quality === "1080"){
                store.dispatch({type: uiTypes.SHOW_CONFIG_PANEL, payload: false});
                    action.type = uiTypes.SHOW_PRO_FEATURE;
                    action.payload = {open: true, message: "You can't enable custom range for 1080 videos Please change video quality in config", type: "INFO"};
            }
            break;
        case optionsTypes.CHANGE_DOWNLOAD_FORMAT:{
            if(action.payload === "mp3"){
                store.dispatch({type: optionsTypes.CHANGE_DOWNLOAD_QUALITY, payload: "low"})
            } else {
                store.dispatch({type: optionsTypes.CHANGE_DOWNLOAD_QUALITY, payload: "360"})
            }
            break;
        }
        default:
            break;
    }
    next(action);   
}