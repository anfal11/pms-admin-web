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

// Custom styles
const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#d9d9d92b', // Green background color
        color: 'black',             // White text color
        fontSize: '12px',          // Font size
        fontWeight: 600
      }
    },
    cells: {
        style: {
          fontSize: '12px'  // Font size for body cells
        }
    }
}

const CommonDataTable = ({ column, TableData, TableDataLoading }) => {
    const [currentPage, setCurrentPage] = useState(0)

    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
    }
    
    // ** Custom Pagination
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel=''
            nextLabel=''
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={TableData.length ? TableData.length / 10 : 1}
            breakLabel='...'
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            nextLinkClassName='page-link'
            nextClassName='page-item next'
            previousClassName='page-item prev'
            previousLinkClassName='page-link'
            pageLinkClassName='page-link'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        />
    )
    return (
        <Fragment>

            <DataTable
                noHeader
                pagination
                columns={column}
                paginationPerPage={10}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                paginationDefaultPage={currentPage + 1}
                paginationComponent={CustomPagination}
                data={TableData}
                progressPending={TableDataLoading}
                progressComponent={<Spinner color='primary' />}
                responsive={true}
                pointerOnHover
                highlightOnHover
                striped
                customStyles={customStyles}
            />
             
        </Fragment>
    )
}

export default CommonDataTable