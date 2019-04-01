export const types = {
    SHOW_OPEN_DIALOG : "ui/SHOW_OPEN_DIALOG",
    SHOW_CONFIG_PANEL : "ui/SHOW_CONFIG_PANEL",
    SHOW_VIDEO_LOADER : "ui/SHOW_VIDEO_LOADER",
    SHOW_PRO_FEATURE: "ui/SHOW_PRO_FEATURE",
    SHOW_ABOUT: "ui/SHOW_ABOUT"
}
export const creators = {
    showOpenDialog: val =>({ type: types.SHOW_OPEN_DIALOG, payload: val }),
    showConfigPanel: (payload, scope)=>({
            type: types.SHOW_CONFIG_PANEL, 
            payload: payload,
            meta: {
                scope: scope
            }
    }),
    showVideoLoader: show => ({ type: types.SHOW_VIDEO_LOADER, payload: show }),
    showProFeature:  open => ({
            type: types.SHOW_PRO_FEATURE, 
            payload: {
                open: open.open,  
                message: open.message
            }
    }),
    showAbout: open =>({type: types.SHOW_ABOUT, payload: open})
}

export default (state={showConfig: false, showProFeatureDialog: false, showAbout: false}, action)=>{
    let newState = {...state};
    switch (action.type) {
        case types.SHOW_CONFIG_PANEL:
            newState.showConfig = action.payload;
            return newState;
        case types.SHOW_PRO_FEATURE: 
            newState.showProFeatureDialog.open = action.payload.open; 
            newState.showProFeatureDialog.message = action.payload.message;
            return newState; 
        case types.SHOW_ABOUT:
            newState.showAbout = action.payload;
            return newState;
        default:
            return newState;
    }
}