import React,{ useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AppBar, Box, Hidden, IconButton, Toolbar, makeStyles, SvgIcon, Button } from '@material-ui/core';
import { Menu as MenuIcon } from 'react-feather';
import appConfigs from 'src/configs/app.config'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch , useSelector} from 'react-redux';
import { IStates } from 'src/stores/root.reducer';
import { ActionSaga } from 'src/services/action.saga';
import { AuthenAction } from 'src/stores/authen/authen.action';
import { useLocation } from 'react-router';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import JwtDecode from 'jwt-decode';
import { CentralAction } from 'src/stores/central/central.action';

const useStyles = makeStyles((theme: any) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    padding: 0
  },
  toolbar: {
    minHeight: '65px',
  },
  logo: {
    '& a': {
      color: '#fff',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      textDecoration: 'none',
    },
    '& > *': {
      display: 'flex'
    },
    '& span': {
      backgroundColor: '#fff',
      borderRadius: '100%',
      width: '60px',
      height: '60px',
      display: 'flex',
      padding: '8px',
      boxShadow: '0 0 1px 0 rgba(0,0,0,0.31)',
      marginRight: '10px',
      '& img': {
        maxHeight: '55px',
        maxWidth: '100%'
      }
    },
    '& strong': {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      fontSize: '30px',
      lineHeight: '30px'
    }
  }, buttonField: {
    backgroundColor: '#E8E9E9',
    borderRadius: '50px',
    maxWidth: '400px',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'none',
    '&.MuiButton-contained': {
      boxShadow: '0 0 0px 0 rgba(0,0,0,0.31), 0 0px 0px 0px rgba(0,0,0,0.25)',
    },
    '&:hover': {
      backgroundColor: '#D5D5D5',
    },
  },
  logOut: {
    '& .MuiSvgIcon-root': {
      marginRight: '10px'
    }
  },
  UserName: {
    '& .MuiSvgIcon-root': {
      marginRight: '10px',
    }
  }
}));

const Logo = () => {
  return (
    <>
      <span><img alt="logo" src={`${process.env.PUBLIC_URL}/static/logo.png`} /></span>
      <strong>{appConfigs.app.name}</strong>
    </>
  )
};

const BoxMenuUser = (propx: any) => {
  const { token } = useSelector((state: IStates) => state.authenReducer)
  let nameUser
  if(token !== undefined){
    const { employee_name } = JwtDecode(token)
    nameUser = employee_name
  }
  const { classes } = propx;
  
  return (
    <Box className={classes.UserName}>
      <Button
        color="secondary"
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        className={classes.buttonField}        
      >
        <AccountCircleIcon/>
        {nameUser}
      </Button>
    </Box>
  );
};

const BoxMenuLogout = (propx: any) => {
  const { classes } = propx;
  const dispatch = useDispatch();
  const onLogout = (e: any) => {
    e.preventDefault()
    dispatch(
      ActionSaga({
        type: AuthenAction.AUTHEN_LOGOUT_R,
      })
    )
  };

  return (
    <Box className={classes.logOut}>
      <Button
        color="secondary"
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        className={classes.buttonField}
        onClick={onLogout}
      >
        <ExitToAppIcon/>
        Logout
      </Button>
    </Box>
  );
};

function TopBar(propx: any) {
  const { className, onMobileNavOpen, ...rest } = propx;
  const classes: any = useStyles();
  const location = useLocation();
  
  return (
    <AppBar elevation={8} className={clsx(classes.root, className)} {...rest}>
      <Toolbar className={classes.toolbar}>
        <Hidden mdUp>
          <IconButton className={classes.menuButton} color="inherit" onClick={onMobileNavOpen}>
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <Hidden smDown>
          <Box className={classes.logo}>
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>
        </Hidden>
        <Box ml={10} flexGrow={80} />
        <BoxMenuUser classes={classes} location={location} />
        <Box ml={0} flexGrow={1} />
        <BoxMenuLogout classes={classes} location={location} />
        <Box ml={2}></Box>
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;
