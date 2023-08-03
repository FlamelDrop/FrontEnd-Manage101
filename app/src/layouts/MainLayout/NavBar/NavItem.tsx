import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { Button, ListItem, makeStyles, Theme, Collapse } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FolderIcon from '@material-ui/icons/Folder';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { ArrowDownCircle } from 'react-feather';
import { useDispatch } from 'react-redux';
// import { GeneralAction } from 'src/stores/general/general.action';
// import { ActionReducer } from 'src/services/action.reducer';
// import { IStates } from 'src/stores/root.reducer';
// import { getCrumbs } from 'src/services/utils';
import { ActionSaga } from 'src/services/action.saga';
import { ReportAction } from 'src/stores/report/report.action';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    display: 'unset',
    paddingTop: 0,
    paddingBottom: 0,
    '& span.MuiTouchRipple-root': {
      borderBottom: '0.5px solid #d6d8da',
    },
  },
  itemLeaf: {
    fontSize: '16px',
    lineHeight: '18px',
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    '& span.MuiTouchRipple-root': {
      borderBottom: '0.5px solid #d6d8da',
    },
  },
  button: {
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    borderRadius: 0,
    padding: '15px',
    textAlign: 'left',
    fontSize: '16px',
    lineHeight: '18px'
  },
  buttonLeaf: {
    fontSize: '16px',
    padding: '15px',
    borderRadius: 0,
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: '18px',
    width: '100%',
    color:'#000000',
    backgroundColor:'#000',
    
    '&:hover': {
      color: '#70B642',
    },
  },
  roundedIcon: {
    color: '#70B642',
    backgroundColor: '#ffffff',
    borderRadius: '30px',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    fontSize: 20,
  },
  title: {
    marginRight: 'auto',
    textAlign: 'left'
  },
  active: {
    color:'#70B642',
    fontWeight:'bold',
    '&.depth-2': {
      '& $title': {
        fontWeight: theme.typography.fontWeightBold,
      },
    },
  },
  activeLv2: {
    marginRight: 'auto',
  },
  boxActive: {
    width: 5,
    position: 'absolute',
    backgroundColor: '#70B642',
    zIndex: 1,
    bottom: 1,
  },
  iconTitle: {
    display: 'flex',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: 20,
  },
}));

const NavItem = (propx: any) => {
  const { title, href, depth, children, icon: Icon, className, info: Info, ...rest } = propx;
  const classes: any = useStyles();
  const [open, setOpen] = useState(!!propx.open);
  const dispatch = useDispatch();
  // let location = useLocation();
  // const { list: menus } = useSelector((state: IStates) => state.menusReducer)
  // const crumbs = getCrumbs(menus, location.pathname);
  // const titleHeader = crumbs && crumbs.length > 0 ? crumbs[crumbs.length - 1].title : '';
  // const menuTitle = useSelector((state: any) => state.generalReducer.menuTitle);
  const [activeMenu,setActiveMenu] = useState(classes.buttonLeaf)

  // const setActive = (titleHeader: any) => {
  //   dispatch(
  //     ActionReducer({
  //       type: GeneralAction.GENERAL_MEUNU_ACTIVE,
  //       payload: { title: titleHeader },
  //     }),
  //   );
  // };

  // useEffect(() => {
  //   setActive(titleHeader);
  // }, []);

  const handleToggle = () => {
    setOpen((prevOpen: boolean) => !prevOpen);
  };

  let paddingLeft = 15;
  let backgroundColor = '#fff';

  if (depth > 0) {
    paddingLeft = 15 + 15 * depth;
    backgroundColor = '#f3f2f2';
  }
  if (depth > 1) {
    paddingLeft = 45;
  }

  const style = { paddingLeft, backgroundColor };

  if (children) {
    return (
      <ListItem className={clsx(classes.item, className)} disableGutters key={title} {...rest}>
        <Button className={classes.button} onClick={handleToggle} style={style}>
          {Icon && <Icon className={classes.icon} />}
          <AssignmentIcon className={classes.iconTitle} />
          <span className={open ? classes.activeLv2 : classes.title}>
            {title}
          </span>
          {open ? (
            <ExpandLessIcon fontSize="small" color="inherit" component="svg" className={classes.roundedIcon} />
          ) : (
            <ExpandMoreIcon fontSize="small" color="inherit" component="svg" />
          )}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    );
  }

  const handleOnClickOverall = () => {
    dispatch(
      ActionSaga({
          type: ReportAction.OVERALL_LIST_R
      })
    )
  }

  const renderButton = () => {
    if(href === '/admin/report/overall'){
      return (
        <Button
          onClick={() => {
            // setActive(title);
            setActiveMenu(classes.buttonLeaf)
            handleOnClickOverall()
          }}
          // activeClassName={classes.active}
          className={clsx(activeMenu, `depth-${depth}`)}
          component={RouterLink}
          exact
          style={style}
          to={'#'}
        >
          {Icon && <Icon className={classes.icon} />}
          <ArrowDownCircle className={classes.iconTitle} />
          <span className={classes.title}>
            {title}
          </span>
          {Info && <Info className={classes.info} />}
        </Button>
      )
    }else{
      return (
        <Button
          onClick={() => {
            // setActive(title);
            setActiveMenu(classes.buttonLeaf)
          }}
          activeClassName={classes.active}
          className={clsx(activeMenu, `depth-${depth}`)}
          component={RouterLink}
          exact
          style={style}
          to={href}
        >
          {Icon && <Icon className={classes.icon} />}
          {title === 'Dashboard' ? <DashboardIcon className={classes.iconTitle} /> : title === 'Project' ? <FolderIcon className={classes.iconTitle} /> : title === 'Task' ? <AssignmentIcon className={classes.iconTitle} /> : <ArrowDownCircle className={classes.iconTitle} />}
          <span className={classes.title}>
            {title}
          </span>
          {Info && <Info className={classes.info} />}
        </Button>
      )
    }
  }

  return (
    <ListItem className={clsx(classes.itemLeaf, className)} disableGutters key={title} {...rest}>
      {/* {menuTitle === title && <Box className={classes.boxActive} key={title}></Box>} */}
      {renderButton()}
    </ListItem>
  );
};

export default NavItem;