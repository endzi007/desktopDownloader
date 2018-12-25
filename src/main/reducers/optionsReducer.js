import { PARALLEL_DOWNLOADS_CHANGE, CHANGE_SAVE_FOLDER } from '../actions/optionsActions';
let defaultState = {
    downloadFormat: "mp3",
    downloadFolder: "",
    parallel: {
        limit: 5, 
        inProgress: 0
    }
  };
export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case CHANGE_SAVE_FOLDER:
            newState.downloadFolder = action.payload; 
            return newState;
        case  PARALLEL_DOWNLOADS_CHANGE:
            action.payload === "INC"? newState.parallel.inProgress++: newState.parallel.inProgress--;
            return newState; 
        default:
            return newState;
    }
}