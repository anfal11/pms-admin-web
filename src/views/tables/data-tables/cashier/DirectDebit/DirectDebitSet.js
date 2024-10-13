import { useState, useEffect, useRef, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
    ChevronDown, Share, Printer, FileText, File, Search, Copy, Plus, MoreVertical, Edit, Archive, Trash, Send, Eye, ChevronRight
} from 'react-feather'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
    CardBody, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, InputGroup, InputGroupAddon, InputGroupText
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import ReactToPrint from 'react-to-print'
import ComponentToPrint from './DirectDebitInfoPrinter'
import DDSConfirmation from './DDSConfirmation'
import DDSDetails from './DDSDetails'
import DDSForm from './DDSForm'
import { Error } from '../../../../viewhelper'

const DirectDebitSet = () => {
    const [IBAN, setIBAN] = useState(false)
    const [showCompanyName, setshowCompanyName] = useState(false)
    const [merchantData, setMerchantData] = useState([])
    const [isloading, setisloading] = useState(false)
    const [business, setBusiness] = useState([])
    const [AllBusinessList, setAllBusinessList] = useState([])
    const [accountlist, setAccountList] = useState([])
    const [showAccountSelect, setShowAccountSelect] = useState(false)
    const [ALLaccountlist, setALLAccountList] = useState([])
    const [SearchValue, setSearchValue] = useState('')
    const [continueBtn, setcontinueBtn] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [isDataTableloading, setDataTableloading] = useState(false)
    const [TableData, setTableData] = useState([])

    const [errors, setErrors] = useState({
        email: false,
        address: false,
        accountNumber: false,
        sortCode: false
    })

    const [ConditionalRendering, setConditionalRendering] = useState({
        showDDSForm: false,
        showDDSDetails: false,
        showDDSConfirmation: false
    })
    const [userinput, setuserinput] = useState({
        isnewaccount: false,
        isibn: false,
        accountnumber: "",
        address: "",
        city: "",
        companyname: "",
        country: "",
        email: "",
        firstname: "",
        lastname: "",
        postcode: "",
        sortCode: "",
        holderName: "",
        customerid: "",
        isneedmorethenonepersontoauth: false,
        addpaymentid:0
    })

    useEffect(() => {
        useJwt.getMerchantDetails().then(res => {
            // console.log(res.data.payload)
            setMerchantData(res.data.payload)
        }).catch(err => {
            console.log(err)
            Error(err)
        })
    }, [])

    const componentRef = useRef()

    const onChange = (e) => {
        setSearchValue(e.target.value)
    }
    const handleSearchByBusinessID = (option, { action }) => {
        setisloading(true)
        if (action === 'clear') {
            console.log('cleared')
        } else {
            setAccountList([])
            setShowAccountSelect(false)
            const filterArray = AllBusinessList.filter(x => Number(x.id) === Number(option.value))
            const data11 = filterArray[0]

            setConditionalRendering({
                showDDSForm: false,
                showDDSDetails: false,
                showDDSConfirmation: false
            })
            // console.log(data11.address.split(",", 2).toString())
            setuserinput({
                ...userinput,
                address: data11.address.split(",", 2).toString(),
                city: data11.city,
                companyname: data11.businessname,
                country: data11.country,
                email: data11.email,
                postcode: data11.postcode,
                businessid:data11.id,
                accountnumber: '',
                sortCode: '',
                holderName: ''
            })
            useJwt.customerpaymentinfolistbybusinessid({ business_id: option.value }).then(res => {
                console.log(res.data.payload)
                const data22 = (res.data.payload)
                setTableData(res.data.payload)
                setALLAccountList(data22)
                const modifyArray = data22.map(x => {
                    return { value: x.accountnumber, label: x.accountnumber }
                })
                setAccountList(modifyArray)
                setisloading(false)
                setShowAccountSelect(true)
            }).catch(err => {
                console.log(err)
                Error(err)
                setisloading(false)
            })
        }
    }

    const handleAccountNumber = (AcNo) => {
        const filteredArray = ALLaccountlist.filter(x => x.accountnumber === AcNo)
        const data44 = filteredArray[0]
        setuserinput({
            ...userinput,
            isnewaccount: false,
            accountnumber: data44.accountnumber,
            sortCode: data44.sortcode,
            holderName: data44.accountholdername,
            addpaymentid:data44.id
        })
        setConditionalRendering({
            showDDSForm: true,
            showDDSDetails: false,
            showDDSConfirmation: false
        })
        setErrors({
            ...errors,
            accountNumber: false,
            sortCode: false
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setisloading(true)
        setAccountList([])
        setShowAccountSelect(false)
        setBusiness([])
        setConditionalRendering({
            showDDSForm: false,
            showDDSDetails: false,
            showDDSConfirmation: false
        })

        useJwt.customerbusinesslistbycustomerid({ customer_id: SearchValue }).then(res => {
            console.log(res.data.payload)
            setAllBusinessList(res.data.payload.businesslist)
            const data55 = (res.data.payload.businesslist[0])
            const data66 = res.data.payload.customer_info
            setuserinput({
                ...userinput,
                accountnumber: data55.accountnumber,
                address: data55.address,
                city: data55.city,
                companyname: data55.businessname,
                country: data55.country,
                email: data55.email,
                firstname: data66.firstname,
                lastname: data66.lastname,
                postcode: data55.postcode,
                sortCode: data55.sortcode,
                holderName: data55.accountholdername,
                customerid: SearchValue,
                idx:data66.idx
            })
            const modifyArray = res.data.payload.businesslist.map(x => {
                return { value: x.id, label: x.businessname }
            })
            setBusiness(modifyArray)
            setisloading(false)
        }).catch(err => {
            setisloading(false)
            console.log(err)
            Error(err)
        })
    }
    const handleAddNewAccount = () => {
        setuserinput({
            ...userinput,
            isnewaccount: true,
            accountnumber: '',
            sortCode: '',
            holderName: ''
        })
        setErrors({
            ...errors,
            accountNumber: false,
            sortCode: false
        })
        setConditionalRendering({
            showDDSForm: true,
            showDDSDetails: false,
            showDDSConfirmation: false
        })
    }
    const columns = [
        {
            name: 'Acc. Holder Name',
            selector: (row, index) => row.accountholdername,
            minWidth: '100px',
            sortable: false
        },
        {
            name: 'Acc. Number',
            selector: (row, index) => String(row.accountnumber).replace(/.{1,5}/, (m) => "*".repeat(m.length)),
            minWidth: '100px',
            sortable: false
        },
        {
            name: 'Sort Code',
            selector: 'sortcode',
            minWidth: '100px',
            sortable: false
        },
        {
            name: 'Actions',
            minWidth: '200px',
            allowOverflow: true,
            cell: (row) => {
                return (
                    <Button.Ripple style={{ cursor: 'pointer' }} color='primary' onClick={() => handleAccountNumber(row.accountnumber)}>
                        <span className='align-middle ml-50'>Proceed DD Setup</span>
                    </Button.Ripple>
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
            pageCount={TableData.length ? TableData.length / 5 : 1}
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
    return (
        <Fragment>
            {!ConditionalRendering.showDDSDetails && !ConditionalRendering.showDDSConfirmation && <Card>
                <Form className="py-2 px-1 " style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Row>
                        <Col md='6'>
                            <Label>TukiTaki Customer ID</Label>
                            <Input
                                required
                                placeholder="e.g. 613837"
                                id='search-input'
                                type='number'
                                value={SearchValue}
                                onChange={onChange}
                            />
                        </Col>
                        {business.length ? <Col md='3'>
                            <Label for="Searchby">Select a Business</Label>
                            <Select
                                style={{ width: '100%' }}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderColor: '#7367f0'
                                    })
                                }}
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                // name="Searchby"
                                onChange={handleSearchByBusinessID}
                                // defaultValue={business[0]}
                                options={business}
                                isClearable={false}
                                isLoading={false}
                            />
                        </Col> : ''}
                        {/* {accountlist.length ? <Col md='3'>
                            <Label for="Searchby">Select an Account</Label>
                            <Select
                                style={{ width: '100%' }}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderColor: '#7367f0'
                                    })
                                }}
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                // name="Searchby"
                                onChange={handleAccountNumber}
                                // defaultValue={accountlist[0]}
                                options={accountlist}
                                isClearable={false}
                                isLoading={false}
                            />
                        </Col> : ''} */}
                        <Col md='3'>
                            {isloading ? <Button.Ripple className='ml-1' color='primary' disabled={true} style={{ marginTop: '22px' }}>
                                <Spinner color='white' size='sm' />
                                <small className='ml-50'>Loading...</small>
                            </Button.Ripple> : <Button.Ripple className='ml-1' color='primary' type="submit" style={{ marginTop: '22px' }}>
                                <Search size={15} />
                                <span className='align-middle ml-50'>Search</span>
                            </Button.Ripple>
                            }
                        </Col>
                    </Row>
                </Form>
            </Card>}

            {!ConditionalRendering.showDDSDetails && !ConditionalRendering.showDDSConfirmation && showAccountSelect ? <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Select an Account</CardTitle>
                    <Button.Ripple className='ml-1' color='primary' onClick={handleAddNewAccount}>
                        <Plus size={15} />
                        <span className='align-middle ml-50'>Add new</span>
                    </Button.Ripple>
                </CardHeader>
                <DataTable
                    noHeader
                    pagination
                    columns={columns}
                    paginationPerPage={5}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10} />}
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={CustomPagination}
                    data={TableData}
                    progressPending={isDataTableloading}
                    progressComponent={<Spinner color='primary' />}
                    responsive={true}
                />
                <CardBody style={{ paddingTop: '15px' }}>
                </CardBody>
            </Card> : ''}

            {/* <div>
                <ReactToPrint
                    trigger={() => <button>Print this out!</button>}
                    content={() => componentRef.current}
                />
                <div style={{ display: 'none' }}>
                    <ComponentToPrint ref={componentRef} userinput={userinput}/>
                </div>
            </div> */}

            {ConditionalRendering.showDDSForm && <DDSForm
                continueBtn={continueBtn}
                setcontinueBtn={setcontinueBtn}
                IBAN={IBAN}
                setIBAN={setIBAN}
                showCompanyName={showCompanyName}
                setshowCompanyName={setshowCompanyName}
                userinput={userinput}
                errors={errors}
                 setErrors={setErrors}
                setuserinput={setuserinput}
                ConditionalRendering={ConditionalRendering}
                setConditionalRendering={setConditionalRendering} />}

            {ConditionalRendering.showDDSDetails && <DDSDetails
                merchantData={merchantData}
                userinput={userinput}
                setuserinput={setuserinput}
                ConditionalRendering={ConditionalRendering}
                setConditionalRendering={setConditionalRendering} />}


            {ConditionalRendering.showDDSConfirmation && <DDSConfirmation
                setcontinueBtn={setcontinueBtn}
                setSearchValue={setSearchValue}
                setAccountList={setAccountList}
                setShowAccountSelect={setShowAccountSelect}
                setBusiness={setBusiness}
                setConditionalRendering={setConditionalRendering}
                setuserinput={setuserinput} />}
        </Fragment>
    )
}

export default DirectDebitSet