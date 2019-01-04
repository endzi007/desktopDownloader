import ffmpeg from 'ffmpeg-static';
export default {
    ffmpegPath: ffmpeg.path.replace('app.asar', 'app.asar.unpacked')
}