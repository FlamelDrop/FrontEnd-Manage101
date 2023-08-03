import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
    root: {
        color: (props: any) => props.btncolor,
        "&:hover, &:focus": {
            color: (props: any) => props.hvcolor,
            backgroundColor: (props: any) => props.hvbgcolor,
        },
        backgroundColor: '#ffffff',
        border: (props: any) => `2px solid ${props.btncolor}`,
    }
}))

const CustomBtn = (props: any) => {
    const classes = useStyles(props)
    const { className, children, ...rest } = props
    return <Button className={clsx(classes.root,className)} {...rest}>{children}</Button>
}

export default CustomBtn
