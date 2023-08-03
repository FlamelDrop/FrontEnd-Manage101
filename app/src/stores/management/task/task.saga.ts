import { takeLatest, put } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { ActionReducer } from 'src/services/action.reducer';
import { TaskAction } from './task.action';
import { callDelete, callGet, callPatch, callPost } from 'src/services/call-api';

const host = `${process.env.REACT_APP_API_HOST}`;
// const hostTest = `https://expenses-api.aagold-th.com`

interface modelResponse {
  status: number;
  msg: string;
  data: any;
  error_detail: any;
}
// ----------------------------------แสดงรายการ------------------------------------
function* taskListSaga(e: IActionSaga) {
  const { payload } = e;
  try {
    const response: modelResponse = yield callGet(`${host}/v1/task/`, payload)
    yield put(ActionReducer({
      type: TaskAction.TASK_LIST_S,
      payload: {
        list: response.data,
        count: response.data.count,
        page: payload.page,
        page_size: payload.page_size ,
        search: response.data.search,
        sprint_id: response.data.sprint_id,
        status_id: response.data.status_id,
        task_id_resource: response.data.task_id_resource,
      }
    }));
    if(response.error_detail){
      const err = JSON.parse(response.error_detail.http_body)
      e.onFailure(err.msg);
    }else{
      e.onSuccess(response.msg);
    }
  } catch (err) {
    e.onFailure(err);
  }
}
// ----------------------------------แสดงTask------------------------------------
function* taskFormSaga(e: IActionSaga) {
  const { payload } = e;
  try {
    const response: modelResponse = yield callGet(`${host}/v1/task/${payload.task_id}/`)
    yield put(ActionReducer({
      type: TaskAction.TASK_FORM_S,
      payload: {
        form: response.data,
      }
    }));
    e.onFinally(response.data)
    if(response.error_detail){
      const err = JSON.parse(response.error_detail.http_body)
      e.onFailure(err.msg);
    }else{
      e.onSuccess(response.msg);
    }
  } catch (err) {
    e.onFailure(err);
  }
}
// ----------------------------------สร้างTask------------------------------------
function* taskStoreSaga(e: IActionSaga) {
  const { task_id_attact, ...data } = e.payload
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  let arr:any[]=[]
  try {
    let formData = new FormData()
    Object.keys(task_id_attact).forEach(fieldName => {
        formData.append(`file[${fieldName}]`, task_id_attact[fieldName].file);
         arr.push({'filename':task_id_attact[fieldName].filename,'note':task_id_attact[fieldName].note})
    })
    if (arr.length !==0){
      formData.append('form', JSON.stringify({...data,'task_id_attact':arr}))
    }else{
      formData.append('file', JSON.stringify([arr]))
      formData.append('form', JSON.stringify(data))
    }
    const response : modelResponse = yield callPost(`${host}/v1/task/add/`, formData, headers)
    if(response.error_detail){
      const err = JSON.parse(response.error_detail.http_body)
      e.onFailure(err.msg);
    }else{
      e.onSuccess(response.msg);
    }
  } catch (err) {
    e.onFailure(err);
  }
}
// ----------------------------------แก้ไขTask------------------------------------
function* taskUpdateSaga(e: IActionSaga) {
  const { task_id_attact, ...data } = e.payload
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  let arr:any[]=[]
  try {
    let formData = new FormData()
    Object.keys(task_id_attact).forEach(fieldName => {
        formData.append(`file[${fieldName}]`, task_id_attact[fieldName].file);
         arr.push({'id':task_id_attact[fieldName].id,'filename':task_id_attact[fieldName].filename,'note':task_id_attact[fieldName].note})
    })
    if (arr.length !==0){
      formData.append('form', JSON.stringify({...data,'task_id_attact':arr}))
    }else{
      formData.append('file', JSON.stringify(arr))
      formData.append('form', JSON.stringify(data))
    }
    
    const response : modelResponse = yield callPatch(`${host}/v1/task/update/${data.id}/`, formData,headers)
    if(response.error_detail){
      const err = JSON.parse(response.error_detail.http_body)
      e.onFailure(err.msg);
    }else{
      e.onSuccess(response.msg);
    }
  } catch (err) {
    e.onFailure(err);
  }
}
// ----------------------------------ลบTask------------------------------------
function* taskDeleteSaga(e: IActionSaga){
  const { payload } = e
  try{
    const response:modelResponse = yield callDelete(`${host}/v1/task/delete/${payload}` )
    if(response.error_detail){
      const err = JSON.parse(response.error_detail.http_body)
      e.onFailure(err.msg);
    }else{
      e.onSuccess(response.msg);
    }
  } catch (err) {
    e.onFailure(err)
  }
}

export default [
  takeLatest(TaskAction.TASK_LIST_R, (e: IActionSaga) => taskListSaga(e)),
  takeLatest(TaskAction.TASK_FORM_R, (e: IActionSaga) => taskFormSaga(e)),
  takeLatest(TaskAction.TASK_STORE, (e: IActionSaga) => taskStoreSaga(e)),
  takeLatest(TaskAction.TASK_UPDATE, (e: IActionSaga) => taskUpdateSaga(e)),
  takeLatest(TaskAction.TASK_DELETE_R, (e: IActionSaga) => taskDeleteSaga(e)),
];
