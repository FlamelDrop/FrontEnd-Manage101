import React, { useRef, useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import {
//   useDispatch,
//   useSelector
// } from 'react-redux';
import {
  // Avatar,
  Box,
  // Button,
  IconButton,
  // List,
  // ListItem,
  // ListItemAvatar,
  // ListItemText,
  Popover,
  SvgIcon,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';

import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
// import { getNotifications } from 'src/actions/notificationsActions';

// const iconsMap: any = {
//   order_placed: PackageIcon,
//   new_message: MessageIcon,
//   item_shipped: TruckIcon,
// };

const useStyles = makeStyles((theme) => ({
  popover: {
    width: 320,
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  iconSvg: {
    fontSize: '1.8rem',
  },
}));

function Notifications() {
  const classes: any = useStyles();
  // const notifications = useSelector((state: any) => state.notifications.notifications);
  const ref = useRef(null);
  // const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   dispatch(getNotifications());
  // }, [dispatch]);

  return (
    <>
      <Tooltip title="Notifications">
        <span>
          <IconButton color="inherit" ref={ref} onClick={handleOpen} disabled={true}>
            <SvgIcon className={classes.iconSvg}>
              <NotificationsNoneOutlinedIcon />
            </SvgIcon>
          </IconButton>
        </span>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Box p={2}>
          <Typography variant="h5" color="textPrimary">
            Notifications
          </Typography>
        </Box>
        {/* {notifications.length === 0 ? (
          <Box p={2}>
            <Typography variant="h6" color="textPrimary">
              There are no notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List className={classes.list} disablePadding>
              {notifications.map((notification: any) => {
                const Icon = iconsMap[notification.type];

                return (
                  <ListItem className={classes.listItem} component={RouterLink} divider key={notification.id} to="#">
                    <ListItemAvatar>
                      <Avatar className={classes.icon}>
                        <SvgIcon fontSize="small">
                          <Icon />
                        </SvgIcon>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                      secondary={notification.description}
                    />
                  </ListItem>
                );
              })} 
            </List>
            <Box p={1} display="flex" justifyContent="center">
              <Button component={RouterLink} size="small" to="#">
                Mark all as read
              </Button>
            </Box>
          </>
        )}*/}
      </Popover>
    </>
  );
}

export default Notifications;
