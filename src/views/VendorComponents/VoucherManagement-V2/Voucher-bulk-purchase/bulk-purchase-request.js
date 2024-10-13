import React, { useEffect, useState, useRef, Fragment } from 'react'
import {ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft} from 'react-feather'
import {Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../viewhelper'
import Select from 'react-select'
import {useLocation, useHistory} from 'react-router-dom'
import { selectThemeColors, transformInToFormObject } from '@utils'

const BulkPurchaseRequest = ({voucherid, setvoucherid, setisbulkpurchase, voucherQuota}) => {
    const productRef = useRef()
    const history = useHistory()
    const { search } = useLocation()
    const [CreateVoucherloading, setCreateVoucherloading] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [group, setGroup] = useState([])
    const [groupLoading, setgroupLoading] = useState(true)
    const [selectedGroup, setSelectedGroup] = useState({value: '', lable: 'Select a group'})
    const [userInput, setUserInput] = useState({
        title: '',
        body: '',
        voucherids: [voucherid],
        mobile_numbers: [],
        group_id: null,
        group_member_count: 0
    })

    const back = () => {
        setvoucherid(null)
        setisbulkpurchase(false)
    }
    useEffect(() => {
        useJwt2.getCentralGroup().then(res => {
            console.log(res)
            const allGroup = []
            res.data.payload.map(q => {
                if (q.is_approved === true) {
                    allGroup.push({value: {id: q.id, group_member_count: q.group_member_count}, label: `${q.group_name} (${q.group_member_count})`})
                }
            })
            if (allGroup.length) {
                setSelectedGroup(allGroup[0])
                setUserInput({...userInput, group_id: allGroup[0].value.id, group_member_count: allGroup[0].value.group_member_count})
            }
            setGroupList(allGroup)
            setgroupLoading(false)
        }).catch(err => {
            setgroupLoading(false)
            Error(err)
            console.log(err.response)  
        })
    }, [])

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('userInput ', userInput)
        // if (userInput.group_member_count > voucherQuota) {
        //   // bulk voucher request is not allow as voucher quota is less then selected group members.
        //     return 0
        // }
        const { title, body, group_id } = userInput
        setCreateVoucherloading(true)
        useJwt2.pmsVoucherBulkPurchaseRequest({voucherid, group_id, title, description: body}).then(res => {
            console.log(res)
            Success({data: {message : res.data.payload.msg}})
            history.push('/VoucherBulkPurchaseList')
            setCreateVoucherloading(false)
        }).catch(err => {
            setCreateVoucherloading(false)
            Error(err)
            console.log(err)
        })
    }

    return (
        <Fragment>
           <Button.Ripple className='mb-1' color='primary' onClick={(e) => back()} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
          <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Voucher Bulk-Purchase (Available = {voucherQuota})</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: '15px' }}>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col md='6' >
                        <FormGroup>
                            <Label for="Business">Select a Group</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                value={selectedGroup}
                                onChange={select => {
                                    setSelectedGroup(select)
                                    setUserInput({...userInput, group_id: select.value.id, group_member_count: select.value.group_member_count})
                                }}
                                options={groupList}
                                loading={groupLoading}
                            />
                        </FormGroup>
                    </Col>
                    <Col md='6' >
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input type="text"
                                name="title"
                                id='title'
                                value={userInput.title}
                                onChange={handleChange}
                                required
                                placeholder='title...'
                            />
                        </FormGroup>
                    </Col>
                    
                    <Col md='6' >
                        <FormGroup>
                            <Label for="body">Description</Label>
                            <Input type="textarea"
                                name="body"
                                id='body'
                                value={userInput.body}
                                onChange={handleChange}
                                required
                                placeholder='description...'
                            />
                        </FormGroup>
                    </Col>

                    <Col md="12" className='text-center'>
                        {
                            CreateVoucherloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Submit</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </CardBody>
        </Card>

        </Fragment>
    )
}

export default BulkPurchaseRequest