import { IActionReducer } from 'src/services/action.reducer';
import { CentralAction } from './central.action';

export interface ICentralState {
  resource: any[],
  projectManager: any[],
  sprint:any[],
  task:any[],
  project:any[],
  resourcebystaff:any[],
}
const CentralState = {
  resource: [],
  projectManager: [],
  sprint:[],
  task:[],
  project:[],
  resourcebystaff:[],
} as ICentralState;

export default (state = CentralState, e: IActionReducer) => {
  switch (e.type) {
    case CentralAction.CENTRAL_RESOURCE_S: {
      const { resource, projectManager } = e.payload
      return {
        ...state,
        resource: (resource),
        projectManager: projectManager
      }
    }
    case CentralAction.CENTRAL_SPRINT_S: {
      return {
        ...state,
        sprint: e.payload
      }
    }
    case CentralAction.CENTRAL_TASK_S: {
      return {
        ...state,
        task: e.payload
      }
    }
    case CentralAction.CENTRAL_PROJECT_S: {
      const {data,all} = e.payload
      let items = []
      if (all !== undefined) {
         items = [{id: 0, status: 0, title: 'All', type: 0}].concat(data)
      }
      else{
         items = data
      }
      return {
        ...state,
        project: items
      }
    }
    case CentralAction.CENTRAL_RESOURCE_BYSTAFF_S: {
      const { data, all } = e.payload
      let items = []
      if (all !== undefined) {
         items = [{ id: 0, name: 'All'}].concat(data)
      }
      else {
        items = data
      }
      return {
        ...state,
        resourcebystaff: items
      }
    }
    default: {
      return state;
    }
  }
};