let defaultState = {
    downloadFormat: "mp4",
    downloadFolder: ""
  };
export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case "CHANGE_SAVE_FOLDER":
            newState.downloadFolder = action.payload; 
            return newState;
    
        default:
            return newState;
    }
}