import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
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
import CommonDataTable from '../ClientSideDataTable'
import EditModal from './EditModal'
import {formatReadableDate} from '../../helper'

const OverallPointRuleList = () => {
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [overallPointRuleList, setoverallPointRuleList] = useState([])
    const [overallPointRuleInfo, setoverallPointRuleInfo] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))

    useEffect(() => {
        // localStorage.setItem('usePMStoken', true)
        // const merchantId = BusinessList[0].pms_merchantid
        // useJwt.getOverallRules(merchantId).then(res => {
        //     console.log(res)
        //     setoverallPointRuleList(res.data.data)
        //     localStorage.setItem('usePMStoken', false)
        //     setTableDataLoading(false)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        //     setTableDataLoading(false)
        //     localStorage.setItem('usePMStoken', false)
        // })
    }, [resetData])
    const handlePoPupActions = (Id, message) => {
       // localStorage.setItem('usePMStoken', true)
        return MySwal.fire({
            title: message,
            text: `You won't be able to revert this`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                // return true
                // const merchantId = BusinessList[0].pms_merchantid
                // const ruleId = parseInt(Id)
                // return useJwt.deleteOverallRule(merchantId, {rule_id: ruleId}).then(res => {
                //     Success(res)
                //     console.log(res)
                //     setoverallPointRuleList(overallPointRuleList.filter(x => x.Id !== Id))
                //     localStorage.setItem('usePMStoken', false)
                // }).catch(err => {
                //     localStorage.setItem('usePMStoken', false)
                //     console.log(err.response)
                //     Error(err)
                // })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {

            }
        })

    }
    const column = [
        {
            name: 'SL.',
            minWidth: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Point Rate Setup Name',
            minWidth: '150px',
            sortable: true,
            selector: 'PointRateSetupName'
        },
        {
            name: 'Purchase Amount',
            minWidth: '100px',
            sortable: true,
            selector: 'PurchaseAmount'
        },
        {
            name: 'Points',
            minWidth: '100px',
            sortable: true,
            selector: 'Points'
        },
        {
            name: 'Expiry Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.ExpiryDate ? formatReadableDate(item.ExpiryDate) : null
               }
        },
        {
            name: 'Offer Rate',
            minWidth: '100px',
            sortable: true,
            selector: (item) => {
                return item.OfferRate ? 'True' : 'False'
              } 
        },
        {
            name: 'Offer Start Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.OfferStartDate ? formatReadableDate(item.OfferStartDate) : null
               }
        },
        {
            name: 'Offer End Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.OfferEndDate ? formatReadableDate(item.OfferEndDate) : null
               }
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.CreatedAt ? formatReadableDate(item.CreatedAt) : null
               }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setoverallPointRuleInfo(row)
                                setModal(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.Id, 'Do you want to delete?')}
                        />
                    </span>
                </>
            }
        }
    ]
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Global Rules</CardTitle>
                <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createOverallPointRule' >
                   <div className='d-flex align-items-center'>
                        <Plus size={17} style={{marginRight:'5px'}}/>
                        <span >Create Global Rule</span>
                   </div>
                 </Button.Ripple>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md='12'>
                        <CommonDataTable column={column} TableData={overallPointRuleList} TableDataLoading={TableDataLoading} />
                    </Col>
                </Row>
                <EditModal
                    toggleModal={toggleModal}
                    modal={modal}
                    resetData={resetData}
                    setReset={setReset}
                    overallPointRuleInfo={overallPointRuleInfo}
                    setoverallPointRuleInfo={setoverallPointRuleInfo}
                />
            </CardBody>
        </Card>
    )
}

export default OverallPointRuleList