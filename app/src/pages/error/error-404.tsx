import React from 'react';
import { Box, Button, Typography, makeStyles, Card, CardContent } from '@material-ui/core';
import Page from '../../components/page';
// import { useHistory } from 'react-router';
function PageError404() {
  const classes = useStyles();
  // const history = useHistory();
  const onGoMain = () => {
    // history.replace('/');
    window.location.href = `${process.env.REACT_APP_WEB_HOST}`;
  };
  return (
    <Page className={classes.root} title="NotFound">
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Box mt={1}>
            <Typography align="center" style={{ fontSize: '2.125rem', color: 'black', fontWeight: 600 }}>
              ขออภัย ไม่พบหน้าที่คุณต้องการ
            </Typography>
          </Box>
          <Box mt={3} width="100%" className={classes.formContainer}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              className={classes.buttonBack}
              onClick={onGoMain}
            >
              ย้อนกลับไปหน้าแรก
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Page>
  );
}

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '100%',
    width: 560,
    maxHeight: 300,
    height: 'auto',
  },
  buttonBack: {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '10px',
    height: '50px',
    fontSize: '1.125rem',
    marginTop: theme.spacing(4),
    maxWidth: '286px',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: '#d43f3a',
    },
  },
  card: {
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    height: '100%',
    // backgroundImage: 'url("/static/images/error/404-background.jpg")',
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    // backgroundBlendMode: 'darken',
    backgroundColor:'#aae1dc',
    '& > *': {
      flexGrow: 1,
      flexBasis: '100%',
      width: '100%',
    },
    // '& .MuiCardContent-root:last-child': {
    //   paddingBottom: '64px',
    // },
  },

  cardContent: {
    padding: theme.spacing(8, 4, 3, 0),

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10px',
  },
}));

export default PageError404;
