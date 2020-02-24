import { types as videoTypes } from '../videos/videoDuck';
import { types as optionsTypes } from "../options/optionsDuck";
import { types as uiTypes } from '../ui/uiDuck';


export default (store)=>(next)=>(action)=>{
    next(action);   
}