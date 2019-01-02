export const ADD_VIDEO_TO_PLAYLIST = "ADD_VIDEO_TO_PLAYLIST";
export const REMOVE_VIDEO_FROM_PLAYLIST = "REMOVE_VIDEO";
export const DOWNLOAD_PROGRESS_COUNTER = "DOWNLOAD_PROGRESS_COUNTER";
export const START_VIDEO_DOWNLOAD = "START_VIDEO_DOWNLOAD";
export const DOWNLOAD_NEXT_VIDEO = "DOWNLOAD_NEXT_VIDEO";

export const addVideoToPlaylist = (url)=>{
    return {
        type: ADD_VIDEO_TO_PLAYLIST,
        payload: url || "" //empty string if is called from clipboard and not from drag and drop
    }
}

export const removeVideoFromPlaylist = (url)=>{
    return {
        type: REMOVE_VIDEO_FROM_PLAYLIST,
        payload: url
    }
}

export const downloadProgressCounter = (url)=>{
    return {
        type: DOWNLOAD_PROGRESS_COUNTER,
        payload: url
    }
}

export const startVideoDownload = ()=>{
    return {
        type: START_VIDEO_DOWNLOAD
    }
}

export const downloadNextVideo = ()=>{
    return {
        type: DOWNLOAD_NEXT_VIDEO
    }
}
