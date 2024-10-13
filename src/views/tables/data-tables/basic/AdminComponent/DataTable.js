import React, { Fragment, useState, useEffect } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'

const CommonDataTable = ({ column, TableData, TableDataLoading }) => {

    return (
        <Fragment>
            <DataTable
                noHeader
                columns={column}
                className='react-dataTable realtimecomissionflaxiabletable'
                sortIcon={<ChevronDown size={10} />}
                data={TableData}
                progressPending={TableDataLoading}
                progressComponent={<Spinner color='primary' />}
                responsive={true}
            />
        </Fragment>
    )
}

export default CommonDataTable