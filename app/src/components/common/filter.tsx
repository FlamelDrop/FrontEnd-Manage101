import React from 'react';
import { Button, makeStyles, Grid, Paper, Box, Icon, Tooltip  } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme:any) => ({
    paper: {
        backgroundColor:'#ffffff',
        height:'auto',
        marginBottom: 20,
        padding: '40px 36px 33px 30px'
    },
    searchBar:{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        paddingRight :'177px',
        '& .MuiFormControl-root':{
            padding: 0
        },
        '& .MuiGrid-grid-sm-3': {
          marginBottom: 12
        }
    },
    buttonSearchDefault:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
        color: '#ff6f00',
        width: '100px',
        backgroundColor: '#ffffff',
        border: '2px solid #ff6f00',
        textTransform: 'none',
        "&:hover ": {
            color: '#ffffff',
            backgroundColor: '#ff6f00',
            border: '2px solid #ff6f00',
        },
    },
    buttonClearDefault:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
        color: '#535353',
        backgroundColor: '#ffffff',
        border: '2px solid #535353',
        "&:hover ": {
            color: '#ffffff',
            backgroundColor: '#535353',
            border: '2px solid #535353',
        },
    },
    buttonSearchLeft:{
        width: '10px',
        '& button':{
            height: 46,
            color: '#000000',
            border: '2px solid #000000',
            backgroundColor: '#ffffff',
        }
    },
    buttonDefault :{
        display: 'flex',
        justifyContent: 'flex-end',
        textAlign: 'right',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        marginRight: '10',
        '& button':{
            height: 46,
        },
    }
}))
interface IFilters {
    children: any
    visionFilter?: boolean
    visionButtonCreate?: boolean
    visionButtonDelete?: boolean
    btnPosition?: "default" | "left" | "right" | undefined
    onCreate?: () => void
    onDelete?: () => void
    onSearch?: () => void
    onClear?: () => void
}

const Filter = (props: IFilters) => {
    const { children, onSearch, onClear, visionFilter=false, btnPosition="default" } = props
    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <Grid className={classes.searchBar} container>
                {
                    visionFilter &&
                    <>
                        <Grid item sm={12}>
                            <Grid container spacing={1}>
                                {children}
                                {
                                    btnPosition === "left" &&
                                    <Grid item sm={3} >
                                        <Box className={classes.buttonSearchLeft}>
                                            <Button startIcon={<Search/>} variant="contained" onClick={onSearch}>ค้นหา</Button>
                                        </Box>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                        {
                            btnPosition === "default" &&
                            <Box className={classes.buttonDefault} >
                                <Tooltip title="Clear Search" >
                                    <Button className={classes.buttonClearDefault} onClick={onClear}>
                                        <Icon component={ClearIcon} fontSize="medium" type="button" />
                                    </Button>
                                </Tooltip>
                                    <Button className={classes.buttonSearchDefault} onClick={onSearch}>
                                        <Icon component={SearchIcon} fontSize="medium" type="button" />
                                        Search
                                    </Button>
                            </Box>
                        }
                    </>
                }
            </Grid>
        </Paper>
    )
}

export default Filter