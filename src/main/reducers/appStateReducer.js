import { SHOW_VIDEO_LOADER } from '../actions/uiActions';

let defaultState = {
    connection: null,
    downloading: null,
    error: null,
    parsingData: null
  }

export default (state = defaultState, action)=>{
    let newState = {...state};
    switch (action.type) {
        case SHOW_VIDEO_LOADER:
            newState.parsingData = action.payload;
            return newState;
        default:
            return newState;
    }
}