import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReportAction } from 'src/stores/report/report.action';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { ActionSaga } from 'src/services/action.saga';
import { IStates } from 'src/stores/root.reducer';
import { PageContainer } from 'src/components'
import { Grid, makeStyles, Paper, TextField, Button } from '@material-ui/core'
import { CustomBtn } from 'src/components/atom'
import { useFormik } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { CentralAction } from 'src/stores/central/central.action';
import moment from 'moment'
import * as yup from 'yup';

const useStyles = makeStyles({
    downloadBtn: {
        backgroundColor: '#ffffff',
        margin: 5,
        border: '2px solid #ff6f00',
        color: '#ff6f00',
        textTransform: 'none',
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
});

const initialValues = {
    staffs: [],
    start_date: Date(),
    end_date: Date(),
    sort_by: 'Date'
}

const ReportByStaff = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [sortBy, setSortBy] = useState('Date');
    const [maxDay, setmaxDay] = useState(0)
    const [selectedDate, setSelectedDate] = useState(initialValues)
    const { resourcebystaff } = useSelector((state: IStates) => state.centralReducer);

    useEffect(() => {
        dispatch(
            ActionSaga({
                type: CentralAction.CENTRAL_RESOURCE_BYSTAFF_R,
                payload:{position_id: 2, all:1}
            })
        )
    }, [dispatch])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortBy((event.target as HTMLInputElement).value);
    };

    const validationSchema = yup.object().shape({
        staffs: yup.array().min(1)
    });


    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: false,
        validateOnBlur: true,
        onSubmit: (values) => {
            if (values.staffs[0]['id'] === 0) {
                renderList(resourcebystaff, values.start_date, values.end_date, sortBy)
                setSelectedDate(values)
            }
            else {
                renderList(values.staffs, values.start_date, values.end_date, sortBy)
                setSelectedDate(values)
            }

        }
    })
    let Maxdate = new Date(formik.values.start_date)
    Maxdate.setDate(Maxdate.getDate() + 365)
    
    const renderList = (staffs: any, start_date: any, end_date: any, sortBy: any) => {
        dispatch(
            ActionSaga({
                type: ReportAction.BYSTAFF_LIST_R,
                payload: {
                    staff_id: staffs,
                    start_date: moment(start_date).format('YYYY-MM-DD'),
                    end_date: moment(end_date).format('YYYY-MM-DD'),
                    date_week: sortBy,
                }
            })
        )
    };

    const renderFilter = () => {
        return (
            <form onSubmit={formik.handleSubmit}>
                <Grid item alignContent="center" sm={12} >
                    <Grid container justify="center">
                        <Autocomplete
                            className={classes.MultipleValue}
                            multiple
                            fullWidth
                            id="tags-outlined"
                            options={resourcebystaff}
                            getOptionLabel={option => {
                                if (typeof option === "string") {
                                    return option;
                                }
                                return option['name'];
                            }}
                            filterSelectedOptions
                            onChange={(e, value) => {
                                formik.setFieldValue(
                                    "staffs",
                                    value !== null ? value : initialValues.staffs
                                );
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Choose Staff"
                                    variant="outlined"
                                    error={Boolean(formik.errors.staffs)}
                                    helperText={formik.errors.staffs}
                                />
                            }
                        />
                    </Grid>
                </Grid>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item alignContent="center" >
                        <Grid container justify="center" alignItems='center'>
                            <div className={classes.TitleDatePicker}>Start Date : </div>
                            <KeyboardDatePicker
                                margin="normal"
                                id="start_date"
                                value={formik.values.start_date}
                                format='dd/MM/yyyy'
                                okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                                cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                                onChange={(date: any | null) => {
                                    formik.setFieldValue(
                                        "start_date",
                                        date !== null ? date : selectedDate.start_date
                                    );
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />

                        </Grid>
                    </Grid>

                    <Grid item justify="center">
                        <Grid container justify="center" alignItems='center'>
                            <div className={classes.TitleDatePickers}>End Date :</div>
                            <KeyboardDatePicker
                                minDate={formik.values.start_date}
                                maxDate={Maxdate}
                                margin="normal"
                                id="end_date"
                                value={formik.values.end_date}
                                format='dd/MM/yyyy'
                                okLabel={<Button className={classes.buttonDateSubmit}>OK</Button>}
                                cancelLabel={<Button className={classes.buttonDateCancel}>Cancel</Button>}
                                onChange={(date: any | null) => {
                                    formik.setFieldValue(
                                        "end_date",
                                        date !== null ? date : selectedDate.end_date
                                    );
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </Grid>
                    </Grid>

                </MuiPickersUtilsProvider>
                <Grid item alignContent="center">
                    <Grid container justify="center">
                        <FormControl component="fieldset" className={classes.RadioBtn}>
                            <FormLabel component="legend"></FormLabel>
                            <RadioGroup row aria-label="sort" name="dateorweek" value={sortBy} onChange={handleChange}>
                                <FormControlLabel value="Date" control={<Radio color="primary" />} label="Date" />
                                <FormControlLabel value="Week" control={<Radio color="primary" />} label="Week" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center">
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
export default ReportByStaff