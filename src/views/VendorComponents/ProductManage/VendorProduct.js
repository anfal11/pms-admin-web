// ** React Imports
import useJwt from '@src/auth/jwt/useJwt'
import { Image } from 'antd'
import 'antd/dist/antd.css'
import { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Eye, Image as ImageIcon, Layers, Plus, Search, Trash } from 'react-feather'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { Badge, Button, Card, CardHeader, CardBody, CardTitle, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap'
import Form from 'reactstrap/lib/Form'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import { Error } from '../../../viewhelper'
//import Avatar from '@components/avatar'
// ** Store & Actions
// import { getProducts } from '../store/actions'
import { getProducts } from '../../tables/data-tables/store/actions'
import {CURRENCY_SYMBOL} from '../../../Configurables'
// import ProductDetailsModal from './productDetailsModal'


const MySwal = withReactContent(Swal)
// ** Vars
//const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

const status = {
  0: { title: 'Pending', color: 'light-primary ' },
  1: { title: 'Active', color: 'light-success ' },
  6: { title: 'Ready', color: 'light-primary' },
  7: { title: 'Processed', color: 'light-danger' },
  8: { title: 'Checked', color: 'light-secondary' },
  9: { title: 'Paid', color: 'light-info' },
  2: { title: 'Booked', color: 'light-info' },
  10: { title: 'Scanning', color: 'light-info' }
}

const productimageexistornot = [
  { value: "all", label: 'All' },
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
]

const DataTableServerSide = () => {
  // product search
  const history = useHistory()
  const [PsearchValue, setPSearchValue] = useState('')
  const [isPloading, setisPloading] = useState(false)
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.dataTables)
  const [isloading, setisloading] = useState(true)
  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [searchValue, setSearchValue] = useState('')
  const [openmodal, setopenmodal] = useState(false)
  const [detailsloading, setdetailsloading] = useState(true)
  const [details, setdetails] = useState({})
  const [modal, setModal] = useState(false)
  const [pimageurl, setpimageurl] = useState('')
  const [imageurlhave, setimageurlhave] = useState(null)
  const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
  const [business_id, setbusiness_id] = useState(BusinessList[0].id)

  const removedeleteitem = async (id) => {
    setisloading(true)
    await dispatch(
      getProducts({
        page: currentPage,
        perPage: rowsPerPage,
        q: searchValue,
        imageurlhave,
        business_id,
        searchValue: PsearchValue || null
      })
    )
    setisloading(false)
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
        useJwt.productdelete({ id }).then(res => {

          return res

        }).catch(error => {
          console.log(err.response)
          // Error(err)
          Swal.showValidationMessage(`Request failed`)
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {

      if (result.value) {
        removedeleteitem(id)
        MySwal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The Product has been deleted.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }

    })
  }

  const onChangeSelectValue = (value, { action, name }) => {
    if (action === 'select-option') {
      setimageurlhave(value.value)
    } else {
      setimageurlhave(null)
    }
  }

  const handelmodal = () => {
    setopenmodal(false)
    //setModal(true)
  }
  const singleProductDetails = (productid) => {
    setopenmodal(true)
    setdetailsloading(true)
    useJwt.singleproductdetails({ productid }).then(res => {
      console.log(res)
      setdetails(res.data.payload)
      setdetailsloading(false)
    }).catch(error => {
      console.log(error.response)
      // Error(error)
    })
  }

  const viewOnlyImage = (imageurl) => {
    setModal(true)
    setpimageurl(imageurl)

  }
  const serverSideColumns = [

    {
      name: 'Product Code',
      sortable: true,
      minWidth: '100px',
      selector: 'product_code'
    },
    /*{
      name: 'Product Image',
      // sortable: true,
      minWidth: '100px',
      selector: row => <Image style={{ height: '80px', width: '80px' }} src={row.productimage} />
    },*/
    {
      name: 'Product Name',
      sortable: true,
      minWidth: '200px',
      selector: row => row.productname
      // (
      //   <div className='d-flex align-items-center'>
      //     <Image
      //       //  width={70}
      //       style={{ height: '80px', width: '80px' }}
      //       src={row.productimage}
      //     />
      //     <div className='user-info text-truncate ml-1' style={{ width: '270px', overflow: 'hidden' }}>
      //       <span className='d-block font-weight-bold text-truncate'>{row.productname}</span>
      //     </div>
      //   </div>
      // )
    },

    {
      name: 'Category',
      selector: (row) => {
        return row.categoryinfo ? row.categoryinfo.categoryname : ""
      },
      sortable: true,
      minWidth: '150px'
      // cell: (row) => {
      //   return row.categoryinfo ? row.categoryinfo.categoryname : ""
      // }
    },

    {
      name: `Marked Price`,
      sortable: true,
      minWidth: '100px',
      selector: (row) => `${CURRENCY_SYMBOL} ${(+row.RRP).toFixed(2)} `
    },
    {
      name: `Till Price`,
      sortable: true,
      minWidth: '100px',
      selector: (row) => `${CURRENCY_SYMBOL} ${(+row.tillprice).toFixed(2)}`
    },
    {
      name: 'Product Volume',
      minWidth: '100px',
      sortable: true,
      // selector: (row) => `${row.productsize || 0}X${row.unitvolume}`
      selector: (row) => row.unitvolume
    },
    {
      name: 'Status',
      selector: 'status',
      // sortable: true,
      minWidth: '150px',
      cell: row => {
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
      cell: row => {
        return (
          <div className='d-flex'>
            <Eye size={15} color='teal' style={{ cursor: 'pointer' }} onClick={(e) => history.push(`/vendor/ProductDetails/${row.productid}`)} />&nbsp;&nbsp;
            <Edit size={15} color='teal' style={{ cursor: 'pointer' }} onClick={(e) => history.push(`/vendor/EditProduct/${row.productid}`)} />&nbsp;&nbsp;
            {/* <ImageIcon size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => viewOnlyImage(row.productimage)} />&nbsp;&nbsp; */}
            <Layers size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => history.push(`/vendor/UpdateProduct/${row.productid}`)} />&nbsp;&nbsp;
            <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={(e) => {
                  e.preventDefault()
                  handleConfirmText(row.productid)
                }}/>

            {/*<UncontrolledDropdown>
              <DropdownToggle className='pr-1' tag='span'>
                <MoreVertical size={15} style={{ cursor: 'pointer' }} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag='a' href={`/editproductdetails/${row.productid}`} className='w-100'>
                  <Edit size={15} color='#2bc871' style={{ cursor: 'pointer' }} />
                  <span className='align-middle ml-50'>Edit</span>
                </DropdownItem>
                <DropdownItem className='w-100' onClick={(e) => {
                  e.preventDefault()
                  handleConfirmText(row.productid)
                }}>
                  <Trash size={15} color='red' style={{ cursor: 'pointer' }} />
                  <span className='align-middle ml-50'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>*/}

          </div>
        )
      }
    }
  ]

  const getproductlist = async() => {

    
  }
  // ** Get data on mount
  useEffect(async () => {
    setisloading(true)
    await dispatch(
      getProducts({
        page: currentPage,
        perPage: rowsPerPage,
        q: searchValue,
        imageurlhave,
        business_id,
        searchValue: PsearchValue || null
      })
    )
    setisloading(false)
  }, [dispatch, business_id])

  // ** Function to handle filter
  /*const handleFilter = async e => {
    setSearchValue(e.target.value)
    setisloading(true)
    await dispatch(
      getProducts({
        page: currentPage,
        perPage: rowsPerPage,
        q: e.target.value
      })
    )
    setisloading(false)
  }
*/
  // ** Function to handle Pagination and get data
  const handlePagination = async page => {
    setisloading(true)
    await dispatch(
      getProducts({
        page: page.selected + 1,
        perPage: rowsPerPage,
        q: searchValue,
        searchValue: PsearchValue || null,
        imageurlhave
      })
    )
    setisloading(false)
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  /*const handlePerPage = async e => {
    setisloading(true)
    await dispatch(
      getProducts({
        page: currentPage,
        perPage: parseInt(e.target.value),
        q: searchValue
      })
    )
    setisloading(false)
    setRowsPerPage(parseInt(e.target.value))
  }
*/
  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number((store.total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchValue
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })
    console.log(store.data)
    return store.data

    /*if (store.data.length > 0) {
      return store.data
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      return store.allData.slice(0, rowsPerPage)
    }*/
  }
  const onSearchValueChange = (e) => {
    setPSearchValue(e.target.value)
  }
  const handleSearchSubmit = async (e) => {
    e.preventDefault()

    let sPsearchValue = PsearchValue
    console.log('imageurlhave ', imageurlhave)
    if (sPsearchValue.trim() && imageurlhave) {
      sPsearchValue = sPsearchValue.trim()
    } else if (sPsearchValue.trim()) {
      sPsearchValue = sPsearchValue.trim()
    } else if (imageurlhave) {
      console.log('imageurlhave ', imageurlhave)
    } else {
      return 0
    }

    setisPloading(true)
    setCurrentPage(1)
    await dispatch(
      getProducts({
        page: 1,
        perPage: rowsPerPage,
        q: searchValue,
        searchValue: sPsearchValue,
        imageurlhave
      })
    )
    // await dispatch(
    //   getProductsBySearch({ searchValue: PsearchValue })
    // )
    setTimeout(() => setisPloading(false), 500)

  }
  const DontSubmit = e => { e.preventDefault() }
  
  return (
    <Fragment>
      <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/vendor/addNewProduct'>
        <Plus size={15} />
        <span className='align-middle ml-50'>Add new product</span>
      </Button.Ripple>
     

         {BusinessList.length > 1 && <Card>
                <CardHeader className='border-bottom mb-1'>
                    <CardTitle tag='h5'>Business </CardTitle>
                </CardHeader>
                <CardBody>
                    <Label for="Business">Select a Business</Label>&nbsp;<span className="text-danger">*</span>
                    <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        classNamePrefix='select'
                        defaultValue={BusinessList.map(x => { return { value: x.id, label: x.businessname } })[0]}
                        onChange={(selected) => setbusiness_id(selected.value)}
                        options={BusinessList.map(x => { return { value: x.id, label: x.businessname } })}
                    />
                </CardBody>
            </Card>}
            
          <Card>
        <Form className="d-flex my-2 mx-1 justify-content-center row" style={{ width: '100%' }} onSubmit={handleSearchSubmit} autoComplete="off">

          <Col sm="6" >
            <FormGroup>
              <Label for="exampleSelect33"></Label>
              <Input
                placeholder="Search product with Product Code, Name"
                type='text'
                id='search-input'
                required
                value={PsearchValue}
                onChange={onSearchValueChange}
              />
            </FormGroup>
          </Col>

          <Col sm="3" >
            <FormGroup>
              <Label for="exampleSelect333" style={{ marginTop: '40px' }}></Label>
              {
                isPloading ? <Button.Ripple className='ml-2' color='primary' disabled={true} >
                  <Spinner color='white' size='sm' />
                  <small className='ml-50'>Loading...</small>
                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit"  >
                  <Search size={15} />
                  <span className='align-middle ml-50'>Search</span>
                </Button.Ripple>
              }
            </FormGroup>
          </Col>

        </Form>
      </Card>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Product List</CardTitle>
        </CardHeader>
        {/*<Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>show</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for='sort-select'>entries</Label>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            <Label className='mr-1' for='search-input'>
              Search
            </Label>
            <Input
              className='dataTable-filter'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>*/}
        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={dataToRender()}
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
        />

        {/* <ProductDetailsModal openmodal={openmodal} handelmodal={handelmodal} loading={detailsloading} details={details} /> */}

      </Card>

      <div className='demo-inline-spacing viewtrollyQRCode' >
        <div>
          <Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => setModal(!modal)}>Product Image</ModalHeader>
            <ModalBody>

              <Col sm={12} md={{ size: 6, offset: 3 }} style={{ minHeight: '200px', display: 'inline-grid' }}>
                <Image src={pimageurl} />
              </Col>

            </ModalBody>

          </Modal>
        </div>
      </div>

    </Fragment>
  )
}

export default memo(DataTableServerSide)
