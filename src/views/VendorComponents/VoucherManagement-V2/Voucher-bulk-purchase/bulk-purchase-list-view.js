import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import CommonDataTable from '../../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { formatReadableDate } from '../../../helper'

const BulkPurchaseListView = ({voucherBulkPurchaseList, TableDataLoading}) => {

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
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by'
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
        },
        {
            name: 'Download-url',
            minWidth: '100px',
            sortable: true,
            selector: (item) => {

                if (item.status && item.csv_url) {
                    return <a href={item.csv_url} target="_blank">{item.csv_url}</a>
                } else if (item.status) {
                    return ""
                } else {
                    return <Spinner color='black' size='sm' />
                }
            }
        }
    ]

    return (
        <Fragment>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Bulk Purchase</CardTitle>
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
                            <CommonDataTable column={column} TableData={voucherBulkPurchaseList} TableDataLoading={TableDataLoading} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default BulkPurchaseListView