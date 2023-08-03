import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { ActionSaga } from 'src/services/action.saga';
import { IStates } from 'src/stores/root.reducer';
import { PageContainer } from 'src/components'
import { ProjectAction } from 'src/stores/management/project/project.action';
import { TableIcons, Filter, Actions, ModalForm } from 'src/components/common'
import { TablePagination, Grid, TextField, makeStyles } from '@material-ui/core';
import Tooltip from '@mui/material/Tooltip';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { routeLink } from 'src/routes';
import { Edit, Delete } from '@material-ui/icons'
import MaterialTable from 'material-table'

const useStyles = makeStyles(() => ({
    btnTRB: {
        padding: 5,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        margin: -10
    },
    filterForm: {
        '& select': {
            lineHeight: '28px',
            height: 25,
            fontSize: '16px',
        }
    },
    filterFormInput: {
        '& input': {
            lineHeight: '28px',
            height: 25,
            fontSize: '16px',
        }
    },
    option: {
        color: '#000000'
    }
}))

const ProjectPage = () => {
    const router = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch();
    const { list, count, statusData, typeData } = useSelector((state: IStates) => state.projectReducer);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [deleted, setDeleted] = useState('');
    let countRow = (10 * page) + 1

    useEffect(() => {
        dispatch(
            ActionSaga({
                type: ProjectAction.PROJECT_LIST_R,
                payload: {
                    page: 1,
                    page_size: pageSize,
                    status_project: 0,
                    type_project: 0,
                    name_project: '',
                }
            })
        )
    }, [])

    const formik = useFormik({
        initialValues: {
            status: '',
            type: '',
            name: '',
        },
        onSubmit: (values) => {
            renderList(1, pageSize, values.status, values.type, values.name)
        }
    })

    const renderList = (page: number, pageSize: number, status?: any, type?: any, name?: string) => {
        dispatch(
            ActionSaga({
                type: ProjectAction.PROJECT_LIST_R,
                payload: {
                    page: page,
                    page_size: pageSize,
                    status: status,
                    type: type,
                    search: name,
                }
            })
        )
    };
    const handleClearSearch = (resetForm:any) => {
        dispatch(
            ActionSaga({
                type: ProjectAction.PROJECT_LIST_R,
                payload: {
                    page: page+1,
                    page_size: pageSize,
                    status_project: 0,
                    type_project: 0,
                    name_project: '',
                }}))
            resetForm();
    }
    const renderFilter = () => {
        return (
            <form onSubmit={formik.handleSubmit}>
                <Filter
                    visionFilter={true}
                    onSearch={formik.handleSubmit}
                    onClear={()=>handleClearSearch(formik.resetForm)}
                >
                    <Grid item xs={10} sm={4}>
                        <TextField
                            className={classes.filterFormInput}
                            label="Name"
                            name={'name'}
                            placeholder={'Please fill in the project name'}
                            variant={'outlined'}
                            fullWidth
                            margin={'normal'}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            size="small"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={10} sm={4}>
                        <TextField
                            className={classes.filterForm}
                            label="Status"
                            name="status"
                            select
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            inputProps={{ style: { textAlign: 'center', color: (formik.values.status === '' ? '#546E7A':'black') } }}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            size="small"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                        >
                            <option key={''} value={''} hidden > Choose status </option>
                            {statusData.map((option, i) => (
                                <option key={i} value={option.id} className={classes.option}>
                                    {option.name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={10} sm={4}>
                        <TextField
                            className={classes.filterForm}
                            label="Type"
                            name="type"
                            select
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            inputProps={{ style: { textAlign: 'center', color: (formik.values.type === '' ? '#546E7A':'black') } }}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            size="small"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                        >
                            <option key={''} value={''} hidden >Choose type</option>
                            {typeData.map((option, i) => (
                                <option key={i} value={option.id} className={classes.option}>
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
        router.push(routeLink.admin.mangement.projectForm)
    }

    const handleSeletorDelete = () => {
        dispatch(
            ActionSaga({
                type: ProjectAction.PROJECT_DELETE_R,
                payload: deleted,
                onSuccess: () => {
                    dispatch(
                        ActionSaga({
                            type: ProjectAction.PROJECT_LIST_R,
                            payload: {
                                page: page+1,
                                page_size: pageSize,
                                status_project: 0,
                                type_project: 0,
                                name_project: '',
                            }
                        })
                    )
                }
            })
        )
        setOpen(false);

    };

    const closeConfirmDeleteModal = () => {
        setOpen(false);
    };

    const modalDeleteConfirm = (rowData: any) => {
        setDeleted(rowData.id)
        setOpen(true);
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
                title={"Are you sure you want to delete this project ?"}
                titleBtnSubmit={"Delete"}
                titleButtonCancel={"Cancel"}
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
                        return <Actions visionButtonCreate={true} onCreate={handleCreate} textCreateButton={"Create Project"} />;
                    },
                    Pagination: (props) => {
                        return (
                                <TablePagination
                                    {...props}
                                    component="div"
                                    count={count}
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
                        width: 20,
                        render: rowData => countRow++
                    },
                    {
                        title: 'Name',
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
                        title: 'Status',
                        field: 'status',
                        cellStyle: {
                            textAlign: 'center' as 'center'
                        },
                        width: 50,
                        render: rowData => statusData.find(x => x.id === rowData.status) &&
                            statusData.find(x => x.id === rowData.status).name
                    },
                    {
                        title: 'Type',
                        field: 'type',
                        cellStyle: {
                            textAlign: 'center' as 'center'
                        },
                        width: 50,
                        render: rowData => typeData.find(x => x.id === rowData.type) &&
                            typeData.find(x => x.id === rowData.type).name
                    }
                ]}
                actions={[
                    {
                        position: 'row',
                        icon: () => <button className={classes.btnTRB}>Task</button>,
                        onClick: (e, rowData) => router.push(`/admin/project/${rowData.id}/task`)
                    },
                    {
                        position: 'row',
                        icon: () => <button className={classes.btnTRB}>Roadmap</button>,
                        onClick: (e, rowData) => router.push(`/admin/project/${rowData.id}/roadmap`)
                    },
                    {
                        position: 'row',
                        icon: () => <button className={classes.btnTRB}>Board</button>,
                        onClick: (e, rowData) => router.push(`/admin/project/${rowData.id}/board`)
                    },
                    {
                        position: 'row',
                        icon: () => <Tooltip title="Edit" followCursor><Edit /></Tooltip>,
                        onClick: (e, rowData) => router.push(`/admin/project/edit/${rowData.id}`)
                    },
                    {
                        position: 'row',
                        icon: () => <Tooltip title="Delete" followCursor><Delete /></Tooltip>,
                        onClick: (e, rowData) => modalDeleteConfirm(rowData)
                    },
                ]}
                data={list}
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
export default ProjectPage
