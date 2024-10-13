import { useSkin } from "@hooks/useSkin"
import useJwt from "@src/auth/jwt/useJwt"
import { AbilityContext } from "@src/utility/context/Can"
import "@styles/base/pages/page-auth.scss"
import { isObjEmpty, selectThemeColors } from "@utils"
import classnames from "classnames"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { Plus } from "react-feather"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import Select from 'react-select'
import { Button, CustomInput,  Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabHeader, TabContent, TabPane, FormGroup, Input, Label, Spinner } from "reactstrap"
import pms from '../../../assets/images/icons/RILAC-Logo.svg'
import { PaymentElement, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { KeyboardReturn } from "@mui/icons-material"
import { loadStripe } from "@stripe/stripe-js"
import PaypalCardForm from "./PaypalCardForm"
import GoCardless from "../../pages/authentication/GoCardless"


const TestCreditCardDetails = () => {
    const ability = useContext(AbilityContext)

    const [skin, setSkin] = useSkin()

    const history = useHistory()

    const dispatch = useDispatch()

    const { register, errors, handleSubmit, trigger } = useForm()

    const [valErrors, setValErrors] = useState({})
    const [docerror, setdocerror] = useState({})
    const [stripePromise, setStripePromise] = useState('')
    const [isLoad, setIsLoad] = useState(false)
    const [amount, setAmount] = useState(0)
    // let stripe = useStripe()
    // let elements = useElements()
    const childFunc = useRef(null)
    // const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => setActiveTab(tab)

    const [planDetails, setPlanDetails] = useState({...JSON.parse(localStorage.getItem('planDetails'))})

    // setAmount(planDetails.price_onetime)

    const [userInput, setUserInput] = useState({
        ...JSON.parse(localStorage.getItem('registration_data')),
        // businessname: '',
        // email: '',
        // mobile: '',
        // password: '',
        country: 'UK',
        // businesscategoryids: 0,
        // status: 1,
        // logo: '',
        // city: '',
        // city_id: 0,
        // web_login: true,
        // card_name: '',
        // card_number: '',
        // card_address: '',
        // card_expiry: '',
        // card_cvc: '',
        payment_method_id: 2

    })

    useEffect(async () => {
        console.log("start use effect")
        useJwt.stripeData().then(async res => {
            const payload1 = res.data.payload
            setStripePromise(loadStripe(payload1.publishableKey))
            setIsLoad(true)
            console.log(payload1)
            console.log("inside then use effect")

        }).catch(err => {
            console.log("inside catch use effect")
            console.log(err)
            Error(err)
        })
        // setAmount(parseFloat(localStorage.getItem('amount')))
        setAmount(parseFloat(50))
        console.log(planDetails)
    }, [])

    const illustration =
        skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
        source = require(`@src/assets/images/pages/${illustration}`).default

    const onSubmit = async (e) => {
        e.preventDefault()
        // console.log({
        //     mobile: mobileNumber,
        //     email,
        //     firstname: firstName,
        //     lastname: lastName
        // })
        // if (isObjEmpty(errors)) {
        //     useJwt
        //         .merchentregister({
        //             mobile: mobileNumber,
        //             email,
        //             firstname: firstName,
        //             lastname: lastName
        //         })
        //         .then((res) => {
        //             console.log(res.data, res.data.payload, "showing response")

        //             if (
        //                 res.data.issuccess &&
        //                 res.data.payload.mobile_match &&
        //                 res.data.payload.is_registered
        //             ) {
        //                 history.push("/login")
        //             } else if (
        //                 res.data.issuccess &&
        //                 res.data.payload.mobile_match &&
        //                 res.data.payload.is_registered === false
        //             ) {
        //                 localStorage.setItem("mobilenumber", mobileNumber)
        //                 history.push("/merchantsetpassword")
        //             }
        //         })
        //         .catch((err) => console.log(err))
        // }

        setIsLoad(true)

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            setIsLoad(false)
            
        }

  
        //   useJwt.payByStripe(
        //     {
        //       useStripeSdk: true,
        //       paymentIntentId: null,
        //       paymentMethodId: paymentMethodResult.paymentMethod.id,
        //       currency: "gbp",
        //       amount
        //     }).then(async res => {
        //       const payload1 = res.data.payload
        //       handleServerResponse(payload1)
        //     }).catch(err => {
        //       Error(err)
        //     })
          
    }

    return (
      <div>

      <Card style={{ maxWidth: "768px" }} className="mx-auto my-4">
      <CardBody className='pt-2'>
        <Nav pills className="border-bottom pb-1">
          <NavItem>
            <NavLink>
            <Button.Ripple 
                                color='primary'
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    history.goBack()
                                }}
                            >Go Back</Button.Ripple>
                             
              {/* <span className='align-middle d-none d-sm-block'>Go Back</span> */}
            </NavLink>
          </NavItem>
        </Nav>
        <Nav pills className="border-bottom pb-1">
          <NavItem>
          <h4>
          Payment Info
        </h4>
          </NavItem>
        </Nav>
        {/* <TabContent activeTab={activeTab}> */}
        <TabContent>
          {/* <TabPane tabId='1'> */}
          <TabPane>
          {isLoad ? <Elements stripe={stripePromise}>
            <PaypalCardForm amount={planDetails.price_onetime} childFunc={childFunc} ></PaypalCardForm>
            </Elements > : <div className='d-flex justify-content-center'>
                <Spinner className='mt-5'/>
            </div>
            }
          </TabPane>
          {/* <TabPane tabId='2'>
            <GoCardless />
          </TabPane> */}
        </TabContent>
      </CardBody>
    </Card>
      </div>
    )
}

export default TestCreditCardDetails