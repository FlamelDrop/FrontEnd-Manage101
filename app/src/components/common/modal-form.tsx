import React from 'react'
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, makeStyles, Typography, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    btnSave: {
        color: '#ffffff',
        border: '2px solid #ff6f00',
        backgroundColor: '#ff6f00',
        textTransform: 'none',
        '&:hover':{
            border: '2px solid #FF7C25',
            backgroundColor: '#FF7C25',
        },
        '&:disabled':{
            border: '2px solid #e0e0e0',
        }
    },
    btnCancel:{
        color: '#413E3E',
        border: '2px solid #e0e0e0',
        backgroundColor: '#e0e0e0',
        textTransform: 'none',
        '&:hover':{
            border: '2px solid #DBDBDB',
            backgroundColor: '#DBDBDB',
        },
        '&:disabled':{
            border: '2px solid #e0e0e0',
        }
    },
    dialogContent: {
        padding: '17px 24px'
    },
    dialogTitle: {
        color: '#000000',
        padding: '0px 24px 24px 24px',
        display:'flex',
        flex: '0 0 auto',
        alignItems: 'center',
        justifyContent:'center',
    },
    dialogAction: {
        padding: '10px',
        display:'flex',
        flex: '0 0 auto',
        alignItems: 'center',
        justifyContent:'center',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
}))

interface IModal {
    children?: any | ""
    isSubmit?: boolean | undefined
    isCancel?: boolean | undefined
    isUpgrade?: boolean | undefined
    disableButtonSubmit?: boolean | undefined
    disableButtonUpgrade?: boolean | undefined
    open?: boolean | undefined
    onSubmit?: () => void
    onClose?: () => void
    onUpgrade?: () => void
    title?: string | undefined
    titleBtnSubmit?: string | undefined
    titleButtonCancel?: string | undefined
    titleButtonUpgrade?: string | undefined
    maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl" | undefined 
    
}

const ModalForm = (props: IModal) => {
    const classes = useStyles()
    const { open=false, onClose, onSubmit, onUpgrade, isSubmit=false, isCancel=false, isUpgrade=false, disableButtonSubmit=false, disableButtonUpgrade=false, title='', children, titleBtnSubmit='ส่งออก', titleButtonCancel='ยกเลิก', titleButtonUpgrade='Upgrade', maxWidth='sm' } = props

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            maxWidth={maxWidth}
            fullWidth={true}
        >
            <DialogTitle disableTypography className={classes.dialogTitle}>
                <Typography variant="h4">
                    {title}
                </Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <Close />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {children}
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                {
                    isCancel &&
                    <Button onClick={onClose} className={classes.btnCancel} variant="contained">
                        {titleButtonCancel}
                    </Button>
                }
                {
                    isSubmit &&
                    <Button onClick={onSubmit} className={classes.btnSave} disabled={disableButtonSubmit}  variant="contained">
                        {titleBtnSubmit}
                    </Button>
                }
                {
                    isUpgrade &&
                    <Button onClick={onUpgrade} className={classes.btnSave} disabled={disableButtonUpgrade}  variant="contained">
                        {titleButtonUpgrade}
                    </Button>
                }
            </DialogActions>
        </Dialog>
    )
}
export default ModalForm