import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageContainer } from 'src/components'
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography } from '@material-ui/core';
import { IStates } from 'src/stores/root.reducer'
import { ActionSaga } from 'src/services/action.saga';
import { DashboardAction } from 'src/stores/dashboard/dashboard.action'

interface DateTimeFormatOptions {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
    day?: "numeric" | "2-digit";
}

const useStyles = makeStyles({
    table: {
        minWidth: 700,
        verticalAlign: 'initial',
    },
    divs: {
        height: 400,
        weight: '100%'
    },
    root: {
        minWidth: 100,
        marginBottom: '5%',
        padding: 10,
        borderRadius: 10,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 16,
        fontWeight: 10,
        marginBottom: 5,
    },
    pos: {
        marginBottom: 5,
        fontsize: 14
    },
    tablecellSize: {
        width: '20%'
    }
});

const DashboardPage = () => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const { rows } = useSelector((state: IStates) => state.dashboardReducer)

    useEffect(() => {
        dispatch(
            ActionSaga({
                type: DashboardAction.DASHBOARD_LIST_R
            })
        )
    }, [])

    const convertDate = (date: any) => {
        var options: DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(["en-GB"], options);
    }

    const renderCard = (row: any, i: number, color: string) => {
        return (
            <>
                <Card key={i} className={classes.root} variant="outlined" style={{ backgroundColor: `${color}` }}>
                    <CardContent>
                        {
                            row.title &&
                            <Typography className={classes.title} color="textSecondary" variant="body2" component="p">
                                Task : {row.title}
                            </Typography>
                        }
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Project : {row.projectname}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            PM : {row.name}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary" variant="body2" component="p">
                            Owner : {row.owner}
                        </Typography>
                        {
                            row.status === 1 &&
                            <Typography className={classes.pos} color="textSecondary" variant="body2" component="p">
                                {
                                    row.start_date !== "Time Period has not yet been Determined" ?
                                        convertDate(row.start_date) + " - " + convertDate(row.end_date) : row.start_date
                                }
                            </Typography>
                        }
                        {
                            row.status === 2 &&
                            <Typography variant="body2" color="textSecondary" component="p">
                                {
                                    row.start_date !== "Time Period has not yet been Determined" ?
                                        convertDate(row.start_date) + " - " + convertDate(row.end_date) : row.start_date
                                }
                            </Typography>
                        }
                        {
                            row.status === 3 &&
                            <Typography variant="body2" color="textSecondary" component="p">
                                {
                                    row.start_date !== "Time Period has not yet been Determined" ?
                                        convertDate(row.start_date) + " - " + convertDate(row.end_date) : row.start_date
                                }
                            </Typography>
                        }
                    </CardContent>
                </Card>
            </>
        )
    }

    const count = (row: any, status: number) => {
        if (row !== undefined) {
            return row.filter((rows: any) => {
                return rows.status === status
            })
        }
        else {
            return []
        }
    }

    const checkStatus = (row: any, status: number, color: string) => {
        if (row !== undefined) {
            if (row.length > 0) {
                return row.map((rows: any, i: number) => {
                    if (rows.status === status) {
                        return renderCard(rows, i, color)
                    }
                })
            }
        }
    }

    const renderTableRow = (row: any) => {
        return (
            <>
                { row.find((rows: any) => {
                    return rows.title !== undefined
                }) ?
                    <>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">Plan ({count(rows, 0).length})</TableCell>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">To do ({count(rows, 1).length})</TableCell>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">In Progress ({count(rows, 2).length})</TableCell>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">Test ({count(rows, 3).length})</TableCell>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">Done ({count(rows, 4).length})</TableCell>
                        <Divider orientation="vertical" />
                    </>
                    :
                    <>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">Proposed ({count(rows, 0).length})</TableCell>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">In Planing ({count(rows, 1).length})</TableCell>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">In Progress ({count(rows, 2).length})</TableCell>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">On Hold ({count(rows, 3).length})</TableCell>
                        <Divider orientation="vertical" />
                        <TableCell className={classes.tablecellSize} align="center">Completed ({count(rows, 4).length})</TableCell>
                        <Divider orientation="vertical" />
                    </>
                }
            </>
        )
    }

    return (
        <PageContainer>
            <div className={classes.divs}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {renderTableRow(rows)}
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            <TableRow className={classes.table}>
                                <Divider orientation="vertical" />
                                <TableCell >
                                    {checkStatus(rows, 0, "#F5F5F5")}
                                </TableCell>
                                <Divider orientation="vertical" />
                                <TableCell >
                                    {checkStatus(rows, 1, "#DAE8FC")}
                                </TableCell>
                                <Divider orientation="vertical" />
                                <TableCell >
                                    {checkStatus(rows, 2, "#FFE6CC")}
                                </TableCell>
                                <Divider orientation="vertical" />
                                <TableCell >
                                    {checkStatus(rows, 3, "#FFF2CC")}
                                </TableCell>
                                <Divider orientation="vertical" />
                                <TableCell >
                                    {checkStatus(rows, 4, "#D5E8D4")}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </PageContainer>
    )
}

export default DashboardPage