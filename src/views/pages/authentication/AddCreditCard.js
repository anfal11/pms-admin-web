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
import PaypalCardForm from "./PaypalCardForm"


const CreditCardDetails = () => {
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

    const [userInput, setUserInput] = useState({
        ...JSON.parse(localStorage.getItem('registration_data')),
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
          const paymentMethodResult = await stripe.createPaymentMethod(paymentMethodObj)
          console.log(paymentMethodResult) 

          const handleServerResponse = async (response) => {
            if (response.error) {
              // Show error from server on payment form
              setIsLoad(false)
              alert(response.error)
            } else if (response.requiresAction) {
              // Use Stripe.js to handle the required card action
              const { error: errorAction, paymentIntent } =
                await stripe.handleCardAction(response.clientSecret)
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
              handleSuccessAlert()
            }
          }

          useJwt.customerBusinessRegistration({...userinput}).then(async res => {
            console.log(res)
            const payload1 = res.data.payload
            handleServerResponse(payload1)
            
         }).catch(error => {
            setLoader(false)
            Error(error.response)
                // console.log(error.response.data.message)
                console.log(error.response)
          
        })

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
        <div className="">
            {isLoad ? <Elements stripe={stripePromise}>
         
            <PaypalCardForm amount={amount} childFunc={childFunc} ></PaypalCardForm>
            {/* <Form
                action="/"
                className="auth-register-form"
                onSubmit={onSubmit}
            >
                <Row>
                    <Col sm='12'>
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
                    </Col>
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
                                onChange={(e) => setUserInput({ ...userInput, businessname: e.target.value })}
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
                                onChange={(e) => setUserInput({ ...userInput, card_expiry: e.target.value })}
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
                                onChange={(e) => setUserInput({ ...userInput, card_cvc: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Button.Ripple type="submit" block color="primary">
                    Sign Up
                </Button.Ripple>
            </Form> */}
            <p className="text-center mt-2">
                <span className="mr-25">Already have an account?</span>
                <Link to="/login">
                    <span>Sign in instead</span>
                </Link>
            </p>
            </Elements > : <div className='d-flex justify-content-center'>
                <Spinner className='mt-5'/>
            </div>
            }        
            </div>
    )
}

export default CreditCardDetails