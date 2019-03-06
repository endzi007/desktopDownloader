export const types = {
    PARSING_DATA: "appState/PARSING_DATA",
    CHECK_LICENCE: "appState/CHECK_LICENCE",
    REGISTER_LICENCE: "appState/REGISTER_LICENCE",
    CHECK_PRO_FEATURES: "appState/CHECK_PRO_FEATURES"
}

export const creators = {
    parsingData: (bool)=>{
        return {
            type: types.PARSING_DATA,
            payload: bool
        }
    }
}

let defaultState = {
    connection: null,
    downloading: null,
    error: null,
    parsingData: null,
    licence: false,
    proFeatures: {
        videosLength: 5, 
        quality: "1080"
    }
  }

export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case types.PARSING_DATA: 
            newState.parsingData = action.payload;
            return newState;
        case types.REGISTER_LICENCE: 
            newState.licence = action.payload; 
            return newState; 
        default:
            return newState;
    }
}