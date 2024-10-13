import Avatar from "@components/avatar"
import InputPasswordToggle from "@components/input-password-toggle"
import { useSkin } from "@hooks/useSkin"
import useJwt from "@src/auth/jwt/useJwt"
import { AbilityContext } from "@src/utility/context/Can"
import "@styles/base/pages/page-auth.scss"
import classnames from "classnames"
import { Fragment, useContext, useState } from "react"
import { Coffee } from "react-feather"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import { toast } from "react-toastify"
import {
  Button,
  CardText,
  CardTitle,
  Col,
  Form,
  FormGroup, Label,
  Row,
  Spinner
} from "reactstrap"
import dpaylogo from '../../../assets/images/icons/RILAC-Logo.svg'

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
        <h6 className="toast-title font-weight-bold">Welcome, {name}</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span>
        You have successfully logged in as an {role} user to Rilac. Now you can
        start to explore. Enjoy!
      </span>
    </div>
  </Fragment>
)
const MerchantLogin = () => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  // const [mobileNumber, setMobileNumber] = useState("") 
  const [password, setPassword] = useState("")
  const [conPassword, setConfromPassword] = useState("")
  const [loading, setloading] = useState(false)
  const [servererrors, seterrors] = useState({})
  const { register, errors, handleSubmit } = useForm()


  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = (data) => {
    const mobileNumber = localStorage.getItem("mobilenumber")
    console.log(mobileNumber, password, conPassword)
    // const email = data["loginemail"]
    // const password = data["login-password"]

    if (password === conPassword) {
      setloading(true)
      useJwt
        .merchentsetpassword({ mobile: mobileNumber, password, isforgetpassword: false })
        .then((res) => {
          console.log(res, "response")
          setloading(false)
          if (res.data.issuccess) {
            history.push("/Adminlogin")
          }
        })
        .catch((err) => {
          setloading(false)
          //  console.log(err)
          const e = err.response
          if (e.status === 404 || e.status === 401) {
            toast.error(e.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            })
          }
        })
    } else {
      toast.error('confirm password must be same as password.')
    }
  }
  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img src={dpaylogo} />
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login V2" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              Welcome to Rilac! 👋
            </CardTitle>
            <CardText className="mb-2">
              Please set new password and start the adventure
            </CardText>
            {/*<Alert color='primary'>
                <div className='alert-body font-small-2'>
                  <p>
                    <small className='mr-50'>
                      <span className='font-weight-bold'>Admin:</span> admin@demo.com | admin
                    </small>
                  </p>
                  <p>
                    <small className='mr-50'>
                      <span className='font-weight-bold'>Client:</span> client@demo.com | client
                    </small>
                  </p>
                </div>
                <HelpCircle
                  id='login-tip'
                  className='position-absolute'
                  size={18}
                  style={{ top: '10px', right: '10px' }}
                />
                <UncontrolledTooltip target='login-tip' placement='left'>
                  This is just for ACL demo purpose.
                </UncontrolledTooltip>
              </Alert>*/}
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* <FormGroup>
                <Label className="form-label" for="register-mobile">
                  Mobile Number
                </Label>
                <Input
                  autoFocus
                  type="number"
                  value={mobileNumber}
                  placeholder="0175139****"
                  id="register-mobile"
                  name="register-mobile"
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className={classnames({
                    "is-invalid": errors["register-username"]
                  })}
                  innerRef={register({
                    required: true,
                    validate: (value) => value !== ""
                  })}
                />
              </FormGroup> */}

              <FormGroup>
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  {/*<Link to='/forgot-password'>
                      <small>Forgot Password?</small>
                    </Link>*/}
                </div>
                <InputPasswordToggle
                  // value={password}
                  id="login-password"
                  name="login-password"
                  minLength="6"
                  className="input-group-merge"
                  onChange={(e) => setPassword(e.target.value)}
                  className={classnames({
                    "is-invalid": errors["login-password"]
                  })}
                  innerRef={register({
                    required: true,
                    validate: (value) => value !== "" && value.length > 5
                  })}
                />
                <span style={{ color: "red" }}>
                  {errors["login-password"] &&
                    "Password must contain at least 6 characters, including 1 upper case,1 lower case, 1 number and a spatial character"}
                </span>
                <span style={{ color: "red" }}>{servererrors["password"]}</span>
              </FormGroup>

              <FormGroup>
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="confirm-password">
                    Confirm Password
                  </Label>
                  {/*<Link to='/forgot-password'>
                      <small>Forgot Password?</small>
                    </Link>*/}
                </div>
                <InputPasswordToggle
                  // value={password}
                  id="confirm-password"
                  name="confirm-password"
                  minLength="6"
                  className="input-group-merge"
                  onChange={(e) => setConfromPassword(e.target.value)}
                  className={classnames({
                    "is-invalid": errors["login-password"]
                  })}
                  innerRef={register({
                    required: true,
                    validate: (value) => value !== "" && value.length > 5
                  })}
                />
                <span style={{ color: "red" }}>
                  {errors["login-password"] &&
                    "Password must contain at least 6 characters, including 1 upper case,1 lower case, 1 number and a spatial character"}
                </span>
                <span style={{ color: "red" }}>{servererrors["password"]}</span>
              </FormGroup>

              {/*<FormGroup>
                  <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' />
                </FormGroup>*/}

              {loading ? (
                <Button.Ripple color="primary" block disabled>
                  <Spinner color="white" size="sm" />
                  <span className="ml-50">Loading...</span>
                </Button.Ripple>
              ) : (
                <Button.Ripple type="submit" color="primary" block>
                  Submit
                </Button.Ripple>
              )}
            </Form>
            {/*<p className='text-center mt-2'>
                <span className='mr-25'>New on our platform?</span>
                <Link to='/register'>
                  <span>Create an account</span>
                </Link>
              </p>
              <div className='divider my-2'>
                <div className='divider-text'>or</div>
              </div>
              <div className='auth-footer-btn d-flex justify-content-center'>
                <Button.Ripple color='facebook'>
                  <Facebook size={14} />
                </Button.Ripple>
                <Button.Ripple color='twitter'>
                  <Twitter size={14} />
                </Button.Ripple>
                <Button.Ripple color='google'>
                  <Mail size={14} />
                </Button.Ripple>
                <Button.Ripple className='mr-0' color='github'>
                  <GitHub size={14} />
                </Button.Ripple>
              </div>*/}
          </Col>
        </Col>
      </Row>
    </div>
  )
}
export default MerchantLogin
