import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from "react-router-dom";
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import { Grid, TextField, makeStyles, Paper, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { PageContainer } from 'src/components'
import FileUploadComponent from 'src/components/common/fileupload';
import { TaskAction } from 'src/stores/management/task/task.action';
import { CentralAction } from 'src/stores/central/central.action';
import { ActionSaga } from 'src/services/action.saga';
import { IStates } from 'src/stores/root.reducer';
import { generateTask } from 'src/services/utils';
import { useSnackbar } from 'notistack';
// import { isArray } from 'lodash';
import moment from 'moment';
import * as yup from 'yup';
import 'date-fns'
import Tooltip from '@mui/material/Tooltip';
import { CustomBtn } from 'src/components/atom';

var isArray = require("isarray")

const useStyles = makeStyles(() => ({
    projectName: {
        marginButtom: '36px',
        paddingLeft: '12px',
        display: 'flex',
        
    },
    paper: {
        backgroundColor: '#fff',
        height: 'auto',
        padding: '40px 30px 33px 30px',
        marginBottom: 20,
    },
    input: {
        display: 'none'
    },
    btn: {
        textAlign: 'center'
    },
    inputUpload: {
        color: '#ffffff',
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10
    },
    btncancel: {
        textAlign: "right"
    },
    warptext: {
        overflowWrap: 'break-word',
    }, HeadOwner: {
        color: '#5C7580',
    },
    buttonSubmit: {
        color: '#ffffff',
        width: '100px',
        backgroundColor: '#ff6f00',
        border: '2px solid #ff6f00',
        textTransform: 'none',
        "&:hover ": {
            color: '#ffffff',
            backgroundColor: '#FF7C25',
            border: '2px solid #FF7C25',
        },
    },
    buttonCancel: {
        color: '#413E3E',
        width: '100px',
        backgroundColor: '#e0e0e0',
        border: '2px solid #e0e0e0',
        textTransform: 'none',
        "&:hover ": {
            color: '#413E3E',
            backgroundColor: '#DBDBDB',
            border: '2px solid #DBDBDB',
        },
    },
    btnArea: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2%'
    },
    optionStyle: {
        color: 'black',
    },
    optionStyleDate: {
        color: '#546E7A',
    },
    buttonDateSubmit: {
        color: '#ffffff',
        marginLeft: '-16px',
        width: '100px',
        backgroundColor: '#ff6f00',
        border: '2px solid #ff6f00',
        textTransform: 'none',
        "&:hover ": {
            color: '#ffffff',
            backgroundColor: '#FF7C25',
            border: '2px solid #FF7C25',
        },
    },
    buttonDateCancel: {
        color: '#413E3E',
        width: '100px',
        backgroundColor: '#e0e0e0',
        border: '2px solid #e0e0e0',
        textTransform: 'none',
        "&:hover ": {
            color: '#413E3E',
            backgroundColor: '#DBDBDB',
            border: '2px solid #DBDBDB',
        },
    },
    downloadBtn: {
        backgroundColor: '#ffffff',
        margin: 5,
        textTransform:'none',
        fontSize: '14px',
        border: '2px solid #ff6f00',
        color: '#ff6f00',
        '&:hover':{
            border: '2px solid #ff6f00',
            backgroundColor: '#ff6f00',
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
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
}))

const initialForm = {
    title: '',
    description: '',
    project_id: '',
    sprint_id: '',
    parent_id: 0,
    task_id_resource: [],
    status: 0,
    start_date: moment(Date()).format("YYYY-MM-DD"),
    end_date: moment(Date()).format("YYYY-MM-DD"),
    actual_start_date: moment(Date()).format("YYYY-MM-DD"),
    actual_end_date: moment(Date()).format("YYYY-MM-DD"),
    task_id_attact: [],
}

const validationSchema = yup.object().shape({
    title: yup.string()
        .trim()
        .required('Please specify task name.'),
    project_id: yup.string()
        .trim()
        .required('Please select a project type.'),
    sprint_id: yup.string()
        .trim()
        .required('Please select a sprint type.'),
});

const TaskFormPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    let { params } = useRouteMatch();
    const dispatch = useDispatch()
    const classes = useStyles()
    const [initialValues, setInitialValues] = useState({ ...initialForm, project_id: params.projectId });
    const { form, status_s } = useSelector((state: IStates) => state.taskReducer)
    const  project_form  = useSelector((state: IStates) => state.projectReducer)
    const { resource, project, sprint, task,projectManager } = useSelector((state: IStates) => state.centralReducer)
    const router = useHistory()
    let genTasks: any[] = [];
    const queryParams = new URLSearchParams(window.location.search);
    const parentId = queryParams.get('parentId');
    const sprintId = queryParams.get('sprintId');

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        validateOnChange: false,
        validateOnBlur: true,
        
        onSubmit: (values: any) => {

            if (params.taskId) {
                dispatch(
                    ActionSaga({
                        type: TaskAction.TASK_UPDATE,
                        payload: values,
                        onFailure: (msg: string) => { return onMessage('error', msg); },
                        onSuccess: (msg: string) => {
                            onMessage('success', msg)
                            return handleSuccess();
                        },
                    }))
            } else {            
                dispatch(
                    ActionSaga({
                        type: TaskAction.TASK_STORE,
                        payload: values,
                        onFailure: (msg: string) => {
                            return onMessage('error', msg);
                        },
                        onSuccess: (msg: string) => {
                            onMessage('success', msg)
                            return handleSuccess();
                        },
                    }))
            }
            const handleSuccess = () => {
                router.push(`/admin/project/${params.projectId}/task`)
            }
            const onMessage = (status: any, text: string) => {
                return enqueueSnackbar(
                    text,
                    {
                        variant: status,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        }
                    });
            };
        }
    })

    useEffect(() => {
        for (let i = 0; i < projectManager.length; i++) {
            resource.push(projectManager[i])
        }
    }, [projectManager, resource])

    useEffect(() => {
        if (parentId && sprintId) {
            dispatch(
                ActionSaga({
                    type: CentralAction.CENTRAL_TASK_R,
                    payload: { sprint_id: sprintId }
                }))

            setInitialValues({
                ...initialValues,
                parent_id: parseInt(parentId),
                sprint_id: sprintId,
            });
        } else {
            dispatch(
                ActionSaga({
                    type: CentralAction.CENTRAL_TASK_R
                }))
        }

        dispatch(
            ActionSaga({
                type: CentralAction.CENTRAL_SPRINT_R,
                payload: { project_id: params.projectId }
            }))
        dispatch(
            ActionSaga({ type: CentralAction.CENTRAL_RESOURCE_R }))
        dispatch(
            ActionSaga({
                type: CentralAction.CENTRAL_PROJECT_R
            }))
        if (params.taskId) {
            dispatch(
                ActionSaga({
                    type: TaskAction.TASK_FORM_R,
                    payload: {
                        task_id: params.taskId,
                        project_id: params.projectId
                    }, onSuccess: (value: any) => {
                        dispatch(
                            ActionSaga({
                                type: CentralAction.CENTRAL_TASK_R,
                                payload: { sprint_id: value.sprint_id }
                            }))
                    },
                    onFinally: (value: any) => {
                        console.log("value = ",value)
                        return setInitialValues({
                            ...initialValues,
                            ...form,
                            ...value,
                        });
                    },
                }))
        }
    }, [params.taskId, dispatch])

    const handleChangeSprint = (value: any) => {
        if (value) {
            dispatch(
                ActionSaga({
                    type: CentralAction.CENTRAL_TASK_R,
                    payload: { sprint_id: value }
                }))
        }
        return formik.setFieldValue('sprint_id', value)
    }

    if (isArray(task) && task !== undefined) {
        generateTask(task, genTasks, 0, 0);
    }

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
        <>
            <PageContainer>
                <Paper className={classes.paper}>
                    <Grid className={classes.projectName}>
                        <Grid item xs={8} sm={8} ><Tooltip title="Edit Project" followCursor onClick={handleEdit}><h2 className={classes.cursor}>{project_form.form ? project_form.form.title : ''}</h2></Tooltip></Grid>
                        <Grid item xs={4} sm={4} className={classes.buttonGroup}>
                            <CustomBtn className={classes.downloadBtn} onClick={handleTask}>Task</CustomBtn>
                            <CustomBtn className={classes.downloadBtn} onClick={handleRoadmap} >Roadmap</CustomBtn>
                            <CustomBtn className={classes.downloadBtn} onClick={handleBoard} >Board</CustomBtn>
                        </Grid>
                    </Grid>
                </Paper>
                <form onSubmit={formik.handleSubmit} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={2}>
                                    <Grid item md={12} >
                                        <TextField
                                            name="title"
                                            label={'Task name***'}
                                            onChange={formik.handleChange}
                                            placeholder={'Please fill'}
                                            variant="outlined"
                                            fullWidth
                                            margin={'normal'}
                                            value={formik.values.title}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            error={Boolean(formik.errors.title)}
                                            helperText={formik.errors.title} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            label={'Description'}
                                            value={formik.values.description}
                                            multiline
                                            onChange={formik.handleChange}
                                            name={'description'}
                                            placeholder={'Task Description'}
                                            variant={'outlined'}
                                            fullWidth
                                            margin={'normal'}
                                            InputLabelProps={{
                                                shrink: true,
                                            }} />
                                    </Grid>
                                    <Grid item md={12} >
                                        <TextField
                                            label={'Project***'}
                                            inputProps={{ style: { textAlign: 'left', color: (formik.values.project_id === "0" ? '#546E7A' : 'black') } }}
                                            value={formik.values.project_id}
                                            onChange={formik.handleChange}
                                            name={'project_id'}
                                            select
                                            margin={'normal'}
                                            SelectProps={{
                                                native: true,
                                            }}
                                            variant={'outlined'}
                                            fullWidth
                                            error={Boolean(formik.errors.project_id)}
                                            helperText={formik.errors.project_id}>
                                            <option className={classes.optionStyle} key={"0"} value={"0"}>
                                                Please select
                                            </option>
                                            {project.map((option, key) => (
                                                <option className={classes.optionStyle} key={key} value={option.id}>
                                                    {option.title}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item md={12} >
                                        <TextField
                                            placeholder="Please select sprint"
                                            label={'Sprint***'}
                                            value={formik.values.sprint_id}
                                            onChange={(e) => handleChangeSprint(e.target.value)}
                                            name={'sprint_id'}
                                            inputProps={{ style: { textAlign: 'left', color: (formik.values.sprint_id === "" ? '#546E7A' : 'black') } }}
                                            select
                                            margin={'normal'}
                                            SelectProps={{ native: true, }}
                                            variant={'outlined'}
                                            fullWidth
                                            error={Boolean(formik.errors.sprint_id)}
                                            helperText={formik.errors.sprint_id}>
                                            <option className={classes.optionStyle} key={"0"} value={" "}>
                                                Please select
                                            </option>
                                            {isArray(sprint) && sprint !== undefined && sprint.map((option, key) =>
                                                <option className={classes.optionStyle} key={key} value={option.id}>
                                                    {option.title}&nbsp;::Start Date {moment(option.start_date).format('DD-MM-YYYY')}&nbsp;- End Date&nbsp;{moment(option.end_date).format('DD-MM-YYYY')}::
                                                </option>
                                            )}
                                        </TextField>
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            label={'Task'}
                                            inputProps={{ style: { textAlign: 'left', color: (formik.values.parent_id === 0 ? '#546E7A' : 'black') } }}
                                            placeholder="None"
                                            value={formik.values.parent_id}
                                            onChange={formik.handleChange}
                                            name={'parent_id'}
                                            select
                                            margin={'normal'}
                                            SelectProps={{
                                                native: true,
                                            }}
                                            variant={'outlined'}
                                            fullWidth
                                            error={Boolean(formik.errors.parent_id)}
                                            helperText={formik.errors.parent_id}>
                                            <option className={classes.optionStyle} key={"0"} value={0}>
                                                None
                                            </option>
                                            {isArray(genTasks) ? genTasks.map((option, key) => {
                                                const taskChildren = genTasks.filter(function (children: any) { return children.parentId === option.id })
                                                if (taskChildren.length > 0 && option.level <= 2) {
                                                    return (<option className={classes.optionStyle} disabled key={key} value={option.id}>{option.no} {option.title} </option>)
                                                } else {
                                                    return (<option className={classes.optionStyle} key={key} value={option.id}> {option.no} {option.title}</option>)
                                                }
                                            }) : []}
                                        </TextField>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={resource}
                                            getOptionLabel={(item: any) => {
                                                if (typeof item == "string") { return item }
                                                return item.name
                                            }}
                                            filterSelectedOptions
                                            value={resource.filter((seletion: any) => formik.values.task_id_resource.find((item: any) => item.user_id === seletion.id))}
                                            onChange={(e, value: any) =>
                                                formik.setFieldValue(
                                                    "task_id_resource",
                                                    value.map((item: any, index: number) =>
                                                        ({ "id": index, "user_id": item.id })))}
                                            renderInput={(params: any) => (
                                                <TextField
                                                    {...params}
                                                    label={'Owner'}
                                                    name={'task_id_resource'}
                                                    placeholder={'Please select'}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin={'normal'}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }} />)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            label={'Status'}
                                            value={formik.values.status}
                                            onChange={formik.handleChange}
                                            name={'status'}
                                            select
                                            placeholder={'Please select'}
                                            variant={'outlined'}
                                            fullWidth
                                            margin={'normal'}
                                            SelectProps={{ native: true, }}
                                            error={Boolean(formik.errors.status)}
                                            helperText={formik.errors.status}>
                                            {status_s.map((option, key) => (<option className={classes.optionStyle} key={key} value={option.code}>{option.status}</option>))}
                                        </TextField>
                                    </Grid>
                                    <Grid item md={6}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                label={'Start Date'}
                                                margin="normal"
                                                id="date-picker-dialog"
                                                format="dd/MM/yyyy"
                                                inputProps={{ style: { textAlign: 'center' }}}
                                                value={formik.values.start_date}
                                                okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                                                cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                                                fullWidth
                                                onChange={(date: any | null) => {
                                                    formik.setFieldValue(
                                                        "start_date",
                                                        date !== null ? moment(date).format("YYYY-MM-DD") : initialValues.start_date);
                                                }}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }} />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item md={6}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                label={'End Date'}
                                                margin="normal"
                                                id="date-picker-dialog"
                                                format="dd/MM/yyyy"
                                                inputProps={{ style: { textAlign: 'center' }}}
                                                fullWidth
                                                value={formik.values.end_date}
                                                okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                                                cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                                                minDate={formik.values.start_date}
                                                onChange={(date: any | null) => {
                                                    formik.setFieldValue(
                                                        "end_date",
                                                        date !== null ? moment(date).format("YYYY-MM-DD") : initialValues.end_date);
                                                }}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }} />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item md={6}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                label={'Actual Start Date'}
                                                margin="normal"
                                                id="date-picker-dialog"
                                                format="dd/MM/yyyy"
                                                inputProps={{ style: { textAlign: 'center' }}}
                                                value={formik.values.actual_start_date}
                                                okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                                                cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                                                fullWidth
                                                onChange={(date: any | null) => {
                                                    formik.setFieldValue(
                                                        "actual_start_date",
                                                        date !== null ? moment(date).format("YYYY-MM-DD") : initialValues.actual_start_date);
                                                }}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }} />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item md={6}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                label={'Actual End Date'}
                                                margin="normal"
                                                id="date-picker-dialog"
                                                format="dd/MM/yyyy"
                                                inputProps={{ style: { textAlign: 'center' }}}
                                                okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                                                cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                                                fullWidth
                                                value={formik.values.actual_end_date}
                                                minDate={formik.values.actual_start_date}
                                                onChange={(date: any | null) => {
                                                    formik.setFieldValue(
                                                        "actual_end_date",
                                                        date !== null ? moment(date).format("YYYY-MM-DD") : initialValues.actual_end_date);
                                                }}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }} />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item md={12} xs={2} className={classes.HeadOwner}>
                                        <h3>File</h3>
                                    </Grid>
                                    <Grid item md={12} xs={10}>
                                        <FileUploadComponent setFieldValue={formik.setFieldValue} onChange={formik.handleChange} value={formik.values.task_id_attact} field={"task_id_attact"} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} className={classes.btnArea} >
                            <Grid item md={1}></Grid>
                            <Grid item md={11} container spacing={1}>
                                <Grid item md={6} className={classes.btncancel}>
                                    <Button className={classes.buttonCancel} onClick={() => router.push(`/admin/project/${params.projectId}/task`)}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item md={6}>
                                    <Button className={classes.buttonSubmit} type={"submit"}>
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </PageContainer>
        </>)
}
export default TaskFormPage