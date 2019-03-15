export const types = {
    INCREASE_LIMIT: "options/INCREASE_LIMIT",
    CHANGE_SAVE_FOLDER: "options/CHANGE_SAVE_FOLDER",
    SHOW_OPEN_DIALOG: "options/SHOW_OPEN_DIALOG",
    CHANGE_DOWNLOAD_FORMAT: "options/CHANGE_DOWNLOAD_FORMAT",
    SAVE_TO_LOCALSTORAGE: "options/SAVE_TO_LOCALSTORAGE",
    RESET_LIMIT: "options/RESET_LIMIT",
    GET_SAVE_FOLDER: "options/GET_SAVE_FOLDER",
    CHANGE_DOWNLOAD_QUALITY: "options/CHANGE_DOWNLOAD_QUALITY",
    AUTO_NUMBERING: "options/AUTO_NUMBERING"
}

export const creators = {
    //val should be INC or DEC to increment or decrement queque
    increaseLimit: ()=>({ type: types.INCREASE_LIMIT, payload: "" }),
    changeSaveFolder: path=>({ type: types.CHANGE_SAVE_FOLDER, payload: path }),
    showOpenDialog: ()=>({ type: types.SHOW_OPEN_DIALOG }),
    changeDownloadFormat: format=>({ type: types.CHANGE_DOWNLOAD_FORMAT, payload: format }),
    saveToLocalStorage: state=>({ type: types.SAVE_TO_LOCALSTORAGE, payload: state }),
    resetLimit: ()=>({ type: types.RESET_LIMIT, payload: "" }),
    getSaveFolder: ()=>({type: types.GET_SAVE_FOLDER,  payload: null }),
    changeDownloadQuality: quality=>({ type: types.CHANGE_DOWNLOAD_QUALITY, payload: quality }),
    autoNumbering: (val)=>({
            type: types.AUTO_NUMBERING,
            payload: {
                numbering: val.numbering,
                value: val.value
            }
    })
}

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
    },
    autoNumbering: {
        numbering: false,
        value: 0
    }
  };
export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case types.CHANGE_SAVE_FOLDER:
            newState.downloadFolder = action.payload; 
            return newState;
        case  types.INCREASE_LIMIT:
             newState.parallel.index++;
            return newState;
        case types.RESET_LIMIT: 
            newState.parallel.index = 0;
            return newState;
        case types.CHANGE_DOWNLOAD_FORMAT: 
            let payloadValue = typeof action.payload === "string"? action.payload: "mp3";
            newState.downloadFormat.type = payloadValue;
            return newState;
        case  types.CHANGE_DOWNLOAD_QUALITY: 
            newState.downloadFormat.quality = action.payload;
            return newState;
        case types.AUTO_NUMBERING: 
            newState.autoNumbering = action.payload;
            return newState;
        default:
            return newState;
    }
}