import React, { useState,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReportAction } from 'src/stores/report/report.action';
import { ActionSaga } from 'src/services/action.saga';
import { IStates } from 'src/stores/root.reducer';
import { PageContainer } from 'src/components'
import { Grid, makeStyles, Paper, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core'
import { CustomBtn } from 'src/components/atom'
import { useFormik } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment'
import { CentralAction } from 'src/stores/central/central.action';
import * as yup from 'yup';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
    downloadBtn: {
        backgroundColor: '#ffffff',
        margin: 5,
        textTransform:'none',
        border: '2px solid #ff6f00',
        color: '#ff6f00',
        '&:hover':{
            border: '2px solid #ff6f00',
            backgroundColor: '#ff6f00',
            color: '#ffffff',
        }
    },
    RadioBtn: {
        marginBottom: 20,
    },
    TopTitle: {
        justifyContent: 'space-between',
        marginBottom: '36px'
    },
    DatePicker: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    TitleDatePicker: {
        marginRight: 30,

    },
    TitleDatePickers: {
        marginRight: 38,

    },
    MultipleValue: {
        marginBottom: 36,
    },
    buttonDateSubmit: {
        color: '#ffffff',
        marginLeft:'-16px',
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
    GridJusify:{
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center'
    },
});

const initialValues = {
    projects: [],
    start_date: Date(),
    end_date: Date(),
    sort_by: 'Date'
}
const validationSchema = yup.object().shape({
    projects: yup.array().min(1)
});
const Reportbyproject = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [sortBy, setValueSortBy] = useState('date');
    const [maxDay, setmaxDay] = useState(0)
    const [selectedDate, setSelectedDate] = useState(initialValues)
    const { project } = useSelector((state: IStates) => state.centralReducer)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueSortBy((event.target as HTMLInputElement).value);
    };
    useEffect(() => {
        dispatch(
            ActionSaga({
                type: CentralAction.CENTRAL_PROJECT_R,
                payload:{all:1}
            })
        )
    }, [dispatch])
    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: false,
        validateOnBlur: true,
        onSubmit: (values) => {
            renderList(values.projects, values.start_date, values.end_date, sortBy)
            setSelectedDate(values)
        }
    })
    let Maxdate = new Date(formik.values.start_date)
    Maxdate.setDate(Maxdate.getDate() + 365)
    
    const renderList = (projects: any, start_date: any, end_date: any, sortBy: any) => {
        dispatch(
            ActionSaga({
                type: ReportAction.BYPROJECT_LIST_R,
                payload: {
                    projects: projects,
                    start_date: moment(start_date).format('YYYY-MM-DD'),
                    end_date: moment(end_date).format('YYYY-MM-D'),
                    date_week: sortBy,
                }
            })
        )
    };
    ;
  
    const renderFilter = () => {
        return (
            <form onSubmit={formik.handleSubmit}>
                <Grid item sm={12} >
                    <Grid container className={classes.GridJusify}>
                        <Autocomplete
                            className={classes.MultipleValue}
                            multiple
                            fullWidth
                            id="tags-outlined"
                            options={project}
                            getOptionLabel={(option) => option.title}
                            filterSelectedOptions
                            onChange={(e, value) => {
                                formik.setFieldValue(
                                    "projects",
                                    value !== null ? value : initialValues.projects
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                name = 'projects' 
                                    {...params}
                                    variant="outlined"
                                    label="Choose Project"
                                    error={Boolean(formik.errors.projects)}
                                    helperText={formik.errors.projects}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item  >
                        <Grid container className={classes.GridJusify}>
                            <div className={classes.TitleDatePicker}>Start Date : </div>
                            <KeyboardDatePicker
                                margin="normal"
                                id="start_date"
                                value={formik.values.start_date}
                                format='dd/MM/yyyy'
                                onChange={(date: any | null) => {
                                    formik.setFieldValue(
                                        "start_date",
                                        date !== null ? date : selectedDate.start_date
                                    );
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                                okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                                cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                            />
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container className={classes.GridJusify}>
                            <div className={classes.TitleDatePickers}>End Date :</div>
                            <KeyboardDatePicker
                                margin="normal"
                                minDate={formik.values.start_date}
                                maxDate={Maxdate}
                                id="end_date"
                                value={formik.values.end_date}
                                format='dd/MM/yyyy'
                                onChange={(date: any | null) => {
                                    formik.setFieldValue(
                                        "end_date",
                                        date !== null ? date : selectedDate.end_date
                                    );
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                                okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                                cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                            />
                        </Grid>
                    </Grid>

                </MuiPickersUtilsProvider>
                <Grid item >
                    <Grid container className={classes.GridJusify}>
                        <FormControl component="fieldset" className={classes.RadioBtn}>
                            <FormLabel component="legend"></FormLabel>
                            <RadioGroup row aria-label="sort" name="dateorweek" value={sortBy} onChange={handleChange}>
                                <FormControlLabel value="date" name="date" control={<Radio color="primary" />} label="Date" />
                                <FormControlLabel value="week" name="week" control={<Radio color="primary" />} label="Week" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container className={classes.GridJusify}>
                    <CustomBtn className={classes.downloadBtn} type="submit" varient="contained">Download</CustomBtn>
                </Grid>
            </form>
        )
    }

    return (
        <PageContainer>
            <Paper>
                {renderFilter()}
            </Paper>
        </PageContainer>
    )
}
export default Reportbyproject