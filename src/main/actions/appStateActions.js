export const PARSING_DATA = "PARSING_DATA";

export const parsingData = (bool)=>{
    return {
        type: PARSING_DATA,
        payload: bool
    }
}
