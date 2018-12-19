import { combineReducers } from 'redux';

const test = (state = "off", action)=>{
    switch (action.type) {
        case "TEST_ACTION": 
            state = action.payload;
            return state;
        default:
            return state;
    }
}

const videos = (state=[], action)=>{
    let newState = [...state];
    switch (action.type) {
        case "ADD_PROCESSED_VIDEO":
            newState.push(action.payload);
            return newState;
        case "DELETE_VIDEO":
            let index = newState.findIndex((vid)=>{
                return vid.url === action.payload;
            });
            newState.splice(index, 1);
            return newState;
        default:
            return newState;
    }
}

const options = (state ={      
    downloadFormat: "mp4",
    downloadFolder: ""
}, action)=>{
    switch (action.type) {
        case "CONFIGURE_OPTIONS":
            return state;
    
        default:
            return state;
    }
}
export default combineReducers({
    test: test,
    videos: videos,
    options: options
});