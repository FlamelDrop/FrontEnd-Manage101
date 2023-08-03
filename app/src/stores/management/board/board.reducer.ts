import { IActionReducer } from 'src/services/action.reducer';
import { BoardAction } from './board.action';

export interface IBoardState {
    list: any[];
    sprint_active: any;
    name: any;
}
const BoardState = {
    list: [],
    sprint_active: "",
    name: ""
} as IBoardState;

export default (state = BoardState, e: IActionReducer) => {
    switch (e.type) {
        case BoardAction.BOARD_LIST_S: {  
            const {board} = e.payload
            return {
                ...state,
                list: board,
            }
        }

        case BoardAction.BOARD_SPRINT_S: {
            const {sprint_active} = e.payload
            return {
                ...state,
                sprint_active: sprint_active
            }
        }

        default: {
            return state;
        }
    }
};