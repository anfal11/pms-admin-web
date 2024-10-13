import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import useJwtBMS from '@src/auth/jwt/useJwtBMS'
import { AbilityContext } from '@src/utility/context/Can'
import { handleLogin } from '@store/actions/auth'
import '@styles/base/pages/page-auth.scss'
import { isObjEmpty } from '@utils'
import classnames from 'classnames'
import { Fragment, useContext, useState, useEffect } from 'react'
import { Coffee } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import {
  Button, CardText, CardTitle, Col, Form, FormGroup, Input, Label, Row, Spinner
} from 'reactstrap'
import pmsImg from '../../../assets/images/icons/RILAC-Logo.svg'
import nav from '../../../navigation/vertical/customise'
import { Error } from '../../viewhelper'

const AdminLogin = () => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setloading] = useState(false)
  const [servererrors, seterrors] = useState({})
  const { register, errors, handleSubmit } = useForm()

  // useEffect(() => {
  //   fetch('https://api.ipify.org/?format=json')
  //     .then(res => res.json())
  //     .then(data => localStorage.setItem('ip', data.ip))
  // }, [])
  const previousLocation = localStorage.getItem("previousLocation") || null
  const previousRole = localStorage.getItem("previousRole") || null

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  useEffect(async () => { 

    localStorage.clear()

  }, [])
  
  const onSubmit = data => {
    const email = data['loginemail']
    const password = data['login-password']
    if (isObjEmpty(errors)) {
      setloading(true)
      useJwt.login({ username: email, password }).then(async res => {
          console.log('login response', res.data)

          const [bms, adminusermenusubmenu] = await Promise.all([

              useJwtBMS.login().then(res3 => {
                return res3.data
              }).catch(err => {
                console.log('BMS ', err)
                return null
              }),

              useJwt2.AdminUsersAssignedMenus({accessToken: res.data.payload.token}).then(response => {
                return response.data.payload
              }).catch(err => {
                console.log(err)
                return []
              })
            
          ])

          // console.log('user_info', res.data.payload)
          const userrole = parseInt(res.data.payload.user_info.roleid)
          //if (userrole === 12 || userrole === 13) {

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

          if (!bms) {
            Error({response: { status: 401, data: { message: 'Bms service is not connected!'}}})
            setloading(false)
            return 0
          }  else if (!adminusermenusubmenu.length) {
            Error({response: { status: 401, data: { message: `Didn't find any assign menu permission for you. Please contact with system admin.`}}})
            setloading(false)
            return 0
          }


          localStorage.setItem("useBMStoken", false)
          localStorage.setItem("BMSCall", false)
          localStorage.setItem('BMStoken', bms['jwtToken'])

          localStorage.setItem("AssignedMenus", JSON.stringify(adminusermenusubmenu))

          localStorage.setItem('username', email)

          const link = nav.find(an => an.id === adminusermenusubmenu[0].id)?.navLink ? nav.find(an => an.id === adminusermenusubmenu[0].id)?.navLink : nav.find(an => an.id === adminusermenusubmenu[0].id)?.children[0]?.navLink

          //password expired check
          if (res.data.payload.password_added_at_before <= res.data.payload.passwordconfig?.expire_date_length) {

            await dispatch(handleLogin(data))
            await ability.update(data.ability)

            window.location.href = (previousRole === data?.role && previousLocation) ? previousLocation : link

          } else {

            localStorage.setItem('accessToken', res.data.payload.token)
            localStorage.setItem('link', link)
            window.location.href = '/resetPass'
          }

        })
        .catch(err => {
          setloading(false)
          Error(err)
          console.log('login error', err.response)

        })
    }
  }
  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>

          <img width='80px' src={pmsImg} />

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
              Welcome to Rilac 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <FormGroup>
                <Label className='form-label' for='login-email'>
                  User Name
                </Label>
                <Input
                  autoFocus
                  type='text'
                  // value={email}
                  id='login-email'
                  name='loginemail'
                  placeholder='username'
                  onChange={e => setEmail(e.target.value)}
                  className={classnames({ 'is-invalid': errors['login-email'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  // value={password}
                  id='login-password'
                  name='login-password'
                  onChange={e => setPassword(e.target.value)}
                  className={classnames('input-group-merge', { 'is-invalid': errors['login-password'] })}
                  innerRef={register({ required: true, validate: value => value !== '' && value.length > 5 })}
                />
                <span style={{ color: 'red' }} >{errors['login-password'] && "Valid password required"}</span>
                <span style={{ color: 'red' }} >{servererrors['password']}</span>

              </FormGroup>
              {
                loading ? <Button.Ripple color='primary' block disabled>
                  <Spinner color='white' size='sm' />
                  <span className='ml-50'>Loading...</span>
                </Button.Ripple> : <Button.Ripple type='submit' color='primary' block>
                  Sign in
                </Button.Ripple>
              }
              <br></br>
              {/* <p className="text-center" >Don't have an account &nbsp;<Link to="/merchantregister">
                Register
              </Link>
              </p>
              <div className='divider my-2'>
                <div className='divider-text'>or</div>
              </div> */}
              <p className="text-center" >Login as &nbsp;<Link to="/login">
                Merchant
              </Link>
              </p>
            </Form>

          </Col>
        </Col>
      </Row>
    </div>
  )
}
export default AdminLogin