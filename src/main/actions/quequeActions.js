export const VIDEO_IN_QUEQUE = "VIDEO_IN_QUEQUE";
export const INCREMENT_QUEQUE_INDEX = "INCREMENT_QUEQUE_INDEX";

export const videoInQueque = (option, video)=>{
    //video is one of videos from playlist videos in store
    //option is INC or DEC determining if video should be pushed to queque or deleted from it
    return {
        type: VIDEO_IN_QUEQUE,
        payload: video,
        meta: {
            option: option
        }
    }
}

export const incrementQuequeIndex = (val)=>{
    return {
        type: INCREMENT_QUEQUE_INDEX,
        payload: val
    }
}