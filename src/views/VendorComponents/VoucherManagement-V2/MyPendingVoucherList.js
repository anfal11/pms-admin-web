import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, Row, Col, Badge, CardBody, Spinner} from 'reactstrap'
import { Eye } from 'react-feather'
import CommonDataTable from '../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { VoucherStatusSet, OperationStatusSet } from '../../statusdb'
import { ExportCSV, formatReadableDate } from '../../helper'

const systemV = {
    false: { title: 'False', color: 'light-primary' },
    true: { title: 'True', color: 'light-success' }
}

const MyPendingVoucherList = ({pendingVoucherListData, TableDataLoading, setisviewDetails, setvoucherid}) => {

    const viewDetails = (e, item) => {
        setvoucherid(item.voucherid)
        setisviewDetails(true)
    }


    const column = [
        // {
        //     name: 'SL',
        //     minWidth: '100px',
        //     sortable: true,
        //     cell: (row, index) => index + 1 
        // },
        {
            name: 'ID',
            minWidth: '100px',
            sortable: true,
            selector: 'voucherid'
        },
        {
            name: 'Title',
            minWidth: '150px',
            sortable: true,
            selector: 'title',
            wrap: true
        },
        {
            name: 'Business Name',
            minWidth: '150px',
            sortable: true,
            selector: 'businessname'
        },
        {
            name: 'Voucher Type',
            minWidth: '100px',
            sortable: true,
            selector: 'vouchertype'
        },
        {
            name: 'System-Voucher',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return <Badge color={systemV[row.is_system_voucher].color} pill className='px-1'>
                    {systemV[row.is_system_voucher].title}
                </Badge>
            }
        },
        {
            name: 'Start Date',
            minWidth: '200px',
            sortable: true,
            selector: 'startdate'
        },
        {
            name: 'Expiry Date',
            minWidth: '200px',
            sortable: true,
            selector: 'expirydate'
        }, 
        {
            name: 'Tier',
            minWidth: '100px',
            sortable: true,
            selector: 'tier_name'
        },
        {
            name: 'Status',
            minWidth: '100px',
            sortable: true,
            selector: (item) => <Badge color={VoucherStatusSet(item['status']).color} pill className='px-1'> {VoucherStatusSet(item['status']).title} </Badge>
        },
        {
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: (item) => <Badge color={OperationStatusSet(item['action']).color} pill className='px-1'> {OperationStatusSet(item['action']).title} </Badge>
        },
        {
            name: 'Operation At',
            minWidth: '200px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.createdat) - new Date(a.createdat)
              },
            selector: row => { return row.createdat ? formatReadableDate(row.createdat) : 'N/A' }
        },
        {
            name: 'Upload-Err-Message',
            minWidth: '250px',
            sortable: true,
            wrap: true,
            selector: row => { return row.customcode_upload_status !== 0 ? <p style={{color: 'red'}}>{row.customcode_upload_error_msg}</p> : 'N/A' }
        },
        {
            name: 'Action',
            minWidth: '200px',
            // sortable: true,
            selector: row => {
                return <Fragment>
                    {
                        row.customcode_upload_status === 0 ? <Fragment> <span title="Custom-code-processing"><Spinner size='sm' /> </span> &nbsp;&nbsp; <span title="View">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => viewDetails(e, row) }
                        />
                    </span></Fragment> : <span title="View">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => viewDetails(e, row) }
                        />
                    </span>
                    }
                   
                </Fragment>
            }
        }
    ]

    return (
        <Fragment>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Pending Vouchers</CardTitle>
                </CardHeader>
                {/* {businessList.length > 1 && <Card>
                        <CardBody style={{zIndex: '5'}}>
                            <Label for="Business">Select a Business</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={businessList.map(x => { return { value: x.pms_merchantid, label: x.businessname } })[0]}
                                onChange={handleBusinessChange}
                                options={businessList.map(x => { return { value: x.pms_merchantid, label: x.businessname } })}
                            />
                        </CardBody>
                    </Card>} */}
                <CardBody>
                    <Row>
                        <Col md='12'>
                            <CommonDataTable column={column} TableData={pendingVoucherListData} TableDataLoading={TableDataLoading} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default MyPendingVoucherList