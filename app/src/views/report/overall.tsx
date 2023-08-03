import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ReportAction } from 'src/stores/report/report.action';
import { ActionSaga } from 'src/services/action.saga';
import { PageContainer } from 'src/components'
import { Grid, makeStyles, Paper } from '@material-ui/core'
import { CustomBtn } from 'src/components/atom'
import { useFormik } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles({
    downloadBtn: {
        backgroundColor: '#ffffff',
        margin: 5,
        marginTop: 30,
        border: '2px solid #ff6f00',
        color: '#ff6f00',
        textTransform: 'none',
        '&:hover':{
            border: '2px solid #ff6f00',
            backgroundColor: '#ff6f00',
            color: '#ffffff',
        }
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
});

const initialValues = {
    start_date: Date(),
    end_date: Date(),
}

const ReportOverall = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(initialValues)

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            renderList(values.start_date, values.end_date)
            setSelectedDate(values)
        }
    })

    const renderList = (start_date: any, end_date: any) => {
        dispatch(
            ActionSaga({
                type: ReportAction.OVERALL_LIST_R
            })
        )
    };


    const renderFilter = () => {
        return (
            <form onSubmit={formik.handleSubmit}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item alignContent="center" >
                        <Grid container justify="center" alignItems='center'>
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
                            />
                        </Grid>
                    </Grid>
                    <Grid item justify="center">
                        <Grid container justify="center" alignItems='center'>
                            <div className={classes.TitleDatePickers}>End Date :</div>
                            <KeyboardDatePicker
                                margin="normal"
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
                            />
                        </Grid>
                    </Grid>
                </MuiPickersUtilsProvider>
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
export default ReportOverall