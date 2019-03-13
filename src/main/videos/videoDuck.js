export const types = {
    REMOVE : "videos/REMOVE_VIDEO",
    ADD : "videos/ADD_VIDEO_TO_PLAYLIST",
    COUNTER : "videos/DOWNLOAD_PROGRESS_COUNTER",
    START_DOWNLOAD : "videos/START_VIDEO_DOWNLOAD",
    DOWNLOAD_NEXT : "videos/DOWNLOAD_NEXT_VIDEO",
    CLEAR_ALL: "videos/CLEAR_ALL",
    SAVE_PLAYLIST: "videos/SAVE_PLAYLIST",
    LOAD_PLAYLIST: "videos/LOAD_PLAYLIST",
    RESUME_VIDEO_DOWNLOAD: "videos/RESUME_VIDEO_DOWNLOAD",
    PAUSE_VIDEO_DOWNLOAD: "",
    CHANGE_VIDEO_STATUS: "videos/CHANGE_VIDEO_STATUS"
}

export const creators = {
    addVideoToPlaylist: (url)=>({type: types.ADD, payload: url || "" }), //empty string if is called from clipboard and not from drag and drop ,
    removeVideoFromPlaylist: (url)=>({ type: types.REMOVE, payload: url }),
    downloadProgressCounter: (url)=>({ type: types.COUNTER, payload: url }),
    startVideoDownload: ()=>({ type: types.START_DOWNLOAD }),
    downloadNextVideo: ()=>({ type: types.DOWNLOAD_NEXT }),
    clearAll: ()=> ({ type: types.CLEAR_ALL }),
    savePlaylist: ()=> ({ type: types.SAVE_PLAYLIST }),
    loadPlaylist: ()=> ({ type: types.LOAD_PLAYLIST, payload: []}),
    changeVideoStatus: (obj)=>({ type: types.CHANGE_VIDEO_STATUS, payload: { index: obj.index, status: obj.status}})
}

export default (state=[], action)=>{
    let newState = [...state];
    switch (action.type) {
        case `${types.ADD}_PROCESSED`:
            newState.push(action.payload);
            return newState;
        case types.REMOVE:
            let index = newState.findIndex((vid)=>{
                return vid.url === action.payload;
            });
            newState.splice(index, 1);
            return newState;
        case types.COUNTER: 
            newState[action.payload.index].downloaded = action.payload.value;
            return newState;
        case types.CLEAR_ALL:
            newState = [];
            return newState;
        case `${types.LOAD_PLAYLIST}_PROCESSED`:
            newState = action.payload;
            return newState;
        case types.CHANGE_VIDEO_STATUS: 
            newState[action.payload.index].status = action.payload.status;
            return newState; 
        default:
            return newState;
    }
}