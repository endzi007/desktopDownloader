import { combineReducers } from 'redux';

const test = (state = "off", action)=>{
    console.log("called reducer on main", action.payload);
    switch (action.type) {
        case "TEST_ACTION": 
            state = action.payload;
            return state;
        default:
            return state;
    }
}

export default combineReducers({
    test: test
});