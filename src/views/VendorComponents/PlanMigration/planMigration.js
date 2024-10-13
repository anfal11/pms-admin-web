import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    Check, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, Loader
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const PlanMigration = () => {
    const currentPlan = JSON.parse(localStorage.getItem('planInfo'))?.plan_info

    const [TableDataLoading, setTableDataLoading] = useState(false)
    const [plans, setPlans] = useState([])
    const [sIndex, setIndex] = useState('')
    const [resetData, setReset] = useState(true)

    useEffect(() => {
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', false)
        useJwt.planList().then(res => {
            console.log(res)
            setPlans(res.data.payload)
        }).catch(err => {
                Error(err)
                console.log(err)
        })
    }, [resetData])

    const migratePlan = async (id) => {
        setTableDataLoading(true)
        await useJwt.planMigration({plan_id: parseInt(id)}).then(res => {
                Swal.fire(res.data.message,
                'Plan migration effect from next billing cycle.',
                'success')
                setTableDataLoading(false)
            }).catch(err => {
                Error(err)
                setTableDataLoading(false)
                console.log(err)
            })
    } 

    return (
        <>
        <Row className='d-flex align-items-center border-dark justify-content-center' style={{borderRadius: '10px'}}>
            <Col sm='4'><h4>Your Current Plan:</h4></Col>
            <Col sm='4' className='p-1'>
                <Card style={{marginBottom: '0px'}}>
                    <CardBody>
                        {<div dangerouslySetInnerHTML={{__html: currentPlan.other_msg}}></div>}
                        <h2>{currentPlan.title}</h2> 
                        <p>{currentPlan.details}</p>
                        <div>
                            {
                                currentPlan.features?.map((feature, index) => <span key={index} className='d-flex'><Check className='check-plane' size='20px'/><h5 className='plan-item-details' style={{marginLeft:'5px'}}>{feature.replace(/'/g, '')}</h5></span>)
                            }
                        </div>     
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row className='border-dark p-1 mt-1' style={{borderRadius: '10px'}}>
            <Col className='pt-1' sm='12'><h4>Choose a Plan for Migration:</h4></Col>
            {
                plans.map((plan, index) =>  <Col key={index} sm='4' className='p-1'>
                <Card style={{marginBottom: '0px'}}>
                    <CardBody>
                        {<div dangerouslySetInnerHTML={{__html: plan.other_msg}}></div>}
                        <h2>{plan.title}</h2> 
                        <p>{plan.details}</p>
                        <div>
                            {
                                plan.features?.map((feature, index) => <span key={index} className='d-flex'><Check className='check-plane' size='20px'/><h5 className='plan-item-details' style={{marginLeft:'5px'}}>{feature.replace(/'/g, '')}</h5></span>)
                            }
                        </div>
                        <Button.Ripple color='primary' className='mt-1' onClick={() => {
                            migratePlan(plan.id)
                            setIndex(index)
                        }}>{(TableDataLoading && sIndex === index) ? <Loader size='18'/> : 'Choose'}</Button.Ripple>     
                    </CardBody>
                </Card>
            </Col>)
            }
        </Row>
    </>
    )
}

export default PlanMigration