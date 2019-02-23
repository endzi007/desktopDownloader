export const types = {
    ERROR_HANDLER: "ERROR_HANDLER"
}
export const creators = {
    errorHandler: (message)=>{
        return {
            type: ERROR_HANDLER,
            payload: message
        }
    }
}