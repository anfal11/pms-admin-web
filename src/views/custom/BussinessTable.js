// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'

import { Link } from 'react-router-dom'
import AddNewModal from '../tables/data-tables/basic/AddNewModal'
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
  ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
  Edit, Archive, Trash, Search, Eye
} from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
  Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col,  Badge, Form, FormGroup, Spinner
} from 'reactstrap'

import { Error, Success } from '../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'
import { FormatePhoneNo } from '../helper'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { PHONE_PREFIX } from '../../Configurables'

const MySwal = withReactContent(Swal)

const status = {
  1: { title: 'Active', color: 'light-success ' },
  0: { title: 'Pending', color: 'light-primary' },
  5: { title: 'Stopped', color: 'light-danger' }
}

const statusoptions = [
  { value: 200, label: 'All' },
  { value: 1, label: 'Active' },
  { value: 0, label: 'Pending' },
  { value: 5, label: 'Stopped' }
]

const searchfields = [
  { value: "", label: 'All' },
  // { value: 'contact', label: 'Mobile Number' },
  // { value: 'companyregisterno', label: 'Company Register No' },
  { value: 'businessname', label: 'Business Name' }
  // { value: 'universalid', label: 'Customer ID' }
]

const DataTableWithButtons = () => {
  const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
  const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
  const subMenuIDs = [].concat(...Array2D)
  // ** States
  const [isloading, setisloading] = useState(true)
  const [reset, setReset] = useState(true)
  const [depotloading, setdepotloading] = useState(true)
  const [modal, setModal] = useState(false)
  const [data, setdata] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [pagecount, setpagecount] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [primarydepot, setprimarydepot] = useState([])
  const [issearch, setissearch] = useState(false)
  const [datashow, setdatashow] = useState(false)
  const [paginationperpage, setpaginationperpage] = useState(10)
  const [searchoptions, setsearchoptions] = useState({
    serchinput: null,
    serchfield: null,
    primarydepot: null,
    status: null
  })

  const removedeleteitem = (businessid) => {
    if (issearch) {
      const updatedfilteredData = filteredData.filter(item => {
        if (item.id === businessid) {
          return false
        } else {
          return true
        }
      })
      setFilteredData(updatedfilteredData)
    }
    const updatedData = data.filter(item => {
      if (item.id === businessid) {
        return false
      } else {
        return true
      }
    })
    setdata(updatedData)
  }
  const handleDeletePoPupActions = (data) => {
    return MySwal.fire({
        title: 'Really want to delete?',
        text: `You won't be able to revert this`,
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ml-1'
        },
        showLoaderOnConfirm: true,
        preConfirm: () => {
            
          return useJwt.customerBusinessUpdate({ ...data, businessid: data.id, operation: 'DELETE'}).then(res => {
            console.log(res)
            Success(res)
            setReset(!reset)
            }).catch(err => {
                console.log(err.response)
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
  // ** Table Common Column
  const columns = [

    // {
    //   name: 'Customer ID',
    //   selector: (item) => {
    //     return item.storemap ? item.storemap.customerid : ''
    //   },
    //   sortable: true,
    //   minWidth: '100px',
    //   selector: (item) => {
    //     return item.storemap ? item.storemap.customerid : ''
    //   }
    // },
    // {
    //   name: 'Primary Depot',
    //   selector: (item) => {
    //     return item.storeinfo ? item.storeinfo.storename : ''
    //   },
    //   sortable: true,
    //   minWidth: '150px'
    // },

    {
      name: 'Business Name',
      selector: 'businessname',
      sortable: true,
      minWidth: '150px'
    },
    // {
    //   name: 'Mobile Number',
    //   selector: (item) => `${PHONE_PREFIX}${FormatePhoneNo(item.customerinfo.mobile)}`,
    //   // cell: (item) => `${window.PHONE_PREFIX}${FormatePhoneNo(item.customerinfo.mobile)}`,
    //   sortable: true,
    //   minWidth: '150px'
    // },
    // {
    //   name: 'Register No',
    //   selector: 'companyregno',
    //   sortable: true,
    //   minWidth: '100px'
    // },
    {
      name: 'Email',
      minWidth: '250px',
      sortable: true,
      selector: 'email'
    },
    {
        name: 'Address',
        minWidth: '250px',
        sortable: true,
        selector: row => {
            return `${row.thana}, ${row.district}, ${row.city}`
        }
    },
    {
      name: 'Web Login',
      minWidth: '120px',
      sortable: true,
      selector: row => {
          return row.web_login ? <Badge pill color='success' className='badge-center'>
          Allow
        </Badge> : <Badge pill color='danger' className='badge-center'>
          Not Allow
        </Badge>
      }
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
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
      minWidth: '100px',
      allowOverflow: true,
      cell: row => {
        return (
          <div className='d-flex'>
            {subMenuIDs.includes(3) && <><a href={`/businessdetails/${row.id}`}><Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} /></a> &nbsp;&nbsp;&nbsp;&nbsp;</>}
            {subMenuIDs.includes(4) && <a href={`/editbusiness/${row.id}`}><Edit size={15} color='#7367f0' style={{ cursor: 'pointer' }} /></a>}&nbsp;&nbsp;&nbsp;&nbsp;
            <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={() => handleDeletePoPupActions(row)} />
          </div>
        )
      }
    }
  ]
  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  useEffect(async () => {

    //store list..
    // useJwt.storeList().then(res => {
    //   const payload1 = res.data.payload
    //   const data1 = payload1.map(item => {
    //     return { value: item.storeid, label: item.storename }
    //   })
    //   setprimarydepot([{ value: "All", label: "All" }, ...data1])
    //   setdepotloading(false)

    // }).catch(err => {
    //   setdepotloading(false)
    //   console.log(err.response)
    //   Error(err)
    // })
    localStorage.setItem('useBMStoken', false) //tokan management purpose
    localStorage.setItem('usePMStoken', false) //tokan management purpose
    
    useJwt.customerBusinessList().then(res => {

      const { payload } = res.data
      const allpages = payload.length / paginationperpage
      const checkneedmore = (payload.length % paginationperpage) ? 1 : 0
      const pages = parseInt(allpages) + checkneedmore
      setdata(payload)
      setFilteredData(payload)
      console.log(payload)
      setpaginationperpage(pages)
      setisloading(false)

    }).catch(err => {
      setisloading(false)
      console.log(err.response)
      Error(err)
    })
  }, [reset])


  const onChangeSelectValue = (value, { action, name }) => {
    if (action === 'select-option') {
      setsearchoptions({ ...searchoptions, [name]: value.value })
    } else {
      const checkdata = { ...searchoptions, [name]: null }
      const { serchinput, serchfield, primarydepot, status } = checkdata
      if (!serchinput && !serchfield && !primarydepot && !status) {
        setissearch(false)
      }
      setsearchoptions(checkdata)
    }
  }
  const onChange = (event) => {
    const { serchfield, primarydepot, status } = searchoptions
    if (!event.target.value && !serchfield && !primarydepot && !status) {
      setsearchoptions({ ...searchoptions, [event.target.name]: event.target.value })
      setissearch(false)
    } else {
      setsearchoptions({ ...searchoptions, [event.target.name]: event.target.value })
    }

  }
  //search..
  const handleSubmit = e => {
    e.preventDefault()
    setissearch(true)
    console.log('searchoptions ', searchoptions)
    const { serchfield, primarydepot, status } = searchoptions
    let { serchinput } = searchoptions
    serchinput = serchinput ? serchinput.trim() : serchinput
    let updatedData = [], mobileprefixadd = serchinput
    const firstchar = serchinput ? serchinput.charAt(0) : serchinput
    if (firstchar && firstchar === '0') {
      mobileprefixadd = serchinput.substring(1)
      mobileprefixadd = mobileprefixadd.replace(/\s+/g, '')
    }

    if (serchinput && !serchfield && !primarydepot && status === null) {
      //search input with contact,companyregisterno,businessname,universalid
      console.log('search input with contact,companyregisterno,businessname,universalid')
      const tolowercase = serchinput.toLowerCase()
      updatedData = data.filter(item => {
        console.log(' item.customerinfo.mobile === serchinput  ', item.customerinfo.mobile === mobileprefixadd)
        const includes =
          item.customerinfo.mobile === mobileprefixadd ||
          item.companyregno.toLowerCase() === tolowercase ||
          item.businessname.toLowerCase() === tolowercase ||
          (item.storemap ? item.storemap.customerid === serchinput : false)

        return includes

      })
      console.log(updatedData)
    } else if (serchinput && serchfield && !primarydepot && status === null) {
      //search input  with selected
      console.log('search input  with selected')
      const tolowercase = serchinput.toLowerCase()
      updatedData = data.filter(item => {
        let includes = false
        switch (serchfield) {
          case 'contact':
            includes = item.customerinfo.mobile === mobileprefixadd
            break

          case 'companyregisterno':
            includes = item.companyregno.toLowerCase() === tolowercase
            break

          case 'businessname':
            includes = item.businessname.toLowerCase() === tolowercase
            break

          case 'universalid':
            includes = item.storemap ? item.storemap.customerid === serchinput : false
            break
        }
        return includes
      })

    } else if (serchinput && serchfield && primarydepot && status === null) {
      //search input  with selected and depot
      console.log('search input  with selected and depot')
      const tolowercase = serchinput.toLowerCase()
      updatedData = data.filter(item => {
        let includes = false
        switch (serchfield) {
          case 'contact':
            includes = item.customerinfo.mobile === mobileprefixadd && primarydepot === 'All' ? true : item.depot_id === primarydepot
            break

          case 'companyregisterno':
            includes = item.companyregno.toLowerCase() === tolowercase && primarydepot === 'All' ? true : item.depot_id === primarydepot
            break

          case 'businessname':
            includes = item.businessname.toLowerCase() === tolowercase && primarydepot === 'All' ? true : item.depot_id === primarydepot
            break

          case 'universalid':
            includes = (item.storemap ? item.storemap.customerid === serchinput : false) && primarydepot === 'All' ? true : item.depot_id === primarydepot
            break
        }
        return includes
      })

    } else if (serchinput && serchfield && primarydepot && status !== null) {
      //search input  with selected and depot and status
      console.log('search input  with selected and depot and status')
      const tolowercase = serchinput.toLowerCase()
      updatedData = data.filter(item => {
        let includes = false
        switch (serchfield) {
          case 'contact':
            includes = item.customerinfo.mobile === mobileprefixadd && primarydepot === 'All' ? true : item.depot_id === primarydepot && item.status === status
            break

          case 'companyregisterno':
            includes = item.companyregno.toLowerCase() === tolowercase && primarydepot === 'All' ? true : item.depot_id === primarydepot && item.status === status
            break

          case 'businessname':
            includes = item.businessname.toLowerCase() === tolowercase && primarydepot === 'All' ? true : item.depot_id === primarydepot && item.status === status
            break

          case 'universalid':
            includes = (item.storemap ? item.storemap.customerid === serchinput : false) && primarydepot === 'All' ? true : item.depot_id === primarydepot && item.status === status
            break
        }
        return includes
      })

    } else if (!serchinput && !serchfield && primarydepot && status === 200 ? true : status === null) {
      //search only depot
      console.log('search only depot')
      if (primarydepot === 'All') {

        updatedData = data

      } else {

        updatedData = data.filter(item => {
          const includes = item.depot_id === primarydepot
          return includes
        })
      }

    } else if (!serchinput && !serchfield && !primarydepot && status !== null) {
      //search only status
      console.log('search only status')
      if (status === 200) {
        updatedData = data
      } else {
        updatedData = data.filter(item => {
          const includes = item.status === status
          return includes
        })
      }

    } else if (serchinput && !serchfield && primarydepot && status !== null) {
      //search input with contact,companyregisterno,businessname,universalid and depot and status
      console.log('search input with contact,companyregisterno,businessname,universalid and depot and status')
      const tolowercase = serchinput.toLowerCase()
      updatedData = data.filter(item => {
        const includes =
          item.customerinfo.mobile === mobileprefixadd ||
          item.companyregno.toLowerCase() === tolowercase ||
          item.businessname.toLowerCase() === tolowercase ||
          (item.storemap ? item.storemap.customerid === serchinput : false)

        return includes ? (primarydepot === 'All' ? true : item.depot_id === primarydepot && status === 200 ? true : item.status === status) : false

      })
    } else if (serchinput && !serchfield && !primarydepot && status !== null) {
      //search input with contact,companyregisterno,businessname,universalid and status
      console.log('search input with contact,companyregisterno,businessname,universalid and status')
      const tolowercase = serchinput.toLowerCase()
      updatedData = data.filter(item => {
        const includes =
          item.customerinfo.mobile === mobileprefixadd ||
          item.companyregno.toLowerCase() === tolowercase ||
          item.businessname.toLowerCase() === tolowercase ||
          (item.storemap ? item.storemap.customerid === serchinput : false)

        return includes ? status === 200 ? true : item.status === status : false

      })
    } else if (serchinput && !serchfield && primarydepot && status === null) {
      //search input with contact,companyregisterno,businessname,universalid and depot
      console.log('search input with contact,companyregisterno,businessname,universalid and depot')
      const tolowercase = serchinput.toLowerCase()
      updatedData = data.filter(item => {
        const includes =
          item.customerinfo.mobile === mobileprefixadd ||
          item.companyregno.toLowerCase() === tolowercase ||
          item.businessname.toLowerCase() === tolowercase ||
          (item.storemap ? item.storemap.customerid === serchinput : false)

        return includes ? primarydepot === 'All' ? true : item.depot_id === primarydepot : false

      })
    } else if (serchinput && serchfield && status !== null) {

      console.log('search input with selected and status')
      const tolowercase = serchinput.toLowerCase()
      updatedData = data.filter(item => {
        let includes = false
        switch (serchfield) {
          case 'contact':
            includes = item.customerinfo.mobile === mobileprefixadd && status === 200 ? true : item.status === status
            break

          case 'companyregisterno':
            includes = item.companyregno.toLowerCase() === tolowercase && status === 200 ? true : item.status === status
            break

          case 'businessname':
            includes = item.businessname.toLowerCase() === tolowercase && status === 200 ? true : item.status === status
            break

          case 'universalid':
            includes = (item.storemap ? item.storemap.customerid === serchinput : false) && status === 200 ? true : item.status === status
            break
        }

        return includes

      })
    } else if (primarydepot && status !== null) {

      console.log('search with primary depot and status..')
      updatedData = data.filter(item => {

        return ((primarydepot === 'All' ? true : item.depot_id === primarydepot) && (status === 200 ? true : item.status === status))

      })

    } else {
      //nothing...
      console.log('nothing..')
    }

    const allpages = updatedData.length / paginationperpage
    const checkneedmore = (updatedData.length % paginationperpage) ? 1 : 0
    const pages = parseInt(allpages) + checkneedmore
    setFilteredData(updatedData)
    setpaginationperpage(pages)
  }

  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={pagecount}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName={'active'}
      pageClassName={'page-item'}
      nextLinkClassName={'page-link'}
      nextClassName={'page-item next'}
      previousClassName={'page-item prev'}
      previousLinkClassName={'page-link'}
      pageLinkClassName={'page-link'}
      breakClassName='page-item'
      breakLinkClassName='page-link'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1'}
    />
  )
  const DontSubmit = e => { e.preventDefault() }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = ['customerid', 'storename', 'mobile', 'businessname', 'companyregno', 'status']
    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
    let ctr = 0
    keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter

        if (key === 'customerid') {
          result += item.storemap.customerid
        } else if (key === 'storename') {
          result += item.storeinfo.storename
        } else if (key === 'mobile') {
          result += item.customerinfo.mobile
        } else {
          result += item[key]
        }
       
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
    const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'})
    FileSaver.saveAs(data, 'export.xlsx')
}
const exportPDF = (list) => {
    const doc = new jsPDF()
    doc.text('Business List', 14, 10)
    const flist = list.map(l => {
      return {...l, ...l.storemap, ...l.storeinfo, ...l.customerinfo}
    })
    doc.autoTable({
       body: [...flist],
       columns: [{ header: 'Business Name', dataKey: 'businessname' }, { header: 'Email', dataKey: 'email' }, { header: 'Division', dataKey: 'city' }, { header: 'District', dataKey: 'district' }, { header: 'Thana', dataKey: 'thana' }, { header: 'Status', dataKey: 'status' }],
        // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
        styles: { cellPadding: 1.5, fontSize: 8 }
      })
    doc.save('export.pdf')
}

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>

          <Form className="row" style={{ width: '100%' }} onSubmit={(searchoptions.serchinput ? searchoptions.serchinput.trim() : false || searchoptions.status !== null || searchoptions.primarydepot !== null) ? handleSubmit : DontSubmit}>

            <Col sm="3" >

              <FormGroup>
                <Label for="search-input">Search</Label>
                <Input type="text" name="serchinput" id='search-input' placeholder="search" onChange={onChange} />
              </FormGroup>

            </Col>

            <Col sm="2" >

              <FormGroup>
                <Label for="exampleSelect2">Search Field</Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  name="serchfield"
                  onChange={onChangeSelectValue}
                  options={searchfields}
                  isClearable
                />
              </FormGroup>

            </Col>

            {/* <Col sm="3" >

              <FormGroup>
                <Label for="exampleSelect3">Primary Depot</Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  name="primarydepot"
                  onChange={onChangeSelectValue}
                  options={primarydepot}
                  isClearable
                  isLoading={depotloading}
                />

              </FormGroup>

            </Col> */}

            <Col sm="2" >

              <FormGroup>
                <Label for="exampleSelect5">Status</Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  name="status"
                  onChange={onChangeSelectValue}
                  options={statusoptions}
                  isClearable
                />


              </FormGroup>

            </Col>

            <Col sm="2" >

              <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                <Search size={10} />
                <span className='align-middle ml-50'>Search</span>
              </Button.Ripple>

            </Col>

          </Form>
         
          {/*<div className='d-flex mt-md-0 mt-1'>
            <UncontrolledButtonDropdown>
              <DropdownToggle color='secondary' caret outline>
                <Share size={15} />
                <span className='align-middle ml-50'>Export</span>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className='w-100'>
                  <Printer size={15} />
                  <span className='align-middle ml-50'>Print</span>
                </DropdownItem>
                <DropdownItem className='w-100' onClick={() => downloadCSV(data)}>
                  <FileText size={15} />
                  <span className='align-middle ml-50'>CSV</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Grid size={15} />
                  <span className='align-middle ml-50'>Excel</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <File size={15} />
                  <span className='align-middle ml-50'>PDF</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Copy size={15} />
                  <span className='align-middle ml-50'>Copy</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <Button className='ml-2' color='primary' onClick={handleModal}>
              <Plus size={15} />
              <span className='align-middle ml-50'>Add Record</span>
            </Button>
          </div>*/}
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col sm='2'>
            <div className='m-1'>
                  <UncontrolledButtonDropdown>
                    <DropdownToggle color='secondary' caret outline>
                        <Share size={15} />
                        <span className='align-middle ml-50'>Export</span>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem className='w-100' onClick={() => downloadCSV(filteredData)}>
                            <FileText size={15} />
                            <span className='align-middle ml-50'>CSV</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportToXL(filteredData)}>
                            <Grid size={15} />
                            <span className='align-middle ml-50'>Excel</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportPDF(filteredData)}>
                            <File size={15} />
                            <span className='align-middle ml-50'>
                                PDF
                            </span>
                        </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </div>
          </Col>
          {/* <Col className='d-flex align-items-center mt-1' style={{ paddingBottom: '20px' }}>
            <Button.Ripple className='ml-2' tag={Link} to='/addnewbusiness' color='primary'>
              <Plus size={15} />
              <span className='align-middle ml-50'>Add New</span>
            </Button.Ripple>
          </Col> */}
          {/*<Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
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
          </Col>*/}
        </Row>
        <DataTable
          noHeader
          pagination
          /*selectableRows*/
          columns={columns}
          paginationPerPage={paginationperpage}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          /*data={issearch ? filteredData : data}*/
          data={filteredData}
          progressPending={isloading}
          progressComponent={<Spinner color='primary' />}
          responsive={true}
        /*selectableRowsComponent={BootstrapCheckbox}*/
        />
      </Card>
      <AddNewModal open={modal} handleModal={handleModal} />
    </Fragment>
  )
}

export default DataTableWithButtons
