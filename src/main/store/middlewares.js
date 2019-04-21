import videoMiddleware from '../videos/videoMiddlewares';
import uiMiddleware from '../ui/uiMiddleware';
import optionsMiddleware from '../options/optionsMiddleware';
import appStateMiddleware from '../appState/appStateMiddleware';

export default [ appStateMiddleware, videoMiddleware, uiMiddleware, optionsMiddleware ];