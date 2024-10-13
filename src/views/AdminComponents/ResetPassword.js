import useJwt from '@src/auth/jwt/useJwt'
import React, { useEffect, useState, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { AbilityContext } from '@src/utility/context/Can'
import { handleLogin } from '@store/actions/auth'
import { ChevronLeft } from 'react-feather'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Button, Card, CardBody, Col, Input, Label, Row, Form, FormGroup, Spinner } from 'reactstrap'
import { Error, Success } from '../viewhelper'
import InputPasswordToggle from '@components/input-password-toggle'
import PasswordValidationItem from './UserManagement/PasswordValidationItem'

const ResetPassword = () => {
    const ability = useContext(AbilityContext)
    const dispatch = useDispatch()
    const username = localStorage.getItem('username')
    const location = useLocation()
    const history = useHistory()
    const [passConfig, setPassConfig] = useState({})
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [resetData, setReset] = useState(true)
    const [isValid, setIsValid] = useState(false)
    const [userInput, setUserInput] = useState({
        newpassword: '',
        conpassword: '',
        oldpassword : ''
    })
    const [errors, seterrors] = useState({
        oldPass: '',
        newPass: '',
        conNewPass: ''
    })
    useEffect(() => {
        localStorage.setItem('useBMStoken', false)
        localStorage.setItem('usePMStoken', false)
        useJwt.getPasswordConfig().then(res => {
            console.log('getPasswordConfig', res)
            setPassConfig(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
    }, [])
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('useBMStoken', false) //tokan management purpose
        localStorage.setItem('usePMStoken', false) //tokan management purpose
        seterrors({})
         //password check...
        if (!isValid) {
            return 0
        }
        if (userInput.newpassword !== userInput.conpassword) {
            seterrors({ ...errors, conNewPass: ' must be same as new password.' })
            return 0
        }
        const { newpassword, oldpassword } = userInput
        console.log({ newpassword, oldpassword })
        setPointRuleloading(true)
        useJwt.changepassword({ newpassword, oldpassword }).then(res1 => {
            console.log(res1)
            // Success(res)
            useJwt.login({ username, password: newpassword }).then(async res => {
                const data = {
                    ...res.data.payload.user_info,
                    fullname: "",
                    avatar: "https://i.imgur.com/P4b2RHh.png",
                    accessToken: res.data.payload.token,
                    refreshToken: res.data.payload.refresh_token,
                    extras: {
                      eCommerceCartItemsCount: 5
                    },
                    role: 'admin',
                    ability: [
                      {
                        action: 'manage',
                        subject: 'ADMIN'
                      },
                      {
                        action: 'manage',
                        subject: 'Auth'
                      }
                    ]
                  }
        
                    dispatch(handleLogin(data))
                    ability.update(data.ability)
                    localStorage.setItem('username', username)

                    Success(res1)
                    if (location.pathname !== '/resetPassInside') {
                        window.location.href = localStorage.getItem('link')
                    }
                    setPointRuleloading(false)
                    
              })
              .catch(err => {
                setPointRuleloading(false)
                Error(err)
                console.log(err)
              })

        }).catch(err => {
            setPointRuleloading(false)
            Error(err)
            console.log(err.response)
        })
    }
    return (
        <> 
            {
                location.pathname === '/resetPassInside' && <Button.Ripple className='mb-1' color='primary' tag={Link} onClick={() => history.goBack()} >
                    <div className='d-flex align-items-center'>
                            <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                            <span >Back</span>
                    </div>
                </Button.Ripple>
            }
     
            <div style={{ display:'flex', justifyContent:'center' }}>
            {/* <div style={location.pathname === '/resetPassInside' ? { width:'450px', marginTop:'10px' } : { width:'450px', marginTop:'100px' }}> */}
            <div style={location.pathname === '/resetPassInside' ? { marginTop:'10px' } : { marginTop:'100px' }}>
                <h4 className='text-center mb-2'>Reset Password</h4>
                <div style={{padding:'10px 20px', color:'white', backgroundColor:'#f0ad4e'}}>
                    <strong>Warning!</strong> Your password is expired. Please reset it.
                </div>
                <Card>
                    <CardBody>
                        <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        <Col sm="12" >
                                <FormGroup>
                                    <Label for="oldpassword">Old Password<span style={{ color: 'red' }}>* {errors.oldPass}</span></Label>
                                    <Input type="text"
                                        name="oldpassword"
                                        id='oldpassword'
                                        onChange={handleChange}
                                        required
                                        placeholder="type here..."
                                    />
                                </FormGroup>
                            </Col>
                        <Col sm="12" >
                                <FormGroup>
                                    <Label for="newpassword">New Password<span style={{ color: 'red' }}>* {errors.newPass}</span></Label>
                                    <InputPasswordToggle
                                        id='newpassword'
                                        name='newpassword'
                                        minLength={passConfig?.length?.toString()}
                                        className='input-group-merge'
                                        required
                                        onChange={handleChange}
                                        // className={classnames({ 'is-invalid': errors['login-password'] })}
                                        // innerRef={register({ required: true, validate: value => value !== '' && value.length > 5 })}
                                        />
                                </FormGroup>
                                {
                                    userInput.newpassword ?  <PasswordValidationItem password={userInput.newpassword} setIsValid={setIsValid} passConfig={passConfig}/> : null
                                }
                            </Col>
                        <Col sm="12" >
                                <FormGroup>
                                    <Label for="conpassword">Retype New Password<span style={{ color: 'red' }}>* {errors.conNewPass}</span></Label>
                                    <InputPasswordToggle
                                        id='conpassword'
                                        name='conpassword'
                                        minLength={passConfig?.length?.toString()}
                                        className='input-group-merge'
                                        required
                                        onChange={handleChange}
                                        // className={classnames({ 'is-invalid': errors['login-password'] })}
                                        // innerRef={register({ required: true, validate: value => value !== '' && value.length > 5 })}
                                        />
                                </FormGroup>
                            </Col>
                            <Col sm="12" className='text-center'>
                                {
                                    pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                        <span >Reset Password</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
        </>
    )
}

export default ResetPassword