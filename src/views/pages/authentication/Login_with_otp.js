import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import { AbilityContext } from '@src/utility/context/Can'
import { handleLogin } from '@store/actions/auth'
import '@styles/base/pages/page-auth.scss'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import classnames from 'classnames'
import { Fragment, useContext, useEffect, useState } from 'react'
import { Coffee } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Slide, toast } from 'react-toastify'
import {BMS_USER, BMS_PASS} from '../../../Configurables'
import {
  Button, CardText, CardTitle, Col, Form, FormGroup, Input, Label, Row, Spinner, Modal, ModalHeader, ModalBody
} from 'reactstrap'
import pms from '../../../assets/images/icons/RILAC-Logo.svg'
import { Error } from '../../viewhelper'


const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as an {role} user to system. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)

const Login = props => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpErr, setOtpErr] = useState('')
  const [loading, setloading] = useState(false)
  const [servererrors, seterrors] = useState({})
  const { register, errors, handleSubmit } = useForm()
  const [registerCheck, setRegistCheck] = useState({})

  useEffect(() => {
    fetch('https://api.ipify.org/?format=json')
      .then(res => res?.json())
      .then(data => localStorage.setItem('ip', data?.ip))
  }, [])

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

    const checkMobile = () => {
      setloading(true)
      if (email.startsWith('0') && email.length !== 11) {
        setRegistCheck({...registerCheck, mobile_match: false})
        setloading(false)
        return
      } else if (!email.startsWith('0') && email.length !== 10) {
        setRegistCheck({...registerCheck, mobile_match: false})
        setloading(false)
        return
      }
      useJwt.checkMobile({ mobile: Number(email) })
          .then(async res => {
            setloading(false)
            setRegistCheck(res.data.payload)
            console.log('checkMobile', res)
          }).catch(err => {
            setloading(false)
            console.log('checkMobile', err)
          })
    }
  const checkOtp = () => {
    setloading(true)
    useJwt.checkOtp({ mobile: Number(email), otp })
        .then(async res => {
          setloading(false)
          if (res.data.issuccess) {
            localStorage.setItem('mobilenumber', Number(email))
            history.push('/merchantsetpassword')
          }
          console.log('checkOtp', res)
        }).catch(err => {
          setloading(false)
          console.log('checkOtp', err.response)
          setOtpErr(err.response.data.message)
        })
  }
  const onSubmit = data => {
    const email = data['loginemail']
    const password = data['login-password']

    // console.log({ mobile: Number(email), password })
    if (isObjEmpty(errors)) {
      setloading(true)
      useJwt
        .merchentlogin({ mobile: Number(email), password })
        .then(async res => {
          // console.log(res.data.payload, 'response')
          // if (res.data.payload.checkininfo) {

          //   history.push('/vendordashboard')
          // }
          setloading(false)
          await useJwt.userPlan({ id: parseInt(res.data.payload.user_info.id) }).then(res => {
            localStorage.setItem('planInfo', JSON.stringify(res.data.payload))
          }).catch(err => {
            console.log('userPlan', err.response)
          })
          const data = {
            ...res.data.payload.user_info,
            // avatar: "https://i.imgur.com/P4b2RHh.png",
            accessToken: res.data.payload.token,
            refreshToken: res.data.payload.token,
            extras: {
              eCommerceCartItemsCount: 5
            },
            role: 'vendor',
            ability: [
              {
                action: 'manage',
                subject: 'VENDOR'
              },
              {
                action: 'manage',
                subject: 'Auth'
              }
            ]
          }

          dispatch(handleLogin(data))
          ability.update(data.ability)
          // localStorage.setItem('username', email)
          toast.success(
            <ToastContent name={data.username} role={data.role} />,
            { transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )

          // await useJwt.getPMStoken({ username: "dddd", module: "kkk" }).then(res => {
          //   localStorage.setItem('PMStoken', res.data.data.access_token)
          //   localStorage.setItem("usePMStoken", false)
          // }).catch(err => {
          //   console.log('getPMStoken', err)
          // })

          localStorage.setItem("usePMStoken", false)
          localStorage.setItem("BMSCall", true)
          await useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
            localStorage.setItem('BMStoken', res.data.jwtToken)
            localStorage.setItem("BMSCall", false)
          }).catch(err => {
            localStorage.setItem("BMSCall", false)
            console.log(err)
          })
          
          await useJwt.customerbusinesslistbymobileno({ mobile: Number(email) }).then(res =>  {
            console.log(res)
             localStorage.setItem('customerBusinesses', JSON.stringify(res.data.payload))
             history.push(getHomeRouteForLoggedInUser(data.role))
          }).catch(err => {
            Error(err)
            console.log(err)
          })
          

        })
        .catch(err => {
          setloading(false)
          Error(err)
          console.log(err)
        })
    }
  }
  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>

          <img width='80px' src={pms} />

          {/* <h2 style={{ color: window.TukitakiThemeColor }} className='brand-text ml-1 mt-1'>RILAC</h2> */}
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login V2' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              Welcome to Rilac! 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label className='form-label' for='login-email'>
                  Mobile Number
                </Label>
                <Input
                  autoFocus
                  type='text'
                  // value={email}
                  id='login-email'
                  name='loginemail'
                  placeholder='Mobile number'
                  onChange={e => setEmail(e.target.value)}
                  className={classnames({ 'is-invalid': errors['login-email'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              {registerCheck?.mobile_match === false && <h6 className='text-danger'>Please enter a valide mobile number.</h6>}
              {
                (!registerCheck?.mobile_match && loading) ? <Button.Ripple color='primary' block disabled>
                    <Spinner color='white' size='sm' />
                    <span className='ml-50'>Loading...</span>
                  </Button.Ripple> : (!registerCheck?.is_registered && !registerCheck?.mobile_match) ? <Button.Ripple type='button' onClick={checkMobile} color='primary' block>
                    Next
                  </Button.Ripple> : <></>
              }
             
              {(registerCheck?.mobile_match && registerCheck?.is_registered) && <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  // value={password}
                  id='login-password'
                  name='login-password'
                  minLength="6"
                  className='input-group-merge'
                  onChange={e => setPassword(e.target.value)}
                  className={classnames({ 'is-invalid': errors['login-password'] })}
                  innerRef={register({ required: true, validate: value => value !== '' && value.length > 5 })}
                />
                <span style={{ color: 'red' }} >{errors['login-password'] && "Password must contain at least 6 characters, including 1 upper case,1 lower case, 1 number and a spatial character"}</span>
                <span style={{ color: 'red' }} >{servererrors['password']}</span>

              </FormGroup>}
              {
                ((registerCheck?.mobile_match && registerCheck?.is_registered) && loading) ? <Button.Ripple color='primary' block disabled>
                  <Spinner color='white' size='sm' />
                  <span className='ml-50'>Loading...</span>
                </Button.Ripple> : (registerCheck?.mobile_match && registerCheck?.is_registered) ? <Button.Ripple type='submit' color='primary' block>
                  Sign in
                </Button.Ripple> : <></>
              }
              <br></br>
              <p className="text-center" >Don't have an account &nbsp;<Link to="/merchantregister">
                Register
              </Link>
              </p>
              <div className='divider my-1'>
                <div className='divider-text'>or</div>
              </div>
              <p className="text-center" >Login as &nbsp;<Link to="/Adminlogin">
                Admin
              </Link>
              </p>
            </Form>
          </Col>
        </Col>
      </Row>
      <Modal isOpen={registerCheck?.mobile_match && !registerCheck.is_registered} /* toggle={toggleModal} */ className='modal-dialog-top'>
            <ModalHeader /* toggle={toggleModal} */>OTP</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md='9' >
                        <FormGroup>
                            <Label for="otp">OTP</Label>
                            <Input type="number"
                                name="otp"
                                id='otp'
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                                min={1}
                                placeholder='code here...'
                            />
                            <h6 className='text-danger mt-1'>{otpErr}</h6>
                        </FormGroup>
                    </Col>
                    <Col md='3' className='mt-2'>
                      {
                        loading ? <Button.Ripple color='primary' block disabled>
                          <Spinner color='white' size='sm' />
                          <span className='ml-50'>Loading...</span>
                        </Button.Ripple> : <Button.Ripple type='button' onClick={checkOtp} color='primary' block>
                          Go
                        </Button.Ripple>
                      }
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    </div>
  )
}

export default Login
