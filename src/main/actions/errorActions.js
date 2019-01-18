export const ERROR_HANDLER = "ERROR_HANDLER";
export const errorHandler = (message)=>{
    return {
        type: ERROR_HANDLER,
        payload: message
    }
}