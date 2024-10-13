import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
// ** Table Data & Columns
import 'antd/dist/antd.css'
// ** Add New Modal Component
import Select from 'react-select'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft } from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody } from 'reactstrap'
import { Skeleton } from 'antd'
import useJwt from '@src/auth/jwt/useJwt'
import ImageUpload from '../basic/ImageUpload'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const EditHotDeal = () => {
    const history = useHistory()
    const { productID } = useParams()
    const [productData, setProductData] = useState([])
    const [spinner, setSpinner] = useState(false)
    const [file, setFile] = useState(null)
    const [imgerror, setimgerror] = useState('')
    const [imageu, setimageu] = useState(null)
    useEffect(() => {
        useJwt.viewHotDealDetails({ id: productID }).then(res => {
            console.log(res.data.payload[0])
            setProductData(res.data.payload[0])
            setimageu(res.data.payload[0].deal_image)
        }).catch(err => {
            console.log(err.response)
        })
    }, [])

    const onchange = (e) => {
        // console.log([e.target.name], e.target.value)
        const CurrentData = { ...productData }
        if (e.target.name === "productid") {
            CurrentData.productid = e.target.value
        }
        if (e.target.name === "offerprice") {
            CurrentData.offerprice = e.target.value
        }
        if (e.target.name === "details") {
            CurrentData.details = e.target.value
        }
        if (e.target.name === "offer_startdate") {
            CurrentData.offer_startdate = e.target.value
        }
        if (e.target.name === "offer_enddate") {
            CurrentData.offer_enddate = e.target.value
        }

        setProductData(CurrentData)
    }
    const handleCallback = (childData, imageUrl) => {
        setimageu(null)
        setFile(childData)
    }
    const onsubmit = (e) => {
        setSpinner(true)
        setimgerror('')
        e.preventDefault()
        console.log('file ', file)
        // if (!file) {
        //     setimgerror('Image required')
        //     setSpinner(false)            
        //     return 0
        // }
        const { productid, offerprice, details, offer_startdate, offer_enddate } = productData
        console.log(productid, offerprice, details, new Date(offer_startdate), new Date(offer_enddate))

        const formData = new FormData()
        formData.append('id', productID)
        formData.append('productimage', file)
        formData.append('productid', productid)
        formData.append('offerprice', offerprice)
        formData.append('details', details)
        formData.append('offer_startdate', new Date(offer_startdate))
        formData.append('offer_enddate', new Date(offer_enddate))

        useJwt.editHotDeal(formData).then(res => {
            console.log(res)
            MySwal.fire({
                icon: 'success',
                title: 'Done!',
                text: 'The Product has been updated.',
                customClass: {
                    confirmButton: 'btn btn-success'
                }
            })
            setTimeout(function () { history.replace('/OffersPromotions') }, 1000)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/OffersPromotions'>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Edit Offer & Promotion</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    {productData.productid ? <Form className="row" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="productid">Product ID <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="productid"
                                    id='productid' onChange={onchange} required
                                    placeholder="productid" value={productData.productid || ''}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="offerprice">Offerprice <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="offerprice"
                                    id='offerprice' onChange={onchange} required
                                    placeholder="offerprice" value={productData.offerprice || ''}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="details">Details <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="details"
                                    id='details' onChange={onchange} required
                                    placeholder="details" value={productData.details || ''}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="offer_startdate">Startdate ({productData.offer_startdate})</Label>
                                <Input type="datetime-local" name="offer_startdate"
                                    id='offer_startdate' onChange={onchange}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="offer_enddate">Enddate ({productData.offer_enddate})</Label>
                                <Input type="datetime-local" name="offer_enddate"
                                    id='offer_enddate' onChange={onchange}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="12" >
                            <FormGroup >
                                <Label for="productimage">Offer Image <span style={{ color: 'red' }}>*</span>
                                    <span style={{ color: 'red' }}>{imgerror}</span></Label>
                                <div className="d-flex flex-wrap mt-4">
                                    {/* <img style={{ height: '130px', marginRight: '20px' }} src={productData.productDetails.productimage} alt="" /> */}
                                    <ImageUpload parentCallback={handleCallback} imageclear2={false} 
                                    imgurl={imageu}/>
                                </div>
                            </FormGroup>
                        </Col>


                        <Col sm="3" >
                            {
                                spinner ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                    <span className='align-middle ml-50'>Submit</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Form> : <Skeleton active />}
                </CardBody>
            </Card>
        </>
    )
}

export default EditHotDeal