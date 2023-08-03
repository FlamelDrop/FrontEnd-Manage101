import React, { useEffect } from 'react';
import { Page, PageHeader } from 'src/components';
import { makeStyles, Container } from '@material-ui/core';
import { getCrumbs } from 'src/services/utils';
// import { routeNavi } from 'src/routes';
import { useDispatch, useSelector } from 'react-redux';
import { ActionSaga } from 'src/services/action.saga';
import { MenusAction } from 'src/stores/menus/menus.action';
import { useLocation } from 'react-router-dom';
import { IStates } from 'src/stores/root.reducer'

const useStyles = makeStyles((theme: any) => ({
  root: {
    minHeight: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

interface IPageContainer {
  children?: any;
}

const PageContainer = (props: IPageContainer) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  let location = useLocation();
  const { list: menus } = useSelector((state: IStates) => state.menusReducer)

  useEffect(() => {
    const crumbs = getCrumbs(menus, location.pathname);
    // const crumbs = getCrumbs(routeNavi, location.pathname);
    const pageHeader = crumbs.length > 0 ? crumbs[crumbs.length -1 ].title : "Page Header"
    if(crumbs.length > 0){
      dispatch(
        ActionSaga({
            type: MenusAction.MENUS_CRUMBS_LIST_S,
            payload: crumbs
        })
      )
    }
    dispatch(
      ActionSaga({
          type: MenusAction.MENUS_HEADER_S,
          payload: pageHeader
      })
    )
  },[dispatch, location.pathname, menus])
  
  return (
    <Page className={classes.root}>
      <PageHeader/>
      <Container maxWidth="xl">
        {props.children}
      </Container>
    </Page>
  );
};

export default PageContainer;
