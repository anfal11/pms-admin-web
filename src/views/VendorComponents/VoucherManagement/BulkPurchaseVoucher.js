import React, { useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import Select from 'react-select'
import {useLocation} from 'react-router-dom'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { toast } from 'react-toastify'

const BulkPurchaseVoucher = () => {
    const productRef = useRef()
    const [CreateVoucherloading, setCreateVoucherloading] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [group, setGroup] = useState([])
    const [selectedGroup, setSelectedGroup] = useState({value: '', lable: ''})
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const { search } = useLocation()
    const voucherid = new URLSearchParams(search).get('voucherid')
    const [userInput, setUserInput] = useState({
        title: '',
        body: '',
        voucherids: [voucherid],
        mobile_numbers: []
    })

    useEffect(async () => {
        await useJwt.getNotificationGroupList().then(res => {
            console.log(res)
            setGroupList(res.data.payload.GroupList)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
    }, [])

    useEffect(() => {
        const data = {
            group_id : parseInt(selectedGroup.value),
            is_pending : false
         }
        if (selectedGroup.value !== '') {
            useJwt.detailsNotificationGroup(data).then(res => {
                console.log(res)
                setGroup(res.data.payload)
            }).catch(err => {
                console.log(err.response)
            })
        } 
    }, [selectedGroup.value])
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        // e.preventDefault()
        // const { title, body, voucherids } = userInput
        // let { mobile_numbers } = userInput
        // mobile_numbers = group.map(g => g.msisdn)
        // setCreateVoucherloading(true)
        // console.log({title, body, mobile_numbers, voucherids})
        // useJwt.bulkVoucherPurchase({title, body, mobile_numbers, voucherids}).then(res => {
        //     console.log(res)
        //     Success(res)
        //     setCreateVoucherloading(false)
        // }).catch(err => {
        //     setCreateVoucherloading(false)
        //     Error(err)
        //     console.log(err)
        // })
    }
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Purchase Voucher</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: '15px' }}>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col md='6' >
                        <FormGroup>
                            <Label for="group">Select a Group</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                onChange={select => {
                                    setSelectedGroup({value: select.value, label: select.label})
                                }}
                                options={groupList.map(x => { return { value: x.id, label: x.group_name } })}
                            />
                        </FormGroup>
                    </Col>
                    
                    <Col md='6' >
                        <FormGroup>
                            <Label for="wallet">Select Wallet</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                options={[{value:1, label: 'Nagad'}]}
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
                                placeholder='this is test mesage for voucher notification voucher code = <voucher-code>, expire date = <voucher-expiry>'
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
    )
}

export default BulkPurchaseVoucher