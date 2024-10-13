import { useSkin } from "@hooks/useSkin"
import useJwt from "@src/auth/jwt/useJwt"
import { AbilityContext } from "@src/utility/context/Can"
import "@styles/base/pages/page-auth.scss"
import Avatar from '@components/avatar'
import { isObjEmpty, selectThemeColors, getHomeRouteForLoggedInUser } from "@utils"
import classnames from "classnames"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { Coffee, Plus, Send } from "react-feather"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import { Slide, toast } from 'react-toastify'
import Select from 'react-select'
import {
    Button, Col, CustomInput,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner
} from "reactstrap"
import pms from '../../../assets/images/icons/RILAC-Logo.svg'
import { PaymentElement, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { KeyboardReturn } from "@mui/icons-material"
import { loadStripe } from "@stripe/stripe-js"
import { handleLogin } from "../../../redux/actions/auth"
import {BMS_USER, BMS_PASS} from '../../../Configurables'
import { Error, Success } from "../../viewhelper"

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

const PaypalCardForm = () => {
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
    const [loader, setLoader] = useState(false)
    const stripe = useStripe()
    const elements = useElements()
    const childFunc = useRef(null)

    const CARD_ELEMENT_OPTIONS = {
        style: {
          base: {
            lineHeight: "27px",
            color: "#212529",
            fontSize: "1.1rem",
            "::placeholder": {
              color: "#aab7c4"
            }
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        }
      }

      // const handleSuccessAlert = () => {
      //   setDisabledModal(!disabledModal)
      // }

      const [userInput, setUserInput] = useState({
        ...JSON.parse(localStorage.getItem('planDetails')),
        // businessname: '',
        // email: '',
        // mobile: '',
        // password: '',
        // country: 'UK',
        // businesscategoryids: 0,
        // status: 1,
        // logo: '',
        // city: '',
        // city_id: 0,
        // web_login: true,
        card_name: '',
        card_number: '',
        card_address: '',
        card_expiry: '',
        card_cvc: '',
        paymentMethodId: '',
        payment_method_id: 2,
        sub_type: "monthly"
    })

    // useEffect(async () => {
    //     console.log("start use effect")
    //     useJwt.stripeData().then(async res => {
    //         const payload1 = res.data.payload
    //         setStripePromise(loadStripe(payload1.publishableKey))
    //         setIsLoad(true)
    //         console.log(payload1)
    //         console.log("inside then use effect")

    //     }).catch(err => {
    //         console.log("inside catch use effect")
    //         console.log(err)
    //         Error(err)
    //     })
    //     // setAmount(parseFloat(localStorage.getItem('amount')))
    //     setAmount(parseFloat(50))
    // }, [])

    const illustration =
        skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
        source = require(`@src/assets/images/pages/${illustration}`).default

    const onSubmit = async (e) => {
        e.preventDefault()
        
        //un comment down
        setIsLoad(true)
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            setIsLoad(false)
            return
        }

        const paymentMethodObj = {
            type: 'card',
            card: elements.getElement(CardNumberElement)
            // billing_details: {
            //   name
            // }
          }
          console.log(paymentMethodObj)
          await stripe.createPaymentMethod(paymentMethodObj).then(async (data) => {

            // if (!data.error) {

              // console.log(data)
              console.log(data.paymentMethod.id)
              console.log({ ...userInput, paymentMethodId: data.paymentMethod.id })
              // setUserInput({ ...userInput, paymentMethodId: data.paymentMethod.id })

              const handleServerResponse = async (response) => {
                if (response.data.payload.error) {
                  // Show error from server on payment form
                  setIsLoad(false)
                  alert(response.data.payload.error)
                } else if (response.data.payload.requiresAction) {
                  // Use Stripe.js to handle the required card action
                  const { error: errorAction, paymentIntent } =
                    await stripe.handleCardAction(response.data.payload.clientSecret)
                  if (errorAction) {
                    // Show error from Stripe.js in payment form
                    setIsLoad(false)
                    alert(errorAction)
                  } else {
                    // The card action has been handled
                    // The PaymentIntent can be confirmed again on the server
                    useJwt.payByStripe(
                      {
                        paymentIntentId: paymentIntent?.id
                      }).then(async res => {
                        const payload1 = res.data.payload
                        handleServerResponse(payload1)
                      }).catch(err => {
                        Error(err)
                      })
                  }
                } else {
                  // Show success message
                  setIsLoad(false)
                  console.log(response)
                  // handleSuccessAlert()
                  Success(response) 
                  history.push('/vendordashboard')

                }
              }
    
                  await useJwt.quotaRequestPayByStripe({ ...userInput, paymentMethodId: data.paymentMethod.id }).then(async res => {
                    console.log(res)
                    const payload1 = res.data.payload
                    setIsLoad(false)
                    handleServerResponse(res)
                    
                 }).catch(error => {
                  setIsLoad(false)
                  Error(error.response)
                        // console.log(error.response.data.message)
                        Error(error)
                        console.log(error.response)
                  
                })

          }).catch(e => {
            console.log(e)
          })     
          
    }

    return (
        <div className="">
         
            <Form
                action="/"
                className="auth-register-form"
                onSubmit={onSubmit}
            >
                <Row>
                    {/* <Col sm='12'>
                        <FormGroup>
                            <Label className="form-label" for="businessname">
                                Card Owner Name
                            </Label>
                            <Input
                                type="text"
                                value={userInput.businessname}
                                placeholder="John"
                                id="businessname"
                                name="businessname"
                                onChange={(e) => setUserInput({ ...userInput, businessname: e.target.value })}
                            />
                        </FormGroup>
                    </Col> */}
                    <Col sm='12'>
                        <FormGroup>
                            <Label className="form-label" for="businessname">
                                Card Number
                            </Label>
                            <CardNumberElement
                                type="text"
                                value={userInput.card_number}
                                placeholder="1234****"
                                id="cc-number"
                                name="businessname"
                                options={CARD_ELEMENT_OPTIONS}
                                onBlur={() => {
                                    console.log("CardNumberElement [blur]", event.target.value)
                                  }}
                                // onChange={(e) => setUserInput({ ...userInput, card_number: e.target.value })}
                                // onChange={(e) =>  console.log(`card number ${e.target.value}`)}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm='6'>
                        <FormGroup>
                            <Label className="form-label" for="card-expiry">
                                Card Expiry
                            </Label>
                            <CardExpiryElement
                                type="text"
                                value={userInput.card_expiry}
                                placeholder="MM/YYYY"
                                id="expiry"
                                name="expiry"
                                options={CARD_ELEMENT_OPTIONS}
                                // onChange={(e) => setUserInput({ ...userInput, card_expiry: e.target.value })}
                                // onChange={(e) =>  console.log(`card expiry ${e.target.value}`)}

                            />
                        </FormGroup>
                    </Col>
                    <Col sm='6'>
                        <FormGroup>
                            <Label className="form-label" for="businessname">
                                CVC
                            </Label>
                            <CardCvcElement
                                type="text"
                                value={userInput.card_cvc}
                                placeholder="MM/YYYY"
                                id="cvc"
                                name="cvc"
                                options={CARD_ELEMENT_OPTIONS}
                                // onChange={(e) => setUserInput({ ...userInput, card_cvc: e.target.value })}
                                // onChange={(e) =>  console.log(`card cvc ${e}`)}

                            />
                        </FormGroup>
                    </Col>
                    <Col md='12' className='text-center'>
                            {isLoad ? <Button.Ripple className='ml-2' color='primary' disabled style={{ marginTop: '22px' }}>
                                <Spinner size='sm' />
                                <span className='align-middle ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' style={{ marginTop: '22px' }} type="submit">
                                <Send size={15} />
                                <span className='align-middle ml-50'>Submit</span>
                            </Button.Ripple>}

                        </Col>
                </Row>

                {/* <Button.Ripple type="submit" block color="primary">
                    Sign Up
                </Button.Ripple> */}
            </Form>
            </div>
    )
}

export default PaypalCardForm