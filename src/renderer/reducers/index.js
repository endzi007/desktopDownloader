import { combineReducers } from 'redux';
const appConfig = (state={}, action)=>{
    switch (action.type) {
        case "APP_CONFIG":
            console.log("appConfig reducer on renderer");
            return state;
    
        default:
            break;
    }
}


export default combineReducers({
    appConfig: appConfig
});