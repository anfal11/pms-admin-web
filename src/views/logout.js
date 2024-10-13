import React, { useState, Fragment, useRef, useEffect } from 'react'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'
import { useHistory } from 'react-router-dom'

const Logout = () => {

    const history = useHistory()
    // ** Store Vars
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(handleLogout())
        history.push('/Adminlogin') 
      }, [])

    return (
        <Fragment>

        </Fragment>
    )
}

export default Logout