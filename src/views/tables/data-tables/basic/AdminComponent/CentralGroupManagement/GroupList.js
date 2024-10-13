import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import * as FileSaver from 'file-saver'
import React, { Fragment, useEffect, useState } from 'react'
import { Edit, Download, Eye, File, FileText, Grid, Plus, Minus, Trash, RefreshCw, MoreVertical, Trash2  } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import { Spinner, Badge, Button, Card, CardHeader, CardTitle, Col, Form, CardBody, FormGroup, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, Modal, ModalHeader, ModalBody, Table,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
 } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { formatReadableDate, validateEmail } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)
// import Pdf from "react-to-pdf"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import PendingGroupList from './PendingGroupList'
import MyPendingGroupList from './MyPendingGroupList'
// import DetailsView from './detailsView'
import GroupContactListView from './groupContactListView'
import { Add } from '@mui/icons-material'
import { toast } from 'react-toastify'
import PendingGroupContactListView from './pendingGroupContactListView'
import DetailsView from '../../../../../AdminComponents/GroupManagement/DetailsView'

const GroupList = () => {
    const history = useHistory()
    const user = JSON.parse(localStorage.getItem('userData'))
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [grouppInfo, setgrouppInfo] = useState({})
    const [isGroupContactListView1, setIsGroupContactListView1] = useState(false)
    const toggleGroupContactListView1 = () => {
        setIsGroupContactListView1(!isGroupContactListView1)
    }
    const viewContacts1 = (row) => {
        toggleGroupContactListView1()
        setgrouppInfo(row)
    }

    const [addContactList, setAddContactlist] = useState([
        {
            email: '',
            msisdn: '',
            device_id: ''
        }
    ])
    
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [AllInputIsNotGiven, setAllInputIsNotGiven] = useState(false)
    const [numberIsInvalid, setNumberIsInvalid] = useState(false)
    const [resetData, setReset] = useState(true)
    const [groupList, setGroupList] = useState([])
    const [groupInfo, setgroupInfo] = useState({})
    const [pendingGroupList, setPendingGroupList] = useState([])
    const [myPendingGroupList, setMyPendingGroupList] = useState([])
    const [refreshLoading, setrefreshLoading] = useState(false)

    const [btnTypeSubmit, setbtnTypeSubmit] = useState(true)
    const [showAddContactModal, setShowAddContactModal] = useState(false)
    const toggleAddContactModal = () => {
        setShowAddContactModal(!showAddContactModal)
    }
    const [isMain, setisMain] = useState(false)

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [csvloading, setcsvloading] = useState(false)
    const [isDetailsView, setIsDetailsView] = useState(false)
    const toggleDetailsView = () => {
        setIsDetailsView(!isDetailsView)
    }
    const [isGroupContactListView, setIsGroupContactListView] = useState(false)
    const toggleGroupContactListView = () => {
        setIsGroupContactListView(!isGroupContactListView)
    }
    const [downloadingItem, setdownloadingItem] = useState({})


    const loadGroupList = () => {
        useJwt.getCentralGroup().then(res => {
            // console.log(res)
            // const allGroup = []
            // for (const q of res.data.payload) {
            //     if (q.is_approved === true || q.is_rejected === true) {
            //         allGroup.push(q)
            //     }
            // }
            setGroupList(res.data.payload)
            setTableDataLoading(false)
            setrefreshLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err.response)
            setTableDataLoading(false)
            setrefreshLoading(false)
        })
    }
    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        loadGroupList()
        useJwt.getPendingCentralGroup().then(res => {
            console.log(res)
            const pending = []
            const myPending = []
            for (const item of res.data.payload) {
                if (parseInt(item.created_by) === user.id) {
                    myPending.push(item)
                } else {
                    pending.push(item)
                }
            }
            setPendingGroupList(pending)
            setMyPendingGroupList(myPending)
        }).catch(err => {
            Error(err)
            console.log(err.response)
        })

    }, [resetData])

    const refreshList = () => {
        setrefreshLoading(true)
        loadGroupList()
    }

    const handleDownloadLinkPoPup = (link) => {
        return MySwal.fire({
            title: `Please click below link`,
            html: `<a href="${link}" target="_blank"> ${link}</a>`,
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: false,
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: false,
            buttonsStyling: false
        })

}

    const contactCSVDownload = (group_id) => {
        if (csvloading) {

            Error({response: { status : 404, data: { message: 'One file is preparing to download, Please wait some time'} }})
            return 0
        }
        setcsvloading(true)
        setdownloadingItem(group_id)
        useJwt2.contactCSVDownload({ group_id: (+group_id) }).then(res => {
            // window.open(res.data.payload.image_url, "_blank")
            handleDownloadLinkPoPup(res.data.payload.image_url)
            setcsvloading(false)
            setdownloadingItem()
        }).catch(err => {
            setcsvloading(false)
            setdownloadingItem()
            console.log(err.response)
            Error(err)
        })
    }
    const viewContacts = (row) => {
        toggleGroupContactListView()
        setgroupInfo(row)
    }
    const ViewDetails = (row, main) => {
        toggleDetailsView()
        setgroupInfo(row)
        setisMain(main)
    }

    const handlePoPupActions = (id, status, message) => {
                return MySwal.fire({
                    title: message,
                    text: `By deleting, the group will delete along with the campaign where it is tagged!`,
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: true,
                    confirmButtonText: 'Continue',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-danger ml-1'
                    },
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        const data = {
                            group_id: id,
                            action_id: status,
                            reject_msg: ""
                        }
                        return useJwt2.deleteCentralGroupV3(data).then(res => {
                            Success(res)
                            setReset(!resetData)
                            // setGroupList(groupList.filter(c => c.id !== id))
                            // console.log(res)
                        }).catch(err => {
                            // console.log(err.response)
                            Error(err)
                        })
                    },
                    buttonsStyling: false,
                    allowOutsideClick: () => !Swal.isLoading()
                }).then(function (result) {
                    if (result.isConfirmed) {
                    }
                })

    }
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = groupList.filter(item => {
                const startsWith = item.group_name.toLowerCase().startsWith(value.toLowerCase()) 
                const includes = item.group_name.toLowerCase().includes(value.toLowerCase()) 
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
    const column = [
        {
            name: 'SL',
            width: '50px',
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Group Name',
            minWidth: '250px',
            sortable: true,
            selector: 'group_name',
            wrap: true
        },
        // {
        //     name: 'Users',
        //     minWidth: '100px',
        //     sortable: true,
        //     selector: row => {
        //         return row.type === 4 ? 'All' : row.type === 1 ? 'Customer' : row.type === 2 ? 'Agent' : row.type === 3 ? 'Merchant' : '---'
        //     }
        // },
        {
            name: 'Group Creation Type',
            minWidth: '150px',
            sortable: true,
            selector: (item) => (item.creation_type === 1 ? <Badge color="light-primary" pill className='px-1'>Bulk-Upload</Badge> : <Badge color="light-success" pill className='px-1'>Group-Profiling</Badge>),
            wrap: true
        },
        {
            name: 'Member Count',
            minWidth: '100px',
            sortable: true,
            selector: 'group_member_count',
            cell: row => {
                if (row['is_loading']) {
                    return <Fragment>{row.group_member_count || 0}&nbsp;<Spinner type='grow' size='sm' /> </Fragment>
                } else {
                    return row.group_member_count || 0
                }     
            }
        },
        {
            name: 'Sync-Type',
            minWidth: '100px',
            selector: row => (row.creation_type === 2 ? row.sync_type : '--'),
            wrap: true
        },
        {
            name: 'Created At',
            minWidth: '170px',
            sortable: true,
            wrap: true,
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: 'created_at',
            cell: (item) => {
                return item.created_at ? formatReadableDate(item.created_at) : null
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            cell: row => {

                if (row['is_loading']) {
                    return null
                } else {

                    return <Fragment>
                            <UncontrolledDropdown>
                            <DropdownToggle tag='div' className='btn btn-sm'>
                            <MoreVertical size={14} className='cursor-pointer' />
                            </DropdownToggle>
                            <DropdownMenu right>
    
                            <DropdownItem
                                className='w-100'
                                onClick={() => ViewDetails(row, true)}
                            >
                                <Eye size={14} className='mr-50' color='teal'/>
                                <span className='align-middle'>Details</span>
                            </DropdownItem>

                            <DropdownItem
                                className='w-100'
                                onClick={() => viewContacts(row)}
                            >
                                <FileText size={14} className='mr-50' color='teal'/>
                                <span className='align-middle'>Contact List</span>
                            </DropdownItem>

                            <DropdownItem
                                className='w-100'
                                onClick={() => {
                                    setShowAddContactModal(true)
                                    setgroupInfo(row)
                                }} 
                            >
                                <Add size={14} className='mr-50' color='teal'/>
                                <span className='align-middle'>Add Contact</span>
                            </DropdownItem>

                            {
                                csvloading && downloadingItem === row['id'] ? null : <DropdownItem 
                                className='w-100' 
                                onClick={() => contactCSVDownload(row['id'])}
                            >
                                <Download size={14} className='mr-50' />
                                <span className='align-middle'>Download</span>
                            </DropdownItem>
                            }

                              {(row.id !== '1' && row.id !== '2' && row.id !== '3') &&   <DropdownItem className='w-100' 
                                        onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?') }
                                    >
                                    <Trash2 size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>}

                            </DropdownMenu>
                           </UncontrolledDropdown> 

                           {
                                csvloading && downloadingItem === row['id'] ? <Spinner size='sm' /> : null
                            }
                    </Fragment>

                   
                }
            }
        }
    ]

    // ** Converts table to CSV
    function convertArrayOfObjectsToCSV(array) {
        let result

        const columnDelimiter = ','
        const lineDelimiter = '\n'
        const keys = [...Object.keys(array[0])]
        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        array.forEach(item => {
            let ctr = 0
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter

                result += item[key]

                ctr++
            })
            result += lineDelimiter
        })

        return result
    }
    // ** Downloads CSV
    function downloadCSV(array) {
        const link = document.createElement('a')
        let csv = convertArrayOfObjectsToCSV(array)
        if (csv === null) return

        const filename = 'export.csv'

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`
        }

        link.setAttribute('href', encodeURI(csv))
        link.setAttribute('download', filename)
        link.click()
    }
    // ** Export XL file
    const exportToXL = (arr) => {
        const ws = XLSX.utils.json_to_sheet(arr)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('Group List', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'ID', dataKey: 'id' }, { header: 'Group Name', dataKey: 'group_name' }, { header: 'Group Type', dataKey: 'type' },
                { header: 'Is Default', dataKey: 'isDefault' }, { header: 'Created at', dataKey: 'created_at' }
            ],
            // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }
    const [activeTab, setActiveTab] = useState('1')

    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)
    
    const onSubmit = async (e) => {
        e.preventDefault()
        if (!AllInputIsNotGiven || !numberIsInvalid) {
            return 0
        }
        setTableDataLoading(true)
        await useJwt2.inputInGroup({group_id: groupInfo.id, entries: [...addContactList]}).then(res => {
            // Success(res)
            toast.success(res.data.payload.msg)
            setReset(!resetData)
            setShowAddContactModal(false)
            console.log(res)
            setAddContactlist([
                {
                    email: '',
                    msisdn: '',
                    device_id: ''
                }
            ])
            setTableDataLoading(false)
        }).catch(err => {
            setTableDataLoading(false)
            console.log(err)
            Error(err)
        })
    }

    const chkRangeInputValues = () => {
        for (let i = 0; i < addContactList.length; i++) {
            const inputValues = Object.values(addContactList[i])
            // if (AllInputIsNotGiven) {
            //     return
            // }
            if (!inputValues.includes('')) {
                setAllInputIsNotGiven(true)
                // return
            } else { setAllInputIsNotGiven(false) }
            if (validateEmail(addContactList[i].email)) {
                setAllInputIsNotGiven(true)
                // return
            } else { setAllInputIsNotGiven(false) }

            if (addContactList[i].msisdn.startsWith('0')) {
                console.log(addContactList[i].msisdn.length)
                if (addContactList[i].msisdn.length === 10) {
                    setNumberIsInvalid(true)
                    // return
                } else { setNumberIsInvalid(false) }
            } else if (addContactList[i].msisdn.startsWith('1')) {
                if (addContactList[i].msisdn.length === 9) {
                    setNumberIsInvalid(true)
                    // return
                } else { setNumberIsInvalid(false) }
            } else if (addContactList[i].msisdn.startsWith('8')) {
                if (addContactList[i].msisdn.length === 12) {
                    setNumberIsInvalid(true)
                    // return
                } else { setNumberIsInvalid(false) }
            } else { setNumberIsInvalid(false) }
        }
        setbtnTypeSubmit(AllInputIsNotGiven)
    }

    const validatePhone = (phone) => {
        if (phone.startsWith('0')) {
            console.log(phone.length)
            if (phone.length === 11) {
                return true
                // return
            } else { return false }
        } else if (phone.startsWith('1')) {
            if (phone.length === 10) {
                return true
                // return
            } else { return false }
        } else if (phone.startsWith('8')) {
            if (phone.length === 13) {
                return true
                // return
            } else { return false }
        } else { return false }
    }

    return (
        <> 
      {  
        isGroupContactListView1 ? <PendingGroupContactListView 
            groupInfo={grouppInfo} 
            toggleGroupContactListView={toggleGroupContactListView1} 
        /> : isDetailsView ? <DetailsView 
            userInput={groupInfo} 
            toggleDetailsView={toggleDetailsView}
            isMain={isMain}
            /> :  isGroupContactListView ? <GroupContactListView 
                groupInfo={groupInfo} 
                toggleGroupContactListView={toggleGroupContactListView}

            /> : <Card>
            <CardHeader>
            
                <Nav pills>
                    <NavItem>
                        <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                            <span className='align-middle d-none d-sm-block'>Groups</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                            <span className='align-middle d-none d-sm-block'>My Pending Groups</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                            <span className='align-middle d-none d-sm-block'>Pending Approval(s)</span>
                        </NavLink>
                    </NavItem>
                </Nav>
            </CardHeader>
            <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Groups &nbsp;&nbsp; 
                            {
                                refreshLoading ? <Spinner color='secondary' /> : <RefreshCw size="20" style={{cursor: 'pointer'}} onClick={() => refreshList()}/>

                            }
                            </CardTitle>
                            
                            <div className='d-flex mt-md-0 mt-1'>
                                <Button.Ripple className='ml-2 mr-1' color='primary' tag={Link} to='/createCentralGroup' >
                                    <div className='d-flex align-items-center'>
                                        <Plus size={17} style={{ marginRight: '5px' }} />
                                        <span >Create Group</span>
                                    </div>
                                </Button.Ripple>
                                {/* <UncontrolledButtonDropdown>
                                    <DropdownToggle color='secondary' caret outline>
                                        <Share size={15} />
                                        <span className='align-middle ml-50'>Export</span>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem className='w-100' onClick={() => downloadCSV(groupList)}>
                                            <FileText size={15} />
                                            <span className='align-middle ml-50'>CSV</span>
                                        </DropdownItem>
                                        <DropdownItem className='w-100' onClick={() => exportToXL(groupList)}>
                                            <Grid size={15} />
                                            <span className='align-middle ml-50'>Excel</span>
                                        </DropdownItem>
                                        <DropdownItem className='w-100' onClick={() => exportPDF(groupList)}>
                                            <File size={15} />
                                            <span className='align-middle ml-50'>
                                                PDF
                                            </span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown> */}
                            </div>
                        </CardHeader>
                        <Row className='justify-content-end mx-0'>
                            <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
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
                        <CommonDataTable column={column} TableData={searchValue.length ? filteredData : groupList} TableDataLoading={TableDataLoading} />
                    </Card>
                </TabPane>
                <TabPane tabId='2'>
                    <MyPendingGroupList  myPendingGroupList={myPendingGroupList} ViewDetails={ViewDetails} toggleDetailsView={toggleDetailsView} setgroupInfo={setgroupInfo} viewContacts={viewContacts1}/>
                </TabPane>
                <TabPane tabId='3'>
                    <PendingGroupList pendingGroupList={pendingGroupList} ViewDetails={ViewDetails} setPendingGroupList={setPendingGroupList} setReset={setReset} resetData={resetData} toggleDetailsView={toggleDetailsView} setgroupInfo={setgroupInfo} viewContacts={viewContacts1}/>
                </TabPane>
            </TabContent>
        </Card>}

        {/* group contact add modal */}
        <Modal isOpen={showAddContactModal} toggle={toggleAddContactModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={toggleAddContactModal}></ModalHeader>
            <ModalBody>
                <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <h4 className='m-1'>Add Contact</h4>
                    <Row className='match-height'>
                        <Col sm='12'>
                                <Card>
                                        <CardBody>
                                            <Table bordered responsive>
                                                <thead style={{ background: 'white' }}>
                                                    <tr>
                                                        <th style={{ background: 'white' }}>Email<span style={{ color: 'red' }}>*</span></th>
                                                        <th style={{ background: 'white' }}>Phone<span style={{ color: 'red' }}>*</span></th>
                                                        <th style={{ background: 'white' }}>Device Id</th>
                                                        <th style={{ background: 'white' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        addContactList.map((row, index) => <tr key={index}>
                                                            <td>
                                                                <Input
                                                                    type="text"
                                                                    name="email"
                                                                    id={`skustartrange${index}`}
                                                                    value={row.email}
                                                                    onChange={e => {
                                                                        chkRangeInputValues()
                                                                        const newRangeArray = [...addContactList]
                                                                        newRangeArray[index] = {
                                                                            ...newRangeArray[index],
                                                                            email: e.target.value
                                                                        }
                                                                        setAddContactlist(newRangeArray)
                                                                    }}
                                                                    required
                                                                    placeholder="john@mail.com"
                                                                />
                                                                <span>{(validateEmail(addContactList[index].email) && addContactList[index].email) ? "" : (!validateEmail(addContactList[index].email) && addContactList[index].email) ? <p style={{color:'red', marginBottom:'0'}}>Email is invalid!</p> : null}</span>
                                                            </td>
                                                            <td>
                                                                <Input
                                                                    type="number"
                                                                    name="skuendrange"
                                                                    id={`skuendrange${index}`}
                                                                    value={row.msisdn}
                                                                    onChange={e => {
                                                                        chkRangeInputValues()
                                                                        const newRangeArray = [...addContactList]
                                                                        newRangeArray[index] = {
                                                                            ...newRangeArray[index],
                                                                            msisdn: e.target.value
                                                                        }
                                                                        setAddContactlist(newRangeArray)
                                                                    }}
                                                                    required
                                                                    placeholder="8801XXXXXXXXX"
                                                                />
                                                                 <span>{(!validatePhone(addContactList[index].msisdn) && addContactList[index].msisdn) ? <p style={{color:'red', marginBottom:'0'}}>Number is invalid!</p> : null}</span>
                                                            </td>
                                                            <td>
                                                                <Input
                                                                    type="text"
                                                                    name="skupoints"
                                                                    id={`skupoints${index}`}
                                                                    value={row.device_id}
                                                                    onChange={e => {
                                                                        chkRangeInputValues()
                                                                        const newRangeArray = [...addContactList]
                                                                        newRangeArray[index] = {
                                                                            ...newRangeArray[index],
                                                                            device_id: e.target.value
                                                                        }
                                                                        setAddContactlist(newRangeArray)
                                                                    }}
                                                                    placeholder="111100000"
                                                                />
                                                            </td>
                                                            <td>
                                                                <Button.Ripple size='sm' color='info' type= 'button' onClick={e => {
                                                                    // e.preventDefault()
                                                                    // let AllInputIsNotGiven = true
                                                                    // for (let i = 0; i < addContactList.length; i++) {
                                                                    //     const inputValues = Object.values(addContactList[i])
                                                                    //     AllInputIsNotGiven = inputValues.includes('')
                                                                    //     if (AllInputIsNotGiven) {
                                                                    //         return
                                                                    //     }
                                                                    // }
                                                                    // console.log(AllInputIsNotGiven)
                                                                    if (addContactList.length < 10 && AllInputIsNotGiven && numberIsInvalid) {
                                                                        setAddContactlist([
                                                                            ...addContactList, 
                                                                            {
                                                                                email: '',
                                                                                msisdn: '',
                                                                                device_id: ''
                                                                            }
                                                                        ])
                                                                    }
                                                                    setbtnTypeSubmit(true)
                                                                }}>
                                                                    <Plus size={15} />
                                                                </Button.Ripple>&nbsp;&nbsp;
                                                                {addContactList.length > 1 && <Button.Ripple size='sm' color='danger' onClick={e => {
                                                                    // e.preventDefault()
                                                                    setAddContactlist(addContactList.filter((r, i) => i !== index))
                                                                }}>
                                                                    <Minus size={15} />
                                                                </Button.Ripple>}
                                                            </td>
                                                        </tr>)
                                                    }
                                                </tbody>
                                            </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Col sm="12" className='text-right'>
                        {
                            TableDataLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Save</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </ModalBody>
        </Modal>
        </>
    )
}

export default GroupList