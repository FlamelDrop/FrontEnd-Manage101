import React, { useEffect, useState } from 'react'
import { PageContainer } from 'src/components'
import { useFormik } from 'formik';
import { Grid, TextField, makeStyles, Paper, Modal, Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useHistory, useRouteMatch } from "react-router-dom";
import * as yup from 'yup';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FileUpload } from 'src/components/common';
import SprintTables from './sprint-table';
import { useDispatch, useSelector } from 'react-redux';
import { IStates } from 'src/stores/root.reducer';
import { ProjectAction } from 'src/stores/management/project/project.action';
import { ActionSaga } from 'src/services/action.saga';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { routeLink } from 'src/routes';
import { CentralAction } from 'src/stores/central/central.action';
// import { isArray } from 'lodash';
import { CustomBtn } from 'src/components/atom';
import Tooltip from '@mui/material/Tooltip';

var isArray = require("isarray")

const useStyles = makeStyles(() => ({
    paper: {
        backgroundColor: '#fff',
        height: 'auto',
        marginBottom: 20,
        padding: '40px 30px 33px 30px',
        borderRadius: '20px',
    },
    FirstArea: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    DetailArea: {
        display: 'flex',
        justifyContent: 'start',
        alignContent: 'start',
    },
    textcenter: {
        textAlign: 'center'
    },
    btnArea: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2%'
    },
    colorShow: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%'
    },
    HeadOwner: {
        color: '#ff6f00',
        fontSize: 'larger',
        fontWeight: 'bold',
    },
    HeaderName: {
        display: 'flex',
        textAlign: 'start',
        margin: 'auto',
        marginRight: '0%',
        paddingRight: '0%',
    },
    colorArea: {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        margin: '0%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: '200% auto',
        background: "linear-gradient(315deg, #f5d020 0%, #f53803 100%)",
    },
    btncancel: {
        textAlign: "right"
    },
    colorModal: {
        position: 'absolute',
        top: "50%",
        left: '50%',
        transform: `translate(-50%, -50%)`,
        margin: "1%"
    },
    colorButton: {
        display: 'flex',
        justifyContent: "space-around",
        alignItems: 'center',
        marginTop: "20px"
    },
    buttonSubmit: {
        marginLeft: '1%',
        color: '#ffffff',
        width: '100px',
        backgroundColor: '#ff6f00',
        border: '2px solid #ff6f00',
        textTransform: 'none',
        "&:hover ": {
            backgroundColor: '#ff7c25',
            border: '2px solid #ff7c25',
            textDecorationStyle: 'dotted'
        },
    },
    buttonCancel: {
        marginRight: '1%',
        color: '#413e3e',
        width: '100px',
        backgroundColor: '#e0e0e0',
        border: '2px solid #e0e0e0',
        textTransform: 'none',
        "&:hover ": {
            backgroundColor: '#DBDBDB',
            border: '2px solid #DBDBDB',
        },
    },
    option: {
        color: 'black',
    },
    downloadBtn: {
        backgroundColor: '#ffffff',
        margin: 5,
        textTransform: 'none',
        fontSize: '14px',
        border: '2px solid #ff6f00',
        color: '#ff6f00',
        '&:hover': {
            border: '2px solid #ff6f00',
            backgroundColor: '#ff6f00',
            color: '#ffffff',
        }
    },
    cursor: {
        paddingTop: '8px',
        cursor: 'pointer',
        width: 'fit-content',
        '&:hover': {
            color: '#535353',
            borderBottom: 'solid'
        }
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    projectName: {
        marginButtom: '36px',
        paddingLeft: '12px',
        display: 'flex',

    },
}))

interface initialForm {
    contact_id: number;
    reference_id: number;
}

export const initialForm = {
    id: 0,
    title: '',
    color_code: '#fe6f00',
    contact_id: 0,
    contact_number: '',
    owner: '',
    owner_company: '',
    owner_number: '',
    type: 0,
    status: 0,
    module: '',
    description: '',
    reference_id: 0,
    project_id_resource: [],
    project_id_sprint: [],
    project_id_attact: [],
}

const validationSchema = yup.object().shape({
    title: yup.string()
        .trim()
        .required('Please fill project name.'),
});

