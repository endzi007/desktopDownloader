import { SHOW_CONFIG_PANEL } from '../actions/uiActions';
export default (state={showConfig: false}, action)=>{
    let newState = {...state};
    switch (action.type) {
        case SHOW_CONFIG_PANEL:
            newState.showConfig = action.payload;
            return newState;
        default:
            return newState;
    }
}