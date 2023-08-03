import React from 'react';
import { useLocation } from 'react-router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Box, Drawer, Hidden, List, makeStyles, Theme } from '@material-ui/core';
import NavItem from './NavItem';

function renderNavItems(propx: any) {
  const { items, ...rest } = propx;
  return (
    <List disablePadding>{items.reduce((acc: any, item: any) => reduceChildRoutes({ acc, item, ...rest }), [])}</List>
  );
}

function reduceChildRoutes(propx: any) {
  const { acc, pathname, item, depth = 0 } = propx;
  const key = item.title + depth;

  if (item.children?.length > 0) {
    // let check = false
    // for(var i=0; i < item.children.length && check === false; i++){
    //   console.log('check', check)
    //   if(check === false){
    //     const open = matchPath(pathname, {
    //       path: item.children[i].url,
    //       exact: false,
    //     });

    //     if(open !== null){
    //       return;
    //     }
    //   }
    // }

    acc.push(
      <NavItem 
        depth={depth} 
        // icon={item.icon} 
        key={key} 
        // info={item.info} 
        open={false} 
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.children,
        })}
      </NavItem>,
    );
  } else {
    acc.push(<NavItem depth={depth} href={item.url} icon={item.icon} key={key} info={item.info} title={item.title} />);
  }

  return acc;
}

const useStyles = makeStyles((theme: Theme) => ({
  mobileDrawer: {
    width: 256,
    padding: 0
  },
  desktopDrawer: {
    border: 0,
    width: 256,
    top: 65,
    height: 'calc(100% - 65px)',
    // boxShadow: '0 0 1px 0 rgba(0,0,0,0.31), 0 5px 8px -2px rgba(0,0,0,0.25)'
    padding: 0
  },
  scrollbar: {
    display: 'flex',
    flexDirection: 'column',
    border: 0,
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
    margin: '0 auto 10px'
  },
  menus: {
    flexGrow: 1,
  },
  boxName: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '150px',
  },
  navTop: {
    padding: theme.spacing(2, 2, 1),
    borderBottom: '0.5px solid #d6d8da',
    textAlign: 'center'
  },
  navBottom: {
    // padding: theme.spacing(0, 0, 3, 3),
    display: 'flex',
    flexDirection: 'column-reverse',
    height: 300,
    backgroundImage: 'url("/static/images/bg-navbar.svg")',
  },
  nonPadding: {
    padding: 0,
  },
  iconLogout: {
    width: '10px',
    height: '10px',
  },
  boxIconLogout: {
    background: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    padding: '6px',
    marginRight: '5px',
  },
  iconButton: {
    width: '30px',
    height: '30px',
    color: '#4D4D4F',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&.MuiIconButton-root:hover': {
      backgroundColor: '#D9D9D9',
    },
  },
  textSearch: {
    backgroundColor: '#F5F6FA',
    borderRadius: '30px',
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: theme.spacing(1),
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '30px',
      '& .MuiInputBase-input': {
        fontSize: 'small',
      },
    },
  },
  textPosition: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  logOut:{
    '& .MuiSvgIcon-root':{
      marginRight: '10px'
    }
  }
}));

const BoxMenus = (propx: any) => {
  const { location, classes, menuList=[] } = propx;
  return (
    <Box className={classes.menus}>
        <List className={classes.nonPadding} key={'pms'}>
          {renderNavItems({ items: menuList, pathname: location.pathname })}
        </List>
    </Box>
  );
};

const NavBar = (propx: any) => {
  const { openMobile, onMobileClose, menuList=[] } = propx;
  const classes = useStyles();
  const location = useLocation();

  const content = (
    <Box height="100%" display="flex" flexDirection="column" border={0}>
      <PerfectScrollbar className={classes.scrollbar} options={{ suppressScrollX: true }}>
        <BoxMenus classes={classes} location={location} menuList={menuList} />
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden mdUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{ elevation: 8 }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer anchor="left" PaperProps={{ elevation: 8 }} classes={{ paper: classes.desktopDrawer, }} open variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};
export default NavBar;