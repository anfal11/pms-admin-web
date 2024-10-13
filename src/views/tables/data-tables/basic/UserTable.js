import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
// ** Table Data & Columns
//import { data } from '../data'

// ** Add New Modal Component
import AddNewModal from './AddNewModal'
import Select from 'react-select'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft } from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody } from 'reactstrap'

import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const UserTable = () => {
    const history = useHistory()
    const [searchValue, setSearchValue] = useState('')
    const [isloading, setisloading] = useState(false)
    const [tableDataLoading, setTDL] = useState(true)
    const [userTypeData, setuserTypeData] = useState([{ value: "", label: "" }])
    const [userTitleData, setuserTitleData] = useState([{ value: "", label: "" }])
    const [userList, setUserlist] = useState([])
    const [storeList, setStoreList] = useState([])
    const [userInput, setUserInput] = useState({})
    const [error, seterror] = useState({
        userType: false,
        userTitle: false,
        storeName: false
    })

    const [currentPage, setCurrentPage] = useState(0)
    const [efct, setEfct] = useState(true)

    useEffect(() => {
        /*useJwt.userRoleList().then(res => {
            // console.log(res.data.payload)
            const userTypeApi = res.data.payload.map(type => {
                return { value: type.id, label: type.statusdesc }
            })
            setuserTypeData(userTypeApi)
        }).catch(err => {
            console.log(err.response)
        })
        useJwt.userTitleList().then(res => {
            // console.log(res.data.payload)
            const userTitleApi = res.data.payload.map(type => {
                return { value: type.id, label: type.statusdesc }
            })
            setuserTitleData(userTitleApi)
        }).catch(err => {
            console.log(err.response)
        })*/
        useJwt.adminUserList().then(res => {
            console.log(res.data.payload)
            setUserlist(res.data.payload)
            setTDL(false)
        }).catch(err => {
            console.log(err)
        })
       /* useJwt.storeList().then(res => {
            // console.log(res.data.payload)
            const storeApi = res.data.payload.map(type => {
                return { value: type.storeid, label: type.storename }
            })
            setStoreList(storeApi)
        }).catch(err => {
            console.log(err)
        })*/
        

    }, [efct])

    const onchange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })

    }
    const handleUserType = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, UserType: null })
        } else {
            setUserInput({ ...userInput, UserType: option.value })
        }
    }
    const handleUserTitle = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, UserTitle: null })
        } else {
            setUserInput({ ...userInput, UserTitle: option.value })
        }
    }
    const handleStoreName = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, StoreName: null })
        } else {
            setUserInput({ ...userInput, StoreName: option.value })
        }
    }
    const onsubmit = (e) => {
        e.preventDefault()
        // console.log(userInput)
        const err = { ...error }
        !userInput.UserType ? err.userType = true : err.userType = false
        !userInput.UserTitle ? err.userTitle = true : err.userTitle = false
        !userInput.StoreName ? err.storeName = true : err.storeName = false
        seterror(err)
        if (!err.userType && !err.userTitle && !err.storeName) {
            const { username, password, Email, firstName, lastName, StoreName, UserType, UserTitle } = userInput
            const fullname = `${firstName} ${lastName}`
            useJwt.addAdminUser({ fullname, username, password, roleid: UserType, emailid: Email, storeid: StoreName, title: UserTitle }).then(res => {
                console.log(res)
                MySwal.fire({
                    icon: 'success',
                    title: 'Done!',
                    text: 'The Staff has been added successfully',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
                setTimeout(function () { history.replace('/user') }, 1000)
            }).catch(err => {
                console.log(err)
            })
        }
    }
    // ** Table Common Column
    const status = {
        1: { title: 'Active', color: 'light-success ' },
        0: { title: 'Blocked', color: 'light-danger' }
    }
    const handleDelete = (userID) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                //fetch business delete api...
                useJwt.adminUserdelete({ id: userID }).then(res => {
                    // console.log(res)
                    //   removedeleteitem(userID)
                    MySwal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The Staff has been deleted.',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    })
                    setEfct(!efct)
                }).catch(err => {
                    console.log(err.response)
                })
            }
        })
    }
    // user staus block
    const handleBlock = (userID, userStatus) => {
        return MySwal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {

                let toggleStatus
                userStatus === 0 ? toggleStatus = 1 : userStatus === 1 ? toggleStatus = 0 : toggleStatus = 0
                useJwt.adminUserBlock({ id: userID, status: toggleStatus }).then(res => {
                    console.log(res)
                    //   removedeleteitem(userID)
                    MySwal.fire({
                        icon: 'success',
                        title: 'Status updated!',
                        // text: 'The user has been Blocked',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    })
                    setEfct(!efct)
                }).catch(err => {
                    console.log(err.response)
                })
            }
        })
    }

    const columns = [
        {
            name: 'Name',
            minWidth: '100px',
            selector: (item) => {
                return item.fullname ? item.fullname : ''
            },
            sortable: true
        },
        {
            name: 'Email',
            selector: 'emailid',
            minWidth: '150px',
            sortable: true
        },
      

        {
            name: 'Store Name',
            selector: (item) => {
                return item.adminstore ? item.adminstore.storename : ''
            },
            minWidth: '150px',
            sortable: true
        },
        {
            name: 'Role',
            selector: (row) => {
                return row['adminstatus'] ? row.adminstatus.statusdesc : ""
            },
            minWidth: '150px',
            sortable: true
        },
        {
            name: 'Status',
            minWidth: '50px',
            selector: row => {
                return (
                    <Badge color={status[row.userstatus].color} pill>
                        {status[row.userstatus].title}
                    </Badge>
                )
            },
            sortable: true
        },
        {
            name: 'Actions',
            allowOverflow: true,
            cell: row => {
                return (
                    <div className='d-flex'>
                        <Link to={`/userDetails/${row.id}`}><Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} /></Link> &nbsp;&nbsp;
                        <Link to={`/EditUserInfo/${row.id}`}><Edit size={15} color='#7367f0' style={{ cursor: 'pointer' }} /></Link> &nbsp;&nbsp;
                        <Trash size={15} color='red' style={{ cursor: 'pointer', marginTop: '2.5px' }} onClick={(e) => {
                            e.preventDefault()
                            handleDelete(row.id)
                        }} /> &nbsp;&nbsp;
                        <Lock size={15} color='teal' style={{ cursor: 'pointer', marginTop: '2.5px' }} onClick={(e) => {
                            e.preventDefault()
                            handleBlock(row.id, row.userstatus)
                        }} />
                        {/* <UncontrolledDropdown>
                            <DropdownToggle className='pr-1' tag='span'>
                                <MoreVertical size={15} style={{ cursor: 'pointer' }} />
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem tag='a' href={`/EditUserInfo/${row.id}`} className='w-100'>
                                    <Edit size={15} color='#2bc871' style={{ cursor: 'pointer' }} />
                                    <span className='align-middle ml-50'>Edit</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={(e) => {
                                    e.preventDefault()
                                    handleDelete(row.id)
                                }}>
                                    <Trash size={15} color='red' style={{ cursor: 'pointer' }} />
                                    <span className='align-middle ml-50'>Delete</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={(e) => {
                                    e.preventDefault()
                                    handleBlock(row.id, row.userstatus)
                                }}>
                                    <Lock size={15} color='teal' style={{ cursor: 'pointer' }} />
                                    <span className='align-middle ml-50'>{row.userstatus === 1 ? "Block" : "Unblock"}</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> */}

                    </div>
                )
            }
        }
    ]
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
            pageCount={userList.length ? userList.length / 10 : 1}
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
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        />
    )
    const onSearchValueChange = (e) => {
        setSearchValue(e.target.value)
    }
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        setTDL(true)
        useJwt.adminUserSearch({searchValue}).then(res => {
            console.log(res.data.payload)
            setUserlist(res.data.payload)
            setTDL(false)
        }).catch(err => {
            console.log(err)
        })

    }
    return (
        <>
            <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/addNewUser'>
                <Plus size={15} />
                <span className='align-middle ml-50'>Add new Staff </span>
            </Button.Ripple>
            <Card>
                <Form className="d-flex my-2 mx-1 justify-content-center" style={{ width: '100%' }} onSubmit={handleSearchSubmit} autoComplete="off">
                    <Input
                        style={{ width: '50%' }}
                        placeholder="Search staff with User name, Name"
                        type='text'
                        id='search-input'
                        required
                        value={searchValue}
                        onChange={onSearchValueChange}
                    />
                    {
                        isloading ? <Button.Ripple className='ml-2' color='primary' disabled={true} >
                            <Spinner color='white' size='sm' />
                            <small className='ml-50'>Loading...</small>
                        </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit"  >
                            <Search size={15} />
                            <span className='align-middle ml-50'>Search</span>
                        </Button.Ripple>
                    }

                </Form>
            </Card>
            {/* data table for user list */}
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Staff List</CardTitle>
                </CardHeader>

                <DataTable
                    noHeader
                    pagination
                    /*selectableRows*/
                    columns={columns}
                    paginationPerPage={10}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10} />}
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={CustomPagination}
                    data={userList}
                    progressPending={tableDataLoading}
                    progressComponent={<Spinner color='primary' />}
                    responsive={true}
                /*selectableRowsComponent={BootstrapCheckbox}*/
                />
            </Card>
        </>
    )
}

export default UserTable