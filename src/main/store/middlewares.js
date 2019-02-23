import videoMiddleware from '../videos/videoMiddlewares';
import uiMiddleware from '../ui/uiMiddleware';
import edgeCaseMiddleware from '../errors/edgeCaseMiddleware';
import optionsMiddleware from '../options/optionsMiddleware';

export default [ videoMiddleware, uiMiddleware, edgeCaseMiddleware, optionsMiddleware ];