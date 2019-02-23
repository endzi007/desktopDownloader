export const types = {
    REMOVE : "types/REMOVE_VIDEO",
    ADD : "types/ADD_VIDEO_TO_PLAYLIST",
    COUNTER : "types/DOWNLOAD_PROGRESS_COUNTER",
    START_DOWNLOAD : "types/START_VIDEO_DOWNLOAD",
    DOWNLOAD_NEXT : "types/DOWNLOAD_NEXT_VIDEO",
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
            
        default:
            return newState;
    }
}