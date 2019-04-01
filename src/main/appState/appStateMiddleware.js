import { types as appStateTypes } from './appStateDuck';
import { types as videoTypes } from '../videos/videoDuck';
import { types as optionsTypes } from "../options/optionsDuck";
import { types as uiTypes } from '../ui/uiDuck';
import { session } from 'electron'
import fetch from 'node-fetch';
import { ipcMain, webContents } from 'electron';

export default (store)=>(next)=>(action)=>{
    const state = store.getState();
    if(!state.appState.license.status){
        switch (action.type) {
            case videoTypes.ADD: 
                if(state.videos.length + state.appState.parsingData.count >= state.appState.proFeatures.videosLength){
                    action.type = uiTypes.SHOW_PRO_FEATURE;
                    action.payload = {open: true, message: "To download more then 20 videos please consider to buy a pro licence"};
                }
            break; 
            case optionsTypes.CHANGE_DOWNLOAD_QUALITY: 
                if(action.payload === "1080"){
                    store.dispatch({type: uiTypes.SHOW_CONFIG_PANEL, payload: false});
                    action.type = uiTypes.SHOW_PRO_FEATURE;
                    action.payload = {open: true, message: "To download HD videos please consider to buy pro licence"};
                }
            break;
                
            default: 
                break; 
        }
    }
    next(action);   
}