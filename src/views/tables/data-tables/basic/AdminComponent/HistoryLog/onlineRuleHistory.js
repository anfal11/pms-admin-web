import useJwt from '@src/auth/jwt/useJwt'
import { handle401 } from '@src/views/helper'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardHeader, CardTitle } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
import ServerSideDataTable from '../../ServerSideDataTable'
const MySwal = withReactContent(Swal)

const OnlineRuleHistory = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [onlineRuleHistory, setonlineRuleHistory] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)

    const getData = (page, limit) => {
        console.log({ page, limit })
        setTableDataLoading(true)
        useJwt.onlineRuleHistory({ page, limit }).then(res => {
            console.log('onlineRuleHistory', res)
            setRowCount(res.data.payload.count)
            setonlineRuleHistory(res.data.payload.data)
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

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(1, 50)
    }, [])
    const column = [
        {
            name: 'Rule Name',
            minWidth: '250px',
            selector: 'commissionRuleName'
        },
        {
            name: 'Amount',
            minWidth: '120px',
            selector: 'amount'
        },
        {
            name: 'Type',
            minWidth: '120px',
            selector: 'commissionType'
        },
        {
            name: 'Start Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.startDate ? formatReadableDate(row.startDate) : 'N/A' }
        },
        {
            name: 'End Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.endDate ? formatReadableDate(row.endDate) : 'N/A' }
        },
        {
            name: 'Reward Condition',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isPercentage ? 'Percentage' : 'Flat'
            }
        },
        {
            name: 'Is Default?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isDefault  ? 'True' : 'False'
            }
        },
        {
            name: 'Recurring Type 2?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isTimelineRange  ? 'True' : 'False'
            }
        },
        {
            name: 'Distribute Reward Point?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isPoint  ? 'True' : 'False'
            }
        },
        {
            name: 'Is Time?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isTime  ? 'True' : 'False'
            }
        },
        {
            name: 'Start Hour',
            minWidth: '120px',
            selector: row => {
                return row.startHour !== ' ' ? row.startHour : '-- : --'
            }
        },
        {
            name: 'End Hour',
            minWidth: '120px',
            selector: row => {
                return row.endHour !== ' ' ? row.endHour : '-- : --'
            }
        },
        {
            name: 'Recurring Timeline?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isCertainTimeline  ? 'True' : 'False'
            }
        },
        {
            name: 'Recurring Type',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.timelineType === 'w' ? 'Weekly' : 'Monthly'
            }
        },
        {
            name: 'Campaign Quota?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isQuota  ? 'True' : 'False'
            }
        },
        {
            name: "Reward Receivers's Quota?",
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isRxQuota  ? 'True' : 'False'
            }
        },
        {
            name: "Transaction Condition",
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isFinBasedOffer  ? 'True' : 'False'
            }
        },
        {
            name: "Status Flag",
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.statusFlag  ? 'True' : 'False'
            }
        },

        {
            name: 'Created By',
            minWidth: '120px',
            selector: 'createBy'
        },
        {
            name: 'Created Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.createDate ? formatReadableDate(row.createDate) : 'N/A' }
        },
        {
            name: 'Modify By',
            minWidth: '250px',
            selector: 'modifyBy'
        },
        {
            name: 'Modify Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.modifyDate ? formatReadableDate(row.modifyDate) : 'N/A' }
        },
        {
            name: 'Approved By',
            minWidth: '250px',
            selector: 'approved_by'
        },
        {
            name: 'Approve Status',
            minWidth: '120px',
            selector: row => {
                return row.approve_status ? 'Approved' : 'Rejected'
            }
        },
        {
            name: 'Modify Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.approve_date ? formatReadableDate(row.approve_date) : 'N/A' }
        },
        {
            name: 'Operation Type',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.operationType === 1 ? 'Insert' : row.operationType === 2 ? 'Update' : row.operationType === 3 ? 'Delete' : ''
            }
        }
    ]
    return (
        
            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                    <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
  
                    ExportCSV(onlineRuleHistory, Object.keys(onlineRuleHistory[0]), 'Online Rule History')
                        }}>
                            Export CSV
                        </Button.Ripple>
                </CardHeader>
                <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={[...column]}
                    TableData={onlineRuleHistory}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card>
    )
}

export default OnlineRuleHistory