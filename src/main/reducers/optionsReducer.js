import { INCREASE_LIMIT, CHANGE_SAVE_FOLDER, CHANGE_DOWNLOAD_FORMAT, RESET_LIMIT, CHANGE_DOWNLOAD_QUALITY } from '../actions/optionsActions';
let defaultState = {
    downloadFormat: {
        type: "mp3",
        quality: "best",
        mp3:  ["low", "medium", "best"],
        mp4:  ["360", "720", "1080"]
    },
    downloadFolder: "",
    parallel: {
        limit: 7, 
        inProgress: "NO",
        index: 0
    }
  };
export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case CHANGE_SAVE_FOLDER:
            newState.downloadFolder = action.payload; 
            return newState;
        case  INCREASE_LIMIT:
             newState.parallel.index++;
            return newState;
        case RESET_LIMIT: 
            newState.parallel.index = 0;
            return newState;
        case  CHANGE_DOWNLOAD_FORMAT: 
            newState.downloadFormat.type = action.payload;
            return newState;
            case  CHANGE_DOWNLOAD_QUALITY: 
            newState.downloadFormat.quality = action.payload;
            return newState;
        default:
            return newState;
    }
}