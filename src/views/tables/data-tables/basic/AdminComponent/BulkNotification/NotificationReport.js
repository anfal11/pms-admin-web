import useJwt2 from '@src/auth/jwt/useJwt2'
import { handle401 } from '@src/views/helper'
import { Fragment, useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Modal, ModalBody, ModalHeader, Row, Spinner, Table } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import { formatReadableDate } from '../../../../../helper'
import ServerSideDataTable from '../../ServerSideDataTable'
import { ChevronLeft, Check, XCircle, Power} from 'react-feather'
import {SyncLoader, ScaleLoader} from "react-spinners"   

const NotificationReport = ({toggleModal, notificationId }) => {

    const [loading, setLoading] = useState(true)
    const [RowCount, setRowCount] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [data, setdata] = useState([])

    const getData = (page, limit) => {
        setLoading(true)
        useJwt2.notificationReport({ page: 1, limit, notification_id: notificationId}).then(res => {
            setdata(res.data.payload)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            Error(err)
        })
    }
    useEffect(() => {
        getData(1, rowsPerPage)
        useJwt2.notificationReportCount({notification_id: notificationId}).then(res => {
            setRowCount(+res.data.payload)
        }).catch(err => {
            Error(err)
        })
    }, [])

    const handlePagination = page => {
        getData(page.selected + 1, rowsPerPage)
    }

    const column = [
        {
            name: 'Mobile',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                if (row.mobile) {
                    return row.mobile
                } else if (row.push_mobile) {
                    return row.push_mobile
                } else {
                    return '--'
                }
            }
        },
        {
            name: 'Sms Status',
            minWidth: '50px',
            sortable: true,
            selector: (row) => {
                switch (row.sms_status) {
                    case 0 : return <ScaleLoader color="#36d7b7" height={5} />
                    case 1 : return <Check size={20} color="#36d7b7"/>
                    case 2 : return <XCircle size={20} color="red"/>
                    default : return '--'
                }
            }
        },
        {
            name: 'Push Status',
            minWidth: '50px',
            sortable: true,
            selector: (row) => {
                switch (row.push_status) {
                    case 0 : return <ScaleLoader color="#36d7b7" height={5} />
                    case 1 : return <Check size={20} color="#36d7b7"/>
                    case 2 : return <XCircle size={20} color="red"/>
                    default : return '--'
                }
            }
        },
        {
            name: 'Email',
            minWidth: '80px',
            sortable: true,
            selector: 'email'
        },
        {
            name: 'Email Status',
            minWidth: '50px',
            sortable: true,
            selector: (row) => {
                switch (row.email_status) {
                    case 0 : return <ScaleLoader color="#36d7b7" height={5} />
                    case 1 : return <Check size={20} color="#36d7b7"/>
                    case 2 : return <XCircle size={20} color="red"/>
                    default : return '--'
                }
            }
        },
        {
            name: 'Sent At',
            minWidth: '80px',
            sortable: true,
            wrap:true,
            selector: (row) => {
                if (row.sms_sent_at) {
                    return formatReadableDate(row.sms_sent_at)
                } else if (row.email_sent_at) {
                    return formatReadableDate(row.email_sent_at)
                } else if (row.push_sent_at) {
                    return formatReadableDate(row.push_sent_at)
                } else {
                    return '--'
                }
            }
        }
    ]


return (
    <Fragment>
        <Button.Ripple className='mb-1' color='primary' onClick={() => toggleModal(false)} >
            <div className='d-flex align-items-center'>
                <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                <span >Back</span>
            </div>
        </Button.Ripple>
            <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Notification Report</CardTitle>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                       <ServerSideDataTable
                            currentPage={currentPage}
                            handlePagination={handlePagination}
                            RowCount={RowCount}
                            column={column}
                            TableData={data}
                            RowLimit={rowsPerPage}
                            TableDataLoading={loading} 
                        />               
                 </CardBody>
            </Card>
               
    </Fragment>
  )
}
export default NotificationReport