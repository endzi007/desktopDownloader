import { app } from 'electron';
import path from 'path';

export default {
    ffmpegPath: path.resolve(app.getAppPath(), "static", "ffmpeg.exe")
}