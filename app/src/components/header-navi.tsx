import React from 'react';
import { makeStyles, Breadcrumbs, Link, Typography, Box } from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingTop: theme.spacing(1)
  },
  routeCurrent: {
    fontWeight: 600,
  },
}));

export interface IHeaderNaviCrumbs {
  title: string;
  link?: string;
}
interface IHeaderNavi {
  crumbs?: IHeaderNaviCrumbs[];
}
const HeaderNavi = (props: IHeaderNavi) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.crumbs && props.crumbs.length > 0 && (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
          {props.crumbs.map((item: IHeaderNaviCrumbs, index) => {
            return (
              <Box key={index}>
                {item.link && index + 1 !== props.crumbs?.length ? (
                  <Link variant="body1" color="inherit" to={item.link} component={RouterLink}>
                    {item.title}
                  </Link>
                ) : (
                  <Typography
                    variant="body1"
                    className={clsx(index + 1 === props.crumbs?.length && classes.routeCurrent)}
                    color="textPrimary"
                  >
                    {item.title}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Breadcrumbs>
      )}
    </div>
  );
};

export default HeaderNavi;
