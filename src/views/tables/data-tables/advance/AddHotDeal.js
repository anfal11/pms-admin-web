import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
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

import useJwt from '@src/auth/jwt/useJwt'
import ImageUpload from '../basic/ImageUpload'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const AddHotDeal = () => {
    const history = useHistory()
    const [spinner, setSpinner] = useState(false)
    const [userInput, setUserInput] = useState({})
    const [file, setFile] = useState(null)
    const [imgerror, setimgerror] = useState('')

    const onchange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleCallback = (childData, imageUrl) => {
        setFile(childData)
    }
    const onsubmit = (e) => {
        const createdby = localStorage.getItem('username')
        setSpinner(true)
        setimgerror('')
        e.preventDefault()
        console.log('file ', file)
        if (!file) {
            setSpinner(false)
            setimgerror('Image required')
            return 0
        }
        const { productid, offerprice, details, offer_startdate, offer_enddate } = userInput

        const formData = new FormData()
        formData.append('productimage', file)
        formData.append('productid', productid)
        formData.append('offerprice', offerprice)
        formData.append('details', details)
        formData.append('offer_startdate', offer_startdate)
        formData.append('offer_enddate', offer_enddate)
        console.log(productid, offerprice, details, offer_startdate, offer_enddate, file)
        useJwt.addNewHotDeal(formData).then(res => {
            console.log(res)
            MySwal.fire({
                icon: 'success',
                title: 'Done!',
                text: 'The product has been added.',
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
                    <CardTitle tag='h4'>Add New Product to Offers & Promotions</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="productid">Product ID <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="productid"
                                    id='productid' onChange={onchange} required
                                    placeholder="productid"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="offerprice">Offerprice <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="offerprice"
                                    id='offerprice' onChange={onchange} required
                                    placeholder="offerprice"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="details">Details <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="details"
                                    id='details' onChange={onchange} required
                                    placeholder="details"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="offer_startdate">Startdate <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="datetime-local" name="offer_startdate"
                                    id='offer_startdate' onChange={onchange} required
                                    placeholder="offer_startdate"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="offer_enddate">Enddate <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="datetime-local" name="offer_enddate"
                                    id='offer_enddate' onChange={onchange} required
                                    placeholder="offer_enddate"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12"  >
                            <FormGroup>
                                <Label for="productimage">Offer Image <span style={{ color: 'red' }}>*</span> <span style={{ color: 'red' }}>{imgerror}</span></Label>

                                <ImageUpload parentCallback={handleCallback} />

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
                    </Form>
                </CardBody>
            </Card>
        </>
    )
}

export default AddHotDeal