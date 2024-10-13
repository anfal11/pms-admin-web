import React, { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
    ChevronDown, Share, Printer, FileText, File, Search, Copy, Plus, MoreVertical, Edit, Archive, Trash, Send, Eye, ChevronRight
} from 'react-feather'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
    CardBody, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, InputGroup, InputGroupAddon, InputGroupText
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import ReactToPrint from 'react-to-print'
import ComponentToPrint from './DirectDebitInfoPrinter'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import DirectDebitLogo from '../../../../../assets/images/logo/DirectDebitLogo.png'

const DDSForm = (props) => {
    const { errors, setErrors, userinput, setuserinput, setConditionalRendering, showCompanyName, setshowCompanyName, continueBtn, setcontinueBtn } = props
    const [isloading, setisloading] = useState(false)
    const [showCustomPostCode, setshowCustomPostCode] = useState(false)
    const [CustomPostCode, setCustomPostCode] = useState(true)
    const [PostCodeError, setPostCodeError] = useState(false)
    const [postcodefetching, setpostcodefetching] = useState(false)
    const [businessaddress, setbusinessaddress] = useState([])
    const [tempaddress, settempaddress] = useState([])

    const onChange = (e) => {
        if (e.target.name === 'postcode') {
            const chkLength = /^.{6,8}$/.test(e.target.value)
            if (chkLength) {
                setPostCodeError(false)
            } else { setPostCodeError(true) }
            // console.log(chkLength)
        }
        if (e.target.name === 'email') {
            const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
            const err = { ...errors }
            !chkEmail ? err.email = true : err.email = false
            setErrors({ ...err })
        }
        if (e.target.name === 'sortCode') {
            const err = { ...errors }
            e.target.value.length !== 6 ? err.sortCode = true : err.sortCode = false
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
        if (userinput.postcode && (userinput.postcode.length > 5 && userinput.postcode.length < 9)) {
            setpostcodefetching(true)
            setbusinessaddress([])
            setuserinput({ ...userinput, address: '', country: '', city: '' })
            useJwt.postCodeSearch({ postcode: userinput.postcode }).then(res => {
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
        setcontinueBtn(true)
        const { IBAN, IBANsortCode, accountnumber, address, city, companyname, country, email, firstname, lastname, postcode, sortCode, holderName, customerid, isneedmorethenonepersontoauth } = userinput

        const err = { ...errors }
        !address ? err.address = true : err.address = false
        setErrors({ ...err })

        if (!address || errors.email || errors.sortCode || errors.accountNumber) {
            return
        }
        setConditionalRendering({
            showDDSForm: false,
            showDDSDetails: true,
            showDDSConfirmation: false
        })
        console.log(userinput)
        setcontinueBtn(false)
    }
    const componentRef = useRef()
    return (
        <>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h3'>Fill in the information</CardTitle>
                    <div>
                        {/* <ReactToPrint
                            trigger={() => <button>Print this out!</button>}
                            content={() => componentRef.current}
                        /> */}
                        <div style={{ display: 'none' }}>
                            <ComponentToPrint ref={componentRef} userinput={userinput} />
                        </div>
                    </div>
                </CardHeader>
                <Form className="p-2" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Row>
                        <Col md='6' className="mb-1">
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
                            <p style={{ cursor: 'pointer', userSelect: 'none' }}
                                className="text-primary p-0 mt-1 m-0"
                                onClick={() => {
                                    setshowCompanyName(!showCompanyName)
                                }}>Click here to enter your {!showCompanyName ? 'company' : 'full'} name</p>
                        </Col>

                        {!showCompanyName && <Col md='6' className="mb-1">
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
                        <Col md='6' className="mb-1">
                            <Label >Account Holder Name</Label>
                            <Input
                                required
                                placeholder="Account Holder Name"
                                type='text'
                                name='holderName'
                                value={userinput.holderName}
                                onChange={onChange}
                                disabled={!userinput.isnewaccount}
                            />
                        </Col>
                        {/* <Col md='6' className="mb-1">
                            <Label >TukiTaki Customer ID</Label>
                            <Input
                                required
                                placeholder="Customer Id"
                                type='number'
                                name='customerid'
                                value={userinput.customerid}
                                onChange={onChange}
                            />
                        </Col> */}

                        <Col md='6' className="mb-1">
                            <Label >{userinput.isibn && 'IBAN'} Sort Code</Label>
                            <Input
                                required
                                placeholder='Sort Code'
                                type='number'
                                name='sortCode'
                                value={userinput.sortCode}
                                onChange={onChange}
                                disabled={!userinput.isnewaccount}
                            />
                            {errors.sortCode && <small style={{ color: 'red' }}>must be 6 character</small>}
                        </Col>

                        <Col md='6' className="mb-1">
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
                            <p style={{ cursor: 'pointer', userSelect: 'none' }}
                                className="text-primary p-0 mt-1 m-0"
                                onClick={() => {
                                    setuserinput({ ...userinput, isibn: !userinput.isibn })
                                }}>Click here to enter {userinput.isibn ? 'account number' : 'IBAN'}</p>
                        </Col>

                        <Col md='6' className="mb-1">
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
                            {/* <CustomInput
                                type='checkbox'
                                id={'AuthMoreThanOne'}
                                // value={'AuthMoreThanOne'}
                                checked={userinput.isneedmorethenonepersontoauth}
                                onChange={hanldeAuthPerson}
                                inline
                                label='More than one person is required to authorise Direct Debits' /> */}
                            <small>You may cancel this Direct Debit at any time by contacting TukiTaki or your bank</small>
                        </Col>

                        <Col md='12' className='text-center'>
                            <ReactToPrint
                                trigger={() => <Button.Ripple className='ml-2' color='primary' style={{ marginTop: '22px' }}>
                                    <Printer size={15} />
                                    <span className='align-middle ml-50'>Print</span>
                                </Button.Ripple>}
                                content={() => componentRef.current}
                            />

                            {isloading ? <Button.Ripple className='ml-1' color='primary' disabled={true} style={{ marginTop: '22px' }}>
                                <Spinner color='white' size='sm' />
                                <small className='ml-50'>Loading...</small>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' style={{ marginTop: '22px' }} type="submit">
                                <span className='align-middle ml-50'>Continue</span>
                                <ChevronRight size={15} />
                            </Button.Ripple>
                            }

                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h5'>Direct Debit Guarantee</CardTitle>
                    <img src={DirectDebitLogo} alt="" />
                </CardHeader>
                <div className="w-100 bg-light p-2">
                    <ul>
                        <li>This Guarantee is offerd by all banks and building societies that accept instructions to pay Direct Debits.</li>
                        <br />
                        <li>If there any changes to the amount, date or interval of your Direct Debit GC re TukiTaki will notify you 3 working days in advance of your account being debited or as otherwise agreed. If you request GC re TukiTaki to collect a payment, confirmation of the amount and date will be given to you at the time of the request. </li><br />

                        <li>If an error is made in the payment of your Direct Debit, by GC re TukiTaki or your bank or building society, you are entitled to a full and immmediate refund of the amount paid from your bank or building society-if you receive a refund you are not entitled to , you must pay it back GC re TukiTaki asks you to.</li><br />

                        <li>You can cancel a Direct Debit at any time by simply contacting your bank or building society. Written confirmation may be required. Please also notify us.</li>
                    </ul>
                    <hr />
                    <p><small>
                        We use  GoCardless to precess your Direct Debit payments. More information on how GoCardless process your personal data and your data protection rights, including your right to object, is available at <a href="https://gocardless.com/privacy" target="_blank">gocardless.com/legal/privacy/</a> <br /> Your payment is protected by the  <a href="https://gocardless.com/direct-debit/guarantee/" target="_blank">Direct Debit Guarantee</a>
                    </small></p>
                </div>
            </Card>
        </>
    )
}

export default DDSForm