import { IActionReducer } from 'src/services/action.reducer';
import { MenusAction } from './menus.action'

const MenusState = {
    isModal: false,
    isLoading: false,
    list: [],
    crumbs: [],
    header: '',
    error: ''
} as IMenusState

export interface IMenusState {
    isModal: boolean;
    isLoading: boolean;
    list: any[];
    crumbs: IHeaderNaviCrumbs[];
    header: string;
    error: string;
}

export interface IHeaderNaviCrumbs {
    title: string;
    link?: string;
  }

export default (state = MenusState, e: IActionReducer) => {
    switch (e.type) {
        case MenusAction.MENUS_LIST_R: {
            return {...state}
        }

        case MenusAction.MENUS_LIST_S: {
            const { payload } = e
            return { ...state, list: payload }
        }

        case MenusAction.MENUS_CRUMBS_LIST_S: {
            const { payload } = e
            return { ...state, crumbs: payload }
        }

        case MenusAction.MENUS_HEADER_S: {
            const { payload } = e
            return { ...state, header: payload }
        }

        case MenusAction.MENUS_RESET_S: {
          return { ...state, ...MenusState };
        }

        default: {
            return state
        }

    }
}