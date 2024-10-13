// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
// ** Custom Components
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { Link, useHistory } from 'react-router-dom'
import {
  ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
  Edit, Archive, Trash, Search, Eye
} from 'react-feather'
import { Image } from 'antd'
import 'antd/dist/antd.css'

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
  Badge,
  Label,
  Row,
  CardBody,
  Form,
  FormGroup,
  CustomInput,
  Col,
  Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ImageUpload from './ImageUpload'

const MySwal = withReactContent(Swal)
// ** Vars
const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

const status = {
  0: { title: 'Inactive', color: 'light-primary ' },
  1: { title: 'Active', color: 'light-success ' },
  6: { title: 'Ready', color: 'light-primary' },
  7: { title: 'Processed', color: 'light-danger' },
  8: { title: 'Checked', color: 'light-secondary' },
  9: { title: 'Paid', color: 'light-info' },
  2: { title: 'Booked', color: 'light-info' },
  10: { title: 'Scanning', color: 'light-info' }
}

const statusoptions = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Inactive' }
]

const DataTableWithButtons = () => {
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [data, setdata] = useState([])
  const [isloading, setisloading] = useState(true)
  const [loading, setloading] = useState(false)
  const [userinput, setuserinput] = useState({})
  const [error, seterror] = useState('')
  const [imageclear, setimageclear] = useState(false)
  const [error2, seterror2] = useState({})
  const [singletrollydetails, setsingletrollydetails] = useState({})
  const [loading2, setloading2] = useState(false)
  const [formModal, setFormModal] = useState(false)
  const [editerror, setediterror] = useState({})
  const removedeleteitem = (id) => {
    const updatedData = data.filter(item => {
      if (item.id === id) {
        return false
      } else {
        return true
      }
    })

    setdata(updatedData)
  }

  const handleConfirmText = (id) => {
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
        return useJwt.categoryDelete({ id }).then(res => {

          return res

        }).catch(error => {
          console.log(err.response)
          Error(err)
          return false
         // Swal.showValidationMessage(`Request failed`)
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {

      if (result.isConfirmed) {
        removedeleteitem(id)
        MySwal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The Category has been deleted.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }

    })
  }

  const statusoptions2 = (option, { action }) => {
  
    setsingletrollydetails({ ...singletrollydetails, defaultstatus: { value: option.value, label: option.label } })
  }
  const openEditModal = (id) => {
    let singletrollyinfo = {}, defaultstatus = {}
    seterror2({})
    setuserinput({...userinput, img:'', imageUrl:null })
    setimageclear(true)
    setloading2(false)
    data.every(item => {
        if (item.id === id) {
          singletrollyinfo = {
            img : item.categoryimage,
            status : item.status,
            id : item.id,
            categoryname : item.categoryname
          }
          statusoptions.every(item2 => {
            if (item2.value === item.status) {
              defaultstatus = { value: item2.value, label: item2.label }
              return false
            }
            return true
          })
          return false
        }
        return true
    })
    singletrollyinfo.defaultstatus = defaultstatus
    setimageclear(false)
    console.log(singletrollyinfo)
    setsingletrollydetails(singletrollyinfo)
    setFormModal(!formModal)
  }
  // ** Table Common Column
  const columns = [

    {
      name: 'Category Image',
      minWidth: '250px',
      cell: row => (
        <div className='d-flex align-items-center'>
        <Image
            // width={100}
            style={{height:'80px', width:'80px'}}
            src={row.categoryimage}
          />
          {/*<Avatar img={row.categoryimage} />*/}
        </div>
      )
    },
    {
      name: 'Category Name',
      selector: 'categoryname',
      sortable: true,
      minWidth: '100px'
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
            <Edit size={15} color='#2bc871' style={{cursor:'pointer'}} onClick={(e) => openEditModal(row.id)} /> &nbsp;&nbsp;
            <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={(e) => handleConfirmText(row.id)} />
          </div>
        )
      }
    }
  ]
  useEffect(async () => {

    //category list..
    useJwt.productcategorylist().then(res => {
      const data2 = res.data.payload
      setdata(data2)
      setisloading(false)

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

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith =
          item.categoryname.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.categoryname.toLowerCase().includes(value.toLowerCase()) ||
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
      pageCount={searchValue.length ? filteredData.length / 7 : data.length / 7 || 1}
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
  const onchange = (e) => {
    setuserinput({ ...userinput, [e.target.name]: e.target.value })
  }

  const handleCallback = (childData, imageUrl) => {
    setimageclear(false)
    setsingletrollydetails({...singletrollydetails, img:null })
    setuserinput({ ...userinput, img: childData, imageUrl })
}
const onchangeedit = (e) => {
  setsingletrollydetails({ ...singletrollydetails, [e.target.name]: e.target.value })
}
  const onsubmit = (e) => {
    seterror('')
    e.preventDefault()
    const {img = null, categoryname = null} = userinput
    if (!img) {
      seterror('Image is required')
      return 0
    }
    setloading(true)
    const formData = new FormData()
    formData.append('categoryimage', img)
    formData.append('categoryname', categoryname)
    useJwt.productcategoryAdd(formData).then(res => {
     Success(res)
     setloading(false)
     setimageclear(true)
     setuserinput({ ...userinput, img: null, categoryname: null })
      const createData = {
        categoryimage:userinput.imageUrl,
        status: 1,
        categoryname,
        id:res.data.payload.id
      }
     setdata([createData, ...data])

    }).catch(err => {
      setloading(false)
      console.log(err.response)
      Error(err)
    })

  }
  const oneditsubmit = (e) => {
    e.preventDefault()
    setediterror({})

    const {id, img, categoryname, status, defaultstatus } = singletrollydetails
    const {img:updatedimagefile, imageUrl} = userinput

    let iserror = false
    if (!categoryname) {
      setediterror({ ...error, categoryname: 'categoryname required' })
      iserror = true
    }
    if (iserror) {
      return 0
    }
    const updateurl = imageUrl || img
    const formData = new FormData()
    formData.append('id', id)
    formData.append('categoryimage', updatedimagefile)
    formData.append('oldcategoryimage', img)
    formData.append('categoryname', categoryname)
    formData.append('status', defaultstatus.value)

    setloading2(true)
    useJwt.categoryUpdate(formData).then(res => {
      console.log(res)
      setFormModal(false)
      Success(res)
      setloading2(false)
      const updatedata = data.map(item => {
         if (item.id === id) {
             return {
               ...item,
              categoryimage: updateurl,
              status: defaultstatus.value,
              categoryname
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
  const imageClear = (tigger) => {

    if (!tigger) {
      setimageclear(true)
    }

  }
  return (
    <Fragment>

      <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/subcategory'>
        <Eye size={15} />
        <span className='align-middle ml-50'>Product Sub-category</span>
      </Button.Ripple>

       <Card>
        <CardHeader className='border-bottom'>
        <CardTitle tag='h4'>Add New Product Category</CardTitle>
        </CardHeader>
        <CardBody style={{ paddingTop: '15px' }}>
          <Form className="row" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off" >
            <Col sm="4" >

              <FormGroup>
                <Label for="search-input">Category Name <span style={{ color: 'red' }}>*</span></Label>
                <Input type="text" name="categoryname"
                  id='categoryname' onChange={onchange} required
                  placeholder="Category Name"
                  value={userinput.categoryname || ''}
                />
              </FormGroup>

            </Col>

            <Col sm="4" >

               <ImageUpload parentCallback = {handleCallback} imageclear2={imageclear}/>
               <span style={{color:'red'}}>{error}</span>
            </Col>

            <Col sm="4" >
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
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4'>Product Category List</CardTitle>
          <CardTitle>
            <Input
              placeholder='Search'
              className='dataTable-filter mb-50'
              type='text'
              // bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleFilter}
            />
          </CardTitle>
        </CardHeader>
        {/* <Row className='justify-content-end mx-0'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='3' sm='12'>
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
        </Row> */}
        <DataTable
          noHeader
          pagination
          columns={columns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          data={searchValue.length ? filteredData : data}
          progressPending={isloading}
          progressComponent={<Spinner color='primary' />}
          responsive={true}
          customStyles={{rows: {
            style: {
              minHeight: '80px'
            }
          }}}
        />
      </Card>

       <div className='demo-inline-spacing editrolly' >
      <div>
        <Modal isOpen={formModal} toggle={() => {
          setFormModal(!formModal)
          imageClear(!formModal)
          }
         } className='modal-dialog-centered'>
          <ModalHeader toggle={() => {
            setFormModal(!formModal)
            imageClear(!formModal)
          }
          }>Update Form</ModalHeader>
          <ModalBody>
            <FormGroup >
              <Label for='categoryname'>Category Name <span style={{ color: 'red' }}>*</span>  <span style={{ color: 'red', fontSize: '11px' }}>{editerror.categoryname}</span></Label>
              <Input type='text' id='categoryname' name="categoryname"
               placeholder='Category Name' value={singletrollydetails['categoryname'] || ''}
               onChange={onchangeedit} required
               />
            </FormGroup>
            <FormGroup >
              <Label for='status'>Status <span style={{ color: 'red' }}>*</span>  <span style={{ color: 'red', fontSize: '11px' }}>{editerror.status}</span></Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  name="status2"
                  value={singletrollydetails.defaultstatus}
                  onChange={statusoptions2}
                  options={statusoptions}
                />
            </FormGroup>
            <FormGroup >
            <Label for="search-input">Category Image <span style={{ color: 'red' }}>*</span></Label>

            <ImageUpload parentCallback = {handleCallback} imageclear2={imageclear} imgurl={singletrollydetails['img']}/>
               <span style={{color:'red'}}>{error}</span>
               </FormGroup>
          </ModalBody>
          <ModalFooter>
          {
                loading2 ?  <Fragment>
                <Button color='primary'  disabled>
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
    </Fragment>
  )
}

export default DataTableWithButtons
