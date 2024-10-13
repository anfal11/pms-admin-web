import useJwt2 from '@src/auth/jwt/useJwt2'
import { handle401 } from '@src/views/helper'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardHeader, CardTitle, Label, Input, Row, Col } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
import { ChevronLeft } from 'react-feather'
import ServerSideDataTable from '../../ServerSideDataTable'
const MySwal = withReactContent(Swal)

const groupContactListView = ({toggleGroupContactListView, groupInfo}) => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)
    const [onlineRuleHistory, setonlineRuleHistory] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const getData = (page, limit) => {
        console.log({ page, limit })
        setTableDataLoading(true)
        useJwt2.getContactList(page, limit, groupInfo.id).then(res => {
            console.log('getContactList', res)
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
        getData(page.selected + 1, rowsPerPage)
        setCurrentPage(page.selected)
        console.log('selected', page.selected)
    }

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(1, rowsPerPage)
    }, [groupInfo])

    // ** Function to handle per page
    const handlePerPage = e => {
        //getData(currentPage + 1, parseInt(e.target.value))
        getData(1, parseInt(e.target.value))
        setCurrentPage(0)
        setRowsPerPage(parseInt(e.target.value))
    }

    const column = [
        {
            name: 'MSISDN',
            minWidth: '250px',
            selector: 'msisdn'
        },
        {
            name: 'Email',
            minWidth: '120px',
            selector: 'email'
        },
        {
            name: 'Device ID',
            minWidth: '120px',
            selector: 'device_id'
        }
    ]

    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = onlineRuleHistory.filter(item => {
                const startsWith =
                    item.msisdn?.startsWith(value) ||
                    item.email?.startsWith(value) ||
                    item.device_id?.startsWith(value)

                const includes =
                    item.msisdn?.includes(value) ||
                    item.email?.includes(value) ||
                    item.device_id?.includes(value)

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

    return (
        
            <Card>
                <CardHeader>
                <Button.Ripple className='mb-1' color='primary' onClick={() => toggleGroupContactListView()} >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
                </Button.Ripple>
                <CardTitle>
                     <h5>Group Name: <strong>{groupInfo.group_name}</strong></h5>
                </CardTitle>
                </CardHeader>
                    <Row>
                        <Col sm='2'>  <div className='d-flex align-items-center ml-1'>
                            <Label for='sort-select'>show</Label>
                            <Input
                                className='dataTable-select'
                                type='select'
                                id='sort-select'
                                value={rowsPerPage}
                                onChange={e => handlePerPage(e)}
                            >
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={75}>75</option>
                                <option value={100}>100</option>
                                <option value={500}>500</option>
                            </Input>
                            <Label for='sort-select'>entries</Label>
                            </div>
                        </Col>
                        <Col className='d-flex align-items-center justify-content-end' sm='3'>
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
                <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={[...column]}
                    TableData={searchValue.length ? filteredData : onlineRuleHistory}
                    RowLimit={onlineRuleHistory?.length}
                    TableDataLoading={TableDataLoading} />
            </Card>
    )
}

export default groupContactListView