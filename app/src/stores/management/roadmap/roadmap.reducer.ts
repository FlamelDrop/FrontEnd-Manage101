import { IActionReducer } from 'src/services/action.reducer';
import { RoadmapAction } from './roadmap.action';

export interface IRoadmapState {
    list: any[];
    dataform: {},
    project_id: Number;
}
const RoadmapState = {
    list: [],
    dataform: {},
    project_id: 0,
    color: '',
} as IRoadmapState;

export default (state = RoadmapState, e: IActionReducer) => {
    switch (e.type) {
        case RoadmapAction.ROADMAP_LIST_S: {
            const { list, dataform, project_id, color} = e.payload           
            return {
                ...state,
                list: list,
                dataform: dataform,
                project_id: project_id,
                color: color,
            }
        }

        default: {
            return state;
        }
    }
};
