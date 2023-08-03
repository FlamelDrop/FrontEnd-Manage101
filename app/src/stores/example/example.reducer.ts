import { IActionReducer } from 'src/services/action.reducer';

export interface IExampleState {
  form: {};
}
const ExampleState = {
  form: {},
} as IExampleState;

export default (state = ExampleState, e: IActionReducer) => {
  switch (e.type) {

    default: {
      return state;
    }
  }
};
