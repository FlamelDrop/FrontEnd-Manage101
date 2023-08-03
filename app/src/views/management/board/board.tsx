import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BoardAction } from 'src/stores/management/board/board.action';
import { ActionSaga } from 'src/services/action.saga';
import { IStates } from 'src/stores/root.reducer';
import { PageContainer } from 'src/components'
import { makeStyles, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Divider, Paper, Card, CardContent, Typography } from '@material-ui/core';
import { Filter } from 'src/components/common'
import { useFormik } from 'formik';
import { ProjectAction } from 'src/stores/management/project/project.action';
import { useRouteMatch } from "react-router-dom";
import { CustomBtn } from 'src/components/atom';
import { useHistory } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

interface DateTimeFormatOptions {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
    day?: "numeric" | "2-digit";
}

const useStyles = makeStyles({
    paper: {
        backgroundColor: '#ffffff',
        height: 'auto',
        marginBottom: 20,
        padding: '40px 36px 33px 30px'
    },
    table: {
        minWidth: 700,
        verticalAlign: 'initial',
    },
    divs: {
        height: 400,
        width: '100%'
    },
    tablecellStyle: {
        top: 0,
        width: '20%'
    },
    projectName: {
        marginButtom: '36px',
        paddingLeft: '12px',
        display: 'flex',
        
    },
    root: {
        minWidth: 100,
        marginBottom: '5%',
        padding: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 10,
    },
    pos: {
        marginBottom: 5,
        fontsize: 14
    },
    filterForm: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& select': {
            lineHeight: '28px',
            height: 25,
        }
    },
    nodataCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        margin: '10%',
        fontSize: '18px'
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    downloadBtn: {
        backgroundColor: '#ffffff',
        margin: 5,
        fontSize: '14px',
        textTransform:'none',
        border: '2px solid #ff6f00',
        color: '#ff6f00',
        '&:hover':{
            border: '2px solid #ff6f00',
            backgroundColor: '#ff6f00',
            color: '#ffffff',
        }
    },
    downloadBtnDisabled: {
        backgroundColor: '#ffffff',
        margin: 5,
        fontSize: '14px',
        textTransform:'none',
        border: '2px solid #535353',
        color: '#ff6f00',
        '&:hover':{
            border: '2px solid #535353',
            backgroundColor: '#535353',
            color: '#ffffff',
        }
    },
    cursor: {
        paddingTop: '8px',
        cursor: 'pointer',
        width: 'fit-content',
        '&:hover':{
            color: '#535353',
            borderBottom: 'solid'
        }
    }
});

export const initialForm = {
    sprint_id: ''
}


