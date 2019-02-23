import downloadAndConvert from '../ffmpegProcesses';
import ytdlAddToPlaylist from '../ffmpegProcesses/ytdlAddToPlaylist';
import { clipboard } from 'electron';
import { types  } from './videoDuck';
import { creators as appStateActions } from '../appState/appStateDuck';

export default (store)=>(next)=>(action)=>{
    let state = store.getState();
    switch(action.type){
        case types.ADD:
            //check if action is called from DROPZONE or CLIPBOARD
            //if string is empty we should check clipboard for url
            if(action.payload === ""){
                action.payload = clipboard.readText();
            }
            //check if video exists in playlist 
            let index = state.videos.findIndex((element)=>{
                return element.url === action.payload;
            })
            if(index === -1){
                store.dispatch(appStateActions.parsingData(true));
                ytdlAddToPlaylist(action).then((newAction)=>{
                    store.dispatch(appStateActions.parsingData(false));
                    next(newAction);
                });
            } else {
                action.type = "CANCELED_ACTION";
            }
            break;
        case types.START_DOWNLOAD:
        let loopLength = state.videos.length < state.options.parallel.limit ? state.videos.length: state.options.parallel.limit; 
            for(let i = state.options.parallel.index; i<loopLength; i++){
                downloadAndConvert(store, i).then(()=>{
                    store.dispatch({ type: types.DOWNLOAD_NEXT });
                });
            }
            break;  
        
        case types.DOWNLOAD_NEXT:
        if(state.options.parallel.index < state.videos.length){
                downloadAndConvert(store, state.options.parallel.index).then(()=>{
                    store.dispatch({ type: types.DOWNLOAD_NEXT });
                });
            }
            break;
        default: 
        break;
    }
    next(action);
}