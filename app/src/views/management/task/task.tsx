import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { ActionSaga } from 'src/services/action.saga';
import { TaskAction } from 'src/stores/management/task/task.action';
import { IStates } from 'src/stores/root.reducer';
import { PageContainer } from 'src/components'
import { TableIcons, Filter, Actions, ModalForm } from 'src/components/common'
import { TablePagination, Grid, TextField, makeStyles, Paper } from '@material-ui/core';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import MaterialTable from 'material-table'
import { Edit, Delete, AddCircleOutline } from '@material-ui/icons'
import { generateTask } from 'src/services/utils';
import { CentralAction } from 'src/stores/central/central.action';
import { ProjectAction } from 'src/stores/management/project/project.action';
import { useSnackbar } from 'notistack';
import { CustomBtn } from 'src/components/atom';

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

const TaskPage = () => {
    const router = useHistory()
    let { params } = useRouteMatch();
    const classes = useStyles()
    const dispatch = useDispatch();
    const { list, status_s} = useSelector((state: IStates) => state.taskReducer);
    const { resource, sprint,projectManager } = useSelector((state: IStates) => state.centralReducer);
    const { form } = useSelector((state: IStates) => state.projectReducer)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [OpenParent, setOpenParent] = useState(false);
    const [deleted, setDeleted] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    let genTasks: any[] = []
    let slicedTask:any[] = []
    // let countRow = (10 * page) + 1
    generateTask(list, genTasks, 0, 0)

    slicedTask= genTasks.slice((page) * pageSize, (page+1) * pageSize);
   
    useEffect(() => {
        for (let i = 0; i < projectManager.length; i++) {
            resource.push(projectManager[i])
        }
    }, [projectManager, resource])

    useEffect(() => {
        dispatch(
            ActionSaga({
                type: TaskAction.TASK_LIST_R,
                payload: {
                    page: 1,
                    page_size: 10,
                    search: '',
                    sprint_id: '',
                    status: '',
                    task_id_resource: '',
                    project_id: params.projectId,
                }
            })
        )
        dispatch(
            ActionSaga({
                type: CentralAction.CENTRAL_SPRINT_R,
                payload: { project_id: params.projectId }
            }))
        dispatch(
            ActionSaga({
                type: CentralAction.CENTRAL_RESOURCE_R
            }))
        dispatch(
            ActionSaga({
                type: ProjectAction.PROJECT_FORM_R,
                payload: params.projectId,
            })
        )
    }, [dispatch,params.projectId])
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

    const formik = useFormik({
        initialValues: {
            page: 1,
            page_size: 10,
            search: '',
            sprint_id: '',
            status: '',
            task_id_resource: '',
        },
        onSubmit: (values) => {
            renderList(1, pageSize, values.search, values.sprint_id, values.status, values.task_id_resource)
        }
    })
    const renderList = (page: number, page_size: number, search?: string, sprint_id?: any, status?: any, task_id_resource?: any) => {
        dispatch(
            ActionSaga({
                type: TaskAction.TASK_LIST_R,
                payload: {
                    page: page,
                    page_size: 10,
                    search: search,
                    sprint_id: sprint_id,
                    status: status,
                    project_id: params.projectId,
                    task_id_resource: task_id_resource,
                }
            })
        )
    };
    const handleClearSearch = (resetForm: any) => {
        dispatch(
            ActionSaga({
                type: TaskAction.TASK_LIST_R,
                payload: {
                    page: page + 1,
                    page_size: 10,
                    search: '',
                    sprint_id: '',
                    status: '',
                    project_id: params.projectId,
                    task_id_resource: '',
                },
            }))
        resetForm();
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

    const renderFilter = () => {
        return (
            <form onSubmit={formik.handleSubmit}>
                <Paper className={classes.paper}>
                    <Grid className={classes.projectName}>
                    <Grid item xs={9} sm={9} ><Tooltip title="Edit Project" followCursor onClick={handleEdit}><h2 className={classes.cursor}>{form ? form.title : ''}</h2></Tooltip></Grid>
                        <Grid item xs={3} sm={3} className={classes.buttonGroup}>
                            <CustomBtn className={classes.downloadBtnDisabled} onClick={handleTask} disabled >Task</CustomBtn>
                            <CustomBtn className={classes.downloadBtn} onClick={handleRoadmap} >Roadmap</CustomBtn>
                            <CustomBtn className={classes.downloadBtn} onClick={handleBoard}>Board</CustomBtn>
                        </Grid>
                    </Grid>
                </Paper>
                <Filter
                    visionFilter={true}
                    onSearch={formik.handleSubmit}
                    onClear={() => handleClearSearch(formik.resetForm)}
                >
                    <Grid item xs={12} sm={3}>
                        <TextField
                            className={classes.filterFormInput}
                            label={'Name'}
                            name={'search'}
                            placeholder={'Please fill in the task name'}
                            variant={'outlined'}
                            fullWidth
                            margin={'normal'}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            size="small"
                            value={formik.values.search}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            className={classes.filterForm}
                            label={'Sprint'}
                            name="sprint_id"
                            select
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
                            inputProps={{ style: { textAlign: 'center', color: (formik.values.sprint_id === '' ? '#546E7A' : 'black') } }}
                        >
                            <option key={''} hidden value={''} className={classes.filterForm}>
                                Choose sprint
                            </option>
                            {sprint.map((option, i) => (
                                <option key={i} value={option.id} className={classes.filterForm}>
                                    {option.title}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            className={classes.filterForm}
                            label={'Status'}
                            name="status"
                            select
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
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            inputProps={{ style: { textAlign: 'center', color: (formik.values.status === '' ? '#546E7A' : 'black') } }}
                        >
                            <option key={''} value={''} hidden className={classes.filterForm}>
                                Choose status
                            </option>
                            {status_s.map((option, i) => (
                                <option key={i} value={option.code} className={classes.filterForm}>
                                    {option.status}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            className={classes.filterForm}
                            label={'Owner'}
                            name="task_id_resource"
                            select
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
                            value={formik.values.task_id_resource}
                            onChange={formik.handleChange}
                            inputProps={{ style: { textAlign: 'center', color: (formik.values.task_id_resource === '' ? '#546E7A' : 'black') } }}
                        >
                            <option key={''} value={''} hidden className={classes.filterForm}>
                                Choose owner
                            </option>
                            {resource.map((option, i) => (
                                <option key={i} value={option.id} className={classes.filterForm}>
                                    {option.name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Filter>
            </form>
        )
    }

    const handleCreate = () => {
        router.push(`/admin/project/${params.projectId}/task/create`)
    }

    const handleSeletorDelete = () => {
        if (deleted !== '') {
            dispatch(
                ActionSaga({
                    type: TaskAction.TASK_DELETE_R,
                    payload: deleted,
                    onFailure: (msg: string) => {
                        return onMessage('error', msg);
                    },
                    onSuccess: (msg: string) => {
                        onMessage('success', msg);
                        return dispatch(
                            ActionSaga({
                                type: TaskAction.TASK_LIST_R,
                                payload: {
                                    page: page + 1,
                                    page_size: 10,
                                    search: '',
                                    sprint_id: '',
                                    status: '',
                                    project_id: params.projectId,
                                    task_id_resource: '',
                                }
                            }))
                    }
                }))
            setOpen(false);
        }

    }

    const closeConfirmDeleteModal = () => {
        setOpen(false);
        setOpenParent(false);
    }

    const modalDeleteConfirm = (rowData: any) => {

        if (genTasks.length > 0) {
            const taskChildren = genTasks.find(function (child: any) { return child.parentId === rowData.id })
            if (taskChildren !== undefined) {
                setDeleted('')
                setOpenParent(true);
            } else {
                setDeleted(rowData.id)
                setOpen(true);
            }

        }
    };

    return (
        <PageContainer>
            {renderFilter()}
            <ModalForm
                open={open}
                isSubmit={true}
                isCancel={true}
                onSubmit={handleSeletorDelete}
                onClose={closeConfirmDeleteModal}
                title={`Are you sure you want to delete this task ?`}
                titleBtnSubmit={`Delete`}
                titleButtonCancel={`Cancel`}
            />
            <ModalForm
                open={OpenParent}
                isSubmit={true}
                onSubmit={closeConfirmDeleteModal}
                onClose={closeConfirmDeleteModal}
                title={`Cannot delete this task`}
                children={<p className={classes.styleSubModal}>this task has sub task</p>}
                titleBtnSubmit={`Close`}


            />
            <MaterialTable
                localization={{
                    pagination: {
                        firstTooltip:"",
                        previousTooltip:"",
                        nextTooltip:"",
                        lastTooltip:"",
                    }
                }}
                components={{
                    Toolbar: props => {
                        const propsCopy = { ...props };
                        propsCopy.showTitle = false;
                        return (
                            <Actions visionButtonCreate={true} onCreate={handleCreate} textCreateButton={"Create Task"} />
                        )
                    },
                    Pagination: (props) => {
                        return (
                            <TablePagination
                                {...props}
                                count={list.length}
                                rowsPerPage={pageSize}
                                page={page}
                                onChangePage={(e, page) => {
                                    setPage(page);
                                    renderList(page + 1, pageSize)
                                }}
                            />
                        );
                    },
                }}
                icons={TableIcons}
                columns={[
                    {
                        title: 'No.',
                        field: 'id',
                        cellStyle: {
                            textAlign: 'left' as 'left',
                            paddingLeft: '100px',
                        },
                        headerStyle: {
                            textAlign: 'left' as 'left',
                            paddingLeft: '100px',
                        },
                        width: 50,
                        render: rowData => rowData.noroad
                    },
                    {
                        title: 'Task name',
                        field: 'title',
                        cellStyle: {
                            textAlign: 'left' as 'left',
                        },
                        headerStyle: {
                            textAlign: 'left' as 'left',
                        },
                        width: 50,
                    },
                    {
                        title: 'Sprint',
                        field: 'sprint_id',
                        cellStyle: {
                            textAlign: 'center' as 'center'
                        },
                        width: 50,
                        render: rowData => sprint.find(x => x.id === rowData.sprint_id) &&
                            sprint.find(x => x.id === rowData.sprint_id).title
                    },
                    {
                        title: 'Status',
                        field: 'status',
                        cellStyle: {
                            textAlign: 'center' as 'center'
                        },
                        width: 50,
                        render: rowData => status_s.find(x => x.code === rowData.status) &&
                            status_s.find(x => x.code === rowData.status).status
                    },
                    {
                        title: 'Owner',
                        field: 'name',
                        cellStyle: {
                            textAlign: 'center' as 'center'
                        },
                        width: 50,
                        render: rowData => rowData.task_id_resource?.length > 0 ? rowData.task_id_resource.map((row: any, index: number) => resource.find(x => x.id === row.user_id) && <span key={index}>{resource.find(x => x.id === row.user_id).name} {index < rowData.task_id_resource.length - 1 ? ", " : ""}</span>) : "-"
                    },
                ]}
                actions={[(rowData) => ({
                    position: 'row',
                    icon: () => <Tooltip title="Add Task" followCursor><AddCircleOutline /></Tooltip>,
                    onClick: (e, rowData) => router.push(`/admin/project/${params.projectId}/task/create?parentId=${rowData.id}&sprintId=${rowData.sprint_id}`),
                    disabled: (genTasks.find((item: any) => item.id === rowData.id) && genTasks.find((item: any) => item.id === rowData.id).level >= 3)
                }),
                {
                    icon: () => <Tooltip title="Edit" followCursor><Edit /></Tooltip>,
                    position: 'row',
                    onClick: (e, rowData) => router.push(`/admin/project/${params.projectId}/task/edit/${rowData.id}`)
                },
                {
                    icon: () => <Tooltip title="Delete" followCursor><Delete /></Tooltip>,
                    iconProps: { color: "primary" },
                    position: 'row',
                    onClick: (e, rowData) => modalDeleteConfirm(rowData),
                },
                ]}
                data={slicedTask}
                options={{
                    draggable: false,
                    search: false,
                    pageSize: 10,
                    sorting: false,
                    pageSizeOptions: [10, 20, 50, 100],
                    selection: false,
                    actionsColumnIndex: -1,
                    emptyRowsWhenPaging: false,
                    headerStyle: {
                        textAlign: 'center',
                    }
                }}
                onChangeRowsPerPage={(pageSize: any) => {
                    setPageSize(pageSize);
                    setPage(0);
                    renderList(1, pageSize)
                }}
            />
        </PageContainer>
    )
}

export default TaskPage