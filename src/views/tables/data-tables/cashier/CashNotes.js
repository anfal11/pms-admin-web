import { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown,
    DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col,
    Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Skeleton } from 'antd'
import 'antd/dist/antd.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const CashNotes = () => {
    const [notes, setNotes] = useState([])
    const [total, setTotal] = useState(0)
    const [noteCount, setNoteCount] = useState({})
    const [totalArray, setTotalArray] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        useJwt.getAllCashNotes().then(res => {
            console.log(res.data.payload)
            setNotes(res.data.payload)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const onsubmit = (e) => {
        setLoading(true)
        e.preventDefault()
        const ObjInput = { ...noteCount }
        const SubmitArray = []
        for (const key in ObjInput) {
            SubmitArray.push(Object.assign({ cash_note_id: Number(key) }, { pisces_of_note: ObjInput[key] ? Number(ObjInput[key]) : 0 }))
        }
        console.log(SubmitArray)
        if (SubmitArray.length) {
            useJwt.dailyCashNotesSubmit({ notes: SubmitArray }).then(res => {
                console.log(res)
                MySwal.fire({
                    icon: 'success',
                    title: 'Done!',
                    text: res.data.message,
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
                setNoteCount({})
                setLoading(false)
            }).catch(err => {
                setLoading(false)
                console.log(err)
            })
        } else { setLoading(false) }
    }
    const onChange = (e, id) => {
        // console.log(noteCount[`${id}`])
        const SumArray = notes.filter(x => x.id === id)
        setNoteCount({ ...noteCount, [e.target.name]: e.target.value })
        const total_array = { ...totalArray, [e.target.name]: SumArray[0].is_it_pence ? e.target.value * (SumArray[0].amount / 100) : e.target.value * (SumArray[0].amount) }
        setTotalArray(total_array)
        // console.log(SumArray[0].is_it_pence ? (SumArray[0].amount / 100) * e.target.value : SumArray[0].amount * e.target.value)
        // const prevValue = SumArray[0].is_it_pence ? noteCount[`${id}`] * (SumArray[0].amount / 100) : noteCount[`${id}`] * SumArray[0].amount
        // const currentValue = SumArray[0].is_it_pence ? (SumArray[0].amount / 100) * e.target.value : SumArray[0].amount * e.target.value
        // setTotal(total - prevValue ? prevValue : 0 + currentValue)
        setTotal(Object.values(total_array).length ? Object.values(total_array).reduce((total, num) => total + num) : 0)

        // console.log(Object.values(totalArray).length ? Object.values(totalArray).reduce((total, num) => total + num) : 0)
    }

    return (
        <Card className="p-1">
            <Row>
                <Col md='6' style={{ margin: 'auto', textAlign: 'center' }}>
                    <h1 style={{ display: 'inline', border: '2px solid #c3c0c0', padding: '10px' }}>Cash Balance : {total.toFixed(2)}{window.CURRENCY_SYMBOL}</h1>
                </Col>
                <Col md='6'>
                    <Form style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                        {notes.length ? <FormGroup>
                            {notes.map((element, index) => <div className="d-flex" key={index}>
                                {/* <span style={{ width: '50%' }}>{element.amount}{element.currency_symbol}</span> */}
                                <Input
                                    style={{ width: '20%', textAlign: 'center' }}
                                    placeholder=""
                                    type='text'
                                    id={Date.now()}
                                    value={`${element.amount}${element.currency_symbol}`}
                                    disabled
                                // onChange={onChange}
                                />
                                  <Input
                                  style={{ width: '50%', textAlign: 'center' }}
                                  placeholder=""
                                  type='number'
                                  min="0"
                                  name={element.id}
                                  id={element.id}
                                  value={noteCount[`${element.id}`] || 0}
                                  onChange={(e) => onChange(e, element.id)}
                              />
                            </div>)}
                        </FormGroup> : <><Skeleton active /><Skeleton active /><Skeleton active /></>}
                        <FormGroup className='mb-0' row>
                            <Col className='d-flex' md={{ size: 4, offset: 5 }}>
                                {loading ? <Button.Ripple color='primary' disabled style={{ marginLeft: '20%' }}>
                                    <Spinner size='sm' />
                                    <span className='align-middle ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple color='primary' type="submit" style={{ marginLeft: '20%' }}>
                                    <span className='align-middle ml-50'>Confirm</span>
                                </Button.Ripple>}
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Card >
    )
}

export default CashNotes