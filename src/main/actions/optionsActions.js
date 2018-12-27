export const PARALLEL_DOWNLOADS_CHANGE = "PARALLEL_DOWNLOAD_CHANGE";
export const CHANGE_SAVE_FOLDER = "CHANGE_SAVE_FOLDER";
export const SHOW_OPEN_DIALOG = "SHOW_OPEN_DIALOG";
export const CHANGE_DOWNLOAD_FORMAT = "CHANGE_DOWNLOAD_FORMAT";


export const parallelDownloadChange = (val)=>{
    //val should be INC or DEC to increment or decrement queque
    return {
        type: PARALLEL_DOWNLOADS_CHANGE, 
        payload: val
    }
}

export const changeSaveFolder = (path)=>{
    return {
        type: CHANGE_SAVE_FOLDER, 
        payload: path
    }
}

export const showOpenDialog = ()=>{
    return {
        type: SHOW_OPEN_DIALOG,
    }
}

export const changeDownloadFormat = (format)=>{
    return {
        type: CHANGE_DOWNLOAD_FORMAT,
        payload: format
    }
}