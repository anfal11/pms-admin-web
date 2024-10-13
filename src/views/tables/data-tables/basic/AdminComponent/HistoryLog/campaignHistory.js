import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import ServerSideDataTable from '../../ServerSideDataTable'
import { Success, Error } from '../../../../../viewhelper'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
const MySwal = withReactContent(Swal)
import { handle401 } from '@src/views/helper'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'

const CampaignHistory = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [resetData, setReset] =  useState(false)
    const [campaignHistory, setCampaignHistory] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [serviceList, setserviceList] = useState([])

    const getData = (page, limit) => {
        console.log({ page, limit })
        setTableDataLoading(true)
        useJwt.campaignHistory({ page, limit }).then(res => {
            console.log('campaignHistory', res)
            setRowCount(res.data.payload.count)
            setCampaignHistory(res.data.payload.data)
        }).catch(err => {
            handle401(err.response?.status)
            console.log(err.response)
        }).finally(f => {
            setTableDataLoading(false)
        })
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        getData(page.selected + 1, 50)
        setCurrentPage(page.selected)
    }

    useEffect(async () => {
        localStorage.setItem('useBMStoken', false)
        await useJwt.getServiceList().then(res => {
            console.log(res)
            setserviceList(res.data.payload)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem("BMSCall", true)
                useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                  localStorage.setItem('BMStoken', res.data.jwtToken)
                  localStorage.setItem("BMSCall", false)
                  setReset(!resetData)
                }).catch(err => {
                  localStorage.setItem("BMSCall", false)
                  console.log(err)
                })
            } else {
                Error(err)
            }
            console.log(err.response)
            setTableDataLoading(false)
            localStorage.setItem('useBMStoken', false)
        })
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(1, 50)
    }, [resetData])

    const column = [
        {
            name: 'SL',
            width: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Campaign Name',
            minWidth: '250px',
            sortable: true,
            selector: 'campaignName'
        },
        {
            name: 'Campaign Message',
            minWidth: '250px',
            sortable: true,
            selector: 'campaignMsg'
        },
        {
            name: 'Quota Expiry Message',
            minWidth: '250px',
            sortable: true,
            selector: 'qtExpireMsg'
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
            name: 'Service Name',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return serviceList?.find(sv => sv.service_id === row.serviceId)?.service_keyword || '---'
            }
        },
        {
            name: 'Sub Types',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return row.subTypes.length !== 0 ? row.subTypes?.map(m => <Badge style={{ marginRight: '5px' }} key={m}>{m}</Badge>) : 'N/A'
            }
        },
        {
            name: 'Status',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isActive  ? 'Active' : 'Inactive'
            }
        },
        {
            name: 'Is Dynamic?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isDynamicCamp  ? 'True' : 'False'
            }
        },
        {
            name: 'Is Same User?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isSameUser  ? 'True' : 'False'
            }
        },
        {
            name: 'Is Same User?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isSameUser  ? 'True' : 'False'
            }
        },
        {
            name: 'Is Subcategory?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isSubCategory  ? 'True' : 'False'
            }
        },
        {
            name: 'Created By',
            minWidth: '250px',
            sortable: true,
            selector: 'createBy'
        },
        {
            name: 'Alert Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.alertDate ? formatReadableDate(item.alertDate) : '---'
            }
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.createDate ? formatReadableDate(item.createDate) : '---'
            }
        },
        {
            name: 'Approved By',
            minWidth: '250px',
            sortable: true,
            selector: 'approved_by'
        },
        {
            name: 'Approve At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.approve_date ? formatReadableDate(item.approve_date) : '---'
            }
        },
        {
            name: 'Approve Status',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.approve_status  ? 'Approved' : 'Rejected'
            }
        },
        {
            name: 'Modified By',
            minWidth: '250px',
            sortable: true,
            selector: 'modifyBy'
        },
        {
            name: 'Modified At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.modifyDate ? formatReadableDate(item.modifyDate) : '---'
            }
        },
        {
            name: 'Operation Type',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.operationType === 1 ? 'Insert' : row.operationType === 2 ? 'Update' : row.operationType === 3 ? 'Delete' : row.operationType === 5 ? 'Deactivate' : row.operationType === 4 ? 'Activate' : ''
            }
        },
        {
            name: 'Request Type',
            minWidth: '100px',
            sortable: true,
            selector: 'request_type'
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
                <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
                    ExportCSV(campaignHistory, Object.keys(campaignHistory[0]), 'Campaign History')
                    }}>
                        Export CSV
                    </Button.Ripple>
            </CardHeader>
            <ServerSideDataTable
                currentPage={currentPage}
                handlePagination={handlePagination}
                RowCount={RowCount}
                column={[...column]}
                TableData={campaignHistory}
                RowLimit={50}
                TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default CampaignHistory