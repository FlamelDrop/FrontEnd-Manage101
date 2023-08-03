import { GeneralAction } from './general.action';
import { IActionReducer } from 'src/services/action.reducer';

export interface IGeneralState {
  language: string;
  userIdLast: string;
  userInfo: {};
  refContent: () => {};
  menuTitle: string;
}
const GeneralState = {
  language: 'th', // ภาษาของระบบ
  userIdLast: '', // รหัสผู้ใช้งานที่ล็อคอินเข้าได้(ล่าสุด)
  userInfo: {}, // ข้อมูลผู้ใช้งานระบบ
  refContent: () => {}, // สำหรับให้  layout สามารถ scroll ได้
  menuTitle: '', //เก็บชื่อเมนูที่มีการเปิด
} as IGeneralState;

export default (state = GeneralState, e: IActionReducer): IGeneralState => {
  switch (e.type) {
    case GeneralAction.GENERAL_LANGUAGE: {
      const { language } = e.payload;
      return { ...state, language };
    }

    case GeneralAction.GENERAL_TOKEN_S: {
      const userInfo = e.payload.info;
      return { ...state, userInfo };
    }

    case GeneralAction.GENERAL_LAYOUT_S: {
      const { refContent } = e.payload;
      return { ...state, refContent };
    }

    case GeneralAction.GENERAL_MEUNU_ACTIVE: {
      const { title } = e.payload;
      return { ...state, menuTitle: title };
    }

    case GeneralAction.GENERAL_RESET_INFO: {
      return { ...state, ...GeneralState };
    }

    default:
      return state;
  }
};
