import ytdl from 'ytdl-core';

export default (store)=>(next)=>(action)=>{
    switch(action.type){
        case "ADD_VIDEO":
            //let writeStream = fs.createWriteStream("enis.mp3");
            let video = ytdl(action.payload, { filter: (format) => format.container === 'mp4'});
            let videoObj = {
                title: "",
                thumbnail: "",
                downloaded: 0,
                url: ""
            }
            ytdl.getBasicInfo(action.payload, (err, info)=>{
                videoObj.title = info.title;
                videoObj.thumbnail = info.thumbnail_url;
                videoObj.url = action.payload;
                action.payload = videoObj;
                next(action);
            });
            break;
        default: 
        break;
    }
    next(action);
}