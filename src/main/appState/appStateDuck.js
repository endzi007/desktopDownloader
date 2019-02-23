export const types = {
    PARSING_DATA: "appState/PARSING_DATA"
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
    parsingData: null
  }

export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case types.PARSING_DATA: 
            newState.parsingData = action.payload;
        default:
            return newState;
    }
}