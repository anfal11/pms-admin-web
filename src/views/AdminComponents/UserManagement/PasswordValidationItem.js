import { Fragment, useEffect, useState } from 'react'
import { FormGroup, Label } from 'reactstrap'
import successIcon from '@src/assets/images/svg/checkmark.svg'
import errorIcon from '@src/assets/images/svg/error.svg'

const PasswordValidationItem = ({password, passConfig, setIsValid}) => {

    const { is_special_charecter = true, islowercase = true, isnumber = true, isuppercase = true, length = 8} = passConfig

    const validationIndex = []
    //check length..
    if (password.length >= length) {
        validationIndex.push(0)
    }
    //check is capital latter have..
    if (!isuppercase || Boolean(password.match(/[A-Z]/))) {
        validationIndex.push(1)
    }
    //check is small latter have...
    if (!islowercase || Boolean(password.match(/[a-z]/))) {
        validationIndex.push(2)
    }
    //check is number have...
    if (!isnumber || Boolean(password.match(/[0-9]/))) {
        validationIndex.push(3)
    }
    //check is spacial charecter have...
    if (!is_special_charecter || Boolean(password.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/))) {
        validationIndex.push(4)
    }

    useEffect(() => { setIsValid(validationIndex.length === 5 || false) }, [validationIndex])

    return (
        <Fragment>
            <FormGroup>

            <div className='d-flex justify-content-between'>
              <Label className='form-label' style={{color: validationIndex.includes(0) ? '#4CAF50' : '#fb606a'}}>
                <img src={validationIndex.includes(0) ? successIcon : errorIcon} height={14} width={14}/> Must be minimum {length} characters
              </Label>
            </div>

            {
                isuppercase ? <div className='d-flex justify-content-between'>
                <Label className='form-label' style={{color: validationIndex.includes(1) ? '#4CAF50' : '#fb606a'}}>
                <img src={validationIndex.includes(1) ? successIcon : errorIcon} height={14} width={14}/> Uppercase characters (A-Z)
                </Label>
              </div> : null
            }

            {
                islowercase ? <div className='d-flex justify-content-between'>
                <Label className='form-label' style={{color: validationIndex.includes(2) ? '#4CAF50' : '#fb606a'}}>
                <img src={validationIndex.includes(2) ? successIcon : errorIcon} height={14} width={14}/> Lowercase characters (a-z)
                </Label>
              </div> : null
            }

            {
                isnumber ? <div className='d-flex justify-content-between'>
                <Label className='form-label' style={{color: validationIndex.includes(3) ? '#4CAF50' : '#fb606a'}}>
                <img src={validationIndex.includes(3) ? successIcon : errorIcon} height={14} width={14}/> Must contain number (0-9)
                </Label>
              </div> : null
            }

            {
                is_special_charecter ?  <div className='d-flex justify-content-between'>
                <Label className='form-label' style={{color: validationIndex.includes(4) ? '#4CAF50' : '#fb606a'}}>
                <img src={validationIndex.includes(4) ? successIcon : errorIcon} height={14} width={14}/> Must contain special character
                </Label>
              </div> : null
            }

            </FormGroup>
        </Fragment>
    )
}

export default PasswordValidationItem