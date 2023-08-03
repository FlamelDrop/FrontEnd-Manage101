import { GanttComponent, TaskFieldsModel, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-gantt'
import React, { useEffect } from 'react'
import { PageContainer } from 'src/components'
import './roadmap.css'
import { generateTask } from 'src/services/utils'
import { useDispatch, useSelector } from 'react-redux'
import { IStates } from 'src/stores/root.reducer'
import { ActionSaga } from 'src/services/action.saga'
import { RoadmapAction } from 'src/stores/management/roadmap/roadmap.action'
import { useRouteMatch } from 'react-router-dom'
import { ProjectAction } from 'src/stores/management/project/project.action';
import { Paper,Grid, makeStyles } from '@material-ui/core';
import { CustomBtn } from 'src/components/atom';
import { useHistory } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: '#ffffff',
        height: 'auto',
        marginBottom: 20,
        padding: '40px 36px 33px 30px'
    },
    btnTRB: {
        padding: 5,
        backgroundColor: '#ffffff',
        borderRadius: 8,
    },
    filterForm: {
        color: 'black',
        '& select': {
            lineHeight: '28px',
            height: 25,

        }
    },
    filterFormInput: {
        '& input': {
            lineHeight: '28px',
            height: 25,
            fontSize: '16px',
        }
    }, styleSubModal: {
        marginTop: '-17px',
        textAlign: 'center'
    },
    projectName: {
        marginButtom: '36px',
        paddingLeft: '12px',
        display: 'flex',
        
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
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
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
}))

const Roadmap = () => {

    const router = useHistory()
    const dispatch = useDispatch();
    const classes = useStyles()
    let { params } = useRouteMatch();
    let genTasks: any[] = [];
    const { dataform, color }: any = useSelector((state: IStates) => state.roadmapReducer)
    const { form } = useSelector((state: IStates) => state.projectReducer)

    useEffect(() => {
        dispatch(
            ActionSaga({
                type: RoadmapAction.ROADMAP_LIST_R,
                payload: params.projectId
            })
        )
        dispatch(
            ActionSaga({
                type: ProjectAction.PROJECT_FORM_R,
                payload: params.projectId,
            })
        )
    }, [])

    const taskValue: TaskFieldsModel = {
        id: "no",
        name: "title",
        startDate: "start_date",
        endDate: "end_date",
        parentID: "parentID",
    }

    const queryTaskbarInfo = (args: any) => {
        args.taskbarBgColor = color;
    }

    generateTask(dataform, genTasks, 0, 0);

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

    return (
        <React.Fragment>
            <PageContainer>
                <Paper>
                    <Grid className={classes.projectName}>
                    <Grid item xs={9} sm={9} ><Tooltip title="Edit Project" followCursor onClick={handleEdit}><h2 className={classes.cursor}>{form ? form.title : ''}</h2></Tooltip></Grid>
                        <Grid item xs={3} sm={3} className={classes.buttonGroup}>
                            <CustomBtn className={classes.downloadBtn} onClick={handleTask} >Task</CustomBtn>
                            <CustomBtn className={classes.downloadBtnDisabled} onClick={handleRoadmap} disabled >Roadmap</CustomBtn>
                            <CustomBtn className={classes.downloadBtn} onClick={handleBoard}>Board</CustomBtn>
                        </Grid>
                    </Grid>
                </Paper>
                <GanttComponent dataSource={genTasks} dateFormat="dd/MM/yy" height='720px' width='max-content' taskFields={taskValue} queryTaskbarInfo={queryTaskbarInfo}  >
                    <ColumnsDirective>
                        <ColumnDirective field='noroad' headerText='ID' width='100'></ColumnDirective>
                        <ColumnDirective field='title' headerText='Name' width='200'></ColumnDirective>
                        <ColumnDirective field='start_date' format="dd/MM/yy"></ColumnDirective>
                        <ColumnDirective field='end_date' format="dd/MM/yy"></ColumnDirective>
                    </ColumnsDirective>
                </GanttComponent>
            </PageContainer>
        </React.Fragment>
    )
}
export default Roadmap