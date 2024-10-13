import useJwt from '@src/auth/jwt/useJwt'
import Avatar from '@components/avatar'
import React, { Fragment, useEffect, useState, useContext } from 'react'
import { Button, Form, Input, Row, Col, Spinner } from 'reactstrap'
import comingSoonImg from '@src/assets/images/pages/coming-soon.svg'
import { useLocation, useSearchParams, useHistory } from 'react-router-dom'
import { Error } from '../../viewhelper'
import { useDispatch } from 'react-redux'
import { handleLogin } from '../../../redux/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { Slide, toast } from 'react-toastify'
import { Coffee } from 'react-feather'
import '@styles/base/pages/page-misc.scss'
import {BMS_USER, BMS_PASS} from '../../../Configurables'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'


const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as an {role} user to system. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)

const PaymentSuccess = () => {

  const [paymentSuccess, setPaymentSuccess] = useState(null)
  const dispatch = useDispatch()
  const {search} = useLocation()
  const history = useHistory()
  const ability = useContext(AbilityContext)

  // const searchParams = new URLSearchParams(search)
  // const useQuery = () => new URLSearchParams(useLocation().search)
  const query = new URLSearchParams(location.search)


  const userData = JSON.parse(localStorage.getItem('registration_data'))
  useEffect(async () => {
    const card_id = query.get('card_id')
    const user_id = query.get('user_id')


    localStorage.setItem('usePMStoken', false) //for token management
    localStorage.setItem('useBMStoken', false) //for token management
    setPaymentSuccess("pending")
    await useJwt.goCardLessPaymentSuccess({card_id, user_id}).then(async res => {
      setPaymentSuccess("success")
        console.log(res)
        console.log(res.data.payload)
        console.log(res.data.payload.payload)

        const data = {
          ...res.data.payload.payload.user_info,
          // avatar: "https://i.imgur.com/P4b2RHh.png",
          accessToken: res.data.payload.payload.token,
          refreshToken: res.data.payload.payload.token,
          extras: {
            eCommerceCartItemsCount: 5
          },
          role: 'vendor',
          ability: [
            {
              action: 'manage',
              subject: 'VENDOR'
            },
            {
              action: 'manage',
              subject: 'Auth'
            }
          ]
        }

        dispatch(handleLogin(data))
        ability.update(data.ability)
        // localStorage.setItem('username', email)
        toast.success(
          <ToastContent name={data.username} role={data.role} />,
          { transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )

        // await useJwt.getPMStoken({ username: "dddd", module: "kkk" }).then(res => {
        //   localStorage.setItem('PMStoken', res.data.data.access_token)
        //   localStorage.setItem("usePMStoken", false)
        // }).catch(err => {
        //   console.log('getPMStoken', err)
        // })
        
        localStorage.setItem("usePMStoken", false)
        localStorage.setItem("BMSCall", true)
        await useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
          localStorage.setItem('BMStoken', res.data.jwtToken)
          localStorage.setItem("BMSCall", false)
        }).catch(err => {
          localStorage.setItem("BMSCall", false)
          console.log(err)
        })
        
        await useJwt.customerbusinesslistbymobileno({ mobile: Number(res.data.payload.payload.user_info.mobileno) }).then(res =>  {
          console.log(res)
           localStorage.setItem('customerBusinesses', JSON.stringify(res.data.payload))
           history.push(getHomeRouteForLoggedInUser(data.role))
        }).catch(err => {
          Error(err)
          console.log(err)
        })
        
    }).catch(err => {
      Error(err)
      console.log(err)
      console.log(err.response)
        // if (err.response?.status === 401) {
        //     localStorage.setItem("BMSCall", true)
        //     useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
        //       localStorage.setItem('BMStoken', res.data.jwtToken)
        //       localStorage.setItem("BMSCall", false)
        //       setReset(!resetData)
        //     }).catch(err => {
        //       localStorage.setItem("BMSCall", false)
        //       console.log(err)
        //     })
        // } else {
        //     Error(err)
        //     console.log(err)
        //     setTableDataLoading(false)
        //     localStorage.setItem('useBMStoken', false)
        // }
    })
   
}, [])
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <h2 style={{ color: window.TukitakiThemeColor }} className='brand-text ml-1'>RILAC</h2>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          {
            paymentSuccess === "pending" ? <div> 
            <h2 className='mb-1'>Payment is Processing... </h2> 
            <Spinner/>
             </div> : paymentSuccess === "success" ?  <div>
            <h2 className='mb-1'>Payment Successful 🚀</h2>
            <p className='mb-3'>Logging into Dashboard</p>
            </div> : ""
          }
          <img className='img-fluid' src={comingSoonImg} alt='Coming soon page' />
        </div>
      </div>
    </div>
  )
}
export default PaymentSuccess