const ProjectFormPage = () => {
    let { params } = useRouteMatch();
    const classes = useStyles()
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { form, statusData, typeData } = useSelector((state: IStates) => state.projectReducer);
    const { resource, projectManager, project } = useSelector((state: IStates) => state.centralReducer);
    const [initialValues, setInitialValues] = useState(initialForm);
    const [open, setOpen] = useState(false);
    const router = useHistory()

    useEffect(() => {
        dispatch(
            ActionSaga({
                type: ProjectAction.PROJECT_FORM_R,
                payload: params.projectId
            })
        )
        dispatch(
            ActionSaga({
                type: CentralAction.CENTRAL_RESOURCE_R,
            })
        )
        dispatch(
            ActionSaga({
                type: CentralAction.CENTRAL_PROJECT_R,
            })
        )
    }, [params.projectId, dispatch])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        validateOnChange: false,
        validateOnBlur: true,
        onSubmit: (values: any) => {
            if (params.projectId) {
                setInitialValues(values);
                dispatch(
                    ActionSaga({
                        type: ProjectAction.PROJECT_UPDATE,
                        payload: values,
                        onFailure: (msg: string) => {
                            //  setModalEditForm(!modalEditForm)
                            return onMessage('error', msg);
                        },
                        onSuccess: (msg: string) => {
                            //  renderList(1,pageSize,formik.values.branch)
                            //  setModalEditForm(!modalEditForm)
                            return onMessage('success', msg) &&
                                router.push(routeLink.admin.mangement.project)
                        },
                    })
                )
            } else {
                setInitialValues(values);
                dispatch(
                    ActionSaga({
                        type: ProjectAction.PROJECT_STORE,
                        payload: values,
                        onFailure: (msg: string) => {
                            //  setModalEditForm(!modalEditForm)
                            return onMessage('error', msg);
                        },
                        onSuccess: (msg: string) => {
                            //  renderList(1,pageSize,formik.values.branch)
                            //  setModalEditForm(!modalEditForm)
                            return onMessage('success', msg) &&
                                router.push(routeLink.admin.mangement.project)
                        },
                    })
                )
            }
            const onMessage = (status: any, text: string) => {
                return enqueueSnackbar(
                    status,
                    {
                        variant: status,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        }
                    }
                );
            };
        }
    })

    const reference = project.filter(function (item: any, i: number) {
        return item.id !== formik.values.id
    })

    useEffect(() => {
        if (params.projectId) {
            setInitialValues({
                ...initialForm,
                ...form
            });
        }
    }, [form, params.projectId])

    // ############################## Color Picker ##################################

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [color, setColor] = useColor("hex", formik.values.color_code);

    const colorChange = () => {
        formik.setFieldValue('color_code', color.hex);
        setOpen(false);
    };

    // ############################## Phone Number Allow ##########################

    const handleChange = (e: any) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            formik.handleChange(e)
        }
    }

    // ###########################################################################

    const selectPhonePM = (e: any) => {
        let id = projectManager.find(num => num.id === e)
        formik.setFieldValue('contact_id', parseInt(e))
        if (id !== undefined) {
            formik.setFieldValue('contact_number', id.phone)
        } else {
            formik.setFieldValue('contact_number', '')
        }
    }

    // ############################################################################

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

    // #############################################################################

    useEffect(() => {
        for (let i = 0; i < projectManager.length; i++) {
            resource.push(projectManager[i])
        }
    }, [projectManager, resource])

    // #############################################################################

    return (
        <>
            <PageContainer>
                {params.projectId &&
                    <Paper className={classes.paper}>
                        <Grid className={classes.projectName}>
                            <Grid item xs={8} sm={8} ><Tooltip title="Edit Project" followCursor onClick={handleEdit}><h2 className={classes.cursor}>{form ? form.title : ''}</h2></Tooltip></Grid>
                            <Grid item xs={4} sm={4} className={classes.buttonGroup}>
                                <CustomBtn className={classes.downloadBtn} onClick={handleTask}>Task</CustomBtn>
                                <CustomBtn className={classes.downloadBtn} onClick={handleRoadmap} >Roadmap</CustomBtn>
                                <CustomBtn className={classes.downloadBtn} onClick={handleBoard} >Board</CustomBtn>
                            </Grid>
                        </Grid>
                    </Paper>
                }
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>

                        {/* ProjectName, Manager, Color ManagerContact */}

                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item md={8} className={classes.FirstArea}>
                                        <Grid item md={12} >
                                            <TextField
                                                name={'title'}
                                                label="Project Name ***"
                                                placeholder={'Please fill'}
                                                variant={'outlined'}
                                                fullWidth
                                                inputProps={{ style: { textAlign: 'center' } }}
                                                margin={'normal'}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                error={Boolean(formik.errors.title)}
                                                helperText={formik.errors.title}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4}
                                        alignItems="center"
                                        justify="center"
                                        className={classes.FirstArea}
                                    >
                                        <Grid item md={10}>
                                            <TextField
                                                name={'color_code'}
                                                label="Color"
                                                placeholder={'Ex #000000'}
                                                variant={'outlined'}
                                                fullWidth
                                                margin={'normal'}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{ style: { textAlign: 'center' } }}

                                                value={formik.values.color_code}
                                                onChange={formik.handleChange}
                                            // error={Boolean(errors.title)}
                                            // helperText={errors.title}
                                            />
                                        </Grid>
                                        <Grid item md={2} className={classes.FirstArea}>
                                            <div style={{ background: formik.values.color_code }} className={classes.colorArea} onClick={handleOpen} />
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                            >
                                                <Grid item md={12} container className={classes.FirstArea}>
                                                    <Grid item md={12} className={classes.colorModal}>
                                                        <Grid item md={12}>
                                                            <ColorPicker width={500} height={300} color={color} onChange={setColor} hideRGB hideHSV hideHEX alpha dark />
                                                        </Grid>
                                                        <Grid item md={12} container spacing={3} className={classes.colorButton} >
                                                            <Grid item md={6} className={classes.btncancel}>
                                                                <Button className={classes.buttonCancel} onClick={handleClose}>
                                                                    Cancel
                                                                </Button>
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <Button className={classes.buttonSubmit} type={"submit"} onClick={colorChange}>
                                                                    Submit
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Modal>
                                        </Grid>
                                    </Grid>

                                    <Grid item md={8} className={classes.FirstArea}>
                                        <Grid item md={12} >
                                            <TextField
                                                name={'contact_id'}
                                                label="Project Manager"
                                                select
                                                margin={'normal'}
                                                inputProps={{ style: { textAlign: 'center', color: (formik.values.contact_id === 0 ? '#546E7A' : 'black') } }}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                                variant={'outlined'}
                                                fullWidth
                                                value={formik.values.contact_id}
                                                onChange={(e) => selectPhonePM(parseInt(e.target.value))}
                                            // error={Boolean(errors.type_id)}
                                            // helperText={errors.type_id}
                                            >
                                                <option key={0} value={0} className={classes.option} >Please select</option>
                                                {projectManager?.map((option, key) => (
                                                    <option key={key} value={option.id} className={classes.option}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} className={classes.FirstArea}>
                                        <Grid item md={12}>
                                            <TextField
                                                name={'contact_number'}
                                                label="Contact"
                                                placeholder={'Please enter phone number'}
                                                variant={'outlined'}
                                                fullWidth
                                                inputProps={{ maxLength: 10, minLength: 10, style: { textAlign: 'center' } }}
                                                margin={'normal'}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={formik.values.contact_number}
                                                onChange={(e) => handleChange(e)}
                                            // error={Boolean(formik.errors.contact_number)}
                                            // helperText={formik.errors.contact_number}
                                            />
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Owner Name, Owner Comapny, Owner Contact */}

                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item md={12} className={classes.FirstArea}>
                                        <TextField
                                            name={'owner'}
                                            label="Owner Name"
                                            placeholder={'Please fill'}
                                            variant={'outlined'}
                                            fullWidth
                                            inputProps={{ style: { textAlign: 'center' } }}
                                            margin={'normal'}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={formik.values.owner}
                                            onChange={formik.handleChange}
                                        // error={Boolean(errors.title)}
                                        // helperText={errors.title}
                                        />
                                    </Grid>
                                    <Grid item md={8} className={classes.FirstArea}>
                                        <Grid item md={12} >
                                            <TextField
                                                name={'owner_company'}
                                                label="Owner Company"
                                                placeholder={'Please fill'}
                                                variant={'outlined'}
                                                fullWidth
                                                inputProps={{ style: { textAlign: 'center' } }}
                                                margin={'normal'}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}

                                                value={formik.values.owner_company}
                                                onChange={formik.handleChange}
                                            // error={Boolean(errors.title)}
                                            // helperText={errors.title}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} className={classes.FirstArea}>
                                        <Grid item md={12}>
                                            <TextField
                                                name={'owner_number'}
                                                label="Owner Contact"
                                                placeholder={'Please enter phone number'}
                                                variant={'outlined'}
                                                fullWidth
                                                inputProps={{ maxLength: 10, minLength: 10, style: { textAlign: 'center' } }}
                                                margin={'normal'}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={formik.values.owner_number}
                                                onChange={formik.handleChange}
                                            // onChange={(e) => checkPhone(e)}
                                            // error={Boolean(formik.errors.owner_number)}
                                            // helperText={formik.errors.owner_number}
                                            />
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Project Detail Type Status Date Module Reference  */}

                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item md={6} className={classes.FirstArea}>
                                        <Grid item md={12} >
                                            <TextField
                                                name={'type'}
                                                label="Type ***"
                                                select
                                                margin={'normal'}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                                variant={'outlined'}
                                                fullWidth
                                                inputProps={{ style: { textAlign: 'center' } }}
                                                value={formik.values.type}
                                                onChange={formik.handleChange}
                                            // error={Boolean(errors.type_id)}
                                            // helperText={errors.type_id}
                                            >
                                                {typeData.map((option, key) => (
                                                    <option key={key} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} className={classes.FirstArea}>
                                        <Grid item md={12} >
                                            <TextField
                                                name={'status'}
                                                label="Status ***"
                                                select
                                                margin={'normal'}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                                variant={'outlined'}
                                                fullWidth
                                                inputProps={{ style: { textAlign: 'center' } }}
                                                value={formik.values.status}
                                                onChange={formik.handleChange}
                                            // error={Boolean(errors.type_id)}
                                            // helperText={errors.type_id}
                                            >
                                                {statusData.map((option, key) => (
                                                    <option key={key} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} className={classes.FirstArea}>
                                        <Grid item md={12}>
                                            <TextField
                                                name={'module'}
                                                label="Module"
                                                placeholder={'Please fill'}
                                                variant={'outlined'}
                                                fullWidth
                                                margin={'normal'}
                                                inputProps={{ style: { textAlign: 'center' } }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={formik.values.module}
                                                onChange={formik.handleChange}
                                            // error={Boolean(errors.title)}
                                            // helperText={errors.title}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} className={classes.FirstArea}>
                                        <TextField
                                            name={'reference_id'}
                                            label="Reference"
                                            select
                                            margin={'normal'}
                                            inputProps={{ style: { textAlign: 'center', color: (formik.values.reference_id === 0 ? '#546E7A' : 'black') } }}
                                            SelectProps={{
                                                native: true,
                                            }}
                                            variant={'outlined'}
                                            fullWidth
                                            value={formik.values.reference_id}
                                            onChange={(e) => formik.setFieldValue('reference_id', parseInt(e.target.value))}
                                        // error={Boolean(errors.type_id)}
                                        // helperText={errors.type_id}
                                        >
                                            <option key={0} value={0} className={classes.option}>Please select</option>
                                            {reference?.map((option, key) => (
                                                <option key={key} value={option.id} className={classes.option}>
                                                    {option.title}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item md={12} className={classes.DetailArea}>
                                        <TextField
                                            name={'description'}
                                            label="Description"
                                            placeholder={'Project detail'}
                                            variant={'outlined'}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            margin={'normal'}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                        // error={Boolean(errors.title)}
                                        // helperText={errors.title}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Resource */}

                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item md={12} className={classes.FirstArea}>
                                        <Autocomplete
                                            multiple
                                            fullWidth
                                            id="tags-outlined"
                                            options={resource}
                                            getOptionLabel={option => {
                                                if (typeof option === "string") {
                                                    return option;
                                                }
                                                return option['name'];
                                            }}
                                            filterSelectedOptions
                                            value={isArray(resource) ? resource.filter(num => formik.values.project_id_resource.find((count: any) => count.user_id === num.id)) : []}
                                            onChange={(e, value: any) => formik.setFieldValue(
                                                "project_id_resource",
                                                value.map((item: any, index: number) => ({ "id": index, "project_id": formik.values.id, "user_id": item.id }))
                                            )}
                                            renderInput={(params: any) => (
                                                <TextField
                                                    {...params}
                                                    name={'project_id_resource'}
                                                    label="Resource"
                                                    variant="outlined"
                                                    fullWidth
                                                    placeholder={formik.values.project_id_resource.length > 0 ? [] : "Please select"}
                                                    margin={'normal'}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }} />
                                            )} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Sprint */}

                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item md={1} className={classes.HeadOwner}>
                                        Sprint
                                    </Grid>
                                    <Grid item md={11} className={classes.HeadOwner}></Grid>
                                    <Grid item md={12}>
                                        <SprintTables setFieldValue={formik.setFieldValue}
                                            value={formik.values.project_id_sprint}
                                            PJ_id={initialValues.id ? initialValues.id : 0} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* File */}
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item md={1} className={classes.HeadOwner}>
                                        File
                                    </Grid>
                                    <Grid item md={11} className={classes.HeadOwner}></Grid>
                                    <Grid item md={12}>
                                        <FileUpload setFieldValue={formik.setFieldValue} value={formik.values.project_id_attact} field={"project_id_attact"} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} className={classes.btnArea} spacing={3}>
                            <Grid item md={12} container spacing={1}>
                                <Grid item md={6} className={classes.btncancel}>
                                    <Button className={classes.buttonCancel} onClick={() => router.push(routeLink.admin.mangement.project)}>
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
        </>
    )
}

export default ProjectFormPage