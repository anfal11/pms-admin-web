import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, XSquare, CheckSquare, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import { BMS_USER, BMS_PASS } from '../../../../../../Configurables'
import { formatReadableDate } from '../../../../../helper'
import DetailsModal from './ViewDetails'

const PendingCampaignList = ({ resetData, setReset, viewTempDetailsInfo, TableDataLoading, pendingCampaignList, setpendingCampaignList, serviceList, groupList }) => {
    const history = useHistory()
    const username = localStorage.getItem('username')
    const [campaignInfo, setCampaignInfo] = useState({})
    
    const [action, setAction] = useState(0)
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)
        if (value.length) {
            updatedData = pendingCampaignList.filter(item => {
                const startsWith =
                item.campaign_name.toLowerCase().startsWith(value.toLowerCase()) ||
                item.commission_rule_name.toLowerCase().startsWith(value.toLowerCase())

            const includes =
                item.campaign_name.toLowerCase().includes(value.toLowerCase()) ||
                item.commission_rule_name.toLowerCase().includes(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            setFilteredData(updatedData)
            setSearchValue(value)
        }
    }
    // const handlePoPupActions = (id, status, message) => {
    //     localStorage.setItem('useBMStoken', true)
    //     return MySwal.fire({
    //         title: message,
    //         text: `You won't be able to revert this`,
    //         icon: 'warning',
    //         allowOutsideClick: false,
    //         allowEscapeKey: false,
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes',
    //         customClass: {
    //             confirmButton: 'btn btn-primary',
    //             cancelButton: 'btn btn-danger ml-1'
    //         },
    //         showLoaderOnConfirm: true,
    //         preConfirm: () => {
    //             localStorage.setItem('useBMStoken', true)
    //             useJwt.approveOrRejectCampaign(id, status).then(res => {
    //                 setReset(!resetData)
    //                 console.log(res)
    //                 setpendingCampaignList(pendingCampaignList.filter(x => x.id !== id))
    //                 Success(res)
    //             }).catch(err => {
    //                 localStorage.setItem('useBMStoken', false)
    //                 Error(err)
    //                 console.log(err.response)
    //             })
    //         },
    //         buttonsStyling: false,
    //         allowOutsideClick: () => !Swal.isLoading()
    //     }).then(function (result) {
    //         if (result.isConfirmed) {

    //         }
    //     })

    // }
    const column = [
        {
            name: 'Campaign Name',
            minWidth: '200px',
            sortable: true,
            selector: 'campaign_name',
            wrap: true
        },
        {
            name: 'Rule Name',
            minWidth: '200px',
            sortable: true,
            selector: 'commission_rule_name',
            wrap: true
        },
        {
            name: 'Service Name',
            minWidth: '250px',
            sortable: true,
            wrap: true,
            selector: (row) => {
                if (row.anyservice) {
                   return <Badge color="info" pill>Any</Badge>
                } else {
                    return row.service_keywords.map(item => <Badge color="primary" pill>{item}</Badge>)
                }
            }
        },
        {
            name: 'Reward Receiver',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.receiver === 's' ? 'Sender' : row.receiver === 'r' ? 'Reciever' : row.receiver === 'b' ? 'Both' : ''
            }
        },
        {
            name: 'Start Date',
            minWidth: '150px',
            sortable: true,
            wrap: true,
            selector: (item) => {
                return item.start_date ? formatReadableDate(item.start_date) : '---'
            }
        },
        {
            name: 'End Date',
            minWidth: '150px',
            sortable: true,
            wrap: true,
            selector: (item) => {
                return item.end_date ? formatReadableDate(item.end_date) : '---'
            }
        },
        {
            name: 'Operation Type',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row.operation_type === 1 ? <Badge color="primary" pill>Insert</Badge> : row.operation_type === 2 ? <Badge color="success" pill>Update</Badge> : row.operation_type === 3 ? <Badge color="danger" pill>Delete</Badge> : row.operation_type === 5 ? <Badge color="danger" pill>Deactivate</Badge>  : row.operation_type === 4 ? <Badge color="success" pill>Live</Badge> : ''
            }
        },
        {
            name: 'Operation By',
            minWidth: '100px',
            sortable: true,
            selector: 'modify_by',
            wrap: true
        },
        {
            name: 'Operation At',
            minWidth: '150px',
            sortable: true,
            wrap: true,
            selector: (item) => {
                return item.modify_date ? formatReadableDate(item.modify_date) : '---'
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            wrap: true,
            selector: row => <Fragment>
                   <span title="View">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => viewTempDetailsInfo(e, row)}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setCampaignInfo(row)
                                setModal(true)
                                setAction(1)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setCampaignInfo(row)
                                setModal(true)
                                setAction(0)
                            }}
                        />
                    </span>
                </Fragment>
        }
    ]
   
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending Campaign Maps</CardTitle>
            </CardHeader>
            <Row className='justify-content-end mx-0'>
                <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
                    <Label className='mr-1' for='search-input'>
                        Search
                    </Label>
                    <Input
                        className='dataTable-filter mb-50'
                        type='text'
                        bsSize='sm'
                        id='search-input'
                        value={searchValue}
                        onChange={handleFilter}
                    />
                </Col>
            </Row>
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingCampaignList} TableDataLoading={TableDataLoading} />
            
            <DetailsModal 
                modal={modal}
                toggleModal={toggleModal}
                campaignInfo={campaignInfo} 
                refresh={resetData}
                setRefresh={setReset}
                action={action}  
            /> 
        </Card>
    )
}

export default PendingCampaignList