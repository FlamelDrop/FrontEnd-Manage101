import { all } from 'redux-saga/effects';
import authenSaga from './authen/authen.saga';
import projectSaga from './management/project/project.saga'
import taskSaga from './management/task/task.saga';
import dashboardSaga from './dashboard/dashboard.saga'
import boardSaga from './management/board/board.saga'
import reportSaga from './report/report.saga'
import roadmapSaga from './management/roadmap/roadmap.saga';
import menusSaga from './menus/menus.saga'
import centralSaga from './central/central.saga';
import exampleSaga from './example/example.saga'

const rootSaga = function*(){
    yield all([
        ...authenSaga,
        ...projectSaga,
        ...taskSaga,
        ...dashboardSaga,
        ...boardSaga,
        ...reportSaga,
        ...roadmapSaga,
        ...menusSaga,
        ...centralSaga,
        ...exampleSaga,
    ]);
}
export default rootSaga
