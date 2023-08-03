import { IActionReducer } from 'src/services/action.reducer';
import { ProjectAction } from './project.action';

export interface IProjectState {
  list: any[];
  form: any,
  PM:any[],
  statusData: any[],
  typeData: any[],
  count: Number;
  page: Number;
  page_size: Number;
  status_project: Number,
  type_project: Number,
  name_project: String,
  sprint: any[],
}

const ProjectState = {
  list: [],
  form: {},
  PM: [],
  typeData: [
    { id: 0, name: "Implement" },
    { id: 1, name: "MA" },
  ],
  statusData: [
    { id: 0, name: "Proposed" },
    { id: 1, name: "In Planing" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "On Hold" },
    { id: 4, name: "Completed" },
  ],
  count: 0,
  page: 1,
  page_size: 10,
  status_project: 0,
  type_project: 0,
  name_project: '',
  sprint: [],
} as IProjectState;


export default (state = ProjectState, e: IActionReducer) => {
  switch (e.type) {
    case ProjectAction.PROJECT_LIST_S: {
      const { list, count, page, page_size, name_project, type_project, status_project } = e.payload
      return {
        ...state,
        list: list,
        count: count,
        page: page,
        page_size: page_size,
        name_project: name_project,
        status_project:status_project,
        type_project:type_project,
      }
    }
    case ProjectAction.PROJECT_FORM_S: {
      const { list, form, PM } = e.payload
      return {
        ...state,
        list: list,
        form: form,
        PM:PM,
      }
    }

    case ProjectAction.PROJECT_SPRINT_S: {
      return {
        ...state,
        sprint: e.payload
      }
    }

    default: {
      return state;
    }
  }
};