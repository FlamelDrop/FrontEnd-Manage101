import React from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { Delete, Add } from '@material-ui/icons'
import { CustomBtn } from '../atom'

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        '& .MuiFormControl-root': {
            padding: 0
        },
        '& .MuiGrid-grid-sm-3': {
            marginBottom: 12
        }
    },
    btnCreate: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#ffffff',
        margin: 5,
        textTransform: 'none'
    },
    btnDelete: {
        backgroundColor: '#ffffff',
        margin: 5
    },
}))
interface IActions {
    visionButtonCreate?: boolean,
    visionButtonDelete?: boolean,
    textCreateButton?: string,
    onCreate?: () => void,
    onDelete?: () => void
}

const Actions = (props: IActions) => {
    const { onCreate, onDelete, visionButtonCreate=false, visionButtonDelete=false, textCreateButton="Created" } = props
    const classes = useStyles()
    return (
        <Grid className={classes.root} container spacing={1}>
            <Grid item alignContent="flex-end" sm={12}>
                <Grid container justify="flex-end" >
                    {
                        visionButtonCreate &&
                            <CustomBtn onClick={onCreate} btncolor="#ff6f00" hvcolor="#ffffff" hvbgcolor="#ff6f00"  startIcon={<Add/>} className={classes.btnCreate} variant="contained">{textCreateButton}</CustomBtn>
                    }
                    {
                        visionButtonDelete &&
                            <CustomBtn className={classes.btnDelete} btncolor="#ffffff"  startIcon={<Delete/>} onClick={onDelete} variant="contained">ลบ</CustomBtn>
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Actions
