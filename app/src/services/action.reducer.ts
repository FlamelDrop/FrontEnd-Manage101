export interface IActionReducer {
    type: string;
    payload: any;
  }
  
  class eActionReducer {
    type: string = '';
    payload?: any = {};
  }
  export const ActionReducer = (e: eActionReducer) => e;
  