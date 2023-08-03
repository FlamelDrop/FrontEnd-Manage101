import { takeLatest, put } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { MenusAction } from './menus.action'
import { ActionReducer } from 'src/services/action.reducer';
import { callGet } from 'src/services/call-api';

const host = `${process.env.REACT_APP_API_HOST}`;

interface modelResponse {
    status: number;
    msg: string;
    data: any;
  }

function* menusListSaga(e: IActionSaga) {
    const { payload } = e;
    try {
        const headers = {
            'Authorization': payload
        }
        const response:modelResponse = yield callGet(`${host}/v1/central/menu`, {}, headers);
        yield put(ActionReducer({ type: MenusAction.MENUS_LIST_S, payload: response.data }));
        e.onSuccess();
    }catch (err) {
        e.onFailure(err)
    }
}

export default [
    takeLatest(MenusAction.MENUS_LIST_R, (e: IActionSaga) => menusListSaga(e)),
];