import { Button, Card, CardContent, CardHeader, Grid, Icon, IconButton, makeStyles, Modal, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { Delete, GetApp } from '@material-ui/icons';
import { CentralAction } from "src/stores/central/central.action";
import { ActionSaga } from "src/services/action.saga";
import { useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles({
    btnAddFile: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0'
    },
    Card: {
        borderRadius: '25px',
        border: 'none',
        padding: 0,
        backgroundColor: '#b4b4b4'
    },
});

const CardStyles = makeStyles((theme)=>({
    paper: {
        position: 'absolute',
        width: 'auto',
        backgroundColor: 'white',
        border: '2px solid #000',
        borderRadius: '25px',
        padding: '2%',
    },
    FirstArea: {
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    Card: {
        minWidth: 275,
        borderRadius: '25px',
        marginBottom: '2%',
    },
    HeaderName: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        height: '100%',
    },
    btnArea: {
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        marginTop: '2%'
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
    cardArea: {
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
        "&:last-child": {
            paddingBottom: 0
        }
    },
    paperModal: {
        position: 'absolute',
        width: 'auto',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        borderRadius: '25px',
        boxShadow: theme.shadows[5],
        padding: '2%',
      },
}));

const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const FileUploadComponent = (props: any) => {
    const classes: any = useStyles();
    let { params } = useRouteMatch();
    const { setFieldValue, value, field } = props
    const [arrayKey, setArrayKey] = useState(value);
    const [openDel, setOpenDel] = useState(false);
    const [fileID, setFileID]: any = useState();
    const [fileIndex, setFileIndex]: any = useState();
    let newArr = [...value]
    const dispatch = useDispatch();
    const [modalStyle] = useState(getModalStyle);
    const host = `${process.env.REACT_APP_API_HOST}`;

    useEffect(() => {
        setArrayKey(newArr)
    }, [value])

    const handleUploadClick = (e: any) => {
        const { files } = e.target
        if (files !== undefined && files.length > 0) {
            let filename = files[0].name.split(".");
            let newArr = [...value,
            {
                id: 0,
                project_id: value.length,
                filename: filename[0],
                file: files[0],
                note: ''
            }];
            setArrayKey(newArr)
            setFieldValue(field, newArr);
        }
    }

    const delModal = (file: any, index: number) => {
        setFileID(file.id)
        setFileIndex(index)
        setOpenDel(true)
    }

    const renderFile = (value: any) => {

        const classes = CardStyles();
        const handleChangeFilename = (e: any, key: any) => {
            let newArr = [...value];
            newArr[key].filename = e;
            setArrayKey(newArr);
            setFieldValue(field, arrayKey);
        }

        const handleChangeDetail = (e: any, key: any) => {
            let newArr = [...value];
            newArr[key].note = e;
            setArrayKey(newArr);
            setFieldValue(field, arrayKey);
        }

        const handleDeleteUpload = () => {
            const filter = arrayKey.filter(function (item: any, i: number) {
                return i !== fileIndex
            })
            setArrayKey(filter);
            setFieldValue(field, filter);

            if (fileID) {
                let type = ''
                if (field === 'project_id_attact') {
                    type = 'project'
                } else {
                    type = 'task'
                }
                dispatch(
                    ActionSaga({
                        type: CentralAction.CENTRAL_DELETE_FILE_R,
                        payload: { id: fileID, field: type }
                    })
                )
            }
            setOpenDel(false)
        }

        if (value !== undefined && value.length > 0) {
            return arrayKey.map((item: any, index: number) => {
                return (
                    <Card className={classes.Card} variant="outlined">
                        <CardContent>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item md={12} className={classes.FirstArea} >
                                        <Grid item md={11} >
                                            <TextField
                                                name={'filename'}
                                                label="File Name"
                                                variant={'outlined'}
                                                fullWidth
                                                inputProps={{ style: { textAlign: 'center' } }}
                                                // margin={'normal'}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={item.filename ? item.filename : ''}
                                                onChange={(e) => handleChangeFilename(e.target.value, index)}
                                            // error={Boolean(errors.title)}
                                            // helperText={errors.title}
                                            />
                                        </Grid>
                                        {!params.projectId || item.id === 0 ?
                                            []
                                            :
                                            <Tooltip title="Download" followCursor>
                                                <IconButton style={{ color: '#000000' }} component="span">
                                                    <Icon component={GetApp} fontSize="large" type="button"
                                                        onClick={() => window.open(`${host}${item.file}`,'_blank')} />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                        <IconButton style={{ color: '#000000' }} component="span">
                                            <Tooltip title="Delete" followCursor>
                                                <Icon component={Delete} fontSize="large" type="button" onClick={(e: any) => delModal(item, index)} />
                                            </Tooltip>
                                            <Modal
                                                open={openDel}
                                                onClose={() => setOpenDel(false)}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Card style={modalStyle} className={classes.paperModal}>
                                                    <CardHeader className={classes.HeaderName}
                                                        title="Are you sure you want to delete this file ?" />
                                                    <CardContent className={classes.cardArea}>
                                                        <Grid xs={12} container spacing={3} className={classes.btnArea} >
                                                            <Button className={classes.buttonCancel} onClick={() => setOpenDel(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button className={classes.buttonSubmit} onClick={() => handleDeleteUpload()}>
                                                                Confirm
                                                            </Button>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Modal>
                                        </IconButton>
                                    </Grid>
                                    <Grid item md={12} className={classes.FirstArea}>
                                        <TextField
                                            name={'file_detail'}
                                            label="File Detail"
                                            variant={'outlined'}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            // margin={'normal'}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={item.note}
                                            onChange={(e) => handleChangeDetail(e.target.value, index)}
                                        // error={Boolean(errors.title)}
                                        // helperText={errors.title}
                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )
            })
        } else {
            return ([])
        }
    }

    return (
        <React.Fragment>
            <Grid>
                {renderFile(value)}
            </Grid>
            <Grid item md={12}>
                <Card className={classes.Card} variant="outlined">
                    <label htmlFor="icon-button-file" className={classes.btnAddFile}>
                        <Tooltip title="Add File" followCursor>
                            <IconButton color="primary" component="span">
                                <input 
                                    accept=".xlsx, .xlsm, .xlsb, .xlt, .xls, .txt, .csv, .ppt, .pptx, .pptm, .ppsx, .pdf, .docx, .doc,.7z, .zip, .rar, image/* "
                                    id="icon-button-file"
                                    type="file"
                                    multiple
                                    value=""
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleUploadClick(e)} />
                                <Icon component={AddCircleOutlineOutlinedIcon} fontSize="large" type="button" />
                            </IconButton>
                        </Tooltip>
                    </label>
                </Card>
            </Grid>
        </React.Fragment>
    );
}

export default FileUploadComponent