# Dedex video downloader

Dedex video downloader is build with ElectronJS. Under the hood this program uses youtube-dl and ffmpeg for downloading and manipulating video files. 

# Currently supported features
  - Download single MP3 and MP4 files from Youtube and a lot of other sites...
  - Download youtube playlists 
  - Download only specific part of video  
You can also:
  - Import and save files.
  - Drag and drop videos directly into the software.
  - Automatically number downloads.

### Installation
1. Download from "Releases" section above and fallow the standard installation process.
- if you get any warnings during the installation on viruses or that software may be insecure, just ignore them. This is happening because software isn't from verified publisher. You can check that software is clean by scanning it afterwards with any antivirus.
2. Download latest youtube-dlp from [this link](https://github.com/yt-dlp/yt-dlp/tags)  and  download ffmpeg.exe  and ffprobe.exe build from [this link](https://mega.nz/folder/dglywDCY#ldVzLzEnlIGfKMgpgE97bQ) 
3. Put downloaded files into resources > static folder in your installation directory
4. Rename ytdlp to youtube-dl.exe

### Development
Want to contribute? Great!
Just clone this repository and thats it.
This software is using React, Redux and ElectronJS under the hood and youtube-dl and ffmpeg for interacting with remote video files. 


