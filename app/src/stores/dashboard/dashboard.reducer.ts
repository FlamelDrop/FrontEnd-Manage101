import { IActionReducer } from 'src/services/action.reducer';
import { DashboardAction } from './dashboard.action';

export interface IDashboardState {
  rows: any[];
}
const DashboardState = {
  rows: [],
} as IDashboardState;

export default (state = DashboardState, e: IActionReducer) => {
  switch (e.type) {
    case DashboardAction.DASHBOARD_LIST_S: {
      return { ...state, rows: e.payload }
    }
    default: {
      return state;
    }
  }
};
