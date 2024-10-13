import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import CommonDataTable from '../../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { formatReadableDate } from '../../../helper'

const MyPendingListView = ({voucherBulkPurchasePendingList, TableDataLoading }) => {

    const column = [

        {
            name: 'Voucher ID',
            minWidth: '100px',
            sortable: true,
            selector: 'voucherid'
        },
        {
            name: 'Title',
            minWidth: '100px',
            sortable: true,
            selector: 'title'
        },
        {
            name: 'Group-Name',
            minWidth: '100px',
            sortable: true,
            selector: 'group_name'
        },
        {
            name: 'Created At',
            minWidth: '100px',
            sortable: true,
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: (item) => {
                return item.created_at ? formatReadableDate(item.created_at) : null
            }
        }
    ]


    return (
        <Fragment>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Pending Bulk Purchase</CardTitle>
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
                            <CommonDataTable column={column} TableData={voucherBulkPurchasePendingList} TableDataLoading={TableDataLoading} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default MyPendingListView