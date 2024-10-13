import useJwt from '@src/auth/jwt/useJwt'
import React, { useEffect, useState } from 'react'
import { Check, CheckCircle, XCircle } from 'react-feather'
import { useHistory } from 'react-router-dom'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { Success } from '../../viewhelper'
import './landingPageStyle.css'
import ModalForm from './userInfoInputModal'


const PricingV2 = () => {
    const history = useHistory()
    // const channels = ['User Management', 'Group Management', 'Layalty Management', 'Voucher Management', 'Bulk Notification', 'Settings']
    const channels = ['Loyalty', 'E-Voucher', 'Bulk Notification', 'Advertise', 'Campaign', 'Customer polls']
    const loyaltyFeatures = ['Sku Based', 'Global Based', 'Service Based', 'Customer Tiering']
    const eVoucherFeatures = ['Product Voucher', 'Cash Voucher', 'Discount Voucher']
    const bulkNotificationFeatures = ['SMS Notification', 'Email Notification', 'Push Notification', 'Facebook Page Post']
    const adFeatures = ['Facebook Page Post', 'Facebook Ad', 'Google Ad']
    const campaignFeatures = ['Online Campaign', 'Offline Campaign']
    const pollFeatures = ['Customer Polls']
    const [plans, setPlans] = useState([])
    const [planSelect, setPlanSelect] = useState(2)
    const [channelSelect, setChannelSelect] = useState({})
    const [features, setFeatures] = useState([])
    const [user_data, setUserData] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    useEffect(async () => {
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', false)

        await useJwt.planListAllFeatures().then(res => {
            console.log(res)

            setFeatures(res.data.payload)
            setChannelSelect(res.data.payload[0])

        }).catch(err => {
            Error(err)
            console.log(err)
        })

        // await useJwt.planList().then(res => {
        await useJwt.planListWithFeatures().then(res => {
            console.log(res)
            setPlans(res.data.payload)

        }).catch(err => {
            Error(err)
            console.log(err)
        })
    }, [])

    const track = (features, feature) => {
        // {f.plan_features.find(item => item.name == feature)?.features?.includes(feature) ? <CheckCircle color='green' size={'16px'} /> : <XCircle color='red' size={'16px'} />}
        // console.log(features)
        // console.log(feature)
        const temp = features?.find(item => item.name === channelSelect.name)?.features || []
        // console.log(temp)
        let check = false
        for (const item of temp) {
            // console.log(item)
            // console.log(feature)

            if (item === feature) {
                check = true
            }

        }

        if (check === true) {

            return <CheckCircle color='green' size={'16px'} />
        } else {

            return <XCircle color='red' size={'16px'} />
        }
    }

    const getStartedOnclick = (index) => {
        // setModal(true)
        // setPlanSelect(index)
        // setUserData({...user_data, plan_id: index + 1})
        localStorage.setItem('registration_data', JSON.stringify({ plan_id: index + 1 }))
        history.push('/merchantregister')
    }

    const onSubmit = (e) => {
        e.preventDefault()

        console.log(user_data)

        useJwt.pricingFormDataInput(user_data).then(res => {
            console.log(res)
            Success(res)
            toggleModal()
        }).catch(err => {
            Error(err)
            console.log(err)
        })

        // const { id : sid, serviceId, serviceKeyword, isSubCategory, subTypes } = serviceInfo
        // console.log({ id : sid, serviceId, serviceKeyword, subTypes })
        // localStorage.setItem('useBMStoken', true)
        // seteditPointRuleloading(true)
        // useJwt.editService(serviceId, { serviceId,  serviceKeyword: serviceKeyword.toLowerCase(), isSubCategory, subTypes }).then(res => {
        //     console.log(res)
        //     // Success(res)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        // })
        // const { id : slid, ruleProvider, isFinancial, minimum, maximum} = serviceLogicInfo
        // useJwt.editServiceLogic(slid, {id : slid, serviceId, ruleProvider, isFinancial, minimum, maximum}).then(res => {
        //     setReset(!resetData)
        //     seteditPointRuleloading(false)
        //     console.log(res)
        //     toggleModal()
        //     Success(res)
        // }).catch(err => {
        //     seteditPointRuleloading(false)
        //     localStorage.setItem('useBMStoken', false)
        //     Error(err)
        //     console.log(err.response)
        // })
    }


    return (
        <div className='py-6'>
            <Row className='py-5 d-flex align-items-center' style={{ background: '#FFFFFF' }} id='pricing'>
                <Col sm='1'></Col>
                <Col sm='2'>
                    {/* <div className='channel' >Channels</div> */}
                    {
                        features.map((item, index) => <div className={channelSelect.name === item.name ? 'channel-active' : 'channel'} key={index} onClick={() => setChannelSelect(item)}>
                            {item.name}
                        </div>)
                    }
                </Col>
                <Col sm='8' className='py-4'>
                    <Table borderless responsive>
                        <tr>
                            <td></td>
                            {plans.slice(0, 4)?.map((f, index) => <td key={index} className='text-center' style={{ fontWeight: '700' }}>{f.title}</td>)}
                        </tr>
                        <tr>
                            <td></td>
                            {[0, 1, 2, 3]?.map((index) => <td key={index} className='text-center'><button className='get-srt-btn' onClick={() => getStartedOnclick(index)}>Get Started</button></td>)}
                        </tr>
                        <tr style={{ margin: '0 0 40px 0' }}>
                            <td style={{ fontWeight: '700' }}>{channelSelect.name}</td>
                            {plans.slice(0, 4)?.map((f, index) => <td key={index} className='text-center' style={{ fontWeight: '700' }}>Contact For Pricing</td>)}
                        </tr>
                        {
                            channelSelect?.features?.map((feature, index) => <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#FFF7F5' } : {}}>
                                <td>{feature}</td>
                                {/* {plans.slice(0, 4)?.map((f, index) => <td key={index} className='text-center' style={{ fontWeight: '700' }}>{f.plan_features.feature?.includes(feature) ? <CheckCircle color='green' size={'16px'} /> : <XCircle color='red' size={'16px'} />}</td>)} */}
                                {plans.slice(0, 4)?.map((f, index) => <td key={index} className='text-center' style={{ fontWeight: '700' }}>{track(f.plan_features, feature)}</td>)}
                                
                            </tr>)
                        }

                    </Table>
                </Col>
                <Col sm='1'></Col>
            </Row>


            <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
                <ModalHeader toggle={toggleModal}>Submit Customer Info</ModalHeader>
                <ModalBody>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        <Col sm="12" >
                            <FormGroup>
                                <Label for="first_name">First Name</Label>
                                <Input type="text"
                                    name="first_name"
                                    id='first_name'
                                    value={user_data.first_name}
                                    onChange={(e) => setUserData({ ...user_data, first_name: e.target.value })}
                                    placeholder="Enter First Name"
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" >
                            <FormGroup>
                                <Label for="last_name">Last Name</Label>
                                <Input type="text"
                                    name="last_name"
                                    id='last_name'
                                    value={user_data.last_name}
                                    onChange={(e) => setUserData({ ...user_data, last_name: e.target.value })}
                                    placeholder="Enter Last Name"
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" >
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input type="email"
                                    name="email"
                                    id='email'
                                    value={user_data.email}
                                    onChange={(e) => setUserData({ ...user_data, email: e.target.value })}
                                    placeholder="Enter Email"
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" >
                            <FormGroup>
                                <Label for="mobile_no">Mobile Number</Label>
                                <Input type="number"
                                    name="mobile_no"
                                    id='mobile_no'
                                    value={user_data.mobile_no}
                                    onChange={(e) => setUserData({ ...user_data, mobile_no: e.target.value })}
                                    placeholder="Enter Mobile Number"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="12" className='text-center'>
                            {
                                <Button className='ml-2 demo-btn' type="submit" style={{ marginTop: '25px' }}>
                                    <span >Submit</span>
                                </Button>
                            }
                        </Col>
                    </Form>
                </ModalBody>
            </Modal>

        </div>

    )
}

export default PricingV2