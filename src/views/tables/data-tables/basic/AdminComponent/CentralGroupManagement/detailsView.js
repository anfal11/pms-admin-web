import { Fragment, useState, useEffect, useRef } from 'react'
import {
    X, Eye, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { formatReadableDate } from '../../../../../helper'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const detailsView = ({ groupInfo, setgroupInfo, setReset, resetData, toggleDetailsView, status }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [file, setFile] = useState(null)
    const campRef = useRef()
    const catRef = useRef()
    const [filePrevw, setFilePrevw] = useState(groupInfo?.image)
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const handleChange = (e) => {
        setgroupInfo({ ...groupInfo, [e.target.name]: e.target.value })
    }
    // useEffect(async () => {
    //     console.log(groupInfo)
    //     localStorage.setItem('usePMStoken', false) //for token management
    //     localStorage.setItem('useBMStoken', false)
    //     useJwt.getFbpageCategory().then(res => {
    //         setbusinesscategorylist(res.data.payload.map(item => { return { value: {id: item.uid, subcategory: item.subcategory }, label: item?.name } }))
    //     }).catch(err => {
    //         console.log(err.response)
    //         Error(err)
    //     })
    // }, [])
    const onSubmit = (e) => {
        e.preventDefault()
        const { id } = groupInfo
        seteditPointRuleloading(true)
        const data = {
            id: parseInt(id),
            action_id: status
        }
        useJwt.approveRejectCentralGroup(data).then(res => {
            setReset(!resetData)
            seteditPointRuleloading(false)
            console.log(res)
            toggleModal()
            Success(res)
        }).catch(err => {
            seteditPointRuleloading(false)
            console.log(err.response)
            Error(err)
        })
    }
    return (
      <Fragment>
        <Button.Ripple className='mb-1' color='primary' onClick={() => toggleDetailsView()} >
            <div className='d-flex align-items-center'>
                <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                <span >Back</span>
            </div>
        </Button.Ripple>
        <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
            <h4 className='m-1'>Group Info</h4>
            <Row className='match-height'>
                <Col sm='12'>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="group_name">Group Name</Label>
                                        <Input type="text"
                                            name="group_name"
                                            id='group_name'
                                            value={groupInfo?.group_name}
                                            onChange={handleChange}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="group_name">Group Creation Type</Label>
                                        <Input type="text"
                                            name="group_name"
                                            id='group_name'
                                            value={groupInfo?.creation_type === 2 ? "Group Profiling" : "Bulk Upload" }
                                            onChange={handleChange}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="12">
                                    {
                                        groupInfo?.creation_type === 2 && <Row>
                                            {
                                                (groupInfo?.gender && groupInfo?.gender?.length !== 0) && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Gender</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }].filter(i => groupInfo?.gender.includes(i.value))?.map(i => i.label)?.toString().replace(/'/g, '').replace(/','/, ', ').replace(/,/g, ', ')}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            }
                                         {
                                            groupInfo?.hand_set_type && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Handset Type</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.hand_set_type}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                         {
                                            (groupInfo?.age && groupInfo?.age?.length !== 0) && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Age</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.age?.toString().replace(/'/g, '').replace(/','/, ', ').replace(/,/g, ', ')}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                         {
                                            groupInfo?.income !== 0 && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Minimum Casa-Balance</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.income}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                         {/* {
                                            groupInfo?.connection_type && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Connection Type</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.connection_type}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         } */}
                                         {
                                            (groupInfo?.division && groupInfo?.division?.length !== 0) && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Division</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.division?.toString().replace(/'/g, '').replace(/','/, ', ').replace(/,/g, ', ')}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                        {
                                            (groupInfo?.division && groupInfo?.division?.length !== 0) && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">District</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.location?.toString().replace(/'/g, '').replace(/','/, ', ').replace(/,/g, ', ')}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                        {
                                            (groupInfo?.religions && groupInfo?.religions?.length !== 0) && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Religions</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.religions?.toString().replace(/'/g, '').replace(/','/, ', ').replace(/,/g, ', ')}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                        {
                                            (groupInfo?.marital_status && groupInfo?.marital_status?.length !== 0) && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Marital Status</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.marital_status?.toString().replace(/'/g, '').replace(/','/, ', ').replace(/,/g, ', ')}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                        {
                                            (groupInfo?.occupation && groupInfo?.occupation?.length !== 0) && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Occupation</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.occupation?.toString().replace(/'/g, '').replace(/','/, ', ').replace(/,/g, ', ')}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                        {
                                            (groupInfo?.customer_type && groupInfo?.customer_type?.length !== 0) && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Customer Type</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.customer_type?.toString().replace(/'/g, '').replace(/','/, ', ').replace(/,/g, ', ')}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                         
                                         {
                                            groupInfo?.has_credit_card && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Has Credit Card</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.has_credit_card}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }  {
                                            groupInfo?.has_debit_card && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Has Debit Card</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.has_debit_card}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }  
                                         {
                                            groupInfo?.has_loan && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Has Loan?</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={groupInfo?.has_loan}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                         {
                                            groupInfo?.account_opening_date && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Account Opening Date</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={formatReadableDate(groupInfo?.account_opening_date)}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                         {
                                            groupInfo?.last_login_type && <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="group_name">Last Login Date</Label>
                                                    <Input type="text"
                                                        name="group_name"
                                                        id='group_name'
                                                        value={formatReadableDate(groupInfo?.last_login_type)}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                         }
                                        </Row>
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Form>
      </Fragment>
    )
}
export default detailsView