const BoardPage = () => {

    const router = useHistory()
    const classes = useStyles();
    const dispatch = useDispatch();
    let { params } = useRouteMatch();
    const { list, sprint_active } = useSelector((state: IStates) => state.boardReducer)
    const { sprint, form } = useSelector((state: IStates) => state.projectReducer)
    const [initialValues, setInitialValues] = useState({ sprint_id: sprint_active });

    useEffect(() => {
        dispatch(
            ActionSaga({
                type: BoardAction.BOARD_SPRINT_R,
                payload: {
                    project_id: params.projectId,
                }
            })
        )
        dispatch(
            ActionSaga({
                type: BoardAction.BOARD_LIST_R,
                payload: {
                    project_id: params.projectId,
                    sprint_id: sprint
                }
            })
        )
        if (params.projectId) {
            dispatch(
                ActionSaga({
                    type: ProjectAction.PROJECT_SPRINT_R,
                    payload: {
                        project_id: params.projectId
                    }
                })
            )
            dispatch(
                ActionSaga({
                    type: ProjectAction.PROJECT_FORM_R,
                    payload: params.projectId,
                })
            )
        }

    }, [])

    const formik = useFormik({
        initialValues,
        onSubmit: (values: any) => {
            renderList(values.sprint_id)
        }
    })

    useEffect(() => {
        formik.setFieldValue("sprint_id", sprint_active)
    }, [form])

    const renderList = (sprint_id: number) => {
        dispatch(
            ActionSaga({
                type: BoardAction.BOARD_LIST_R,
                payload: {
                    sprint_id: sprint_id,
                    project_id: params.projectId,
                }
            })
        )
    };


    const handleTask = () => {
        router.push(`/admin/project/${params.projectId}/task`)
    }

    const handleRoadmap = () => {
        router.push(`/admin/project/${params.projectId}/roadmap`)
    }

    const handleBoard = () => {
        router.push(`/admin/project/${params.projectId}/board`)
    }

    const handleEdit = () => {
        router.push(`/admin/project/edit/${params.projectId}`)
    }

    const renderFilter = () => {
        return (
            <form onSubmit={formik.handleSubmit}>
                <Paper className={classes.paper}>
                    <Grid className={classes.projectName}>
                        <Grid item xs={8} sm={8} ><Tooltip title="Edit Project" followCursor onClick={handleEdit}><h2 className={classes.cursor}>{form ? form.title : ''}</h2></Tooltip></Grid>
                        <Grid item xs={4} sm={4} className={classes.buttonGroup}>
                            <CustomBtn className={classes.downloadBtn} onClick={handleTask}>Task</CustomBtn>
                            <CustomBtn className={classes.downloadBtn} onClick={handleRoadmap} >Roadmap</CustomBtn>
                            <CustomBtn className={classes.downloadBtnDisabled} onClick={handleBoard} disabled >Board</CustomBtn>
                        </Grid>
                    </Grid>
                </Paper>
                <Filter
                    visionFilter={true}
                    onSearch={formik.handleSubmit}
                >
                    <Grid item sm={9}></Grid>
                    <Grid item sm={3}>
                        <TextField
                            className={classes.filterForm}
                            name="sprint_id"
                            select
                            label="Sprint"
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            size="small"
                            value={formik.values.sprint_id}
                            onChange={formik.handleChange}
                            error={Boolean(formik.errors.sprint_id)}
                            helperText={formik.errors.sprint_id}
                        >
                            <option key={''} value={''}>
                                Choose Sprint
                            </option>
                            {sprint.length > 0 && sprint.map((option, i) => (
                                <option key={i} value={option.id}>
                                    {option.title}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Filter>
            </form>
        )
    }

    const count = (row: any, status: number) => {
        if (row !== undefined) {
            if (row.length > 0) {
                return row.filter((rows: any) => {
                    return rows.status === status
                })
            }

            else {
                return []
            }
        }
        else {
            return []
        }
    }

    const checkStatus = (row: any, status: number, color: string) => {
        if (row !== undefined) {
            if (row.length > 0) {
                return row.map((rows: any, i: number) => {
                    if (rows.status === status) {
                        return renderCard(rows, i, color)
                    }
                })
            }
        }
    }

    const checkAssigee = (list: any) => {
        if (list !== undefined) {
            if (list.length > 0) {
                return list.map((key: any, i: number) => {
                    if (key.name !== "Data Not Found") {
                        return key.name + " "
                    }
                })
            }
            else {
                return "N/A"
            }
        }
        else {
            return "N/A"
        }
    }

    const convertDate = (date: any) => {
        var options: DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(["en-GB"], options);
    }

    const renderNodata = (color: string) => {
        return (
            <Typography className={classes.nodataCard} color="textSecondary" >
                No Data in this Sprint
            </Typography>
        )
    }

    const renderCard = (sprint: any, i: number, color: string) => {
        return (
            <Card key={i} className={classes.root} variant="outlined" style={{ backgroundColor: `${color}` }}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Task : {sprint.title}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary" variant="body2" component="p">
                        Estimated Time :
                    </Typography >
                    {
                        sprint.start_date !== "Time Period has not yet been Determined" ?
                            <Typography color="textSecondary" className={classes.pos} variant="body2" component="p">
                                {convertDate(sprint.start_date)} - {convertDate(sprint.end_date)}
                            </Typography>
                            :
                            <Typography color="textSecondary">
                                {sprint.start_date}
                            </Typography>
                    }
                    <Typography className={classes.pos} color="textSecondary" variant="body2" component="p">
                        Assigee : {checkAssigee(sprint.task_id_resource)}
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <PageContainer>
            {renderFilter()}
            <div className={classes.divs}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow  >
                                <Divider />
                                <TableCell align="center" >Plan ({count(list, 0).length})</TableCell>
                                <Divider />
                                <TableCell align="center" >To do ({count(list, 1).length})</TableCell>
                                <Divider />
                                <TableCell align="center" >In Progress ({count(list, 2).length})</TableCell>
                                <Divider />
                                <TableCell align="center" > Test ({count(list, 3).length})</TableCell>
                                <Divider />
                                <TableCell align="center" > Done ({count(list, 4).length})</TableCell>
                                <Divider />
                            </TableRow>
                        </TableHead>

                        <TableBody >
                            <TableRow className={classes.table}>
                                <Divider orientation="vertical" />
                                <TableCell className={classes.tablecellStyle}>
                                    {checkStatus(list, 0, "#F5F5F5")}
                                </TableCell>
                                <Divider className='boardline' orientation="vertical" />
                                <TableCell className={classes.tablecellStyle}>
                                    {checkStatus(list, 1, "#DAE8FC")}
                                </TableCell>
                                <Divider orientation="vertical" />
                                <TableCell className={classes.tablecellStyle}>
                                    {(count(list, 0).length === 0 && count(list, 1).length === 0 && count(list, 2).length === 0 && count(list, 3).length === 0 && count(list, 4).length === 0) ?
                                        renderNodata("#FFFFFF") : checkStatus(list, 2, "#FFE6CC")
                                    }
                                </TableCell >
                                <Divider orientation="vertical" />
                                <TableCell className={classes.tablecellStyle}>

                                    {checkStatus(list, 3, "#FFF2CC")}
                                </TableCell >
                                <Divider orientation="vertical" />
                                <TableCell>
                                    {checkStatus(list, 4, "#D5E8D4")}
                                </TableCell >
                                <Divider orientation="vertical" />
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </PageContainer>
    )
}
export default BoardPage