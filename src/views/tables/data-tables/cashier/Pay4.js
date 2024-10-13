// ** React Imports
import { Fragment, useState, forwardRef, useEffect, useContext, useRef } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, ChevronLeft, Trash, TrendingDown, TrendingUp, Check, RefreshCw, RotateCw } from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import {
  Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
  CardBody, Table, CustomInput, Modal, ModalHeader, ModalBody, ModalFooter, Media, CardText, UncontrolledTooltip
} from 'reactstrap'
import Avatar from '@components/avatar'
import useJwt from '@src/auth/jwt/useJwt'
import './cashierStyles/payment.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error, Success, ErrorMessage } from '../../../viewhelper'
const MySwal = withReactContent(Swal)
import Chart from 'react-apexcharts'
import { StatusSet } from '../../../statusdb'
import InputGroup from 'reactstrap/lib/InputGroup'
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon'
import InputGroupText from 'reactstrap/lib/InputGroupText'

const success = '#4BB543'
const options = {
  chart: {
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: { show: true }, //ggg
  // comparedResult: [2, -3, 8],
  labels: ['Used', 'Remaining'],
  stroke: { width: 0 },
  colors: ['#28c76f66', '#28c76f'],
  grid: {
    padding: {
      right: -20,
      bottom: -8,
      left: -20
    }
  },
  plotOptions: {
    pie: {
      startAngle: 0,
      donut: {
        labels: {
          show: true,
          name: {
            offsetY: 15
          },
          value: {
            offsetY: -15,
            formatter(val) {
              return `${parseFloat(val)} %`
            }
          },
          total: {
            show: true,
            offsetY: 15,
            label: 'IOU',
            formatter(w) {
              return ' '
            }
          }
        }
      }
    }
  }/*,
  responsive: [
    {
      breakpoint: 1325,
      options: {
        chart: {
          height: 100
        }
      }
    },
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 120
        }
      }
    },
    {
      breakpoint: 1065,
      options: {
        chart: {
          height: 100
        }
      }
    },
    {
      breakpoint: 992,
      options: {
        chart: {
          height: 120
        }
      }
    }
  ]*/
}

const Pay4 = () => {
  const { payID } = useParams()
  const history = useHistory()
  const timerIdRef = useRef(0)
  // const [currentPage, setCurrentPage] = useState(0)
  const [isloading, setisloading] = useState(false)
  // const [data, setdata] = useState([{ id: '00700', Time: 'test', Customer: 'test', Tendered: 'test', Due: 'test', tik: '#' }])
  const [types, setTypes] = useState([])
  const [series, setseries] = useState([100, 0])
  const [paymenttype, setpaymenttype] = useState(-1)
  const { colors } = useContext(ThemeColors)
  const [businessinfo, setbusinessinfo] = useState({})
  const [invoiceinfo, setinvoiceinfo] = useState({})
  const [invoices, setinvoices] = useState([])
  const [checkinvoiceids, setcheckinvoiceids] = useState([])
  const [selectinvoiceids, setselectinvoiceids] = useState([])
  const [allcheck, setallcheck] = useState(true)
  const [totalamount, settotalamount] = useState(0)
  const [invoiceloading, setinvoiceloading] = useState(true)
  const [enetramount, setenteramount] = useState('')
  const [dueamount, setdueamount] = useState(0)
  const [ischeckdisabled, setischeckdisabled] = useState(false)
  const [submitenable, setsubmitenable] = useState(false)
  const [paymentdata, setpaymentdata] = useState([])
  const [subpaymentloading, setsubpaymentloading] = useState(false)
  const [totalinvoiceloading, settotalinvoiceloading] = useState(false)
  const [errormsg, seterrormsg] = useState('')
  const [Allowance, setAllowance] = useState('')
  const [plusMinusIoU, setplusMinusIoU] = useState(0)
  const [modal, setModal] = useState(false)
  const [MobilePaymentModal, setMobilePaymentModal] = useState(false)
  const [CardPaymentModal, setCardPaymentModal] = useState(false)
  const [MinputErr, setMinputErr] = useState(false)
  const [serverselectedinvoiceinfo, setserverselectedinvoiceinfo] = useState([])
  const [anypaymentisinloadingmode, setanypaymentisinloadingmode] = useState(true)
  const [isrefreshing, setisrefreshing] = useState(false)
  const [subpaymentamount, setsubpaymentamount] = useState(0)
  const [resend, setresend] = useState(false)
  const [subpaymentid, setsubpaymentid] = useState(0)
  const [autoreloadingongoing, setautoreloadingongoing] = useState(false)
  const [intervalfnc, seintervalfnc] = useState(null)
  const [autoreloadingonprocess, setautoreloadingonprocess] = useState(false)

  const subpaymentsectionautoreloadoff = () => {
     console.log('autoreloadingonprocess ', autoreloadingonprocess)
   // if (autoreloadingonprocess) {
      setautoreloadingongoing(false)
      clearInterval(window.customTimeInterval)
      seintervalfnc(null)
      setautoreloadingonprocess(false)
      //window.customTimeInterval = null
   // }
  }

  const paymentRefresh = (if_refresh = true) => {
   
    if (if_refresh) {
      setisrefreshing(true)
    }
    
    useJwt.customerinvoicedetailswithsubpaymentinfo({ receipt_id: payID }).then(res => {
      const { invoicepaymentinfo = [] } = res.data.payload
      let ispaymentinpending = false, alreadypaid = 0
      const paymentdata = invoicepaymentinfo.map((item, index) => {
        alreadypaid = alreadypaid + item.amount
        if (!item.payment_success) {
          ispaymentinpending = true
        }
        return {
          id: item.id,
          time: new Date(item.time).toLocaleString(),
          typename: item.type_name,
          amount: item.amount,
          payment_success: item.payment_success,
          payment_type_id: item.type_id
        }
      })

      setpaymentdata(paymentdata || [])
      //auto reloading..start
      if (!ispaymentinpending) {
        subpaymentsectionautoreloadoff()
      } 
       //auto reloading..end
      setanypaymentisinloadingmode(ispaymentinpending)
      if (if_refresh) {
        setisrefreshing(false)
      }
      
    }).catch(err => {

      if (if_refresh) {
        setisrefreshing(false)
        Error(err)
      }
      console.log(err)
     
    })
  }

  const subpaymentsectionautoreloadon = () => {

     if (!autoreloadingongoing) {

      // 10 s interval...
       const inter =  setInterval(() => { 
          setautoreloadingongoing(true)
          paymentRefresh(false)
          console.log('interval calling..')
        }, 15000)

        window.customTimeInterval = inter

        setautoreloadingonprocess(true)

       // seintervalfnc(inter)
    }
        
  }

  useEffect(() => {

    useJwt.customerinvoicedetailswithsubpaymentinfo({ receipt_id: payID }).then(res => {
      console.log(res.data.payload)
      const { businessinfo = {}, invoiceinfo = {}, invoicepaymentinfo = [], selectedinvoiceinfo = {} } = res.data.payload
      const { invoices = [] } = invoiceinfo
      let alreadypaid = 0, ispaymentinpending = false
      console.log('invoicepaymentinfo ', invoicepaymentinfo)
      console.log('businessinfo ', businessinfo)
      const paymentdata = invoicepaymentinfo.map((item, index) => {
        alreadypaid = alreadypaid + item.amount
        if (!item.payment_success) {
          ispaymentinpending = true
        }
        return {
          id: item.id,
          time: new Date(item.time).toLocaleString(),
          typename: item.type_name,
          amount: item.amount,
          payment_success: item.payment_success,
          payment_type_id: item.type_id
        }
      })

      if (ispaymentinpending) {
         subpaymentsectionautoreloadon()
      }
      //console.log('selectedinvoiceinfo ', selectedinvoiceinfo)
      const selectedinvoiceids = selectedinvoiceinfo ? selectedinvoiceinfo['invoice_ids'] : []
      const convertinnumber = selectedinvoiceids
      setanypaymentisinloadingmode(ispaymentinpending)
      setserverselectedinvoiceinfo(convertinnumber || [])
      setbusinessinfo(businessinfo || {})
      setinvoiceinfo(invoiceinfo)
      setpaymentdata(paymentdata || [])
      setischeckdisabled(paymentdata.length || false)
      setinvoices(invoices)
      if (invoices.length) {
        const invoiceids = []
        let total = 0, subtotal = 0
        invoices.forEach((item, index) => {
          invoiceids[index] = item.row_id
          total = total + item.subtotal_amount
          if (convertinnumber.includes(item.row_id)) {
            subtotal = subtotal + item.subtotal_amount
          }
        })
        total = +total.toFixed(2)

        setcheckinvoiceids(convertinnumber.length ? convertinnumber : invoiceids)
        setselectinvoiceids(convertinnumber.length ? convertinnumber : invoiceids)

        if (convertinnumber.length) {
          setallcheck(false)
        }

        const due = subtotal - alreadypaid
        settotalamount(total)
        console.log('total - subtotal ', total - subtotal)
        if (alreadypaid && (due === 0)) {
          setsubmitenable(true)
          //console.log('total - subtotal2 ', total - subtotal)
        }
        setdueamount(alreadypaid ? due : total)
        setinvoiceloading(false)
        if (businessinfo) {
          const iouused = businessinfo.iou_used
          const ioulimit = businessinfo.iou_limit
          if (iouused) {
            const usepercent = +parseFloat((iouused / ioulimit) * 100).toFixed(2)
            const useremaining = +parseFloat(100 - usepercent).toFixed(2)
            //console.log(iouused, ioulimit)
            //console.log(usepercent, useremaining)
            setseries([usepercent, useremaining])
          }

        }

      }
    }).catch(err => {
      console.log(err)
      Error(err)
    })

    useJwt.getAllPaymentType().then(res => {
      console.log(res.data.payload)
      setTypes(res.data.payload)
    }).catch(err => {
      console.log(err)
      Error(err)
    })
  }, [])

  const paymenttypeselected = (index, typeid) => {

    if (paymenttype === -1 && index === 0) {
      return 'info'
    } else if (paymenttype !== -1 && typeid === paymenttype) {
      return 'info'
    } else {
      return 'secondary'
    }
  }

  const onChange = (e) => { setenteramount(e.target.value) }

  const subpaymentadd = (e) => {
    e.preventDefault()
    seterrormsg('')
    // if (enetramount.includes("e") || enetramount.includes("+")) {
    //   alert(enetramount, 'is invalid')
    // }
    if (Number(enetramount) === 0) {
      return
    }
    if (enetramount) {
      if (enetramount > dueamount) {
        seterrormsg('Amount is exceed !')
        return 0
      }
      let typeinfo = {}, typeid = 0
      if (paymenttype === -1) {
        typeinfo = types[0]
        typeid = types[0].id
      } else {
        types.forEach(item => {
          if (item.id === paymenttype) {
            typeinfo = item
          }
        })
      }

      const ioulimit = (parseFloat(businessinfo['iou_limit']) - parseFloat(businessinfo['iou_used'])) || 0
      if (typeinfo.id === 4 && enetramount > ioulimit) {
        seterrormsg('This customer has reached to IOU limit')
        return 0
      }

      setsubpaymentloading(true)
      const sinvo = selectinvoiceids.map(i => Number(i))
      const payment_type_id = typeid || paymenttype
      setsubpaymentamount(enetramount)
      useJwt.subPayment({
        payment_type_id,
        amount: +enetramount,
        receipt_id: payID,
        selectdinvoiceid: sinvo
      }).then(res => {
        if (paymenttype === 3) {
          setMobilePaymentModal(true)
          setanypaymentisinloadingmode(true)
          setTimeout(() => setMobilePaymentModal(false), 5000)
          
        } else if (paymenttype === 5) {
          setCardPaymentModal(true)
          setanypaymentisinloadingmode(true)
          setTimeout(() =>  setCardPaymentModal(false), 5000)
          
        }
        // console.log(res)
        Success(res)
        console.log('paymenttype ', paymenttype)
        if (paymenttype === 4) {
          // console.log
          const iou_used = businessinfo.iou_used + Number(enetramount)
          console.log('businessinfo.iou_used ', businessinfo.iou_used, 'enetramount ', enetramount)
          //graph change...
          const ioulimit = businessinfo.iou_limit
          if (iou_used) {
            const usepercent = +parseFloat((iou_used / ioulimit) * 100).toFixed(2)
            const useremaining = +parseFloat(100 - usepercent).toFixed(2)
            setseries([usepercent, useremaining])
          }

          setbusinessinfo({ ...businessinfo, iou_used })
        }
        setsubpaymentloading(false)
        let payment_success = true
        if (payment_type_id === 3 || payment_type_id === 5) {
          payment_success = false
          //auto reload..
          subpaymentsectionautoreloadon()
        }
        setpaymentdata([
          {
            id: res.data.payload.id,
            time: new Date().toLocaleString(),
            typename: typeinfo['payment_type_name'],
            amount: +enetramount,
            payment_success,
            payment_type_id
          },
          ...paymentdata
        ])
        setischeckdisabled(true)
        setenteramount('')
        setdueamount(dueamount - enetramount)
        if ((dueamount - enetramount) === 0) {
          setsubmitenable(true)
        }

      }).catch(e => {
        setsubpaymentloading(false)
        console.log(e)
        Error(e)
      })

    }

  }


  const paymentSelectChange = (typeid) => {
    setpaymenttype(typeid)
    console.log(typeid)
  }

  const removedeleteitem = (id) => {

    const updatedfilteredData = paymentdata.filter(item => {
      if (item.id === id) {
        if (item.payment_type_id === 4 || item.payment_type_id === "4") {
          const iou_used = businessinfo.iou_used - Number(item.amount)
          //graph change...
          const ioulimit = businessinfo.iou_limit
          if (iou_used) {
            const usepercent = +parseFloat((iou_used / ioulimit) * 100).toFixed(2)
            const useremaining = +parseFloat(100 - usepercent).toFixed(2)
            setseries([usepercent, useremaining])
          }

          setbusinessinfo({ ...businessinfo, iou_used })
        }
        setdueamount(Math.abs(dueamount + item.amount))
        return false
      } else {
        return true
      }
    })

    let ishavependingmode = false
    paymentdata.every(v => {
      if (!v.payment_success) {
        ishavependingmode = true
        return false
      }
      return true
    })

    if (ishavependingmode) {
      setanypaymentisinloadingmode(true)
    } else {
      setanypaymentisinloadingmode(false)
    }

    setsubmitenable(false)
    setpaymentdata(updatedfilteredData)
  }

  const deletesubpayment = (id) => {
    console.log(id)
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
        //fetch business delete api...
        return useJwt.deleteSubPayment({ id }).then(res => {

          return res

        }).catch(err => {
          console.log(err.response)
          Error(err)
          return false
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {

      if (result.isConfirmed) {
        removedeleteitem(id)
        MySwal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The payment has been deleted.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }

    })
  }
  const tenderedAmount = () => {
    let total = 0
    paymentdata.forEach(item => {
      total = total + item.amount
    })
    return +total.toFixed(2)
  }
  const thousandSeparator = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  const submittotalinvoicepayment = (e) => {
    console.log({
      receipt_id: payID,
      paid_invoice_ids: selectinvoiceids,
      all_invoice_ids: checkinvoiceids,
      amount: tenderedAmount(),
      apibaseurl: window.API_BASE_URL
    })
    settotalinvoiceloading(true)
    useJwt.totalInvoicePayment({
      receipt_id: payID,
      paid_invoice_ids: selectinvoiceids,
      all_invoice_ids: checkinvoiceids,
      amount: tenderedAmount(),
      apibaseurl: window.API_BASE_URL
    }).then(res => {

      Success(res)
      settotalinvoiceloading(false)
      history.push("/payment")

    }).catch(e => {
      settotalinvoiceloading(false)
      console.log(e)
      Error(e)
    })
  }
  const fillRemaining = () => {
    const due_amountconvert = +dueamount
    const due_amount = +due_amountconvert.toFixed(2)
    setenteramount(due_amount)
  }
  const checkboxclick = (e) => {
    let due_amount = 0
    if (e.target.checked) {
      if (e.target.name === 'allcheck') {
        setselectinvoiceids([...checkinvoiceids])
        setallcheck(true)
        due_amount = totalamount
      } else {
        setselectinvoiceids([...selectinvoiceids, e.target.name])
        setallcheck(false)
        invoices.forEach(item => {
          if (e.target.name === item.row_id) {
            console.log(item)
            due_amount = parseFloat(dueamount) + item.subtotal_amount
            console.log('due_amount ', due_amount, 'dueamount ', dueamount, 'subtotal_amount ', item.subtotal_amount)

          }
        })
      }

    } else {
      if (e.target.name === 'allcheck') {
        setselectinvoiceids([])
      } else {
        setselectinvoiceids(selectinvoiceids.filter(item => item !== e.target.name))
        invoices.forEach(item => {
          if (e.target.name === item.row_id) {
            due_amount = dueamount - item.subtotal_amount

            console.log('due_amount ', due_amount, 'dueamount ', dueamount, 'subtotal_amount ', item.subtotal_amount)
          }
        })
      }

      setallcheck(false)
    }

    due_amount = (parseFloat(due_amount) - parseFloat(tenderedAmount()))

    due_amount = +due_amount.toFixed(2)

    setdueamount(due_amount)

    console.log(e.target.name, e.target.checked) //checked
  }

  const resendNotification = (id) => {

    setresend(true)
    setsubpaymentid(id)
    useJwt.resendnotificationforpay({ subpaymentid: id }).then(res => {

      Success(res)
      setresend(false)
      setsubpaymentid(0)

    }).catch(e => {

      setresend(false)
      setsubpaymentid(0)
      console.log(err)
      Error(err)
    })

  }
  //console.log('paymentdata ', paymentdata)
  const PaymentTable = () => {

    return (
      <Fragment>
        {
          isrefreshing ? <Spinner color='secondary' className='mr-25' style={{ fontSize: 10 }} /> : <Button.Ripple color='primary' 
          size="sm"  onClick={paymentRefresh} className="custom_button">
          <span className='align-middle' style={{paddingLeft:'2px'}}>Refresh</span>
        </Button.Ripple>

          // <RefreshCw className='mr-25' size={18} style={{ cursor: 'pointer', margin: '4px' }} onClick={paymentRefresh} />

        }
        <Table responsive bordered size="sm" >
          <tbody>
            {
              paymentdata.map((item, index) => <tr key={index}>
                <td scope='col' className='text-nowrap'>
                  #{index + 1}

                </td>
                <td scope='col' className='text-nowrap'>{item.time} </td>
                <td scope='col' className='text-nowrap'>
                  {
                    item.payment_success ? <Check className='mr-25' size={18} /> : <Spinner color='primary' className='mr-25' size='sm' />
                  }
                  {item.typename} &nbsp;

                  {
                    ((item.payment_type_id === 3) && !item.payment_success) ? (resend && subpaymentid === item.id) ? <Spinner color='primary' className='mr-25' size='sm' /> : <Fragment>
                      {/* <RotateCw className='mr-25' style={{ cursor: 'pointer' }} size={13} onClick={(e) => resendNotification(item.id)} id={`positionBottom${item.id}`} /> */}
                      <Button.Ripple color='primary' size="sm" className="custom_button" onClick={(e) => resendNotification(item.id)} id={`positionBottom${item.id}`}>
                        <span className='align-middle' style={{paddingLeft:'2px'}}>Reset</span>
                      </Button.Ripple>
                      {/*<UncontrolledTooltip placement='bottom' target={`positionBottom${item.id}`}>
                        Resend
                      </UncontrolledTooltip>*/}
                    </Fragment> : null
                  }

                </td>
                <td scope='col' className='text-nowrap'> {window.CURRENCY_SYMBOL} {thousandSeparator((+item.amount).toFixed(2))} </td>
                <td scope='col' className='text-nowrap'>
                  {
                    (item.payment_success === true && (item.payment_type_id === 3 || item.payment_type_id === 5)) ? <Trash size={15} color='#968f8f' /> : <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={(e) => deletesubpayment(item.id)} />
                  }

                </td>
              </tr>)
            }

          </tbody>
        </Table>
      </Fragment>
    )
  }

  const InvoiceTable = () => {
    return (
      <Fragment>
        {
          invoiceloading ? <Spinner color='primary' /> : <Table responsive bordered size='sm' >
            <thead>
              <tr>
                <th scope='col' className='text-nowrap'> <CustomInput disabled={ischeckdisabled} name='allcheck' inline type='checkbox' id='allcheck' onChange={(e) => checkboxclick(e)} checked={allcheck} /> </th>
                <th scope='col' className='text-nowrap'>Time </th>
                <th scope='col' className='text-nowrap'>Invoice ID </th>
                <th scope='col' className='text-nowrap'> Till</th>
                <th scope='col' className='text-nowrap'> Amount </th>
                <th scope='col' className='text-nowrap'>Status </th>
              </tr>
            </thead>
            <tbody>
              {
                invoices.length ? invoices.map((item, index) => <tr key={index}>
                  <td className='text-nowrap'> <CustomInput inline disabled={ischeckdisabled} type='checkbox' name={item.row_id} id={item.row_id} onChange={(e) => checkboxclick(e)} checked={selectinvoiceids.includes(item.row_id)} /></td>
                  <td className='text-nowrap'>{item['invoice_time']}</td>
                  <td className='text-nowrap'>{item['invoice_id']}</td>
                  <td className='text-nowrap'>{item['till_id']}</td>
                  <td className='text-nowrap'>{window.CURRENCY_SYMBOL} {thousandSeparator((+item['subtotal_amount']).toFixed(2))}</td>
                  <td className='text-nowrap'><Badge color={StatusSet(item['status']).color} pill>
                    {StatusSet(item['status']).title}
                  </Badge></td>
                </tr>) : null
              }

            </tbody>
          </Table>
        }
      </Fragment>

    )
  }
  const onModalIOUChange = (e) => {
    setAllowance(e.target.value)
    // setTimeout(() => console.log(Number(Allowance), Number(businessinfo['iou_limit'])), 500)
  }
  const onsubmit = (e) => {
    e.preventDefault()
    // console.log(Number(Allowance) < Number(businessinfo['iou_limit']))
    if (Allowance === '' || typeof businessinfo.id === 'undefined') {
      return 0
    }
    if (Number(Allowance) < Number(businessinfo['iou_limit'] || 0)) {
      setMinputErr(true)
      return 0
    }
    setisloading(true)
    setMinputErr(false)
    console.log({ change: Allowance, typeid: 1, busnessid: businessinfo.id })
    useJwt.customerIOUmanage({ change: Number(Allowance), typeid: 1, busnessid: businessinfo.id }).then(res => {
      console.log(res)
      setisloading(false)
      setbusinessinfo({ ...businessinfo, iou_limit: Number(Allowance) })
      setAllowance('')

      //graph change...
      const iouused = businessinfo.iou_used
      const ioulimit = Number(Allowance)
      if (iouused) {
        const usepercent = +parseFloat((iouused / ioulimit) * 100).toFixed(2)
        const useremaining = +parseFloat(100 - usepercent).toFixed(2)
        setseries([usepercent, useremaining])
      }


    }).catch(err => {
      console.log(err)
      Error(err)
      setisloading(false)
    })
  }

  return (
    <>
      <Button.Ripple className='mb-2 ml-2' color='primary' onClick={() => history.goBack()}>
        <ChevronLeft size={10} />
        <span className='align-middle ml-50'>Back</span>
      </Button.Ripple>
      <Row>
        <Col sm='6'>
          <Card className="d-flex justify-content-center p-2">
            <Media>
              <Avatar color={'light-success'} icon={<TrendingUp size={24} />} className='mr-2' style={{ padding: '7px' }} />
              <Media className='my-auto' body>
                <h4 className='font-weight-bolder mb-0'>{window.CURRENCY_SYMBOL} {thousandSeparator((+tenderedAmount()).toFixed(2))}</h4>
                <CardText className='font-small-3 mb-0'>{'Tendered Amount'}</CardText>
              </Media>
            </Media>
          </Card>
        </Col>
        <Col sm='6'>
          <Card className="d-flex justify-content-center p-2">
            <Media>
              <Avatar color={'light-danger'} icon={<TrendingDown size={24} />} className='mr-2' style={{ padding: '7px' }} />
              <Media className='my-auto' body>
                <h4 className='font-weight-bolder mb-0'>{window.CURRENCY_SYMBOL} {thousandSeparator(parseFloat(dueamount).toFixed(2))}</h4>
                <CardText className='font-small-3 mb-0'>{'Due Amount'}</CardText>
              </Media>
            </Media>
          </Card>
        </Col>
      </Row>
      <Card className='pt-1 pay4'>
        <Row>
          <Col md="5">
            {!types.length ? <Spinner color='primary' /> : types.map((type, index) => <Button.Ripple key={index} size="sm" className='ml-1 mb-1' color={paymenttypeselected(index, type.id)} onClick={(e) => paymentSelectChange(type.id)}>
              <span className='align-middle'>{type.payment_type_name}</span>
            </Button.Ripple>)
            }
            <div className='paycardBorder pt-1'>

              <Form className="d-flex flex-wrap my-1 ml-1" style={{ width: '100%' }} autoComplete="off" onSubmit={subpaymentadd}>
                {
                  errormsg ? <FormGroup style={{ width: '100%' }}>
                    <Label style={{ color: 'red' }}>{errormsg}</Label>
                  </FormGroup> : null
                }

                <FormGroup style={{ width: '70%' }}>
                  <Input
                    min="0"
                    placeholder="0.00"
                    type='number'
                    id='search-input'
                    step="0.01"
                    presicion={2}
                    onChange={onChange}
                    value={enetramount}
                  />
                </FormGroup>
                <FormGroup>
                  {
                    subpaymentloading ? <Button.Ripple className='ml-1' color='primary' disabled={true}>
                      <Spinner color='white' size='sm' />
                      <small className='ml-50'></small>
                    </Button.Ripple> : <Button.Ripple className='ml-1' color='primary' type='submit' disabled={submitenable}>
                      <span className='align-middle ml-50'>Add</span>
                    </Button.Ripple>
                  }
                </FormGroup>
              </Form>
              <Button.Ripple className='ml-1 mb-1' color='info' size="sm" onClick={fillRemaining}>
                <span className='align-middle ml-50'>Fill remains</span>
              </Button.Ripple>

              <Button.Ripple className='ml-1 mb-1' color='info' size="sm" onClick={() => setModal(true)}>
                <span className='align-middle ml-50'>Manage IOU</span>
              </Button.Ripple>
              {/* MODAL */}
              <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                <ModalHeader toggle={() => {
                  setModal(!modal)
                  setAllowance('')
                }}>Manage IOU</ModalHeader>
                <ModalBody className="px-md-5 px-1">
                  <p>Customer Name : <span className="float-right">{invoiceinfo['customername'] || ""}</span></p>
                  <p>Customer ID : <span className="float-right">{invoiceinfo['customer_id'] || ""}</span></p>
                  <p>Business Name : <span className="float-right">{businessinfo['businessname'] || ""} </span></p>
                  <p>Allowance : <span className="float-right">{window.CURRENCY_SYMBOL} {businessinfo['iou_limit'] ? thousandSeparator((+businessinfo['iou_limit']).toFixed(2)) : 0}</span></p>
                  <p>Used : <span className="float-right">{window.CURRENCY_SYMBOL} {businessinfo['iou_limit'] ? thousandSeparator((+businessinfo['iou_used']).toFixed(2) || 0) : 0}</span></p>
                  <p>Remaining : <span className="float-right">{window.CURRENCY_SYMBOL} {businessinfo['iou_limit'] ? thousandSeparator((+(parseFloat(businessinfo['iou_limit'] || 0) - parseFloat(businessinfo['iou_used'] || 0))).toFixed(2)) : 0}</span></p>
                  
                  <div className='w-100'>
                    <p className="text-center mb-0">IOU Allowance increase to</p>
                    <Form className="p-1" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                      <InputGroup className='input-group-merge w-100 mb-1'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            {window.CURRENCY_SYMBOL}
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          min="0"
                          placeholder="0.00"
                          type='number'
                          id='search-input'
                          onChange={onModalIOUChange}
                          value={Allowance}
                        />
                      </InputGroup>
                      {MinputErr && <small style={{ color: 'red', margin: '-10px 0px 10px 10px', display: 'block' }}>must be greater than Allowance</small>}
                      <FormGroup>
                        <div className='d-flex justify-content-center'>
                          <Button.Ripple color='danger' onClick={() => {
                            setModal(!modal)
                            setAllowance('')
                          }} >
                            <span className='align-middle ml-50'>Cancel</span>
                          </Button.Ripple>
                          {
                            isloading ? <Button.Ripple className='ml-1' color='primary' disabled={true}>
                              <Spinner color='white' size='sm' />
                              <small className='ml-50'>Loading...</small>
                            </Button.Ripple> : <Button.Ripple className='ml-1' color='primary' type='submit' >
                              <span className='align-middle ml-50'>Add</span>
                            </Button.Ripple>
                          }
                        </div>
                      </FormGroup>
                    </Form>
                  </div>
                </ModalBody>
              </Modal>
              {/* MODAL */}

              {/* MODAL for mobile payment*/}
              <Modal isOpen={MobilePaymentModal} toggle={() => setMobilePaymentModal(!MobilePaymentModal)}>

                <ModalHeader toggle={() => setMobilePaymentModal(!MobilePaymentModal)}>

                </ModalHeader>

                <ModalBody className="px-md-5 px-1">
                  <h3>Payment request for mobile payment to customer has been sent successfully.</h3>
                    <p> Payment status will be updated just after it gets completed in the payment list section.
                      Please click refresh button for manual check </p>
                </ModalBody>
                <div className="w-100 text-center pb-2">
                  <Button.Ripple color='danger' onClick={() => setMobilePaymentModal(!MobilePaymentModal)} >
                    <span className='align-middle ml-50'>Cancel</span>
                  </Button.Ripple>
                </div>
              </Modal>
              {/* MODAL for mobile payment*/}

              {/* MODAL for card payment*/}
              <Modal isOpen={CardPaymentModal} toggle={() => setCardPaymentModal(!CardPaymentModal)}>

                <ModalHeader toggle={() => setCardPaymentModal(!CardPaymentModal)}>

                </ModalHeader>

                <ModalBody className="px-md-5 px-1" style={{ textAlign: 'center' }}>
                  <h3>Please insert the card </h3>
                  <p>Ready to process payment</p>
                  <p>{window.CURRENCY_SYMBOL} {subpaymentamount}</p>
                </ModalBody>
                <div className="w-100 text-center pb-2">
                  <Button.Ripple color='danger' onClick={() => setCardPaymentModal(!CardPaymentModal)} >
                    <span className='align-middle ml-50'>Cancel</span>
                  </Button.Ripple>
                </div>
              </Modal>
              {/* MODAL for card payment*/}

            </div>
            <div className='paycardBorder'>
              <Row >
                <Col sm='12'>
                  <PaymentTable />
                </Col>

                <Col sm='12' className='text-center'>
                  {
                    totalinvoiceloading ? <Button.Ripple className='my-1' color='primary' disabled={true} >
                      <Spinner color='white' size='sm' />
                      <span className='align-middle ml-50'>Submit</span>
                    </Button.Ripple> : <Button.Ripple className='my-1' color='primary' disabled={!(dueamount < 0.2 && anypaymentisinloadingmode === false)} onClick={submittotalinvoicepayment} >
                      <span className='align-middle ml-50'>Submit</span>
                    </Button.Ripple>
                  }

                </Col>
              </Row>
            </div>
          </Col>
          <Col md="7">
            <Row className='pt-1'>
              <Col sm="7">
              <Table responsive size="sm" className="detailsshowtable" >
                <tbody>
                     <tr>
                     <td scope='col' className='text-nowrap textbold textalignright' >Customer Name : </td>
                     <td scope='col' className='text-nowrap smallfontsize '>{invoiceinfo['customername'] || ""} </td>
                     </tr>
                     <tr>
                     <td scope='col' className='text-nowrap textbold textalignright'>Customer ID : </td>
                     <td scope='col' className='text-nowrap smallfontsize'>{invoiceinfo['customer_id'] || ""} </td>
                     </tr>
                     <tr>
                     <td scope='col' className='text-nowrap textbold textalignright'>Business Name : </td>
                     <td scope='col' className='text-nowrap smallfontsize '>{businessinfo['businessname'] || ""}</td>
                     </tr>

                     <tr>
                     <td scope='col' className='text-nowrap'> </td>
                     <td scope='col' className='text-nowrap'> </td>
                     </tr>

                      <tr>
                     <td scope='col' className='text-nowrap textbold textalignright'>Allowance : </td>
                     <td scope='col' className='text-nowrap smallfontsize '>{window.CURRENCY_SYMBOL} {thousandSeparator((+(businessinfo['iou_limit'] ? businessinfo['iou_limit'] : 0)).toFixed(2))} </td>
                     </tr>
                     <tr>
                     <td scope='col' className='text-nowrap textbold textalignright'>Used : </td>
                     <td scope='col' className='text-nowrap smallfontsize '>{window.CURRENCY_SYMBOL} {thousandSeparator((+(businessinfo['iou_used'] ? businessinfo['iou_used'] : 0)).toFixed(2)) }</td>
                     </tr>
                     <tr>
                     <td scope='col' className='text-nowrap textbold textalignright'>Remaining : </td>
                     <td scope='col' className='text-nowrap smallfontsize '>{window.CURRENCY_SYMBOL} {thousandSeparator((+businessinfo['iou_limit'] ? (parseFloat(businessinfo['iou_limit'] || 0) - parseFloat(businessinfo['iou_used'] || 0)) : 0).toFixed(2))} </td>
                     </tr>

                </tbody>
              </Table>
              {/*  <p>Customer Name : {invoiceinfo['customername'] || ""} </p>
                <p>Customer ID : {invoiceinfo['customer_id'] || ""}</p>
                <p>Business Name : {businessinfo['businessname'] || ""} </p>
            

                <p>Allowance : {window.CURRENCY_SYMBOL} {thousandSeparator((+(businessinfo['iou_limit'] ? businessinfo['iou_limit'] : 0)).toFixed(2))} </p>
                <p>Used : {window.CURRENCY_SYMBOL} {thousandSeparator((+(businessinfo['iou_used'] ? businessinfo['iou_used'] : 0)).toFixed(2)) }</p>
                <p>Remaining : {window.CURRENCY_SYMBOL} {thousandSeparator((+businessinfo['iou_limit'] ? (parseFloat(businessinfo['iou_limit'] || 0) - parseFloat(businessinfo['iou_used'] || 0)) : 0).toFixed(2))}</p>
              */}
              </Col>
              <Col sm="5">
                <Chart options={options} series={series} type='donut' height={120} />
              </Col>

              <Col sm="12">
                <div className="paycardBorder pt-1 mr-1 mt-2">
                  <InvoiceTable />
                </div>
              </Col>
            </Row>
            <p className="float-right mr-2 mt-2">Total Amount : {window.CURRENCY_SYMBOL} {thousandSeparator((+totalamount || 0).toFixed(2))}</p>
          </Col>
        </Row>
      </Card ></>
  )
}

export default Pay4