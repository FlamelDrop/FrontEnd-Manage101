import React, { useState } from 'react'
import { Box, Button, IconButton, InputAdornment, makeStyles } from '@material-ui/core'
import { AccountCircle, LockOutlined, Visibility, VisibilityOff } from '@material-ui/icons'
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Logo } from 'src/components'
import { ActionSaga } from 'src/services/action.saga';
import { AuthenAction } from 'src/stores/authen/authen.action';
import BoxInput from './box-input'

const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: 'center',
        display: 'flex',
        height: '100%',
        minHeight: '100%',
        flexDirection: 'column',
        backgroundColor: '#eee',
        '& form': {
            width: '100%',
        },
        '& .MuiFormControl-root': {
            margin: 0,
            marginBottom: 16
        },
    },
    boxLogin: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0px 10px',
    },
    boxLogo: {
        textAlign: 'center',
        marginBottom: '30px',
        '& img': {
            height: '100px',
        },
    },
    boxTitle: {
        textAlign: 'center'
    },
    boxContainer: {
        width: '500px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: '50px 30px',
        backgroundColor: '#fff',
        '& .MuiTypography-h1': {
            marginBottom: '33px',
            color: '#aa0c0e',
            marginLeft: 2
        }
    },
    buttonField: {
        display: 'block',
        // background: '#aa0c0e',
        borderRadius: '50px',
        height: '58px',
        fontSize: 'larger',
        marginTop: theme.spacing(2),
        maxWidth: 500,
        color: '#ffffff',
    },
}));

const BoxLogin = () => {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [values, setValues] = useState<any>()
    const [showPassword, setShowPassword] = useState<any>()

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const onSubmit = (e: any) => {
        e.preventDefault();

        const onMessage = (status: any, text: string) => {
            return enqueueSnackbar(
                text,
                {
                    variant: status,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }
                }
            );
        };

        if (values.username === '' || values.password === '') {
            return onMessage('error', 'กรุณาระบุ Username หรือ Password');
        }

        dispatch(
            ActionSaga({
                type: AuthenAction.AUTHEN_LOGIN_R,
                payload: values,
                onFailure: () => {
                    return onMessage('error', 'Username หรือ Password ไม่ถูกต้อง');
                }
            })
        )
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    return (
        <Box className={classes.root}>
            <Box className={classes.boxLogin}>
                <Box className={classes.boxContainer}>
                    <Box className={classes.boxLogo}>
                        <Logo />
                    </Box>
                    <form onSubmit={onSubmit}>
                        <BoxInput
                            placeholder="Username"
                            variant="outlined"
                            icon={<AccountCircle />}
                            name="username"
                            onChange={handleChange}
                        />
                        <BoxInput
                            placeholder="Password"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            onChange={handleChange}
                            InputProps={{ 
                                startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlined />
                                </InputAdornment>
                            ),
                                endAdornment: (<InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        // onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>)
                            }}
                        />
                        <Button
                            color="primary"
                            fullWidth
                            type="submit"
                            size="large"
                            variant="contained"
                            className={classes.buttonField}
                            onClick={onSubmit}
                        >
                            Login
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    )
}

export default BoxLogin
