import { takeLatest, put } from 'redux-saga/effects';
import { IActionSaga } from 'src/services/action.saga';
import { ActionReducer } from 'src/services/action.reducer';
import { ReportAction } from './report.action';
import moment from 'moment';

const host = `${process.env.REACT_APP_API_HOST}`;

interface modelResponse {
  status: number;
  msg: string;
  data: any;
  startDate: Date;
  endDate: Date;
  project: any[];
  sort_by: any;
}

function* reportByProjectSaga(e: IActionSaga) {
  const { payload } = e;
  let filename = ""
  if (payload.date_week === 'date') {
    filename = "report_by_project_"+payload.date_week+" from "+payload.start_date+" to "+payload.end_date+".xlsx"
  }
  else{
    filename = "report_by_project_"+payload.date_week+" from "+payload.start_date+" to "+payload.end_date+".xlsx"
  }
  try {
    fetch(`${host}/v1/report_byproject/`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(payload)
  })
  .then((response) => response.blob())
  .then((blob) => {
    const url = window.URL.createObjectURL(
      new Blob([blob]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
       filename
    );
    document.body.appendChild(link);
    link.click();
  });
    yield
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

function* reportByStaffSaga(e: IActionSaga) {
  const { payload } = e;
  let filename = ""
  if (payload.date_week === 'date') {
    filename = "report_by_staff_"+payload.date_week+" from "+payload.start_date+" to "+payload.end_date+".xlsx"
  }
  else{
    filename = "report_by_staff_"+payload.date_week+" from "+payload.start_date+" to "+payload.end_date+".xlsx"
  }
  try{
    yield put(ActionReducer({
      type: ReportAction.BYSTAFF_LIST_S,
      payload: payload
    }));
  fetch(`${host}/v1/report_bystaff/`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(payload)
  })
  .then((response) => response.blob())
  .then((blob) => {
    const url = window.URL.createObjectURL(
      new Blob([blob]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      filename,
    );
    document.body.appendChild(link);
    link.click();
  });
    e.onSuccess();
  }catch(err){
    e.onFailure(err);
  }
}

function* reportOverAll(e: IActionSaga) {
  let filename = "report-overall-"+moment(Date.now()).format("YYYY-MM-DD")+".xlsx"
  
  try {
    fetch(`${host}/v1/report_overall/`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.blob())
  .then((blob) => {
    const url = window.URL.createObjectURL(
      new Blob([blob]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
       filename
    );
    document.body.appendChild(link);
    link.click();
  });
    yield
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

export default [
  takeLatest(ReportAction.BYPROJECT_LIST_R, (e: IActionSaga) => reportByProjectSaga(e)),
  takeLatest(ReportAction.BYSTAFF_LIST_R, (e: IActionSaga) => reportByStaffSaga(e)),
  takeLatest(ReportAction.OVERALL_LIST_R, (e: IActionSaga) => reportOverAll(e)),
];