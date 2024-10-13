import { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, Eye, Check, ChevronLeft
} from 'react-feather'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
    CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Media
} from 'reactstrap'
import Avatar from '@components/avatar'

import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const DDSConfirmation = ({ setConditionalRendering, setuserinput, setAccountList, setBusiness, setSearchValue, setcontinueBtn, setShowAccountSelect }) => {
    const handleReset = () => {
        setuserinput({
            isnewaccount: false,
            isibn: false,
            accountnumber: "",
            address: "",
            city: "",
            companyname: "",
            country: "",
            email: "",
            firstname: "",
            lastname: "",
            postcode: "",
            sortCode: "",
            holderName: "",
            customerid: "",
            isneedmorethenonepersontoauth: false
        })
        setConditionalRendering({
            showDDSForm: false,
            showDDSDetails: false,
            showDDSConfirmation: false
        })
        setSearchValue('')
        setAccountList([])
        setShowAccountSelect(false)
        setBusiness([])
        setcontinueBtn(true)
    }
    return (
        <>
            <Button.Ripple className='ml-2 mb-2' color='primary' onClick={handleReset}>
                <ChevronLeft size={15} />
                <span className='align-middle ml-50'>Back to Direct Debit</span>
            </Button.Ripple>
            <Card>
                <div className="d-flex justify-content-center pt-1 w-100">
                    <Media>
                        <Avatar color={'light-success'} icon={<Check size={20} />} className='mr-2' style={{ padding: '7px' }} />
                        <Media className='my-auto' body>
                            <h4 className='font-weight-bolder mb-0'>Direct Debit set up successfully</h4>
                        </Media>
                    </Media>
                </div>
                <hr />
                <div className="p-2">
                    <p>TukiTaki Ltd will appear on your bank statement when payments are taken against this Direct Debit. <br />
                        You will receive notification via email or post within <b className='text-info'>3 business days</b> confirming that the mandate has been set up.
                    </p>
                </div>
            </Card>
        </>
    )
}

export default DDSConfirmation