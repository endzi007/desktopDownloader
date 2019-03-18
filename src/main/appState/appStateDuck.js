export const types = {
    PARSING_DATA: "appState/PARSING_DATA",
    CHECK_LICENCE: "appState/CHECK_LICENCE",
    REGISTER_LICENCE: "appState/REGISTER_LICENCE",
    CHECK_PRO_FEATURES: "appState/CHECK_PRO_FEATURES",
    DOWNLOADING: "appState/DOWNLOADING"
}

export const creators = {
    parsingData: bool =>({ type: types.PARSING_DATA, payload: bool }),
    downloading: bool =>({ type: types.DOWNLOADING, payload: bool}),
    registerLicence: url => ({ type: types.REGISTER_LICENCE, payload: url })
}

let defaultState = {
    connection: null,
    downloading: null,
    error: null,
    parsingData: {
        bool: null,
        count: 0
    },
    licence: false,
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
        case types.REGISTER_LICENCE: 
            newState.licence = action.payload; 
            return newState;
        case types.DOWNLOADING:
            newState.downloading = action.payload;
            return newState;
        default:
            return newState;
    }
}