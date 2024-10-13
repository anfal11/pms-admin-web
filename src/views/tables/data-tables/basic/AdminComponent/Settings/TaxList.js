import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useEffect, useState } from 'react'
import { Edit, File, FileText, Grid, Plus, Share, Trash } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner, UncontrolledButtonDropdown } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)

const TaxList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const history = useHistory()

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [TaxList, setTaxList] = useState([])
    const [adInfo, setAdInfo] = useState({})
    const [userInput, setUserInput] = useState({
        tax_name: "",
        tax_percentage: 0,
        vat_percentage: 0
    })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleChangeInt = (e) => {
        setUserInput({ ...userInput, [e.target.name]: parseInt(e.target.value) })
    }
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const userData = JSON.parse(localStorage.getItem('userData'))
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.planTaxList().then(res => {
            const { payload } = res.data
            console.log('TaxList', payload)
            setTaxList(payload)
            setTableDataLoading(false)
        }).catch(err => {
            setTableDataLoading(false)
            Error(err)
            console.log(err)
        })
    }, [resetData])
    const handlePoPupActions = (id, action_id, message) => {
        return MySwal.fire({
            title: message,
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
                const data = {
                    id 
                }
                return useJwt.deletePlanTax(data).then(res => {
                    Success(res)
                    // setTaxList(TaxList.filter(x => x.id !== plan_id))
                    console.log(res)
                    setReset(!resetData)
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
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = TaxList.filter(item => {
                const startsWith =
                    item.tax_name.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.tax_name.toLowerCase().includes(value.toLowerCase())

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
            width: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Tax Name',
            minWidth: '100px',
            sortable: true,
            selector: 'tax_name'
        },
        {
            name: 'Tax Percentage',
            minWidth: '100px',
            sortable: true,
            selector: 'tax_percentage'
        },
        {
            name: 'Vat Percentage',
            minWidth: '100px',
            sortable: true,
            selector: 'vat_percentage'
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    {
                        (subMenuIDs.includes(32)) && <span title="Edit">
                            <Edit size={15}
                                color='teal'
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    setUserInput(row)
                                    toggleModal()
                                }}
                            />
                        </span>
                    }&nbsp;&nbsp;&nbsp;&nbsp;
                    {(subMenuIDs.includes(32)) && <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?')}
                        />
                    </span>}
                </>
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
        doc.text('All ADs', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [{ header: 'title', dataKey: 'title' }, { header: 'body', dataKey: 'body' }, { header: 'created_by', dataKey: 'created_by' }, { header: 'created_at', dataKey: 'created_at' }],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }
    const onSubmit = (e) => {
        e.preventDefault()
        setTableDataLoading(true)
        if (userInput.id) {
            useJwt.editPlanTax({...userInput, id: parseInt(userInput.id)}).then(res => {
                setReset(!resetData)
                setTableDataLoading(false)
                console.log(res)
                toggleModal()
                Success(res)
                setUserInput({
                    tax_name: "",
                    tax_percentage: 0,
                    vat_percentage: 0
                })
            }).catch(err => {
                setTableDataLoading(false)
                Error(err)
                console.log(err.response)
            })
        } else {
            useJwt.createPlanTax(userInput).then(res => {
                setReset(!resetData)
                setTableDataLoading(false)
                console.log(res)
                toggleModal()
                Success(res)
            }).catch(err => {
                setTableDataLoading(false)
                Error(err)
                console.log(err.response)
            })
        }
    }
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Plan Tax</CardTitle>
                <div>
                    <Button.Ripple className='ml-2' color='primary' onClick={toggleModal}>
                        <div className='d-flex align-items-center'>
                            <Plus size={17} style={{ marginRight: '5px' }} />
                            <span >Create Tax</span>
                        </div>
                    </Button.Ripple>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(TaxList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(TaxList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(TaxList)}>
                                <File size={15} />
                                <span className='align-middle ml-50'>
                                    PDF
                                </span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </div>
            </CardHeader>
            <CardBody className='pt-2'>
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
                <CommonDataTable column={column} TableData={searchValue.length ? filteredData : TaxList} TableDataLoading={TableDataLoading} />
            </CardBody>

            {/* create modal start */}
            <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-md'>
                <ModalHeader toggle={toggleModal}>Plan Tax Info</ModalHeader>
                <ModalBody>
                    <Form className="row" style={{ width: '100%', marginTop:'15px' }} onSubmit={onSubmit} autoComplete="off">
                        <Col sm="12" >
                            <FormGroup>
                                <Label for="tax_name">Tax Name<span className='text-danger'>*</span></Label>
                                <Input type="text"
                                    name="tax_name"
                                    id='tax_name'
                                    value={userInput.tax_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="tax name here..."
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" >
                            <FormGroup>
                                <Label for="tax_percentage">Tax Percentage<span className='text-danger'>*</span></Label>
                                <Input type="number"
                                    name="tax_percentage"
                                    id='tax_percentage'
                                    value={userInput.tax_percentage}
                                    onChange={handleChangeInt}
                                    required
                                    placeholder="tax percentage here..."
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" >
                            <FormGroup>
                                <Label for="vat_percentage">Vat Percentage<span className='text-danger'>*</span></Label>
                                <Input type="number"
                                    name="vat_percentage"
                                    id='vat_percentage'
                                    value={userInput.vat_percentage}
                                    onChange={handleChangeInt}
                                    required
                                    placeholder="vat percentage here..."
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" className='text-center'>
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
        </Card>
    )
}

export default TaxList