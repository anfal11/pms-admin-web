// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'

import { Link } from 'react-router-dom'
// ** Table Data & Columns
//import { data } from '../data'

// ** Add New Modal Component
import AddNewModal from './AddNewModal'
import Select from 'react-select'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
  ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
  Edit, Archive, Trash, Search, Eye
} from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Label,
  Row,
  Col,
  Badge,
  Form,
  FormGroup,
  UncontrolledDropdown,
  Spinner,
  CardBody,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'

import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import QRCode from "react-qr-code"
import '../cashier/cashierStyles/payment.css'

const MySwal = withReactContent(Swal)
// ** Vars
//const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

const status = {
  1: { title: 'Active', color: 'light-success ' },
  6: { title: 'Ready', color: 'light-primary' },
  7: { title: 'Processed', color: 'light-danger' },
  8: { title: 'Checked', color: 'light-secondary' },
  9: { title: 'Paid', color: 'light-info' },
  2: { title: 'Booked', color: 'light-info' },
  10: { title: 'Scanning', color: 'light-info' },
  3: { title: 'Collected', color: 'light-info' }
}

const statusoptions = [
  { value: 1, label: 'Active' },
  { value: 6, label: 'Ready' },
  { value: 7, label: 'Processed' },
  { value: 8, label: 'Checked' },
  { value: 9, label: 'Paid' }
]


