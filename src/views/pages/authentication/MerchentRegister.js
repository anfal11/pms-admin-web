import { useSkin } from "@hooks/useSkin"
import { AbilityContext } from "@src/utility/context/Can"
import "@styles/base/pages/page-auth.scss"
import { selectThemeColors } from "@utils"
import classnames from "classnames"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { Plus, Search } from "react-feather"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import Select from 'react-select'
import {
  Button, Col, CustomInput,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap"
import InputPasswordToggle from '@components/input-password-toggle'
import pms from '../../../assets/images/icons/RILAC-Logo.svg'
// import useJwt from "../../../@core/auth/jwt/useJwt"
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { toast } from "react-toastify"

const Register = () => {
  const ability = useContext(AbilityContext)
  const pawsswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,}$/
  const catRef = useRef()
  const countryRef = useRef()
  const cityRef = useRef()
  const [skin, setSkin] = useSkin()
  const history = useHistory()
  const dispatch = useDispatch()
  const { register, errors, handleSubmit, trigger } = useForm()
  const [file, setFile] = useState(null)

  const [valErrors, setValErrors] = useState({})
  const [docerror, setdocerror] = useState({})
  const [businesscategorylist, setbusinesscategorylist] = useState(null)
  const [terms, setTerms] = useState(false)

  useEffect(() => {
    useJwt.businesscategoryList().then(res => {
      console.log(res)
      const { payload } = res.data
      setbusinesscategorylist(payload.map(x => { return { value: x.id, label: x.statusdesc } }))
    }).catch(err => {
        console.log(err.response)
        Error(err)
    })
  }, [])
  
  const [userInput, setUserInput] = useState(JSON.parse(localStorage.getItem('registration_data')) || {
    ...JSON.parse(localStorage.getItem('registration_data')),
    firstname: '',
    lastname: '',
    businessname: '',
    email: '',
    mobile: '',
    password: '',
    reTypedPassword: '',
    country: '',
    businesscategoryids: [6],
    status: 1,
    logo: '',
    city: '', // need city api 
    city_id: 0,
    address: '',
    postcode: '',
    web_login: true,
    card_name: '',
    card_number: '',
    card_address: '',
    card_expiry: '',
    off_days: []
    // plan_id : 2  //delete later
  })

  const illustration =
    skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default

  const Terms = () => {
    return (
      <Fragment>
        I agree to
        <a className="ml-25" href="/" onClick={(e) => e.preventDefault()}>
          privacy policy & terms
        </a>
      </Fragment>
    )
  }
  const onSubmit = (e) => {
    e.preventDefault()
    if (userInput.reTypedPassword !== userInput.password) {
      toast.error('Password and retype password are not matching!')
      return 0
    }
    if (!terms) {
      toast.error('Please agree to privacy & terms.')
      return 0
    }
    localStorage.setItem("registration_data", JSON.stringify(userInput))
    history.push('/merchantregistercarddetails')
  }

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner justify-content-center">
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <img width='80px' src={pms} />
        </Link>
        <Col className="d-flex align-items-center auth-bg px-1 py-lg-3 my-5" lg="6" sm="12">
          <Col className="px-xl-1" sm="12">
            <Form action="/" className="auth-register-form" onSubmit={onSubmit}>
              <Row>
              <Col sm='6'>
                  <FormGroup>
                    <Label className="form-label" for="first-name">
                      First Name <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      autoFocus
                      required
                      type="text"
                      value={userInput.firstname}
                      placeholder="John"
                      id="firstname"
                      name="firstname"
                      onChange={(e) => setUserInput({ ...userInput, firstname: e.target.value })}
                    // className={classnames({ "is-invalid": errors["mobile"] })}
                    // innerRef={register({ required: true, validate: (value) => value !== "" })}
                    />
                    {/* {Object.keys(valErrors).length && valErrors.mobile ? (
                      <small className="text-danger">{valErrors.mobile}</small>
                    ) : null} */}
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className="form-label" for="last-name">
                      Last Name <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      required
                      value={userInput.lastname}
                      placeholder="Doe"
                      id="lastname"
                      name="lastname"
                      onChange={(e) => setUserInput({ ...userInput, lastname: e.target.value })}
                    // className={classnames({ "is-invalid": errors["businessname"] })}
                    // innerRef={register({ required: true, validate: (value) => value !== "" })}
                    />
                    {/* {Object.keys(valErrors).length && valErrors.businessname ? (
                      <small className="text-danger">{valErrors.businessname}</small>
                    ) : null} */}
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className="form-label" for="register-mobile">
                      Mobile Number <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      required
                      type="number"
                      value={userInput.mobile}
                      placeholder="017*******"
                      id="mobile"
                      name="mobile"
                      onChange={(e) => setUserInput({ ...userInput, mobile: e.target.value })}
                    // className={classnames({ "is-invalid": errors["mobile"] })}
                    // innerRef={register({ required: true, validate: (value) => value !== "" })}
                    />
                    {/* {Object.keys(valErrors).length && valErrors.mobile ? (
                      <small className="text-danger">{valErrors.mobile}</small>
                    ) : null} */}
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className="form-label" for="businessname">
                      Business Name <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      required
                      value={userInput.businessname}
                      placeholder="John"
                      id="businessname"
                      name="businessname"
                      onChange={(e) => setUserInput({ ...userInput, businessname: e.target.value })}
                    // className={classnames({ "is-invalid": errors["businessname"] })}
                    // innerRef={register({ required: true, validate: (value) => value !== "" })}
                    />
                    {/* {Object.keys(valErrors).length && valErrors.businessname ? (
                      <small className="text-danger">{valErrors.businessname}</small>
                    ) : null} */}
                  </FormGroup>
                </Col>
                <Col sm='12'>
                  <FormGroup>
                    <Label className="form-label" for="email">
                      Email <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      type="email"
                      value={userInput.email}
                      id="email"
                      required
                      name="email"
                      onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
                      placeholder="john@example.com"
                    // className={classnames({ "is-invalid": errors["email"] })}
                    // innerRef={register({ required: true, validate: (value) => value !== "" })}
                    />
                    {/* {Object.keys(valErrors).length && valErrors.email ? (
                      <small className="text-danger">{valErrors.email}</small>
                    ) : null} */}
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className="form-label" for="password">
                      Password <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <InputPasswordToggle
                      className='input-group-merge'
                      value={userInput.password}
                      id="password"
                      name="password"
                      required
                      pattern={String(pawsswordPattern).slice(1, -1)}
                      onChange={(e) => {
                        if (!pawsswordPattern.test(e.target.value)) {
                          e.target.setCustomValidity('Minimum eight characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character')
                        } else {
                          e.target.setCustomValidity("")
                        }
                        setUserInput({ ...userInput, password: e.target.value })
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className="form-label" for="password">
                      Re-type Password <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <InputPasswordToggle
                      id="password2"
                      name="password2"
                      required
                      className='input-group-merge'
                      // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                      value={userInput.reTypedPassword}
                      pattern={String(pawsswordPattern).slice(1, -1)}
                      onChange={(e) => {
                        if (userInput.password !== (e.target.value)) {
                          e.target.setCustomValidity('Please Re-type password correctly!')
                        } else {
                          e.target.setCustomValidity("")
                        }
                        setUserInput({ ...userInput, reTypedPassword: e.target.value })
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col sm='4'>
                  <FormGroup>
                    <Label for='businesscategories'>Business Category <span style={{ color: 'red' }}>*</span></Label>&nbsp;{docerror['category'] ? <Fragment><span style={{ color: 'red', fontSize: '11px' }}>Business Category is required</span></Fragment> : null
                    }
                    <Select
                      ref={catRef}
                      theme={selectThemeColors}
                      className='basic-multi-select'
                      classNamePrefix='select'
                      name="businesscategoryids"
                      options={businesscategorylist}
                      value={businesscategorylist?.find(item => item.value === userInput?.businesscategoryids)}
                      onChange={selected => setUserInput({ ...userInput, businesscategoryids: selected.value })}
                      isClearable={false}
                      isLoading={!businesscategorylist}

                    />
                    <Input
                      // required
                      style={{
                        opacity: 0,
                        width: "100%",
                        height: 0
                        // position: "absolute"
                      }}
                      onFocus={e => catRef.current.select.focus()}
                      value={userInput.businesscategoryids || ''}
                      onChange={e => ''}
                    />
                  </FormGroup>
                </Col>
                <Col sm='4'>
                  <FormGroup>
                    <Label for='country'>Country<span style={{ color: 'red' }}>*</span></Label>&nbsp;{docerror['country'] ? <Fragment><span style={{ color: 'red', fontSize: '11px' }}>Country is required</span></Fragment> : null
                    }
                    <Select
                      ref={countryRef}
                      theme={selectThemeColors}
                      className='basic-multi-select'
                      classNamePrefix='select'
                      name="country"
                      value={[{value: 'UK', label: 'United Kingdom' }, {value: 'BD', label: 'Bangladesh' }].find(item => item.value === userInput?.country)}
                      options={[{value: 'UK', label: 'United Kingdom' }, {value: 'BD', label: 'Bangladesh' }]}
                      onChange={selected => setUserInput({ ...userInput, country: selected.value })}
                      isClearable={false}
                      // isLoading={businesscategorylist.length === 0}

                    />
                    <Input
                      // required
                      style={{
                        opacity: 0,
                        width: "100%",
                        height: 0
                        // position: "absolute"
                      }}
                      onFocus={e => countryRef.current.select.focus()}
                      value={userInput.country || ''}
                      onChange={e => ''}
                    />
                  </FormGroup>
                </Col>
                <Col sm='4'>
                  <FormGroup>
                    <Label for='city'>City <span style={{ color: 'red' }}>*</span></Label>&nbsp;{docerror['city'] ? <Fragment><span style={{ color: 'red', fontSize: '11px' }}>City is required</span></Fragment> : null
                    }
                    <Select
                      ref={catRef}
                      theme={selectThemeColors}
                      className='basic-multi-select'
                      classNamePrefix='select'
                      name="city"
                      value={[{value: 'London', label: 'London' }, {value: 'Dhaka', label: 'Dhaka' }].find(item => item.value === userInput?.city)}
                      options={[{value: 'London', label: 'London' }, {value: 'Dhaka', label: 'Dhaka' }]}
                      onChange={selected => setUserInput({ ...userInput, city: selected.value })}
                      isClearable={false}
                      // isLoading={businesscategorylist.length === 0}

                    />
                    <Input
                      // required
                      style={{
                        opacity: 0,
                        width: "100%",
                        height: 0
                        // position: "absolute"
                      }}
                      onFocus={e => cityRef.current.select.focus()}
                      value={userInput.city || ''}
                      onChange={e => ''}
                    />
                  </FormGroup>
                </Col>

                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='postcode'>
                      Postcode
                    </Label>
                    <div className="d-flex">
                      <Input
                        type='text'
                        id='postcode'
                        name='postcode'
                        placeholder='1234'
                        value={userInput.postcode}
                        onChange={(e) => setUserInput({ ...userInput, postcode: e.target.value })}
                      // onChange={e => setEmail(e.target.value)}
                      // className={classnames({ 'is-invalid': errors['postcode'] })}
                      // innerRef={register({ required: true, validate: value => value !== '' })}
                      />
                      <Button.Ripple type="button" color="info">
                        <Search size={15} />
                      </Button.Ripple>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='Address'>
                      Address
                    </Label>
                    <Input
                      type='text'
                      id='Address'
                      name='Address'
                      placeholder=''
                      value={userInput.address}
                      onChange={(e) => setUserInput({ ...userInput, address: e.target.value })}
                    // onChange={e => setEmail(e.target.value)}
                    // className={classnames({ 'is-invalid': errors['postcode'] })}
                    // innerRef={register({ required: true, validate: value => value !== '' })}
                    />
                  </FormGroup>
                </Col>
                <Col sm='3'>
                  <FormGroup>
                      <Label for="openTime">Shop Opening Time<span style={{ color: 'red' }}>*</span></Label>
                      <Input type="time"
                          name="openTime"
                          id='openTime'
                          value={userInput.openTime}
                          onChange={(e) => setUserInput({ ...userInput, openTime: e.target.value })}
                          required
                      />
                  </FormGroup>
                </Col>
                <Col sm='3'>
                  <FormGroup>
                      <Label for="closeTime">Shop Closing Time<span style={{ color: 'red' }}>*</span></Label>
                      <Input type="time"
                          name="closeTime"
                          id='closeTime'
                          value={userInput.closeTime}
                          onChange={(e) => setUserInput({ ...userInput, closeTime: e.target.value })}
                          required
                      />
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                      <Label for="offDay">Shop Off day<span style={{ color: 'red' }}>*</span></Label>
                      <Select
                          theme={selectThemeColors}
                          maxMenuHeight={200}
                          className='react-select'
                          classNamePrefix='select'
                          isMulti
                          onChange={(selected) => {
                              setUserInput({ ...userInput, off_days: selected.map(i => i.value) })
                          }}
                          value={[{ value: 6, label: 'Saturday' }, { value: 0, label: 'Sunday' }, { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }].filter(item => userInput.off_days?.includes(item.value))}
                          options={[{ value: 6, label: 'Saturday' }, { value: 0, label: 'Sunday' }, { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }]}
                      />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='12' className='mb-1'>
                  <Label for="voucherImage">Upload Logo</Label>
                  <div className='d-flex'>
                    <div className="file position-relative overflow-hidden mr-2">
                      <div className='text-center p-1' style={{
                        height: '102px',
                        width: '102px',
                        border: '1px dashed #d9d9d9',
                        backgroundColor: "#fafafa"
                      }}>
                        <span ><Plus size={20} className='my-1' /></span> <br />
                        <span>Upload</span>
                      </div>
                      <Input
                        // style={{ width: '300px' }}
                        style={{
                          position: 'absolute',
                          opacity: '0',
                          left: '0',
                          top: '0',
                          height: '102px',
                          width: '102px',
                          cursor: 'pointer'
                        }}
                        type="file"
                        accept="image/png, image/jpeg"
                        // required
                        name="voucherImage"
                        id='voucherImage'
                        onChange={async e => {
                          setFile(e.target.files[0])
                          const formData = new FormData()
                          formData.append('image', e.target.files[0])
                          await useJwt.singleFileupload(formData).then(res => {
                              if (res.data.payload) {
                                  setUserInput({...userInput, logo: res.data.payload.image_url})
                              }
                          }).catch(e => {
                              console.log(e.response)
                          })
                        }}
                      />
                    </div>
                    {(file || userInput.logo) ? <img src={userInput.logo || URL.createObjectURL(file)} alt='voucher img' height='100px'></img> : null}
                  </div>
                </Col>
              </Row>
              <FormGroup>
                <CustomInput
                  type="checkbox"
                  id="terms"
                  name="terms"
                  value="terms"
                  label={<Terms />}
                  className="custom-control-Primary"
                  innerRef={register({ required: true })}
                  onChange={(e) => setTerms(e.target.checked)}
                  invalid={errors.terms && true}
                />
              </FormGroup>

              <Button.Ripple type="submit" block color="primary">
                Next
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <span className="mr-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
