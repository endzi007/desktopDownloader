import { combineReducers } from 'redux';

const test = (state = "off", action)=>{
    console.log("called reducer on renderer", action.payload);
    switch (action.type) {
        case "ddd": 
            state = action.payload;
            return state;
        default:
            return state;
    }
}

export default combineReducers({
    test: test
})