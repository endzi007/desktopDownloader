export default (state={showConfig: false}, action)=>{
    let newState = {...state};
    switch (action.type) {
        case "SHOW_CONFIG":
            newState.showConfig = action.payload;
            return newState;
        default:
            return newState;
    }
}