import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button
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

const FbPostReport = () => {
    const history = useHistory()
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [FbpagePostReport, setFbpagePostReport] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)

    const getData = () => {
        setTableDataLoading(true)
        useJwt.fbPagePostBonusCampSummary().then(res => {
            console.log('fbPagePostBonusCampSummary', res)
            setFbpagePostReport(res.data.payload)
        }).catch(err => {
            handle401(err.response?.status)
            console.log(err.response)
        }).finally(f => {
            setTableDataLoading(false)
        })
    }

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData()
    }, [])
     
    const column = [
        {
            name: 'Post Created Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.post_create_date ? formatReadableDate(row.post_create_date) : 'N/A' }
        },
        {
            name: 'Campaign Created Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.campaign_create_date ? formatReadableDate(row.campaign_create_date) : 'N/A' }
        },
        {
            name: 'Campaign Name',
            minWidth: '250px',
            sortable: true,
            selector: 'campaign_name'
        },
        {
            name: 'Notification Id',
            minWidth: '250px',
            sortable: true,
            selector: 'notification_id'
        },
        {
            name: 'Number Of Page Post',
            minWidth: '250px',
            sortable: true,
            selector: 'number_of_page_post'
        },
        {
            name: '',
            minWidth: '100px',
            selector: row => {
                return <>
                    <span title="Details">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                history.push(`/detailsFbPagePost/${row.notification_id}`)
                            }
                        }
                        />
                    </span>
                </>
            }
        }
    ]

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Facebook Page Post Report</CardTitle>
                    <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
  
                    ExportCSV(FbpagePostReport, Object.keys(FbpagePostReport[0]), 'Notification Report')
                        }}>
                            Export CSV
                        </Button.Ripple>
                </CardHeader>
                <ServerSideDataTable
                    // currentPage={currentPage}
                    // handlePagination={handlePagination}
                    // RowCount={RowCount}
                    column={[...column]}
                    TableData={FbpagePostReport}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card>
        </>
    )
}

export default FbPostReport