export const INCREASE_LIMIT = "INCREASE_LIMIT";
export const CHANGE_SAVE_FOLDER = "CHANGE_SAVE_FOLDER";
export const SHOW_OPEN_DIALOG = "SHOW_OPEN_DIALOG";
export const CHANGE_DOWNLOAD_FORMAT = "CHANGE_DOWNLOAD_FORMAT";
export const SAVE_TO_LOCALSTORAGE = "SAVE_TO_LOCALSTORAGE";
export const RESET_LIMIT = "RESET_LIMIT";
export const GET_SAVE_FOLDER = "GET_SAVE_FOLDER";

export const increaseLimit = ()=>{
    //val should be INC or DEC to increment or decrement queque
    return {
        type: INCREASE_LIMIT, 
        payload: ""
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
        payload: ""
    }
}

export const changeDownloadFormat = (format)=>{
    return {
        type: CHANGE_DOWNLOAD_FORMAT,
        payload: format
    }
}

export const saveToLocalStorage = (state)=>{
    return {
        type: SAVE_TO_LOCALSTORAGE, 
        payload: state
    }
}

export const resetLimit = ()=>{
    return {
        type: RESET_LIMIT,
        payload: ""
    }
}

export const getSaveFolder = ()=>{
    return {
        type: GET_SAVE_FOLDER, 
        payload: null
    }
}