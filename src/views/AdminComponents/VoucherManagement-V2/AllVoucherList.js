import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import React, { Fragment, useEffect, useState } from 'react'
import {
    CheckSquare,
    Eye,
    XSquare
} from 'react-feather'
import {
    Card,
    CardBody,
    Nav, NavItem, NavLink,
    TabContent, TabPane
} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error } from '../../viewhelper'
const MySwal = withReactContent(Swal)
// import CommonDataTable from '../ClientSideDataTable'
// import Modal from './Slider'
import classnames from 'classnames'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../helper'

import MyPendingVoucherList from './MyPendingVoucherList'
import NeedApproveVoucherList from './NeedApproveVoucherList'
import BulkPurchaseRequest from './Voucher-bulk-purchase/bulk-purchase-request'
import VoucherListView from './VoucherList'
import VoucherDetailsView from './VoucherDetailsView'
import VoucherTempDetailsView from './VoucherTempDetailsView'
import VoucherEdit from './VoucherEdit'
import NewCustomVoucherCodeAdd from './NewCustomVoucherCodeAdd'

const AllVoucherList = () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [TableDataLoading1, setTableDataLoading1] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [VoucherList, setVoucherList] = useState([])
    const [businessList, setBusinessList] = useState([])
    const [pendingVoucherList, setPendingVoucherList] = useState([])
    const [approvepending, setapprovepending] = useState([])
    const [pms_merchantid, setpms_merchantid] = useState('')
    const [resetData, setReset] = useState(false)
    const [VoucherDetails, setVoucherDetails] = useState({})
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    const [isbulkpurchase, setisbulkpurchase] = useState(false)
    const [voucherid, setvoucherid] = useState(null)
    const [voucherQuota, setvoucherQuota] = useState(0)
    const [refresh, setrefresh] = useState(1)

    const [isviewDetails, setisviewDetails] = useState(false)
    const [isviewTempDetails, setisviewTempDetails] = useState(false)
    const [isvoucherEdit, setisvoucherEdit] = useState(false)
    const [newcustomecodeadded, setnewcustomecodeadded] = useState(false)

    const bulkPurchase = (e, item) => {
        e.preventDefault()
        if (item.status && item.quota) {

            setvoucherQuota(item.quota)
            setvoucherid(item.voucherid)
            setisbulkpurchase(true)

        } else if (!item.quota) {
            Error({response: { status: 400, data: { message: 'Bulk voucher is not allow as voucher quota is not avilable.'}}})
           // bulk voucher is not allow as voucher quota is not avilable.
        } else {
            // bulk voucher is not allow as voucher is not active.
            Error({response: { status: 400, data: { message: 'Bulk voucher is not allow as voucher is not active.'}}})
        }
    }

    const getVoucherList = async (/* pms_merchantid */) => {
        //localStorage.setItem('usePMStoken', true)
        // setTableDataLoading(true)
        // setVoucherList({})
        // await useJwt.allVouchersList(/* pms_merchantid */).then(res => {
        //     setTableDataLoading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     console.log(res)
        //     const tempV = []
        //     for (const p in res.data.payload) {
        //         for (const pp of res.data.payload[p]) {
        //             tempV.push(pp)
        //         }
        //     }
        //     setVoucherList(tempV)
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     Error(err)
        //     console.log(err.response)
        //     setTableDataLoading(false)
        // })
    }
    const getPendingVoucherList = async (pms_merchantid) => {
        // setTableDataLoading1(true)
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.pendingVouchersList(pms_merchantid).then(res => {
        //     setTableDataLoading1(false)
        //     localStorage.setItem('usePMStoken', false)
        //     console.log(res)
        //     const tempV = []
        //     for (const p in res.data.payload) {
        //         for (const pp of res.data.payload[p]) {
        //             tempV.push(pp)
        //         }
        //     }
        //     setPendingVoucherList(tempV)
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     // Error(err)
        //     setPendingVoucherList([])
        //     console.log(err.response)
        //     setTableDataLoading1(false)
        // })
    }

    useEffect(() => {

        //setTableDataLoading(true)
        useJwt2.pmsVoucherList().then(async res => {
            console.log(res)
            const { payload } = res.data
            const { approvepending = [], mypending = [], list = []} = payload
            setVoucherList(list)
            setPendingVoucherList(mypending)
            setapprovepending(approvepending)
            setTableDataLoading(false)
        
        }).catch(err => {
            setTableDataLoading(false)
            console.log(err.response)
            Error(err)
        })
        
    }, [refresh])
    //}, [/* pms_merchantid */resetData])

    const handleBusinessChange = (selected) => {
        getPendingVoucherList(selected.value)
        setpms_merchantid(selected.value)
    }

// ** Function to handle filter
const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = VoucherList.filter(item => {
        const startsWith =
          item.Id.toLowerCase().startsWith(value.toLowerCase()) ||
          item.Merchant.MerchantName.toLowerCase().startsWith(value.toLowerCase()) ||
          item.VoucherType.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.Id.toLowerCase().includes(value.toLowerCase()) ||
          item.Merchant.MerchantName.toLowerCase().includes(value.toLowerCase()) ||
          item.VoucherType.toLowerCase().includes(value.toLowerCase())

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
  const handleApprovePoPupActions = (voucherId, message) => {
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
            // return true
            // localStorage.setItem('usePMStoken', true)
            // return useJwt.approveVoucher({ voucherId, approvedBy: "fahim" }).then(res => {
            //     localStorage.setItem('usePMStoken', false)
            //     toast.success('voucher approved successfully')
            //     console.log(res)
            //     setReset(!resetData)
            // }).catch(err => {
            //     localStorage.setItem('usePMStoken', false)
            //     Error(err)
            //     console.log(err.response)
            // })
        },
        buttonsStyling: false,
        allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {
        if (result.isConfirmed) {

        }
    })

}
  const handleRejectPoPupActions = (voucherId, message) => {
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
            // return true
            // localStorage.setItem('usePMStoken', true)
            // return useJwt.rejectVoucher({ voucherId, approvedBy: "fahim" }).then(res => {
            //         localStorage.setItem('usePMStoken', false)
            //         toast.success('voucher rejected successfully')
            //         console.log(res)
            //         setReset(!reset)
            //     }).catch(err => {
            //         localStorage.setItem('usePMStoken', false)
            //         Error(err)
            //         console.log(err)
            //     })
        },
        buttonsStyling: false,
        allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {
        if (result.isConfirmed) {

        }
    })

}

     // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = ['Id', 'MerchantName', 'ExpiryDate', 'VoucherType', 'price', 'Quota']
    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
    let ctr = 0
    keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter

        if (key === 'MerchantName') {
            result += item.Merchant.MerchantName
          }  else {
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
        doc.text('Voucher List', 14, 10)
        const flist = list.map(l => {
            return {...l, ...l.Merchant}
          })
        doc.autoTable({
        body: [...flist],
        columns: [
            { header: 'ID', dataKey: 'Id' }, { header: 'Business Name', dataKey: 'MerchantName' }, { header: 'Expiry Date', dataKey: 'ExpiryDate' },
                { header: 'Voucher Type', dataKey: 'VoucherType' }, { header: 'Price', dataKey: 'price' }, { header: 'Quota', dataKey: 'Quota' }
            ],
            // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
       <Fragment>
        {
           newcustomecodeadded ? <NewCustomVoucherCodeAdd
            setnewcustomecodeadded={setnewcustomecodeadded}
            voucherid={voucherid} 
            refresh={refresh} 
            setrefresh={setrefresh} 
           /> :  <Fragment>
            {
                
                isbulkpurchase && voucherid ?  <BulkPurchaseRequest 
                        voucherQuota={voucherQuota} 
                        voucherid={voucherid} 
                        setvoucherid={setvoucherid} 
                        setisbulkpurchase={setisbulkpurchase}
                    /> :  isviewDetails && voucherid ?  <VoucherDetailsView 
                        voucherid={voucherid} 
                        setvoucherid={setvoucherid} 
                        setisviewDetails={setisviewDetails}
                    /> :  isviewTempDetails && voucherid ? <VoucherTempDetailsView 
                        voucherid={voucherid} 
                        setvoucherid={setvoucherid} 
                        setisviewDetails={setisviewTempDetails}
                    /> :  isvoucherEdit && voucherid ? <VoucherEdit 
                        voucherid={voucherid} 
                        setvoucherid={setvoucherid} 
                        setisviewDetails={setisvoucherEdit}
                        refresh={refresh} 
                        setrefresh={setrefresh} 
                        /> : <Fragment>
                    <Card>
                        <CardBody>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { toggle('1') }}
                                    > Voucher List
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { toggle('2') }}
                                    >My Pending
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '3' })}
                                        onClick={() => { toggle('3') }}
                                    >Approve
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </CardBody>
                    </Card>
                    <Card>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <VoucherListView 
                                    VoucherListData={VoucherList} 
                                    TableDataLoading={TableDataLoading} 
                                    bulkPurchase={bulkPurchase} 
                                    refresh={refresh} 
                                    setrefresh={setrefresh} 
                                    setisviewDetails={setisviewDetails} 
                                    setvoucherid={setvoucherid}
                                    setisvoucherEdit={setisvoucherEdit}
                                    setnewcustomecodeadded={setnewcustomecodeadded}
                                />
                            </TabPane>
                            <TabPane tabId="2">
                                <MyPendingVoucherList 
                                    pendingVoucherListData={pendingVoucherList} 
                                    TableDataLoading={TableDataLoading}
                                    setisviewDetails={setisviewTempDetails} 
                                    setvoucherid={setvoucherid}
                                />
                            </TabPane>
                            <TabPane tabId="3">
                                <NeedApproveVoucherList 
                                approvependingListData={approvepending} 
                                TableDataLoading={TableDataLoading} 
                                refresh={refresh} 
                                setrefresh={setrefresh}
                                setisviewDetails={setisviewTempDetails} 
                                setvoucherid={setvoucherid}
                                />
                            </TabPane>
                        </TabContent>
                    </Card>
                </Fragment>
            }
        </Fragment>
        }
       </Fragment>
        
    )
}

export default AllVoucherList