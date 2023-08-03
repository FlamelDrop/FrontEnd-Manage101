import { takeLatest, put } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { callGet } from 'src/services/call-api';
import { ActionReducer } from 'src/services/action.reducer';
import { RoadmapAction } from './roadmap.action';

const host = `${process.env.REACT_APP_API_HOST}`;
// const hostTest = `https://expenses-api.aagold-th.com`

interface modelResponse {
  status: number;
  msg: string;
  data: any;
}

function* roadmapListSaga(e: IActionSaga) {
  const { payload } = e;
  try {
    const response:modelResponse = yield callGet(`${host}/v1/roadmap/${payload}`)
    yield put(ActionReducer({ 
      type: RoadmapAction.ROADMAP_LIST_S, 
      payload: {
        project_id: payload.project_id,
        list: response.data.results,
        dataform: response.data.project_id_task,
        color: response.data.color_code
      }
    }));
    console.log(response.data.project_id_task)
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

export default [
  takeLatest(RoadmapAction.ROADMAP_LIST_R, (e: IActionSaga) => roadmapListSaga(e)),
];