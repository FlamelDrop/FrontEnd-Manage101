import { Box, Container, makeStyles, Paper } from '@material-ui/core'
import React from 'react'
import HeaderNavi from './header-navi'
import { useSelector } from 'react-redux';
import { IStates } from 'src/stores/root.reducer';

const useStyles = makeStyles((theme: any) => ({
    root: {
        backgroundColor: '#fff',
        padding: 0,
        marginTop: '-7px'
    },
    pageHeader: {
        padding: `${theme.spacing(3)}px 0`,
        display: 'flex',
        marginBottom: theme.spacing(3)
    },
    pageIcon: {
        display: 'inline-block',
        padding: theme.spacing(1),
        color: '#3c44b1'
    },
    pageTitle: {
        '& .MuiTypography-subtitle2' : {
            opacity:'0.6'
        }
    }
}))

const PageHeader = (props : any) => {
    const classes = useStyles()
    const { crumbs } = useSelector((state: IStates) => state.menusReducer)
    
    return (
        <Paper elevation={4} className={classes.root}>
            <Container maxWidth="xl">
                <Box className={classes.pageHeader}>
                    <Box className={classes.pageTitle}>
                        <HeaderNavi crumbs={crumbs} />
                    </Box>
                </Box>
            </Container>
        </Paper>
    )
}

export default PageHeader
