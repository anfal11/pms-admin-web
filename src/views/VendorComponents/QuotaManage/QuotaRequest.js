import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
  ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
  Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput, Modal, ModalHeader, ModalBody
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { formatReadableDate } from '../../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import 'jspdf-autotable'
import classnames from 'classnames'
import CreditCardDetails from '../../pages/authentication/AddCreditCard'
import { useRTL } from '@hooks/useRTL'
import notification from '../../../assets/images/icons/notification 3.svg'
import mail from '../../../assets/images/icons/clarity_email-solid.svg'
import insta from '../../../assets/images/icons/Instagram_logo_2016 1.svg'
import sms from '../../../assets/images/icons/fa6-solid_comment-sms.svg'
import wapp from '../../../assets/images/icons/logos_whatsapp.svg'
import google from '../../../assets/images/icons/google_svg 1.svg'
import fb from '../../../assets/images/icons/ant-design_facebook-filled.svg'

import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import OneTimePlanList from './OneTimePlans'


const MrchntBudgetTable = () => {
  const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
  const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
  const subMenuIDs = [].concat(...Array2D)
  const [reset, setReset] = useState(false)
  const [modal, setmodal] = useState(false)
  const toggleModal = () => setmodal(m => !m)

  const [TableDataLoading, setTableDataLoading] = useState(true)
  const [TableData, setTableData] = useState([])

  const [SelectedMerchantLoading, setSelectedMerchantLoading] = useState(false)
  const [budgetpercentage, setbudgetpercentage] = useState(1)
  const [budgets, setBudgets] = useState([])
  const [pendingBudgets, setPendingBudgets] = useState([])


  const userData = JSON.parse(localStorage.getItem('userData'))
  const [isRtl, setIsRtl] = useRTL()
  const [pointRuleloading, setPointRuleloading] = useState(false)
  const history = useHistory()
  const [budget, setBudget] = useState(0.1)
  const [title, setTitle] = useState('')
  const [total, setTotal] = useState(0)
  const [upRange, setupRange] = useState(1000)
  const [facebook, setfacebook] = useState(0)
  const [googleV, setgoogle] = useState(0)
  const [whatsapp, setwhatsapp] = useState(0)
  const [smsV, setsms] = useState(0)
  const [instagram, setinstagram] = useState(0)
  const [email, setemail] = useState(0)
  const [push_notification, setpush_notification] = useState(0)
  const [facebook_post, setfacebookpost] = useState(0)
  const [smsRate, setsmsRate] = useState(1)
  const [charges, setCharges] = useState({})

  useEffect(async () => {

    setTotal((email * charges.email_charge) + (push_notification * charges.push_notification_charge) + (facebook_post * charges.facebook_post_charge) + (smsV * charges.sms_charge) + (instagram * charges.instagram_post_charge) + googleV + facebook + whatsapp)


  }, [facebook, googleV, whatsapp, smsV, instagram, email, push_notification, facebook_post, smsRate])

  useEffect(async () => {

    await useJwt.notificationPlansList().then((response) => {
        console.log(response.data.payload)
    }).catch((error) => {
        Error(error)
        console.log(error)
    })
   

    await useJwt.payAsGoCharges().then((response) => {
        console.log(response.data.payload)
        setCharges(response.data.payload)

    }).catch((error) => {
        Error(error)
        console.log(error)
    })
   

  await  useJwt.getSmsRate().then((response) => {
      console.log(response.data.payload?.per_sms_cost)
      setsmsRate(response.data.payload?.per_sms_cost)
  }).catch((error) => {
      Error(error)
      console.log(error)
  })
  }, [reset])
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const column = [
    {
      name: 'Merchant Phone',
      minWidth: '150px',
      sortable: true,
      selector: 'created_by_name'
    },
    {
      name: 'Proposed Budget',
      minWidth: '120px',
      sortable: true,
      selector: 'proposed_budget'
    },
    {
      name: 'Current Balance',
      minWidth: '100px',
      sortable: true,
      selector: 'current_balance'
    },
    {
      name: 'Previous Balance',
      minWidth: '100px',
      sortable: true,
      selector: 'previous_balance'
    },
    {
      name: 'Action',
      minWidth: '100px',
      sortable: true,
      selector: 'action'
    },
    {
      name: 'Created At',
      minWidth: '220px',
      sortable: true,     
      sortType: (a, b) => {
          return new Date(b.created_at) - new Date(a.created_at)
        },
      selector: row => formatReadableDate(row.created_at)
    }
  ]

  const onSubmit = (e) => {
    e.preventDefault()

    const data = {

        amount: total,
        google: googleV,
        sms: smsV,
        facebook,
        whatsapp,
        instagram,
        email,
        push_notification,
        facebook_post
        }

    localStorage.setItem('planDetails', JSON.stringify(data))

    history.push('/quotas-submit-test')

    // console.log({ facebook, googleV, whatsapp, smsV, email, push_notification, instagram, budget, title })
    // const isEqual = (budget - (facebook + googleV + whatsapp + (smsV * smsRate) + instagram)) < 1 && (budget - (facebook + googleV + whatsapp + (smsV * smsRate) + instagram)) >= 0
    // if (!isEqual) {
    //     toast.error('Please,  fulfill your budget quota!')
    //     return 0
    // }
    // setPointRuleloading(true)
    // useJwt.createQuotaList({ title, total_budget:budget, facebook, google: googleV, whatsapp, sms: smsV, email, push_notification, instagram }).then((response) => {
    //     setPointRuleloading(false)
    //     Success(response)
    //     history.push(userData?.role === 'vendor' ? '/allQuotaVendor' : '/allQuota')
    // }).catch((error) => {
    //     setPointRuleloading(false)
    //     Error(error)
    //     console.log(error)
    // })


}


  const onSelectedMerchantSubmit = (e) => {
    e.preventDefault()
    
    console.log(body)
    // return 0
    setSelectedMerchantLoading(true)
    useJwt.createCampaignBudget(body).then((response) => {
      setReset(!reset)
      setSelectedMerchantLoading(false)
      Success(response)
      setbudgetpercentage(0)
      toggleModal()
    }).catch((error) => {
      setSelectedMerchantLoading(false)
      Error(error)
      console.log(error)
    })
  }
  const [activeTab, setActiveTab] = useState('1')
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }
  return (
   
    <>
    <Card>
        <CardBody>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1') }}
                    > Purchase One Time Plan
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2') }}
                    >Purchase Customized Plan
                    </NavLink>
                </NavItem>
            </Nav>
        </CardBody>
    </Card>
    <Card>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
                <OneTimePlanList></OneTimePlanList>
                {/* <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle></CardTitle>
                        <CardTitle>
                          
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CommonDataTable column={column} TableData={searchValue.length ? filteredData : budgets} TableDataLoading={TableDataLoading} />
                    </CardBody>
                </Card> */}
            </TabPane>
            <TabPane tabId="2">
                <Card>
                    <CardBody>
                    <Fragment>
            {/* <Button.Ripple className='mb-1' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/allQuotaVendor' : '/allQuota'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple> */}
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <div className='d-flex justify-content-center mb-2 mt-2'>
                    {/* <div className='d-flex align-items-center bg-white p-1 mr-1' style={{ borderRadius: '10px' }}>
                        <h4 className='mr-1 mb-0 text-primary'>Title<span style={{ color: 'red' }}>*</span></h4>
                        <Input type="text"
                            name="title"
                            id='title'
                            style={{ width: '60%' }}
                            value={title}
                            onChange={e => {
                                setTitle(e.target.value)
                            }}
                            required
                            placeholder="title here..."
                        />
                    </div> */}
                    {/* <div className='d-flex justify-content-center mb-2 mt-2'> */}
                    {/* <div className='d-flex align-items-center bg-white p-1' style={{ borderRadius: '10px' }}>
                        <h4 className='mr-1 mb-0 text-primary'>Total Budget<span style={{ color: 'red' }}>*</span></h4>
                        <Input type="number"
                            name="budget"
                            id='budget'
                            style={{ width: '60%' }}
                            value={budget}
                            min={0}
                            onChange={e => {
                                setupRange(parseInt(e.target.value))
                                setBudget(parseInt(e.target.value))
                                setBudgetLimit(parseInt(e.target.value))
                                setfacebook(0)
                                setgoogle(0)
                                setwhatsapp(0)
                                setsms(0)
                                setinstagram(0)
                            }}
                            required
                            placeholder="0"
                        />
                    </div> */}
                </div>
                {/* <Row>
                    <Col>
                        <h4 className='mb-1'>Free Channels</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm='6'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Email</CardTitle>
                                <CustomInput type='checkbox' id='primary' name='primary' inline defaultChecked disabled />
                            </CardHeader>
                         
                        </Card>
                    </Col>
                    <Col sm='6'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Push Notification</CardTitle>
                                <CustomInput type='checkbox' id='primary' name='primary' inline defaultChecked disabled />
                            </CardHeader>
                        </Card>
                    </Col>
                </Row> */}
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Paid Channels</CardTitle>
                        {total !== 0 && < CardTitle tag='h4'>Total : {total.toFixed(2)}</CardTitle>}
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px', paddingLeft: '60px', paddingRight: '60px' }}>
                        <Row className='pb-2 border-bottom border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={mail} />
                                    <h4>Email</h4>
                                </div>
                            </Col>
                            <Col sm="5" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={email}
                                        tooltip={true}
                                        orientation="horizontal"
                                        // disabled={budget === 0}
                                        onChange={e => {
                                            // console.log(parseInt(e))
                                            setemail(parseInt(e))
                                            // setTotal(total + (email * charges.email_charge))

                                            // if (total > 0 || (parseInt(e) < email)) {
                                            //     if ((total - (parseInt(e) - email)) >= 0) {
                                            //         // setBudgetLimit(total - (parseInt(e) - email))
                                            //         setemail(parseInt(e))
                                            //     }
                                            // }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="1" >
                                <div className='d-flex align-items-center'>
                                    {/* <h7>{email * charges.email_charges}</h7> */}
                                    <h7>{`cost ${email * charges.email_charge}`}</h7>

                                </div>
                            </Col>
                        </Row>
                        <Row className='pb-2 border-bottom border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={notification} />
                                    <h4>Push Notification</h4>
                                </div>
                            </Col>
                            <Col sm="5" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={push_notification}
                                        tooltip={true}
                                        orientation="horizontal"
                                        // disabled={budget === 0}
                                        onChange={e => {
                                            // console.log(parseInt(e))
                                            setpush_notification(parseInt(e))
                                            // setTotal(total + (push_notification * charges.push_notification_charge))


                                            // if (total > 0 || (parseInt(e) < facebook)) {
                                            //     if ((total - (parseInt(e) - facebook)) >= 0) {
                                            //         setBudgetLimit(total - (parseInt(e) - facebook))
                                            //         setfacebook(parseInt(e))
                                            //     }
                                            // }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="1" >
                                <div className='d-flex align-items-center'>
                                    {/* <h7>{email * charges.email_charges}</h7> */}
                                    <h7>{`cost ${push_notification * charges.push_notification_charge}`}</h7>

                                </div>
                            </Col>
                        </Row>
                        <Row className='pb-2 border-bottom border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={fb} />
                                    <h4>Facebook Post</h4>
                                </div>
                            </Col>
                            <Col sm="5" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={facebook_post}
                                        tooltip={true}
                                        orientation="horizontal"
                                        // disabled={budget === 0}
                                        onChange={e => {
                                            setfacebookpost(parseInt(e))
                                            // setTotal(total + (facebook_post * charges.facebook_post_charge))

                                            // console.log(parseInt(e))
                                            // if (total > 0 || (parseInt(e) < facebook)) {
                                            //     if ((total - (parseInt(e) - facebook)) >= 0) {
                                            //         setBudgetLimit(total - (parseInt(e) - facebook))
                                            //         setfacebook(parseInt(e))
                                            //     }
                                            // }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="1" >
                                <div className='d-flex align-items-center'>
                                    {/* <h7>{email * charges.email_charges}</h7> */}
                                    <h7>{`cost ${facebook_post * charges.facebook_post_charge}`}</h7>
                                </div>
                            </Col>
                        </Row>
                        <Row className='pb-2 border-bottom border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={fb} />
                                    <h4>Facebook Ad</h4>
                                </div>
                            </Col>
                            <Col sm="5" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={facebook}
                                        tooltip={true}
                                        orientation="horizontal"
                                        // disabled={budget === 0}
                                        onChange={e => {
                                            setfacebook(parseInt(e))
                                            // setTotal(total + facebook)

                                            // console.log(parseInt(e))
                                            // if (total > 0 || (parseInt(e) < facebook)) {
                                            //     if ((total - (parseInt(e) - facebook)) >= 0) {
                                            //         setBudgetLimit(total - (parseInt(e) - facebook))
                                            //         setfacebook(parseInt(e))
                                            //     }
                                            // }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="1" >
                                <div className='d-flex align-items-center'>
                                    {/* <h7>{email * charges.email_charges}</h7> */}
                                    <h7>{`cost ${facebook}`}</h7>
                                </div>
                            </Col>
                        </Row>
                        <Row className='pb-2 pt-1 border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={google} />
                                    <h4>Google Ad</h4>
                                </div>
                            </Col>
                            <Col sm="5" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={googleV}
                                        tooltip={true}
                                        orientation="horizontal"
                                        // disabled={budget === 0}
                                        onChange={e => {
                                            setgoogle(parseInt(e))
                                            // setTotal(total + googleV)


                                            // if (total > 0 || (parseInt(e) < googleV)) {
                                            //     if ((total - (parseInt(e) - googleV)) >= 0) {
                                            //         setBudgetLimit(total - (parseInt(e) - googleV))
                                            //         // setBudget(budget - (parseInt(e) - googleV))
                                            //         setgoogle(parseInt(e))
                                            //     }

                                            // }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="1" >
                                <div className='d-flex align-items-center'>
                                    {/* <h7>{email * charges.email_charges}</h7> */}
                                    <h7>{`cost ${googleV}`}</h7>
                                </div>
                            </Col>
                        </Row>
                        <Row className='pb-2 pt-1 border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={wapp} />
                                    <h4>WhatsApp</h4>
                                </div>
                            </Col>
                            <Col sm="5" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={whatsapp}
                                        tooltip={true}
                                        orientation="horizontal"
                                        // disabled={budget === 0}
                                        onChange={e => {
                                            setwhatsapp(parseInt(e))
                                            // setTotal(total + whatsapp)


                                            // if (total > 0 || (parseInt(e) < whatsapp)) {
                                            //     if ((total - (parseInt(e) - whatsapp)) >= 0) {
                                            //         setBudgetLimit(total - (parseInt(e) - whatsapp))
                                            //         // setBudget(budget - (parseInt(e) - whatsapp))
                                            //         setwhatsapp(parseInt(e))
                                            //     }
                                            // }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="1" >
                                <div className='d-flex align-items-center'>
                                    {/* <h7>{email * charges.email_charges}</h7> */}
                                    <h7>{`cost ${whatsapp}`}</h7>
                                </div>
                            </Col>
                        </Row>
                        <Row className='pb-2 pt-1 border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={sms} />
                                    {/* <h4>SMS {`(${smsRate} per sms)`}</h4> */}
                                    <h4>SMS</h4>
                                </div>
                            </Col>
                            <Col sm="5" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={smsV}
                                        tooltip={true}
                                        orientation="horizontal"
                                        // disabled={budget === 0}
                                        onChange={e => {
                                            setsms(parseInt(e))
                                            // setTotal(total + (smsV * charges.sms_charge))

                                            // if (total >= smsRate || (parseInt(e) < smsV)) {
                                            //     if ((total - ((parseInt(e) - smsV) * smsRate)) >= 0) {
                                            //         setBudgetLimit(total - ((parseInt(e) - smsV) * smsRate))
                                            //         // setBudget(budget - (parseInt(e) - smsV))
                                            //         setsms(parseInt(e))
                                            //     }
                                            // }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="1" >
                                <div className='d-flex align-items-center'>
                                    {/* <h7>{email * charges.email_charges}</h7> */}
                                    <h7>{`cost ${smsV * charges.sms_charge}`}</h7>
                                </div>
                            </Col>
                        </Row>
                        <Row className='pt-1'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={insta} />
                                    <h4>Instagram</h4>
                                </div>
                            </Col>
                            <Col sm="5" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={instagram}
                                        tooltip={true}
                                        orientation="horizontal"
                                        // disabled={budget === 0}
                                        onChange={e => {
                                            setinstagram(parseInt(e))
                                            // setTotal(total + (instagram * charges.instagram_post_charge))


                                            // if (total > 0 || (parseInt(e) < instagram)) {
                                            //     if ((total - (parseInt(e) - instagram)) >= 0) {
                                            //         setBudgetLimit(total - (parseInt(e) - instagram))
                                            //         // setBudget(budget - (parseInt(e) - instagram))
                                            //         setinstagram(parseInt(e))
                                            //     }
                                            // }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="1" >
                                <div className='d-flex align-items-center'>
                                    {/* <h7>{email * charges.email_charges}</h7> */}
                                    <h7>{`cost ${instagram * charges.instagram_post_charge}`}</h7>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="12" className='text-center'>
                                {
                                    pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment >
                    </CardBody>
                </Card>
            </TabPane>
        </TabContent>
    </Card>
    <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
        <ModalHeader toggle={toggleModal}>Request For Quota</ModalHeader>
        <ModalBody>
            <Form style={{ width: '100%' }} onSubmit={onSelectedMerchantSubmit} autoComplete="off">
                <Row>
                    <Col md='12'>
                        <FormGroup>
                            <Label>Quota Amount</Label>
                            <Input
                                type="number"
                                min={0}
                                // max={100}
                                step='0.01'
                                name={budgetpercentage}
                                id={budgetpercentage}
                                value={budgetpercentage}
                                onChange={e => {
                                    setbudgetpercentage(e.target.value)
                                }}
                                required
                                placeholder="1"
                            />
                        </FormGroup>
                    </Col>
                    <Col md='12' className='text-center' style={{ paddingTop: '23px' }}>
                        {
                            SelectedMerchantLoading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                <span >Submit</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Row>
            </Form>
        </ModalBody>
    </Modal>
</>

  )
}

export default MrchntBudgetTable