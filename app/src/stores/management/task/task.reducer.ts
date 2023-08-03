import { IActionReducer } from 'src/services/action.reducer';
import { TaskAction } from './task.action';

  const test_status = [
    {
        "status": 'Plan',
        "code": 0
    },
    {
        "status": 'To Do',
        "code": 1
    },
    {
        "status": 'In Progress',
        "code": 2
    },
    {
        "status": 'Test',
        "code": 3
    },
    {
        "status": 'Done',
        "code": 4
    }
  ]

export interface ITaskState {
  list: any[];
  form:{},
  count: Number;
  page: Number;
  page_size: Number;
  status_s: any[];
  name_task: String;
  sprint_task: Number;
  status_task: Number;
  owner_task: Number;
}

const TaskState = {
  list: [],
  form: {},
  count: 10,
  page: 1,
  page_size: 10,
  status_s: test_status,
  name_task: '',
  sprint_task: 0,
  status_task: 0,
  owner_task: 0,
} as ITaskState;

export default (state = TaskState, e: IActionReducer) => {
  switch (e.type) {
    case TaskAction.TASK_LIST_S: {
      const { list,count, page, page_size,search,sprint_id,status_id ,task_id_resource} = e.payload
      return { 
          ...state, 
          list: list,
          count: count,
          page: page,
          page_size: page_size,
          search: search,
          sprint_id: sprint_id,
          status_id: status_id,
          task_id_resource: task_id_resource,
        }
    }
    case TaskAction.TASK_FORM_S: {
      const { form} = e.payload
      
        return { 
          ...state, 
          form: form,
        }
    }
    default: {
      return state;
    }
  }
};