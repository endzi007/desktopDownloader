export const types = {
    PARSING_DATA: "appState/PARSING_DATA",
    CHECK_LICENCE: "appState/CHECK_LICENCE",
    REGISTER_LICENCE: "appState/REGISTER_LICENCE",
    CHECK_PRO_FEATURES: "appState/CHECK_PRO_FEATURES",
    DOWNLOADING: "appState/DOWNLOADING",
    CHANGE_LICENSE: "appState/CHANGE_LICENSE",
    LICENSE_FAILURE_COUNTER: "appState/LICENSE_FAILURE_COUNTER",
    ERROR_HANDLER: "appState/ERROR_HANDLER"
}

export const creators = {
    parsingData: bool =>({ type: types.PARSING_DATA, payload: bool }),
    downloading: bool =>({ type: types.DOWNLOADING, payload: bool}),
    changeLicense: bool =>({type: types.CHANGE_LICENSE, payload: bool}),
    licenseFailureCounter: val=>({type: types.LICENSE_FAILURE_COUNTER, payload: val}),
    errorHandler: obj=>({type: types.ERROR_HANDLER, payload: {
        status: obj.status,
        message: obj.message
    }})
}

let defaultState = {
    connection: null,
    downloading: null,
    error: {
        status: null,
        message: ""
    },
    parsingData: {
        bool: null,
        count: 0
    },
    license: {
        status: false,
        failureCount: 0
    },
    proFeatures: {
        videosLength: 20, 
        quality: "1080"
    }
  }

export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case types.PARSING_DATA: 
            newState.parsingData.bool = action.payload;
            newState.parsingData.count = action.payload? newState.parsingData.count+1: newState.parsingData.count-1;
            return newState;
        case types.DOWNLOADING:
            newState.downloading = action.payload;
            return newState;
        case types.CHANGE_LICENSE: 
            newState.license.status = action.payload;
            return newState;
        case types.LICENSE_FAILURE_COUNTER: 
            if(action.payload === "INC"){
                newState.license.failureCount++;
            } else {
                newState.license.failureCount = 0;
            }
            return newState;
        case types.ERROR_HANDLER: 
            newState.error = action.payload;
            return newState;
        default:
            return newState;
    }
}