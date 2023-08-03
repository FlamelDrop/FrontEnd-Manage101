import { takeLatest } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { ExampleAction } from './example.action';
import { callPost } from 'src/services/call-api';

const host = `${process.env.REACT_APP_API_HOST}`;

interface modelResponse {
  status: number;
  msg: string;
  data: any;
}

function* exampleStore(e: IActionSaga) {
  const { project_id_attact, project_id_attact_desc } = e.payload
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  try {
    let formData = new FormData()
    // Object.keys(data).forEach(fieldName => {
    //     formData.append(fieldName, data[fieldName]);
    // })

    if (Object.keys(project_id_attact).length > 0) {
        // formData.append('files', files)
        formData.append('project_id_attact', project_id_attact)
        formData.append('project_id_attact_desc', project_id_attact_desc)
    }
    console.log("before")
    const response:modelResponse = yield callPost(`${host}/v1/project/add/`, formData, headers)
    console.log("response example : ",response)

    e.onSuccess();
  }catch (err) {
    console.log("Err : ", err)
    e.onFailure(err)
  }
}

export default [
  takeLatest(ExampleAction.EXAMPLE_STORE, (e: IActionSaga) => exampleStore(e)),
];