const DataTableWithButtons = () => {
  // ** States
  const [isloading, setisloading] = useState(true)
  const [loading, setloading] = useState(false)
  const [loading2, setloading2] = useState(false)
  const [depotloading, setdepotloading] = useState(true)
  const [modal, setModal] = useState(false)
  const [data, setdata] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [primarydepot, setprimarydepot] = useState([])
  const [counter, setcounter] = useState({
    total: 0,
    ready: 0,
    inused: 0
  })
  const [userinput, setuserinput] = useState({
    trollyid: null,
    primarydepot: null,
    status: 0
  })
  const [error, seterror] = useState({
    trollyid: '',
    primarydepot: '',
    status: ''
  })
  const [editerror, setediterror] = useState({
    trollyid: '',
    primarydepot: '',
    macid: ''
  })
  const [singletrollydetails, setsingletrollydetails] = useState({})
  const [editdepotdefaultvalue, seteditdepotdefaultvalue] = useState({})

  const [formModal, setFormModal] = useState(false)
  const [formModal2, setFormModal2] = useState(false)
  const [viewinfo, setviewinfo] = useState({
    qurcode:"",
    trolleyid:""
  })

  const [searchdata, setsearchdata] = useState([])

  const openViewModal = (trolleyid, qurcode) => { 
    setviewinfo({
      qurcode,
      trolleyid
    })
     setFormModal2(!formModal2)
  }

  const openEditModal = (trolleyid) => {
    let singletrollyinfo = {}, depotdefaultval = {}
    setediterror({
      trollyid: '',
      primarydepot: '',
      macid: ''
    })
    setloading2(false)
    data.every(item => {
      if (item.trolleyid === trolleyid) {
        singletrollyinfo = {
          trolleyid,
          macid: item.macid,
          id: item.id,
          storeid: item.storeid
        }
        primarydepot.every(item2 => {
          if (item2.value === item.storeid) {
            depotdefaultval = { value: item2.value, label: item2.label }
            return false
          }
          return true
        })
        return false
      }
      return true
    })
    singletrollyinfo.depotdefaultval = depotdefaultval
    setsingletrollydetails(singletrollyinfo)
    setFormModal(!formModal)
  }
  const removedeleteitem = (trollyid) => {
    const updatedData = data.filter(item => {
      if (item.trolleyid === trollyid) {
        return false
      } else {
        return true
      }
    })

    setdata(updatedData)
  }
  const handleConfirmText = (trollyid) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false,
      preConfirm: () => {
       return useJwt.trollyDelete({ trolleyid: trollyid }).then(res => {

          return res

        }).catch(error => {
          console.log(error.response)
          Error(error)
         // Swal.showValidationMessage(`Request failed`)
          return false
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {

      if (result.isConfirmed) {
        removedeleteitem(trollyid)
        MySwal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The trolley has been deleted.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      } 

    })
  }

  // ** Table Common Column
  const columns = [

    {
      name: 'Trolley Barcode',
      selector: 'trolleyid',
      minWidth: '100px'
    },
    {
      name: 'Mac ID',
      selector: 'macid',
      minWidth: '100px'
    },
    {
      name: 'Depot Name',
      minWidth: '150px',
      cell: (item) => {
        return item.storeinfo ? item.storeinfo.storename : ''
      }
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      minWidth: '150px',
      cell: (row) => {
        return (
          <Badge color={status[row.status].color} pill>
            {status[row.status].title}
          </Badge>
        )
      }
    },
    {
      name: 'Actions',
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className='d-flex'>
            <Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => openViewModal(row.trolleyid, row.qurcode)}/>&nbsp;&nbsp;
            <Edit size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => openEditModal(row.trolleyid)} /> &nbsp;&nbsp;
            <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={(e) => handleConfirmText(row.trolleyid)} />
          </div>
        )
      }
    }
  ]

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  useEffect(async () => {

    //store list..
    useJwt.storeList().then(res => {
      const payload1 = res.data.payload
      const data1 = payload1.map(item => {
        return { value: item.storeid, label: item.storename }
      })
      setprimarydepot(data1)
      setdepotloading(false)

    }).catch(err => {
      setdepotloading(false)
      console.log(err.response)
      Error(err)
    })

    //trolly list..
    useJwt.trollyList().then(res => {
      const data2 = res.data.payload
      // console.log(data2)
      setdata(data2)
      setisloading(false)

      let total = 0, ready = 0, inused = 0
      data2.forEach(item => {
           total++
           if (item.status === 6) {
             ready++
           } else {
             inused++
           }
      })

      setcounter({total, ready, inused})

    }).catch(err => {
      setisloading(false)
      console.log(err.response)
      Error(err)
    })
  }, [])

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    const status = {
      1: { title: 'Current', color: 'light-primary' },
      2: { title: 'Professional', color: 'light-success' },
      3: { title: 'Rejected', color: 'light-danger' },
      4: { title: 'Resigned', color: 'light-warning' },
      5: { title: 'Applied', color: 'light-info' }
    }

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith =
          item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.post.toLowerCase().startsWith(value.toLowerCase()) ||
          item.email.toLowerCase().startsWith(value.toLowerCase()) ||
          item.age.toLowerCase().startsWith(value.toLowerCase()) ||
          item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
          item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.full_name.toLowerCase().includes(value.toLowerCase()) ||
          item.post.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.age.toLowerCase().includes(value.toLowerCase()) ||
          item.salary.toLowerCase().includes(value.toLowerCase()) ||
          item.start_date.toLowerCase().includes(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().includes(value.toLowerCase())

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
      pageCount={searchValue.length ? filteredData.length / 10 : data.length / 10 || 1}
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

  const onchange = (e) => {
    setuserinput({ ...userinput, [e.target.name]: e.target.value })
  }
  const onchangeedit = (e) => {
    setsingletrollydetails({ ...singletrollydetails, [e.target.name]: e.target.value })
  }
  const onchangeprimarydepot = (option, { action }) => {
    if (action === 'clear') {
      setuserinput({ ...userinput, primarydepot: null })
    } else {
      seterror({...error, primarydepot: ''})
      setuserinput({ ...userinput, primarydepot: option.value })
    }

  }
  const onchangeprimarydepot2 = (option, { action }) => {
    if (action === 'clear') {
      setsingletrollydetails({ ...singletrollydetails, depotdefaultval: null })
    } else {
      setsingletrollydetails({ ...singletrollydetails, depotdefaultval: { value: option.value, label: option.label } })
    }

  }
  const onchangestatus = (option, { action }) => {
    if (action === 'clear') {
      setuserinput({ ...userinput, status: 0 })
    } else {
      setuserinput({ ...userinput, status: option.value })
    }

  }

  const oneditsubmit = (e) => {
    e.preventDefault()
    setediterror({
      trollyid: '',
      primarydepot: '',
      macid: ''
    })

    const { id, trolleyid, macid, storeid, depotdefaultval } = singletrollydetails
    let iserror = false
    if (!trolleyid) {
      setediterror({ trollyid: 'trolley barcode required' })
      iserror = true
    }
    if (!macid) {
      setediterror({ ...error, macid: 'macid required' })
      iserror = true
    }
    if (!depotdefaultval) {
      setediterror({ ...error, primarydepot: 'primarydepot required' })
      iserror = true
    }

    if (iserror) {
      return 0
    }
    setloading2(true)
    useJwt.trollyEdit({ id, trolleyid, storeid: depotdefaultval.value, macid }).then(res => {
      console.log(res)
      setFormModal(false)
      Success(res)
      setloading2(false)
      const updatedata = data.map(item => {
        if (item.id === id) {
          let storename = ''
          primarydepot.map(item => {
            if (item.value === depotdefaultval.value) {
              storename = item.label
            }
          })
          return {
            ...item,
            macid,
            storeid: depotdefaultval.value,
            trolleyid,
            storeinfo: {
              storename
            }
          }
        } else {
          return item
        }
      })

      setdata(updatedata)

    }).catch(err => {
      setloading2(false)
      console.log(err.response)
      Error(err)
    })

  }
  const onsubmit = (e) => {
    e.preventDefault()
    seterror({
      trollyid: '',
      primarydepot: '',
      status: ''
    })
    const { trollyid, primarydepot: primarydepot2, macid } = userinput
    let iserror = false
    if (!trollyid) {
      seterror({ trollyid: 'trolley barcode required' })
      iserror = true
    }
    if (!primarydepot2) {
      seterror({ ...error, primarydepot: 'Please select Depot' })
      iserror = true
    }

    if (iserror) {
      return 0
    }

    setloading(true)
    useJwt.trollyAdd({ trolleyid: trollyid, storeid: primarydepot2, macid }).then(res => {
      Success(res)
      setloading(false)
      setuserinput({ ...userinput, trollyid: null, macid: null })
      let storename = ''
      primarydepot.map(item => {
        if (item.value === primarydepot2) {
          storename = item.label
        }
      })
      const createData = {
        macid,
        status: 6,
        storeid: primarydepot2,
        trolleyid: trollyid,
        storeinfo: {
          storename
        }
      }
      setdata([createData, ...data])

    }).catch(err => {
      setloading(false)
      console.log(err.response)
      Error(err)
    })
  }


  const oninputsearchchange = (e) => {
     const inputsearch = e.target.value
    const updatedData = data.filter(item => {
      const startsWith =
        item.trolleyid.startsWith(inputsearch) ||
        item.macid.startsWith(inputsearch) ||
        item.storeinfo.storename.toLowerCase().startsWith(inputsearch.toLowerCase())

      const includes =
        item.trolleyid.includes(inputsearch) ||
        item.macid.includes(inputsearch) ||
        item.storeinfo.storename.toLowerCase().includes(inputsearch.toLowerCase()) 

      if (startsWith) {
        return startsWith
      } else if (!startsWith && includes) {
        return includes
      } else return null
    })

    setSearchValue(inputsearch)
    setsearchdata(updatedData)

  }

  return (
    <Fragment>

       <Card>

                <CardBody style={{ paddingTop: '15px' }}>
                    <div className="d-flex flex-wrap">
                        <div className="payment-card m-2 pt-1">
                            <p style={{fontSize:'30px'}}>{counter['total'] || 0}</p>
                            <p>Total</p>
                        </div>
                        <div className="payment-card m-2 pt-1">
                            <p style={{fontSize:'30px'}}>{counter['ready'] || 0}</p>
                            <p>Ready</p>
                        </div>
                        <div className="payment-card m-2 pt-1">
                            <p style={{fontSize:'30px'}}>{counter['inused'] || 0}</p>
                            <p>In-Used</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Add New Trolley</CardTitle>
        </CardHeader>
        <CardBody style={{ paddingTop: '15px' }}>
          <Form className="row" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
            <Col sm="3" >

              <FormGroup>
                <Label for="search-input">Trolley Barcode <span style={{ color: 'red' }}>*</span></Label>
                <Input type="text" name="trollyid"
                  id='trollyid' onChange={onchange} required
                  placeholder="Trolley Barcode"
                  value={userinput.trollyid || ''}
                />
              </FormGroup>

            </Col>

            <Col sm="3" >

              <FormGroup>
                <Label for="search-input">Mac ID <span style={{ color: 'red' }}>*</span></Label>
                <Input type="text" name="macid"
                  id='macid' onChange={onchange} required
                  placeholder="Mac ID"
                  value={userinput.macid || ''}
                />
              </FormGroup>

            </Col>

            <Col sm="3" >

              <FormGroup>
                <Label for="exampleSelect3">Primary Depot <span style={{ color: 'red' }}>*</span></Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  name="primarydepot"
                  onChange={onchangeprimarydepot}
                  options={primarydepot}
                  isClearable
                  isLoading={depotloading}
                />
                <span style={{ color: 'red', fontSize: '11px' }}>{error.primarydepot}</span>
              </FormGroup>

            </Col>

            {/*<Col sm="2" >

           <FormGroup>
              <Label for="exampleSelect5">Status <span style={{color:'red'}}>*</span></Label>
              <Select
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        name="status"
                        required
                        onChange={onchangestatus}
                        options={statusoptions}
                        isClearable
                        />
            <span style={{color:'red', fontSize:'11px'}}>{error.status}</span>

            </FormGroup>

            </Col>*/}

            <Col sm="3" >
              {
                loading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                  <Spinner color='white' size='sm' />
                  <span className='ml-50'>Loading...</span>
                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                  <Plus size={15} />
                  <span className='align-middle ml-50'>Add New</span>
                </Button.Ripple>
              }
            </Col>
          </Form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className='border-bottom' style={{display:'inline'}}>

        <Row >
        <Col sm="8" >
          <CardTitle tag='h4'>Trolley List</CardTitle>
         </Col>
          <Col sm="4" >
              
                <Input type="text" name="searchinput"
                  id='search-input2' onChange={oninputsearchchange} 
                  placeholder="Search by Mac ID or Barcode or Depot"
                 
                />
            </Col>
            </Row>
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
          data={searchValue.length ? searchdata : data}
          progressPending={isloading}
          progressComponent={<Spinner color='primary' />}
          responsive={true}
        /*selectableRowsComponent={BootstrapCheckbox}*/
        />
      </Card>
      <AddNewModal open={modal} handleModal={handleModal} />

      <div className='demo-inline-spacing editrolly' >
        <div>
          <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => setFormModal(!formModal)}>Update Form</ModalHeader>
            <ModalBody>
              <FormGroup >
                <Label for='barcodes'>Trolley Barcode <span style={{ color: 'red' }}>*</span>  <span style={{ color: 'red', fontSize: '11px' }}>{editerror.trollyid}</span></Label>
                <Input type='text' id='barcodes' name="trolleyid"
                  placeholder='Trolley Barcode' value={singletrollydetails['trolleyid'] || ''}
                  onChange={onchangeedit} required
                />
              </FormGroup>
              <FormGroup >
                <Label for='macids'>Mac ID <span style={{ color: 'red' }}>*</span>  <span style={{ color: 'red', fontSize: '11px' }}>{editerror.macid}</span></Label>
                <Input type='text' id='macids' placeholder='Mac ID' name="macid"
                  value={singletrollydetails['macid'] || ''}
                  onChange={onchangeedit} required
                />
              </FormGroup>
              <FormGroup >
                <Label for="exampleSelect3">Primary Depot <span style={{ color: 'red' }}>*</span>  <span style={{ color: 'red', fontSize: '11px' }}>{editerror.primarydepot}</span></Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  name="primarydepot2"
                  value={singletrollydetails.depotdefaultval}
                  onChange={onchangeprimarydepot2}
                  options={primarydepot}
                  isClearable
                  isLoading={depotloading}
                />
              </FormGroup>

            </ModalBody>
            <ModalFooter>
              {
                loading2 ? <Fragment>
                  <Button color='primary' disabled>
                    <Spinner color='white' size='sm' />
                    <span className='ml-50'>Loading...</span>
                  </Button>{' '}
                </Fragment> : <Fragment>
                  <Button color='primary' onClick={(e) => oneditsubmit(e)}>
                    Update
            </Button>{' '}
                </Fragment>
              }
            </ModalFooter>
          </Modal>
        </div>
      </div>

      <div className='demo-inline-spacing viewtrollyQRCode' >
        <div>
          <Modal isOpen={formModal2} toggle={() => setFormModal2(!formModal2)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => setFormModal2(!formModal2)}>Qrcode</ModalHeader>
            <ModalBody>
              
            <Col sm={12} md={{ size: 3, order: 2, offset: 2 }}>
                  <QRCode value={viewinfo.qurcode} />
                  <span>{viewinfo.trolleyid}</span>
                </Col>

            </ModalBody>

          </Modal>
        </div>
      </div>


    </Fragment>
  )
}

export default DataTableWithButtons
