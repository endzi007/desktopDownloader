export const types = {
    INCREASE_LIMIT: "options/INCREASE_LIMIT",
    CHANGE_SAVE_FOLDER: "options/CHANGE_SAVE_FOLDER",
    SHOW_OPEN_DIALOG: "options/SHOW_OPEN_DIALOG",
    CHANGE_DOWNLOAD_FORMAT: "options/CHANGE_DOWNLOAD_FORMAT",
    SAVE_TO_LOCALSTORAGE: "options/SAVE_TO_LOCALSTORAGE",
    RESET_LIMIT: "options/RESET_LIMIT",
    GET_SAVE_FOLDER: "options/GET_SAVE_FOLDER",
    CHANGE_DOWNLOAD_QUALITY: "options/CHANGE_DOWNLOAD_QUALITY",
    AUTO_NUMBERING: "options/AUTO_NUMBERING",
    ENABLE_CUSTOM_RANGE: "options/ENABLE_CUSTOM_RANGE",
    ADD_CHANNEL: "options/ADD_CHANNEL",
    REMOVE_CHANNEL: "options/REMOVE_CHANNEL"
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
    enableCustomRange: bool =>({type: types.ENABLE_CUSTOM_RANGE, payload: bool}),
    autoNumbering: (val)=>({
            type: types.AUTO_NUMBERING,
            payload: {
                numbering: val.numbering,
                value: val.value
            }
    }),
    addChannel: (channel, value)=>({type: types.ADD_CHANNEL, payload: {channel, value}}),
    removeChannel: index =>({type: types.REMOVE_CHANNEL, payload: index})
}

export let defaultState = {
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
    },
    customRange: false,
    channels:[]
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
            newState.downloadFormat.type = action.payload;
            return newState;
        case  types.CHANGE_DOWNLOAD_QUALITY: 
            newState.downloadFormat.quality = action.payload;
            return newState;
        case types.AUTO_NUMBERING: 
            newState.autoNumbering = action.payload;
            return newState;
        case types.ENABLE_CUSTOM_RANGE:
            newState.customRange = action.payload;
            return newState;
        case types.ADD_CHANNEL:
            newState.channels.push([{channel: action.payload.channel, value: action.payload.value}]);
            return newState;
        case types.REMOVE_CHANNEL: 
            
        default:
            return newState;
    }
}