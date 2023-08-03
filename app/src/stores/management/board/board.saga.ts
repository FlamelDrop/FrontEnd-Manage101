import { takeLatest,put } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { callGet } from 'src/services/call-api';
import { ActionReducer } from 'src/services/action.reducer';
import { BoardAction } from './board.action';

const host = `${process.env.REACT_APP_API_HOST}`;

interface modelResponse {
  status: number;
  msg: string;
  data: any;
}

function* boardListSaga(e: IActionSaga) {
  const { payload } = e;
  try {
    const response:modelResponse = yield callGet(`${host}/v1/board/`, payload )
    yield put(ActionReducer({ 
      type: BoardAction.BOARD_LIST_S, 
      payload: {
        board:response.data, 
      }  
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

function* boardSprintSaga(e: IActionSaga){
  const { payload } = e
  try{
    const sprint_active:modelResponse = yield callGet(`${host}/v1/board/sprint_active/`, payload ) 
    yield put(ActionReducer({ 
      type: BoardAction.BOARD_SPRINT_S, 
      payload: {
        sprint_active: sprint_active.data.id
      }  
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

export default [
  takeLatest(BoardAction.BOARD_LIST_R, (e: IActionSaga) => boardListSaga(e)),
  takeLatest(BoardAction.BOARD_SPRINT_R, (e: IActionSaga) => boardSprintSaga(e)),
];