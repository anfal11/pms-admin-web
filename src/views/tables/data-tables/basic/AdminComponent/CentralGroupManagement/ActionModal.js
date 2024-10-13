import { Fragment, useState, useEffect, useRef } from 'react'
import {
    X, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { formatReadableDate } from '../../../../../helper'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const ActionModal = ({ modal, toggleModal, adInfo, setAdInfo, setReset, resetData, roleWiseApprovedList, status }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [file, setFile] = useState(null)
    const campRef = useRef()
    const catRef = useRef()
    const [filePrevw, setFilePrevw] = useState(adInfo.image)
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const handleChange = (e) => {
        setAdInfo({ ...adInfo, [e.target.name]: e.target.value })
    }
    // useEffect(async () => {
    //     console.log(adInfo)
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
        const { id } = adInfo
        seteditPointRuleloading(true)
        const data = {
            group_id: +(id),
            action_id: status
        }
        useJwt2.approveRejectCentralGroupV3(data).then(res => {

            setTimeout(() => {
                //do nothing
                setReset(!resetData)
                seteditPointRuleloading(false)
                console.log(res)
                toggleModal()
                Success(res)
            }, 4000)
            
        }).catch(err => {
            seteditPointRuleloading(false)
            // console.log(err.response)
            Error(err)
        })
    }
    // const onSubmit = (e) => {
    //     e.preventDefault()
    //     const { id } = adInfo
    //     seteditPointRuleloading(true)
    //     const data = {
    //         id: parseInt(id),
    //         action_id: status
    //     }
    //     useJwt.approveRejectCentralGroup(data).then(res => {
    //         setReset(!resetData)
    //         seteditPointRuleloading(false)
    //         console.log(res)
    //         toggleModal()
    //         Success(res)
    //     }).catch(err => {
    //         seteditPointRuleloading(false)
    //         console.log(err.response)
    //         Error(err)
    //     })
    // }
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-xl'>
            <ModalHeader toggle={toggleModal}></ModalHeader>
            <ModalBody>
                <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <h4 className='m-1'>Group Info</h4>
                    <Row className='match-height'>
                        <Col sm='5'>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col sm="6" >
                                            <FormGroup>
                                                <Label for="group_name">Group Name</Label>
                                                <Input type="text"
                                                    name="group_name"
                                                    id='group_name'
                                                    value={adInfo.group_name}
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
                                                    value={adInfo.creation_type === 2 ? "Group-Profiling" : "Bulk-Upload" }
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm='7'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Approval Entry</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="12" >
                                            <Table>
                                                <tr>
                                                    <th>Role Name</th>
                                                    <th>Approved By</th>
                                                    <th>Approved At</th>
                                                </tr>
                                                {
                                                    roleWiseApprovedList?.length !== 0 ? roleWiseApprovedList?.map((item, index) => <tr key={index}>
                                                        <td>{item.role_id}</td>
                                                        <td>{item.approved_by}</td>
                                                        <td>{item.approved_at ? formatReadableDate(item.approved_at || '') : '--'}</td>
                                                    </tr>) : <Spinner className='text-center'/>
                                                }
                                            </Table>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>`
                        </Col>
                    </Row>
                    <Card>
                        <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm="3" >
                                    <FormGroup>
                                        <Label for="action">Requested Action</Label>
                                        <Input type="text"
                                            name="action"
                                            id='action'
                                            value={adInfo.action}
                                            onChange={handleChange}
                                            disabled
                                            placeholder="action here..."
                                        />
                                    </FormGroup>
                                </Col>
                                {/* <Col sm="3" >
                                    <FormGroup>
                                        <Label for="created_at">Created Date</Label>
                                        <Input type="datetime"
                                            name="created_at"
                                            id='created_at'
                                            value={adInfo?.created_at}
                                            onChange={handleChange}
                                            disabled
                                            placeholder="0"
                                        />
                                    </FormGroup>
                                </Col> */}
                                <Col sm="3" >
                                    <FormGroup>
                                        <Label for="created_by_name">Created By</Label>
                                        <Input type="text"
                                            name="created_by_name"
                                            id='created_by_name'
                                            value={adInfo?.created_by_name}
                                            onChange={handleChange}
                                            disabled
                                            placeholder="0"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    <Col sm="12" className='text-right'>
                        {
                            editPointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >{status === 1 ? 'Approve' : 'Reject'}</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </ModalBody>
        </Modal>
    )
}
export default ActionModal