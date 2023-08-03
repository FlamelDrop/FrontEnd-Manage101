import { takeLatest, put } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { callDelete, callGet } from 'src/services/call-api';
import { ActionReducer } from 'src/services/action.reducer';
import { CentralAction } from './central.action';

const host = `${process.env.REACT_APP_API_HOST}`;

interface modelResponse {
  status: number;
  msg: string;
  data: any;
}

function* centralResourceSaga(e: IActionSaga) {
  try {
    const projectManager:modelResponse = yield callGet(`${host}/v1/central/filter_employee/?position_id=1`)
    const resource:modelResponse = yield callGet(`${host}/v1/central/filter_employee/?position_id=2`)
    yield put(ActionReducer({ 
      type: CentralAction.CENTRAL_RESOURCE_S, 
      payload:{ 
        resource:resource.data,
        projectManager:projectManager.data
      }
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

function* centralTaskSaga(e: IActionSaga) {
  const { payload } = e;
  try {
    const response: modelResponse = yield callGet(`${host}/v1/central/filter_task/`, payload)
    yield put(ActionReducer({
      type: CentralAction.CENTRAL_TASK_S,
      payload: response.data,
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

function* centralSprintSaga(e: IActionSaga) {
  const { payload } = e;
  try {
    const response: modelResponse = yield callGet(`${host}/v1/central/filter_sprint/`, payload)
    yield put(ActionReducer({
      type: CentralAction.CENTRAL_SPRINT_S,
      payload: response.data,
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}
function* centralProjectSaga(e: IActionSaga) {
  const { all,...rest } = e.payload;
  try {
    const response: modelResponse = yield callGet(`${host}/v1/central/filter_project/`,rest)
    yield put(ActionReducer({
      type: CentralAction.CENTRAL_PROJECT_S,
      payload: {data:response.data,all},
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

function* fileDeleteSaga(e: IActionSaga) {
  const { payload } = e
  try {
    yield callDelete(`${host}/v1/${payload.field}/attactment/delete/${payload.id}/`)
    e.onSuccess();
  } catch (err) {
    e.onFailure(err)
  }
}


function* centralResourceByStaffSaga(e: IActionSaga) {
  const { all, ...rest } = e.payload
  try {
    const resourcebystaff:modelResponse = yield callGet(`${host}/v1/central/filter_employee/`, rest)
    if (all === 1){
      yield put(ActionReducer({ 
        type: CentralAction.CENTRAL_RESOURCE_BYSTAFF_S, 
        payload: {data:resourcebystaff.data, all},
      }));
    }
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

export default [
  takeLatest(CentralAction.CENTRAL_RESOURCE_R, (e: IActionSaga) => centralResourceSaga(e)),
  takeLatest(CentralAction.CENTRAL_PROJECT_R, (e: IActionSaga) => centralProjectSaga(e)),
  takeLatest(CentralAction.CENTRAL_SPRINT_R, (e: IActionSaga) => centralSprintSaga(e)),
  takeLatest(CentralAction.CENTRAL_TASK_R, (e: IActionSaga) => centralTaskSaga(e)),
  takeLatest(CentralAction.CENTRAL_DELETE_FILE_R, (e: IActionSaga) => fileDeleteSaga(e)),
  takeLatest(CentralAction.CENTRAL_RESOURCE_BYSTAFF_R, (e: IActionSaga) => centralResourceByStaffSaga(e)),
];