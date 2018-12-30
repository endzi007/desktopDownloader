import { VIDEO_IN_QUEQUE, INCREMENT_QUEQUE_INDEX} from '../actions/quequeActions';
export default (state = {
    limit: 5, 
    queque: [],
    currentIndex: 0
  }, action)=>{
    let newState = {...state};
    switch (action.type) {
        case VIDEO_IN_QUEQUE:
            action.meta.option === "ADD"? newState.queque.push(action.payload): newState.queque.splice(newState.queque.indexOf(action.payload), 1);
            return newState
        case INCREMENT_QUEQUE_INDEX: 
            newState.currentIndex = action.payload;
            return newState;
        default:
            return newState;
    }
}