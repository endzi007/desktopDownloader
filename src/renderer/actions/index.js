export const addVideo = (url)=>{
    return {
        type: "ADD_VIDEO",
        payload: url
    }
}

export const deleteVideo = (url)=>{
    return {
        type: "DELETE_VIDEO",
        payload: url
    }
}