import { IActionReducer } from 'src/services/action.reducer';
import { ReportAction } from './report.action';

const project = [
  { name: "project1" },
  { name: "project2" },
  { name: "project3" },
  { name: "project4" },
  { name: "project5" },
]

const staff = [
{ name: "p'เติ้ล" },
{ name: "p'ไข่" },
{ name: "p'นุ" },
{ name: "p'ชิต" },
{ name: "p'พอร์ช" },
]
export interface IReportState {
  projects: any[],
  staffs: any[],
  startDate: any,
  endDate: any,
  project: any[],
  staff: any[],
  sort_by: any,
}

const ReportState = {
  projects: [],
  staffs: [],
  startDate: '',
  endDate: '',
  project: project,
  staff: staff,
  sort_by: '',

} as IReportState;


export default (state = ReportState, e: IActionReducer) => {
  switch (e.type) {
    case ReportAction.BYPROJECT_LIST_S: {
      const {projects, startDate, endDate, sort_by } = e.payload
        return { 
          ...state, 
          project: project,
          projects: projects,
          startDate: startDate,
          endDate: endDate,
          sort_by: sort_by,
        }
    }
    case ReportAction.BYSTAFF_LIST_S: {
      const { staffs, startDate, endDate, sort_by } = e.payload
        return { 
          ...state, 
          staff: staff,
          staffs: staffs,
          startDate: startDate,
          endDate: endDate,
          sort_by: sort_by,
        }
    }
    case ReportAction.OVERALL_LIST_S: {
      const { startDate, endDate, sort_by } = e.payload
        return { 
          ...state, 
          startDate: startDate,
          endDate: endDate,
          sort_by: sort_by,
        }
    }

    default: {
      return state;
    }
  }
};