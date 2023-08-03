export interface IActionSaga {
    type: string;
    payload: any;
    project_id: Number;
    onSuccess: Function;
    onFailure: Function;
    onFinally: Function;
  }
  
  class eActionSaga {
    type: string = '';
    payload?: any = {};
    onSuccess?: Function = () => {};
    onFailure?: Function = () => {};
    onFinally?: Function = () => {};
  }
  export const ActionSaga = (e: eActionSaga) => {
    // Snackbar.dismiss();
    return {
      type: e.type,
      payload: e.payload || {},
      onSuccess: (data: any) => e.onSuccess && e.onSuccess(data),
      onFailure: (data: any) => {
        // Snackbar.show({
        //   text: data.message,
        //   duration: Snackbar.LENGTH_INDEFINITE,
        //   textColor: scheme.errorText,
        //   backgroundColor: scheme.errorBackgroud,
        //   fontFamily: themeFonts.default,
        //   action: {
        //     text: 'Close',
        //     onPress: () => {},
        //   },
        // });
        console.error(data);
        e.onFailure && e.onFailure(data);
      },
      onFinally: (data: any) => e.onFinally && e.onFinally(data),
    };
  };
  