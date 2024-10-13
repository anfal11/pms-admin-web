// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
// ** Custom Components
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import { Image } from 'antd'
import 'antd/dist/antd.css'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
  ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
  Edit, Archive, Trash, Search
} from 'react-feather'
import ImageUpload from './ImageUpload'
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
  Col,
  Spinner,
  Form,
  FormGroup,
  CardBody,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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
  const [categorydata, setcategorydata] = useState([])
  const [isloading, setisloading] = useState(true)
  const [iscategoryloading, setiscategoryloading] = useState(true)
  const [userinput, setuserinput] = useState({})
  const [imageclear, setimageclear] = useState(false)
  const [error2, seterror2] = useState({})
  const [singletrollydetails, setsingletrollydetails] = useState({})
  const [loading2, setloading2] = useState(false)
  const [formModal, setFormModal] = useState(false)
  const [editerror, setediterror] = useState({})
  const [error, seterror] = useState('')
  const [error1, seterror1] = useState('')
  const [loading, setloading] = useState(false)

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
        return useJwt.productsubcategorydelete({ id }).then(res => {

          return res

        }).catch(err => {
          console.log(err.response)
          Error(err)
          return false
          //Swal.showValidationMessage(`Request failed`)
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {

      if (result.isConfirmed) {
        removedeleteitem(id)
        MySwal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The Sub Category has been deleted.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }

    })
  }

  const openEditModal = (id) => {
    let singletrollyinfo = {}, defaultstatus = {}, defaultcategory = {}
    seterror2({})
    setuserinput({ ...userinput, img: '', imageUrl: null })
    setimageclear(true)
    setloading2(false)
    data.every(item => {
      if (item.id === id) {
        singletrollyinfo = {
          img: item.subcategoryimage,
          status: item.status,
          id: item.id,
          subcategoryname: item.subcategoryname,
          categoryid: item.categoryid
        }
        statusoptions.every(item2 => {
          if (item2.value === item.status) {
            defaultstatus = { value: item2.value, label: item2.label }
            return false
          }
          return true
        })
        //category pick up..
        categorydata.every(item22 => {
          if (item22.value === item.categoryid) {
            defaultcategory = { value: item22.value, label: item22.label }
            return false
          }
          return true
        })

        return false
      }
      return true
    })
    singletrollyinfo.defaultstatus = defaultstatus
    singletrollyinfo.defaultcategory = defaultcategory
    setimageclear(false)
    console.log(singletrollyinfo)
    setsingletrollydetails(singletrollyinfo)
    setFormModal(!formModal)
  }

  const orderby = (nameA, nameB) => {
    console.log(' nameA, nameB ', nameA, nameB)
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }

    // names must be equal
    return 0
  }

  const customSortFunction = (rowss, field, direction) => {
    console.log(rowss, field, direction)
    const rows = rowss.slice(0)
    const rows2 = rows.sort(function (a, b) {
      let nameA = a['subcategoryname']
      let nameB = b['subcategoryname']
      if (field === 'categoryname') {
        nameA = a['category']['categoryname']
        nameB = b['category']['categoryname']
      }
      if (direction === 'asc') {
        orderby(nameA, nameB)
      } else {
        orderby(nameB, nameA)
      }
    })

    // console.log('rows2 ', rows2)
    return rows2
  }
  // ** Table Common Column
  const columns = [

    {
      name: 'Sub Category Image',
      selector: 'subcategoryimage',
      minWidth: '250px',
      cell: row => (
        <div className='d-flex align-items-center'>
          <Image
            //  width={100}
            style={{ height: '80px', width: '80px' }}
            src={row.subcategoryimage}
          />
        </div>
      )
    },
    {
      name: 'Sub Category Name',
      selector: 'subcategoryname',
      minWidth: '100px',
      sortable: true
    },
    {
      name: 'Category Name',
      selector: (row, index) => {
        if (row.category) {
          return row.category.categoryname
        } else {
          return ""
        }
      },
      minWidth: '100px',
      sortable: true
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
            <Edit size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => openEditModal(row.id)} /> &nbsp;&nbsp;
            <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={(e) => handleConfirmText(row.id)} />
          </div>
        )
      }
    }
  ]
  useEffect(async () => {

    //category list..
    useJwt.productcategorylist().then(res => {
      const data22 = res.data.payload

      const data21 = data22.map(item => {
        return {
          value: item.id, label: item.categoryname
        }
      })
      setcategorydata(data21)
      setiscategoryloading(false)

    }).catch(err => {
      setiscategoryloading(false)
      console.log(err.response)
      Error(err)
    })

    //subcategory list..
    useJwt.productsubcategorylist().then(res => {
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
          item.subcategoryname.toLowerCase().startsWith(value.toLowerCase()) ||
          item.category.categoryname.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.subcategoryname.toLowerCase().includes(value.toLowerCase()) ||
          item.category.categoryname.toLowerCase().includes(value.toLowerCase()) ||
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

  const categoryoption = (option, { action }) => {
    if (action === 'select-option') {
      setuserinput({ ...userinput, categoryid: option.value })
    } else {
      setuserinput({ ...userinput, categoryid: null })
    }
  }

  const imageClear = (tigger) => {

    if (!tigger) {
      setimageclear(true)
    }

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
      breakClassName='page-item'
      breakLinkClassName='page-link'
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
    />
  )
  const handleCallback = (childData, imageUrl) => {
    setimageclear(false)
    setsingletrollydetails({ ...singletrollydetails, img: null })
    setuserinput({ ...userinput, img: childData, imageUrl })
  }
  const onsubmit = (e) => {
    seterror('')
    seterror1('')
    e.preventDefault()
    const { img, imageUrl, categoryid, subcategory } = userinput
    if (!img) {
      seterror('Image is required')
      return 0
    }

    if (!categoryid) {
      seterror1('Category is required')
      return 0
    }
    setloading(true)
    const formData = new FormData()
    formData.append('categoryimage', img)
    formData.append('subcategoryname', subcategory)
    formData.append('categoryid', categoryid)
    useJwt.productsubcategoryadd(formData).then(res => {
      Success(res)
      setloading(false)
      setimageclear(true)
      setuserinput({ ...userinput, img: null, subcategory: null })
      let category_name = ''
      categorydata.every(item => {
        if (item.value === categoryid) {
          category_name = item.label
          return false
        }
        return true
      })
      const createData = {
        subcategoryimage: imageUrl,
        status: 1,
        subcategoryname: subcategory,
        categoryid,
        category: {
          categoryname: category_name
        },
        id: res.data.payload.id
      }
      setdata([createData, ...data])

    }).catch(err => {
      setloading(false)
      console.log(err.response)
      Error(err)
    })
  }

  const onchangeedit = (e) => {
    setsingletrollydetails({ ...singletrollydetails, [e.target.name]: e.target.value })
  }
  const statusoptions2 = (option, { action }) => {

    setsingletrollydetails({ ...singletrollydetails, defaultstatus: { value: option.value, label: option.label } })
  }
  const categoryoption2 = (option, { action }) => {

    setsingletrollydetails({ ...singletrollydetails, defaultcategory: { value: option.value, label: option.label } })
  }
  const onchange = (e) => setuserinput({ ...userinput, [e.target.name]: e.target.value })

  const oneditsubmit = (e) => {
    e.preventDefault()
    setediterror({})

    const { id, img, subcategoryname, categoryid, status, defaultstatus, defaultcategory } = singletrollydetails
    const { img: updatedimagefile, imageUrl } = userinput

    let iserror = false
    if (!subcategoryname) {
      setediterror({ ...error, subcategoryname: 'subcategoryname required' })
      iserror = true
    }
    if (iserror) {
      return 0
    }
    const updateurl = imageUrl || img
    const formData = new FormData()
    formData.append('id', id)
    formData.append('categoryimage', updatedimagefile)
    formData.append('oldsubcategoryimage', img)
    formData.append('categoryid', defaultcategory.value)
    formData.append('status', defaultstatus.value)
    formData.append('subcategoryname', subcategoryname)

    setloading2(true)
    useJwt.productsubcategoryedit(formData).then(res => {
      //console.log(res)
      setFormModal(false)
      setimageclear(true)
      Success(res)
      setloading2(false)
      console.log('singletrollydetails ', singletrollydetails)
      console.log('imageUrl ', imageUrl)
      console.log('img ', img)
      console.log('updateurl ', updateurl)
      const updatedata = data.map(item => {
        if (item.id === id) {
          return {
            ...item,
            subcategoryimage: updateurl,
            subcategoryname,
            status: defaultstatus.value,
            category: {
              categoryname: defaultcategory.label
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


  return (
    <Fragment>

      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Add New Product Sub Category</CardTitle>
        </CardHeader>
        <CardBody style={{ paddingTop: '15px' }}>
          <Form className="row" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off" className='row '>

            <Col sm="3" >
              <FormGroup>
                <Label for="search-input">Category Name <span style={{ color: 'red' }}>*</span></Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  name="categoryid"
                  onChange={categoryoption}
                  options={categorydata}
                />
                <span style={{ color: 'red' }}>{error1}</span>
              </FormGroup>
            </Col>

            <Col sm="3" >
              <FormGroup>
                <Label for="search-input">Sub Category Name <span style={{ color: 'red' }}>*</span></Label>
                <Input type="text" name="subcategory"
                  id='subcategory' onChange={onchange} required
                  placeholder="Sub Category Name"
                  value={userinput.subcategory || ''}
                />
              </FormGroup>

            </Col>

            <Col sm="3" >

              <ImageUpload parentCallback={handleCallback} imageclear2={imageclear} />
              <span style={{ color: 'red' }}>{error}</span>
            </Col>

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
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4'>Product Sub Category List</CardTitle>
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
          customStyles={{
            rows: {
              style: {
                minHeight: '80px'
              }
            }
          }}
        //sortFunction= { (rows, field, direction) => customSortFunction(rows, field, direction)}
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
              <FormGroup>
                <Label for="search-input">Category Name <span style={{ color: 'red' }}>*</span>  <span style={{ color: 'red', fontSize: '11px' }}>{editerror.categoryid}</span></Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  name="categoryid2"
                  value={singletrollydetails.defaultcategory}
                  onChange={categoryoption2}
                  options={categorydata}
                />

              </FormGroup>
              <FormGroup >
                <Label for='subcategoryname'>Sub Category Name <span style={{ color: 'red' }}>*</span>  <span style={{ color: 'red', fontSize: '11px' }}>{editerror.categoryname}</span></Label>
                <Input type='text' id='subcategoryname' name="subcategoryname"
                  placeholder='Sub Category Name' value={singletrollydetails['subcategoryname'] || ''}
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
                <Label for="search-input">Sub Category Image <span style={{ color: 'red' }}>*</span></Label>

                <ImageUpload parentCallback={handleCallback} imageclear2={imageclear} imgurl={singletrollydetails['img']} />
                <span style={{ color: 'red' }}>{error}</span>
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

    </Fragment>
  )
}

export default DataTableWithButtons
