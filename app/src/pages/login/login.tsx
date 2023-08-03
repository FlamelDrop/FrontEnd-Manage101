// import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { Page } from 'src/components'
import BoxLogin from './box-login'

const useStyles = makeStyles(() => ({
    root: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#eee',
        // justifyContent: 'center',
        // // backgroundColor: theme.palette.background.dark,
        // display: 'flex',
        // height: '100%',
        // minHeight: '100%',
        // flexDirection: 'column',
    },
    // wrapper: {
    //     maxWidth: '400px',
    //     width: '100%'
    // }
}))

const LoginPage = () => {

    const classes = useStyles()

    return (
        <Page className={classes.root}>

            {/* <Box className={classes.wrapper}> */}
                <BoxLogin/>
            {/* </Box> */}
        </Page>
    )
}

export default LoginPage
