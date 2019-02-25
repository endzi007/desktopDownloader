export const types = {
    REMOVE : "videos/REMOVE_VIDEO",
    ADD : "videos/ADD_VIDEO_TO_PLAYLIST",
    COUNTER : "videos/DOWNLOAD_PROGRESS_COUNTER",
    START_DOWNLOAD : "videos/START_VIDEO_DOWNLOAD",
    DOWNLOAD_NEXT : "videos/DOWNLOAD_NEXT_VIDEO",
    CLEAR_ALL: "videos/CLEAR_ALL"
}

export const creators = {
    addVideoToPlaylist: (url)=>{
        return {
            type: types.ADD,
            payload: url || "" //empty string if is called from clipboard and not from drag and drop
        }
    },
    removeVideoFromPlaylist: (url)=>{
        return {
            type: types.REMOVE,
            payload: url
        }
    },
    downloadProgressCounter: (url)=>{
        return {
            type: types.COUNTER,
            payload: url
        }
    },
    startVideoDownload: ()=>{
        return {
            type: types.START_DOWNLOAD
        }
    },
    downloadNextVideo: ()=>{
        return {
            type: types.DOWNLOAD_NEXT
        }
    },
    clearAll: ()=>{
        return {
            type: types.CLEAR_ALL
        }
    }
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
        default:
            return newState;
    }
}