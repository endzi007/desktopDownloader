import { PARSING_DATA } from '../actions/appStateActions';

let defaultState = {
    connection: null,
    downloading: null,
    error: null,
    parsingData: null
  }

export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case PARSING_DATA: 
            newState.parsingData = action.payload;
        default:
            return newState;
    }
}