import React from 'react';
import { toAbsoluteUrl } from 'src/services/utils';
// import HomeIcon from '@material-ui/icons/Home';
// import { makeStyles } from '@material-ui/core';

// const useStyles = makeStyles(() => ({
//   boxLogo: {
//     borderRadius: '50%',
//     height: 32,
//     width: 32,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: '#ffff',
//     border: 'solid 1px',
//   },
// }));

function Logo(propx: any) {
  // const classes = useStyles();
  return <img alt="Logo"  src={toAbsoluteUrl('static/logo.png')}  {...propx} />;
  // return (
  //   <Box className={classes.boxLogo}>
  //     <HomeIcon />
  //   </Box>
  // );
}
export default Logo;
