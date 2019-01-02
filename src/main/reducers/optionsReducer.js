import { INCREASE_LIMIT, CHANGE_SAVE_FOLDER, CHANGE_DOWNLOAD_FORMAT } from '../actions/optionsActions';
let defaultState = {
    downloadFormat: "mp3",
    downloadFolder: "",
    parallel: {
        limit: 7, 
        inProgress: 0,
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
        case  CHANGE_DOWNLOAD_FORMAT: 
            newState.downloadFormat = action.payload;
            return newState;
        default:
            return newState;
    }
}