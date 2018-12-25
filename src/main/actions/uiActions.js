export const SHOW_OPEN_DIALOG = "SHOW_OPEN_DIALOG";
export const SHOW_CONFIG_PANEL = "SHOW_CONFIG_PANEL";

export const showOpenDialog = (val)=>{

    return {
        type: SHOW_OPEN_DIALOG, 
        payload: val
    }
}


export const showConfigPanel = (payload, scope)=>{
    return {
        type: SHOW_CONFIG_PANEL, 
        payload: payload,
        meta: {
            scope: scope
        }
    }
}