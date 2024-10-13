import useJwt from '@src/auth/jwt/useJwt'
import { selectThemeColors } from '@utils'
import React, { useState } from 'react'
import { Search, Send } from 'react-feather'
import Select from 'react-select'
import { Alert, Button, Card, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
// import DirectDebitLogo from '../../../../assets/images/logo/DirectDebitLogo.png'
import { toast } from 'react-toastify'
import { Error } from '../../viewhelper'

const GoCardless = (props) => {
    const { setConditionalRendering, showCompanyName, setshowCompanyName, continueBtn, setcontinueBtn } = props
    const [userinput, setuserinput] = useState({
        ...JSON.parse(localStorage.getItem('registration_data')),
        isnewaccount: true,
        isibn: false,
        accountnumber: "",
        // address: "",
        // city: "",
        // companyname: "",
        // country: "",
        // email: "",
        // firstname: "",
        // lastname: "",
        // postcode: "",
        sortcode: "",
        accountholdername: "",
        // customerid: "",
        isneedmorethenonepersontoauth: false,
        addpaymentid: 0,
        payment_method_id: 1,
        sub_type: "monthly"
    })  
    const [errors, setErrors] = useState({
        email: false,
        address: false,
        accountNumber: false,
        sortcode: false
    })
    const [isloading, setisloading] = useState(false)
    const [showCustomPostCode, setshowCustomPostCode] = useState(false)
    const [CustomPostCode, setCustomPostCode] = useState(true)
    const [PostCodeError, setPostCodeError] = useState(false)
    const [postcodefetching, setpostcodefetching] = useState(false)
    const [businessaddress, setbusinessaddress] = useState([])
    const [tempaddress, settempaddress] = useState([])
    const [loader, setLoader] = useState(false)
    const [ErrorTexts, setErrorTexts] = useState([])

    const onChange = (e) => {
        // if (e.target.name === 'postcode') {
        //     const chkLength = /^.{6,8}$/.test(e.target.value)
        //     if (chkLength) {
        //         setPostCodeError(false)
        //     } else { setPostCodeError(true) }
        //     // console.log(chkLength)
        // }
        if (e.target.name === 'email') {
            const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
            const err = { ...errors }
            !chkEmail ? err.email = true : err.email = false
            setErrors({ ...err })
        }
        if (e.target.name === 'sortcode') {
            const err = { ...errors }
            e.target.value.length !== 6 ? err.sortcode = true : err.sortcode = false
            setErrors({ ...err })
        }
        if (e.target.name === 'accountnumber') {
            const err = { ...errors }
            e.target.value.length !== 8 ? err.accountNumber = true : err.accountNumber = false
            setErrors({ ...err })
        }
        setuserinput({ ...userinput, [e.target.name]: e.target.value })
    }


    const addressChange = (item) => {
        const index1 = +item.value
        setuserinput({ ...userinput, address: item.label, country: tempaddress[index1].country, city: tempaddress[index1].town_or_city })
    }

    const handleCustomPostCode = (e) => {
        setuserinput({ ...userinput, country: '', address: '', city: '' })
        if (e.target.checked) {
            setCustomPostCode(false)
        } else {
            setCustomPostCode(true)
        }
    }

    const hanldeAuthPerson = (e) => {
        if (e.target.checked) {
            setuserinput({ ...userinput, isneedmorethenonepersontoauth: true })
        } else {
            setuserinput({ ...userinput, isneedmorethenonepersontoauth: false })
        }
    }

    const searchPostcode = () => {
        if (userinput.postcode) {
            setpostcodefetching(true)
            setbusinessaddress([])
            setuserinput({ ...userinput, address: '', country: '', city: '' })
            useJwt.ukAddressEndpoint({ postCode: userinput.postcode }).then(res => {
                const { addresses } = res.data.payload
                console.log(addresses)
                if (!addresses.length) {
                    setshowCustomPostCode(true)
                } else { setshowCustomPostCode(false) }
                setCustomPostCode(true)
                const data = addresses.map((item, index) => {
                    const format = item.formatted_address.filter(item => item).splice(0, 1).toString()
                    return { value: index, label: format }
                })  //convert to string
                setpostcodefetching(false)
                setbusinessaddress(data)
                settempaddress(addresses)
                // setuserinput({ ...userinput })
            })
                .catch(err => {
                    setpostcodefetching(false)
                    Error(err)
                    setshowCustomPostCode(true)
                })
        }
    }

    const handleContinue = () => {
        setConditionalRendering({
            showDDSForm: false,
            showDDSDetails: true,
            showDDSConfirmation: false
        })
    }
    const onSubmit = (e) => {
        e.preventDefault()
        // if (!userinput.address && userinput.postcode) {
        //     searchPostcode()
        // }
        // setcontinueBtn(true)
        // const { IBAN, IBANsortCode, accountnumber, address, city, companyname, country, email, firstname, lastname, postcode, sortcode, accountholdername, customerid, isneedmorethenonepersontoauth } = userinput
        const { accountnumber, address, city, email, firstname, lastname, postcode, sortcode, accountholdername } = userinput

        const err = { ...errors }
        !address ? err.address = true : err.address = false
        setErrors({ ...err })

        if (!address || errors.email || errors.sortcode || errors.accountNumber) {
            return
        }

        setLoader(true)
        console.log({
            accountnumber, address, city, email, firstname, lastname, postcode, sortcode, accountholdername
        })

        
        // useJwt.DDScreateCustomer({ address, city, email, firstname, lastname, postcode }).then(res => {
        console.log(userinput)    
        useJwt.customerBusinessRegistration({...userinput}).then(res => {
            console.log(res)
            window.location.href = res.data.payload.payment_url
            // window.location.href = res.data.payload.payment_url
            
        }).catch(error => {
            setLoader(false)
            Error(error.response)
                // console.log(error.response.data.message)
                console.log(error.response)
          
        })
    }
    return (
        <div className='m-0'>
            <Card>
                {/* <CardHeader className='border-bottom'>
                    <CardTitle tag='h3'>Set Your Direct Debit Account First</CardTitle>
                    <div>
                    </div>
                </CardHeader> */}
                <Form className="p-2" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Row>
                        {!!ErrorTexts.length && <Col md='12'>
                            <Alert color='danger' className='p-1'>
                                <ul>
                                    {
                                        ErrorTexts.map((err, i) => <li key={i}>{`${err.message}`}</li>)
                                    }
                                </ul>
                            </Alert>
                        </Col>}
                        <Col md='4' className="mb-1">
                            <Label >{showCompanyName ? 'Company name' : 'First Name'}</Label>
                            {!showCompanyName ? <Input
                                required
                                placeholder="Firstname"
                                type='text'
                                name='firstname'
                                value={userinput.firstname}
                                onChange={onChange}
                            /> : <Input
                                required
                                placeholder="Your Company Name"
                                type='text'
                                name='companyname'
                                value={userinput.companyname}
                                onChange={onChange}
                            />}
                        </Col>

                        {!showCompanyName && <Col md='4' className="mb-1">
                            <Label >Last Name</Label>
                            <Input
                                required
                                placeholder="Lastname"
                                type='text'
                                name='lastname'
                                value={userinput.lastname}
                                onChange={onChange}
                            />
                        </Col>}
                        <Col md='4' className="mb-1">
                            <Label >Email</Label>
                            <Input
                                required
                                placeholder="Your Email"
                                type='email'
                                name='email'
                                value={userinput.email}
                                onChange={onChange}
                            />
                            {errors.email && <small style={{ color: 'red' }}>Please enter a valid email</small>}
                        </Col>

                        <Col md='4' className="mb-1">
                            <Label >Account Holder Name</Label>
                            <Input
                                required
                                placeholder="Account Holder Name"
                                type='text'
                                name='accountholdername'
                                value={userinput.accountholdername}
                                onChange={onChange}
                                disabled={!userinput.isnewaccount}
                            />
                        </Col>
                        <Col md='4' className="mb-1">
                            <Label >{userinput.isibn && 'IBAN'} Sort Code</Label>
                            <Input
                                required
                                placeholder='Sort Code'
                                type='number'
                                name='sortcode'
                                value={userinput.sortcode}
                                onChange={onChange}
                                disabled={!userinput.isnewaccount}
                            />
                            {errors.sortcode && <small style={{ color: 'red' }}>must be 6 character</small>}
                        </Col>

                        <Col md='4' className="mb-1">
                            <Label >{userinput.isibn ? 'IBAN' : 'Account Number'} </Label>
                            <Input
                                required
                                placeholder='Account Number'
                                type='number'
                                name='accountnumber'
                                value={userinput.accountnumber}
                                onChange={onChange}
                                disabled={!userinput.isnewaccount}
                            />
                            {errors.accountNumber && <small style={{ color: 'red' }}>must be 8 character</small>}
                        </Col>

                        <Col md='12'>
                            <hr />
                            <Card>
                                <Row>
                                    <Col md='4'>
                                        <FormGroup>
                                            <Label for='postcode'>Post Code<span style={{ color: 'red' }}>*</span></Label>
                                            <InputGroup className='input-group-merge mb-1'>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>
                                                        <Search size={14} />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type='text'
                                                    name='postcode'
                                                    id='postcode'
                                                    placeholder='Post Code'
                                                    value={userinput.postcode}
                                                    onChange={onChange}
                                                    required
                                                />
                                                <InputGroupAddon addonType='append'>
                                                    {postcodefetching ? <Button style={{ paddingBottom: '9px' }} color='primary' outline disabled>
                                                        <Spinner color='primary' size='sm' />
                                                    </Button> : <Button color='primary' outline onClick={searchPostcode}>
                                                        Search
                                                    </Button>
                                                    }
                                                </InputGroupAddon>
                                                <div className="p-0 m-0 w-100">
                                                    {showCustomPostCode && !PostCodeError && <small style={{ color: 'red' }}> postcode notfound</small>}
                                                </div>
                                                <div className="p-0 m-0 w-100">
                                                    {PostCodeError && <small style={{ color: 'red' }}> postcode must be 6 to 8 character</small>}
                                                </div>
                                                {/* {errors && errors.postcode && <FormFeedback>{errors.postcode.message}</FormFeedback>} */}
                                            </InputGroup>
                                            {showCustomPostCode && <CustomInput type='checkbox' id={'postcode1'} value={'CPC'} onChange={handleCustomPostCode} inline label='Click here to enter your address manually' />}
                                        </FormGroup>
                                    </Col>
                                    <Col md='3' sm='12'>
                                        <FormGroup>
                                            <Label for='address'>Address <span style={{ color: 'red' }}>*</span></Label>
                                            {
                                                businessaddress.length ? <Select
                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            borderColor: '#7367f0'
                                                        })
                                                    }}
                                                    maxMenuHeight={150}
                                                    theme={selectThemeColors}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name="address"
                                                    required
                                                    onChange={addressChange}
                                                    // defaultValue={businessaddress[0]}
                                                    options={businessaddress}
                                                    isClearable={false}
                                                /> : <Input
                                                    type='text'
                                                    required
                                                    onChange={onChange}
                                                    value={userinput.address}
                                                    disabled={CustomPostCode}
                                                    name='address'
                                                    placeholder='Address' />
                                            }
                                            {errors.address && !userinput.address && <small style={{ color: 'red' }}>Address is required</small>}
                                        </FormGroup>
                                    </Col>
                                    <Col md='3' sm='12'>
                                        <FormGroup>
                                            <Label for='country'>Country <span style={{ color: 'red' }}>*</span></Label>
                                            <Input onChange={onChange} type='text' required name='country' value={userinput.country} disabled={CustomPostCode} id='country' placeholder='Country' />
                                        </FormGroup>
                                    </Col>

                                    <Col md='2' sm='12'>
                                        <FormGroup>
                                            <Label for='city'>City <span style={{ color: 'red' }}>*</span></Label>
                                            <Input onChange={onChange} type='text' required name='city' value={userinput.city} disabled={CustomPostCode} id='city' placeholder='City' />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col md='12' >
                            <small>You may cancel this Direct Debit at any time by contacting Rilac or your bank</small>
                        </Col>

                        <Col md='12' className='text-center'>
                            {loader ? <Button.Ripple className='ml-2' color='primary' disabled style={{ marginTop: '22px' }}>
                                <Spinner size='sm' />
                                <span className='align-middle ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' style={{ marginTop: '22px' }} type="submit">
                                <Send size={15} />
                                <span className='align-middle ml-50'>Submit</span>
                            </Button.Ripple>}

                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    )
}

export default GoCardless