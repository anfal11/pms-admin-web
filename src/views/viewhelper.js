import { Fragment, useState } from 'react'
import { toast, Slide } from 'react-toastify'

    export const Error = (err) => {
        try {
            const e = err.response
            if (e.status === 404 || e.status === 401 || e.status === 400 || e.status === 500 || e.status === 409) {
                toast.error(e.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
                })  
            } else  {
                toast.error('The server is under maintenance', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                    }) 
            }
        } catch (e) {
            toast.error('Please check your connection', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
                })  
        }
 
    }

    export const ErrorMessage = (err) => {
        try {
        const e = err.response
        if (e.status === 404 || e.status === 401 || e.status === 400) {
            toast.error(e.data.errors ? e.data.errors[Object.keys(e.data.errors)[0]] : e.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
            })  
         }
        } catch (e) {
            toast.error('Please check your connection', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
                })  
        } 
    }
    export const Success = (response) => {
        const message = response.data.message || 'success'
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
            })  
    }

