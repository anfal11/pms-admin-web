import { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, Eye, ChevronRight, Send
} from 'react-feather'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
    CardBody, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error } from '../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const DDSDetails = ({ merchantData, userinput, setuserinput, ConditionalRendering, setConditionalRendering }) => {
    const [loader, setLoader] = useState(false)

    const handleEdit = () => {
        setConditionalRendering({
            showDDSForm: true,
            showDDSDetails: false,
            showDDSConfirmation: false
        })
    }
    const handleSubmit = () => {
        setLoader(true)
        const { isibn, accountnumber, addpaymentid = 0, idx = 0, businessid = 0, address, city, companyname, country, email, firstname, lastname, postcode, sortCode, holderName, customerid, isneedmorethenonepersontoauth, isnewaccount } = userinput
        console.log({
            isnewaccount: isnewaccount ? isnewaccount : false,
            email,
            isibn: isibn ? isibn : false,
            given_name: firstname ? firstname : null,
            family_name: lastname ? lastname : null,
            company_name: companyname ? companyname : null,
            address_line1: address,
            city,
            country,
            postal_code: postcode,
            account_number: accountnumber,
            // account_number: "55779911",
            branch_code: sortCode,
            // branch_code: "200000",
            account_holder_name: holderName,
            isneedmorethenonepersontoauth: isneedmorethenonepersontoauth ? isneedmorethenonepersontoauth : false,
            customerid,
            businessid,
            idx,
            addpaymentid
        })
        useJwt.setgocardlessdirectdebit({
            isnewaccount: isnewaccount ? isnewaccount : false,
            email,
            isibn: isibn ? isibn : false,
            given_name: firstname ? firstname : null,
            family_name: lastname ? lastname : null,
            company_name: companyname ? companyname : null,
            address_line1: address,
            city,
            country,
            postal_code: postcode,
            account_number: accountnumber,
            // account_number: "55779911",
            branch_code: sortCode,
            // branch_code: "200000",
            account_holder_name: holderName,
            isneedmorethenonepersontoauth: isneedmorethenonepersontoauth ? isneedmorethenonepersontoauth : false,
            customerid,
            businessid,
            idx,
            addpaymentid
        }).then(res => {
            setLoader(false)
            console.log(res.data.payload)
            setConditionalRendering({
                showDDSForm: false,
                showDDSDetails: false,
                showDDSConfirmation: true
            })
        }).catch(err => {
            setLoader(false)
            console.log(err)
            Error(err)
        })
    }
    return (
        <>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h3'>Check your details are correct</CardTitle>
                </CardHeader>
                <Row className="p-2">
                    <Col md='12'>
                        <div className="bg-light w-100 p-2">
                            <Row>
                                <Col md='4'>
                                    <p>Account Name</p>
                                    <p><b>{`${userinput.firstname} ${userinput.lastname}` || "-"}</b></p>
                                </Col>
                                <Col md='4'>
                                    <p>Company Name</p>
                                    <p><b>{userinput.companyname || "-"}</b></p>
                                </Col>
                                <Col md='4'>
                                    <p>Email</p>
                                    <p><b>{userinput.email || "-"}</b></p>
                                </Col>
                            </Row>
                        </div>
                        {/* <div className="bg-light w-100 p-2 mt-1">
                            <Row>
                                <Col md='3'>
                                    <p>Post Code</p>
                                    <p><b>{userinput.postcode || "-"}</b></p>
                                </Col>
                                <Col md='3'>
                                    <p>Address</p>
                                    <p><b>{userinput.address || "-"}</b></p>
                                </Col>
                                <Col md='3'>
                                    <p>Country</p>
                                    <p><b>{userinput.country || "-"}</b></p>
                                </Col>
                                <Col md='3'>
                                    <p>City</p>
                                    <p><b>{userinput.city || "-"}</b></p>
                                </Col>
                            </Row>
                        </div> */}
                        <div className="bg-light w-100 p-2 mt-1">
                            <Row>
                                <Col md='4'>
                                    <p>Account Holder Name</p>
                                    <p><b>{userinput.holderName || "-"}</b></p>
                                </Col>
                                <Col md='4'>
                                    <p>Account Number</p>
                                    <p><b>{userinput.accountnumber || "-"}</b></p>
                                </Col>
                                <Col md='4'>
                                    <p>Sort Code</p>
                                    <p><b>{userinput.sortCode || "-"}</b></p>
                                </Col>
                            </Row>
                        </div>
                        <div className="bg-light w-100 p-2 mt-1">
                            <Row>
                                <Col md='4' className="mb-2">
                                    <p>Creditor</p>
                                    <p><b>{merchantData.creditor || "-"}</b></p>
                                </Col>
                                <Col md='4' className="mb-2">
                                    <p>Merchant Information</p>
                                    <p><b>{merchantData.merchent_information || "-"}</b></p>
                                </Col>
                                <Col md='4' className="mb-2"></Col>
                                <Col md='4' className="mb-2">
                                    <p>Merchant Name</p>
                                    <p><b>{merchantData.merchent_name || "-"}</b></p>
                                </Col>
                                <Col md='4' className="mb-2">
                                    <p>Merchant's Phone Number</p>
                                    <p><b>{merchantData.merchent_phone_no || "-"}</b></p>
                                </Col>
                                <Col md='4' className="mb-2">
                                    <p>Merchant Email</p>
                                    <p><b>{merchantData.merchent_email || "-"}</b></p>
                                </Col>
                                <Col md='12'>
                                    <p>Name that will appear on payers' bank statements</p>
                                    <p><b>{merchantData.merchent_name || "-"}</b></p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Form className="p-2" style={{ width: '100%' }} autoComplete="off">
                    <Row>
                        <Col md='12'>
                            {/* <CustomInput
                                type='checkbox'
                                disabled
                                checked={userinput.isneedmorethenonepersontoauth}
                                inline
                                label='More than one person is required to authorise Direct Debits' /> <br /> */}
                            <small>You may cancel this Direct Debit at any time by contacting TukiTaki or your bank</small>
                        </Col>
                        <Col md='12' className='text-center'>
                            <Button.Ripple className='ml-2' color='primary' style={{ marginTop: '22px' }} onClick={handleEdit}>
                                <Edit size={15} />
                                <span className='align-middle ml-50'>Change</span>
                            </Button.Ripple>
                            {loader ? <Button.Ripple className='ml-2' color='primary' disabled style={{ marginTop: '22px' }}>
                                <Spinner size='sm' />
                                <span className='align-middle ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' style={{ marginTop: '22px' }} onClick={handleSubmit}>
                                <Send size={15} />
                                <span className='align-middle ml-50'>Submit</span>
                            </Button.Ripple>}
                        </Col>
                    </Row>
                </Form>
            </Card>
        </>
    )
}

export default DDSDetails