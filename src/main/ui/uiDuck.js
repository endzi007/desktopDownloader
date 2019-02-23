export const types = {
    SHOW_OPEN_DIALOG : "SHOW_OPEN_DIALOG",
    SHOW_CONFIG_PANEL : "SHOW_CONFIG_PANEL",
    SHOW_VIDEO_LOADER : "SHOW_VIDEO_LOADER"
}
export const creators = {
    showOpenDialog: (val)=>{
        return {
            type: types.SHOW_OPEN_DIALOG, 
            payload: val
        }
    },
    showConfigPanel: (payload, scope)=>{
        return {
            type: types.SHOW_CONFIG_PANEL, 
            payload: payload,
            meta: {
                scope: scope
            }
        }
    },
    showVideoLoader: (show)=>{
        return {
            type: types.SHOW_VIDEO_LOADER,
            payload: show
        }
    }
}

export default (state={showConfig: false}, action)=>{
    let newState = {...state};
    switch (action.type) {
        case types.SHOW_CONFIG_PANEL:
            newState.showConfig = action.payload;
            return newState;
        default:
            return newState;
    }
}