import React, { useRef } from 'react';
// import { capitalCase } from 'change-case';
import { IconButton, SvgIcon, Tooltip, makeStyles, createStyles } from '@material-ui/core';
// import { Settings as SettingsIcon } from 'react-feather';
// import { useHistory } from 'react-router';
import { HomeOutlined } from '@material-ui/icons';

function Home() {
  const ref = useRef(null);
  // const history = useHistory();
  const classes: any = useStyles();

  const handleOpen = () => {
    // setOpen(true);
  };

  return (
    <>
      <Tooltip title="Single Sign On">
        <IconButton color="inherit" onClick={handleOpen} ref={ref}>
          <SvgIcon className={classes.iconSvg}>
            <HomeOutlined />
          </SvgIcon>
        </IconButton>
      </Tooltip>
    </>
  );
}
const useStyles = makeStyles(() =>
  createStyles({
    iconSvg: {
      fontSize: '1.8rem',
    },
  }),
);

export default Home;
