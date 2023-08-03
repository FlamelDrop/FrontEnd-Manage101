import { takeLatest, put } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { callGet } from 'src/services/call-api';
import { ActionReducer } from 'src/services/action.reducer';
import { DashboardAction } from './dashboard.action';

const host = `${process.env.REACT_APP_API_HOST}`;

interface modelResponse {
  status: number;
  msg: string;
  data: any;
}

function* dashboardListSaga(e: IActionSaga) {
  try {
    const response:modelResponse = yield callGet(`${host}/v1/dashboard/`)
    yield put(ActionReducer({ 
      type: DashboardAction.DASHBOARD_LIST_S, 
      payload: response.data
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

export default [
  takeLatest(DashboardAction.DASHBOARD_LIST_R, (e: IActionSaga) => dashboardListSaga(e)),
];