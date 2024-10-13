import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'

const NeedApprove = ({approvependingListData}) => {

    return (
        <Fragment>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Approve/Reject Pending Bulk Purchase</CardTitle>
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
                    </Card>}
                <CardBody>
                    <Row>
                        <Col md='12'>
                            <CommonDataTable column={column1} TableData={pendingVoucherList} TableDataLoading={TableDataLoading1} />
                        </Col>
                    </Row>
                </CardBody> */}
            </Card>
        </Fragment>
    )
}

export default NeedApprove