import { combineReducers } from 'redux';
import uiReducer from '../ui/uiDuck';
import optionsReducer from '../options/optionsDuck';
import appStateReducer from '../appState/appStateDuck';
import videos from '../videos/videoDuck';


export default combineReducers({
    videos: videos,
    uiConfig: uiReducer,
    options: optionsReducer,
    appState: appStateReducer
});