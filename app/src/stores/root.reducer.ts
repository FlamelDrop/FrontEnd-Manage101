import { combineReducers } from 'redux';
import authenReducer, { IAuthenState } from './authen/authen.reducer';
import generalReducer, { IGeneralState } from './general/general.reducer';
import menusReducer, { IMenusState } from './menus/menus.reducer'
import projectReducer, { IProjectState } from './management/project/project.reducer'
import dashboardReducer, { IDashboardState} from './dashboard/dashboard.reducer'
import boardReducer, { IBoardState } from './management/board/board.reducer'
import reportReducer, { IReportState } from './report/report.reducer'
import taskReducer, { ITaskState } from './management/task/task.reducer';
import roadmapReducer, {IRoadmapState} from './management/roadmap/roadmap.reducer';
import centralReducer,{ ICentralState } from './central/central.reducer';
import exampleReducer, { IExampleState } from './example/example.reducer';

export const rootPersist = ['authenReducer', 'generalReducer', 'menusReducer'];
export const authPersist = ['authenReducer'];

export interface IStates {
    authenReducer: IAuthenState
    generalReducer: IGeneralState
    menusReducer: IMenusState
    projectReducer: IProjectState
    taskReducer: ITaskState
    dashboardReducer:IDashboardState
    boardReducer:IBoardState
    reportReducer:IReportState
    roadmapReducer:IRoadmapState
    centralReducer:ICentralState
    exampleReducer:IExampleState
}

const rootReducer = combineReducers({
    authenReducer,
    generalReducer,
    menusReducer,
    projectReducer,
    taskReducer,
    dashboardReducer,
    boardReducer,
    reportReducer,
    roadmapReducer,
    centralReducer,
    exampleReducer,
})
export default rootReducer