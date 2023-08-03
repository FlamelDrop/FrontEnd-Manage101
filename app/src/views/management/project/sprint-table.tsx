import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { Card, CardContent, CardHeader, Grid, Icon, IconButton, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core';
import moment from 'moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Delete, Edit } from '@material-ui/icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { ActionSaga } from 'src/services/action.saga';
import { ProjectAction } from 'src/stores/management/project/project.action';
import { useRouteMatch } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  tableSetting: {
    borderRadius: '18px'
  },
  addSprint: {
    margin: '50px',
    textAlign: 'center',
    padding: '0',
  },
  cardHead: {
    textAlign: 'center',
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
  dateArea: {
    display: 'flex',
    justifyContent: 'center',
    margin: '2%',
    width: "auto"
  },
  nameArea: {
    display: 'flex',
    justifyContent: 'center',
    marginLeft: '4%',
    marginRight: '4%',
    width: 'auto',
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
  paperModal: {
    position: 'absolute',
    width: 'auto',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    borderRadius: '25px',
    boxShadow: theme.shadows[5],
    padding: '2%',
  },
  cardArea: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
    "&:last-child": {
      paddingBottom: 0
    }
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

const validationSchema = yup.object().shape({
  title: yup.string()
    .trim()
    .required('Please Fill Project Name.'),
});

export const initialForm = {
  title: '',
  start_date: Date.now(),
  actual_end_date: Date.now(),
  actual_start_date: Date.now(),
  end_date: Date.now(),
  id: 0,
  project_id: 0,
}

export default function SprintTables(props: any) {
  const classes = useStyles();
  let { params } = useRouteMatch();
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [sprintID, setSprintID]: any = useState();
  const [sprintIndex, setSprintIndex]: any = useState();
  const [sprintPk, setSprintPk]: any = useState(undefined);
  const { setFieldValue, value, PJ_id } = props
  const [modalStyle] = useState(getModalStyle);
  const [initialValues, setInitialValues] = useState(initialForm);
  const dispatch = useDispatch();

  const formsp = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values: any) => {
      if (sprintPk === '') {
        let newArr = [...value,
        {
          id: 0,
          project_id: PJ_id,
          title: formsp.values.title,
          start_date: moment(formsp.values.start_date).format("YYYY-MM-DD"),
          end_date: moment(formsp.values.end_date).format("YYYY-MM-DD"),
          actual_start_date: moment(formsp.values.actual_start_date).format("YYYY-MM-DD"),
          actual_end_date: moment(formsp.values.actual_end_date).format("YYYY-MM-DD")
        }];
        setFieldValue('project_id_sprint', newArr);
        setOpen(false);
      } else {
        let newArr: any = [...value]
        newArr[sprintPk] = ({
          id: formsp.values.id,
          project_id: PJ_id,
          title: formsp.values.title,
          start_date: moment(formsp.values.start_date).format("YYYY-MM-DD"),
          end_date: moment(formsp.values.end_date).format("YYYY-MM-DD"),
          actual_start_date: moment(formsp.values.actual_start_date).format("YYYY-MM-DD"),
          actual_end_date: moment(formsp.values.actual_end_date).format("YYYY-MM-DD"),
        })
        setFieldValue('project_id_sprint', newArr);
        setOpen(false);
      }
    }
  })

  const handleStartDateChange = (date: any) => {
    formsp.setFieldValue("start_date", date);
  };

  const handleEndDateChange = (date: any) => {
    formsp.setFieldValue("end_date", date);
  };

  const handleActualStartChange = (date: any) => {
    formsp.setFieldValue("actual_start_date", date);
  };

  const handleActualEndChange = (date: any) => {
    formsp.setFieldValue("actual_end_date", date);
  };

  const handleCreate = () => {
    setSprintPk('')
    formsp.setFieldValue('title', '');
    formsp.setFieldValue("start_date", Date.now())
    formsp.setFieldValue("end_date", Date.now())
    formsp.setFieldValue("actual_start_date", Date.now())
    formsp.setFieldValue("actual_end_date", Date.now())
    setOpen(true);
  };

  const handleEdit = (sprint: any, index: any) => {
    setSprintPk(index)
    formsp.setFieldValue("id", sprint.id)
    formsp.setFieldValue("title", sprint.title)
    formsp.setFieldValue("project_id", sprint.project_id)
    formsp.setFieldValue("start_date", sprint.start_date)
    formsp.setFieldValue("end_date", sprint.end_date)
    formsp.setFieldValue("actual_start_date", sprint.actual_start_date)
    formsp.setFieldValue("actual_end_date", sprint.actual_end_date)
    setOpen(true);
  };

  const handleClose = () => {
    formsp.setErrors({})
    setOpen(false);
  };

  const delModal = (sprint: any, index: number) => {
    setSprintID(sprint.id)
    setSprintIndex(index)
    setOpenDel(true)
  }

  const myDelete = (sprint: any, index: number) => {
    let newArr: any = [...value]
    const filter = newArr.filter(function (item: any, i: number) {
      return i !== sprintIndex
    })
    setFieldValue('project_id_sprint', filter);
    if (sprintID) {
      dispatch(
        ActionSaga({
          type: ProjectAction.PROJECT_SPRINT_DELETE_R,
          payload: sprintID
        })
      )
    }
    setOpenDel(false)
  };

  useEffect(() => {
    setInitialValues({ ...initialForm, ...value })
    setFieldValue('project_id_sprint', value);
  }, [value,setFieldValue])

  const renderSprint = () => {
    if (value !== undefined && value.length > 0) {
      return value.map((sprint: any, index: number) => {
        return (
          <StyledTableRow key={index}>
            <StyledTableCell align="center" style={{ backgroundColor: 'white', fontSize: '18px' }}>{sprint.title}</StyledTableCell>
            <StyledTableCell align="center" style={{ backgroundColor: 'white', fontSize: '18px' }} itemType='date'>{moment(sprint.start_date).format('DD/MM/YYYY')}</StyledTableCell>
            <StyledTableCell align="center" style={{ backgroundColor: 'white', fontSize: '18px' }} itemType='date'>{moment(sprint.end_date).format('DD/MM/YYYY')}</StyledTableCell>
            <StyledTableCell align="center" style={{ backgroundColor: 'white' }}>
              <Tooltip title="Edit" followCursor>
                <IconButton style={{ color: '#000000' }} component="span">
                  <Icon component={Edit} fontSize="large" type="button" onClick={() => handleEdit(sprint, index)} />
                </IconButton>
              </Tooltip>
              <IconButton style={{ color: '#000000' }} component="span">
                <Tooltip title="Delete" followCursor>
                  <Icon component={Delete} fontSize="large" type="button" onClick={() => delModal(sprint, index)} />
                </Tooltip>
                <Modal
                  open={openDel}
                  onClose={() => setOpenDel(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Card style={modalStyle} className={classes.paperModal}>
                    <CardHeader className={classes.cardHead}
                      title="Are you sure you want to delete this sprint ?" />
                    <CardContent className={classes.cardArea}>
                      <Grid xs={12} container spacing={1} className={classes.btnArea}>
                        <Button className={classes.buttonCancel} onClick={() => setOpenDel(false)}>
                          Cancel
                        </Button>
                        <Button className={classes.buttonSubmit} onClick={() => myDelete(sprint, index)}>
                          Confirm
                        </Button>
                      </Grid>
                    </CardContent>
                  </Card>
                </Modal>
              </IconButton>
            </StyledTableCell>
          </StyledTableRow>
        )
      })
    } else {
      return ([])
    }
  }

  const ModalSprint = () => {
    return (
      <form onSubmit={formsp.handleSubmit}>
        <Card style={modalStyle} className={classes.paperModal}>
          <CardHeader className={classes.cardHead}
            title="Create Sprint" />
          <CardContent className={classes.cardArea}>
            <Grid xs={12}>
              <Grid item md={12}>
                <TextField
                  name={'title'}
                  placeholder={'Please Fill'}
                  variant={'outlined'}
                  label="Sprint Name***"
                  fullWidth
                  className={classes.nameArea}
                  inputProps={{ style: { textAlign: 'center' } }}
                  margin={'normal'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formsp.values.title}
                  onChange={formsp.handleChange}
                  error={Boolean(formsp.errors.title)}
                  helperText={formsp.errors.title}
                />
              </Grid>
              <Grid item md={12} container spacing={3} className={classes.dateArea}>
                <Grid item md={6} >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      name={'start_date'}
                      id="date-picker-dialog"
                      label="Start Date"
                      inputVariant="outlined"
                      fullWidth
                      inputProps={{ style: { textAlign: 'center' } }}
                      format="dd/MM/yyyy"
                      value={formsp.values.start_date}
                      onChange={handleStartDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',

                      }}
                      okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                      cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      name={'end_date'}
                      id="date-picker-dialog"
                      label="End Date"
                      inputVariant="outlined"
                      fullWidth
                      minDate={formsp.values.start_date}
                      inputProps={{ style: { textAlign: 'center' } }}
                      format="dd/MM/yyyy"
                      value={formsp.values.end_date}
                      onChange={handleEndDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                      cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
              {!params.projectId ?
                []
                :
                <>
                  <Grid item md={12} container spacing={3} className={classes.dateArea}>
                    <Grid item md={6} >
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          margin="normal"
                          name={'actual_start_date'}
                          id="date-picker-dialog"
                          label="Actual Start Date"
                          inputVariant="outlined"
                          fullWidth
                          inputProps={{ style: { textAlign: 'center' } }}
                          format="dd/MM/yyyy"
                          value={formsp.values.actual_start_date}
                          onChange={handleActualStartChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                          okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                          cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item md={6}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          margin="normal"
                          name={'actual_end_date'}
                          id="date-picker-dialog"
                          label="Actual End Date"
                          inputVariant="outlined"
                          fullWidth
                          minDate={formsp.values.actual_start_date}
                          inputProps={{ style: { textAlign: 'center' } }}
                          format="dd/MM/yyyy"
                          value={formsp.values.actual_end_date}
                          onChange={handleActualEndChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                          okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                          cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                  </Grid>
                </>
              }
              <Grid item md={12} container spacing={3} className={classes.dateArea}>
                <Grid item md={12} className={classes.btnArea}>
                  <Button className={classes.buttonCancel} onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button className={classes.buttonSubmit} type={"submit"}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </form>
    )
  }

  return (
    <TableContainer className={classes.tableSetting}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" style={{ fontSize: '18px', fontWeight: 'bold', }}>Sprint Name</StyledTableCell>
            <StyledTableCell align="center" style={{ fontSize: '18px', fontWeight: 'bold', }}>Start Date</StyledTableCell>
            <StyledTableCell align="center" style={{ fontSize: '18px', fontWeight: 'bold', }}>End Date</StyledTableCell>
            <StyledTableCell align="center" style={{ fontSize: '18px', fontWeight: 'bold', }}>Edit</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableHead>
        </TableHead>
        <TableBody>
          {renderSprint()}
          <StyledTableRow>
            <TableCell className={classes.addSprint} style={{ backgroundColor: '#e0e0e0' }} align="center" colSpan={12}>
              <IconButton color="primary" component="span">
                <Tooltip title="Add Sprint" followCursor >
                  <Icon component={AddCircleOutlineOutlinedIcon} fontSize="large" type="button" onClick={handleCreate} />
                </Tooltip>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  {ModalSprint()}
                </Modal>
              </IconButton>
            </TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
