import { takeLatest, put } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { callGet, callPost, callPatch, callDelete } from 'src/services/call-api';
import { ActionReducer } from 'src/services/action.reducer';
import { ProjectAction } from './project.action';

const host = `${process.env.REACT_APP_API_HOST}`;

interface modelResponse {
  status: number;
  msg: string;
  data: any;
  status_s: any[];
  type_s: any[];
  sprint?: any[];
}

function* projectListSaga(e: IActionSaga) {
  const { payload } = e;
  try {
    const response: modelResponse = yield callGet(`${host}/v1/project/?time=${new Date().getTime()}`, payload)
    yield put(ActionReducer({
      type: ProjectAction.PROJECT_LIST_S,
      payload: {
        list: response.data.data.results,
        count: response.data.count,
        page: 1,
        page_size: 10,
      }
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

function* projectFormSaga(e: IActionSaga) {
  const { payload } = e;
  try {
    const response: modelResponse = yield callGet(`${host}/v1/project/${payload}`)
    yield put(ActionReducer({
      type: ProjectAction.PROJECT_FORM_S,
      payload: {
        form: response.data,
      }
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}


function* projectCreateSaga(e: IActionSaga) {
  const { project_id_attact, ...data } = e.payload
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  try {
    let formData = new FormData()
    let arr: any = []
    Object.keys(project_id_attact).forEach(fieldName => {
      formData.append(`file[${fieldName}]`, project_id_attact[fieldName].file);
      arr.push({ 'id': project_id_attact[fieldName].id, 'filename': project_id_attact[fieldName].filename, 'note': project_id_attact[fieldName].note })
    })

    if (arr.length !== 0) {
      formData.append('form', JSON.stringify({ ...data, 'project_id_attact': arr }))
    }else{
      formData.append('file', JSON.stringify(arr))
      formData.append('form', JSON.stringify(data))
    }

    yield callPost(`${host}/v1/project/add/`, formData, headers)

    e.onSuccess();
  } catch (err) {
    e.onFailure(err)
  }
}

function* projectUpdateSaga(e: IActionSaga) {
  const { project_id_attact, ...data } = e.payload
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  try {
    let formData = new FormData()
    let arr: any = []
    Object.keys(project_id_attact).forEach(fieldName => {
      formData.append(`file[${fieldName}]`, project_id_attact[fieldName].file);
      arr.push({ 'id': project_id_attact[fieldName].id, 'filename': project_id_attact[fieldName].filename, 'note': project_id_attact[fieldName].note })
    })

    if (arr.length !== 0) {
      formData.append('form', JSON.stringify({ ...data, 'project_id_attact': arr }))
    }else{
      formData.append('file', JSON.stringify(arr))
      formData.append('form', JSON.stringify(data))
    }

    yield callPatch(`${host}/v1/project/edit/${data.id}/`, formData, headers)
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

function* projectListSprintSaga(e: IActionSaga) {
  const { payload } = e
  try {
    const response: modelResponse = yield callGet(`${host}/v1/central/filter_sprint/`, payload)
    yield put(ActionReducer({
      type: ProjectAction.PROJECT_SPRINT_S,
      payload: response.data
    }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err)
  }
}

function* projectDeleteSaga(e: IActionSaga) {
  const { payload } = e
  try {
    yield callDelete(`${host}/v1/project/delete/${payload}`)
    e.onSuccess();
  } catch (err) {
    e.onFailure(err)
  }
}

function* sprintDeleteSaga(e: IActionSaga) {
  const { payload } = e
  try {
    yield callDelete(`${host}/v1/project/sprint/delete/${payload}`)
    e.onSuccess();
  } catch (err) {
    e.onFailure(err)
  }
}

export default [
  takeLatest(ProjectAction.PROJECT_LIST_R, (e: IActionSaga) => projectListSaga(e)),
  takeLatest(ProjectAction.PROJECT_FORM_R, (e: IActionSaga) => projectFormSaga(e)),
  takeLatest(ProjectAction.PROJECT_STORE, (e: IActionSaga) => projectCreateSaga(e)),
  takeLatest(ProjectAction.PROJECT_UPDATE, (e: IActionSaga) => projectUpdateSaga(e)),
  takeLatest(ProjectAction.PROJECT_SPRINT_R, (e: IActionSaga) => projectListSprintSaga(e)),
  takeLatest(ProjectAction.PROJECT_DELETE_R, (e: IActionSaga) => projectDeleteSaga(e)),
  takeLatest(ProjectAction.PROJECT_SPRINT_DELETE_R, (e: IActionSaga) => sprintDeleteSaga(e))
];