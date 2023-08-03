import { Button, Grid, makeStyles, Paper, TextField, Box, Switch, InputLabel } from '@material-ui/core'
import { Cancel, Save } from '@material-ui/icons'
import React from 'react'
import { PageContainer } from 'src/components'

const useStyles = makeStyles(() => ({
    paper: {
        backgroundColor:'#fff',
        height:'auto'
    },
    rootForm: {
        width: '100%'
    },
    btnCenter:{
        textAlign: 'center',
        '& button':{
            margin: '10px',
            color: '#fff'
        }
    }
}))

const FormPage = () => {

    const classes = useStyles()

    return (
        <PageContainer>
            <Grid container>
                <form className={classes.rootForm}>
                    <Grid container spacing={3}>
                        <Grid item md={8}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item md={12}>
                                        <TextField
                                            name="name"
                                            label="ชื่อ..."
                                            placeholder="กรุณากรอกข้อมูลชื่อ..."
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                        />
                                    </Grid>
                                </Grid>
                                <Box className={classes.btnCenter}>
                                    <Button type="submit" variant="contained" color="primary" startIcon={<Save/>}>บันทึก</Button>
                                    <Button type="submit" variant="contained" color="primary" startIcon={<Save/>}>บันทึกและเปิด</Button>
                                    <Button variant="contained" color="secondary" startIcon={<Cancel/>}>ยกเลิก</Button>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item md={4}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={3}>
                                    <Grid item md={12}>
                                        <InputLabel>สถานะ</InputLabel>
                                        <Switch 
                                            name="publish"
                                            color="primary" 
                                            inputProps={{ 'aria-label': 'primary checkbox' }} 
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </PageContainer>
    )
}

export default FormPage
