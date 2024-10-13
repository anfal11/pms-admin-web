import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Card,
    CardTitle,
    Row,
    Col,
    Button,
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap'
import Chart from 'react-apexcharts'

const RevenueReport = props => {
    const { revenueSeries, revenueOptions } = props
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get('/card/card-analytics/revenue-report').then(res => setData(res.data))
    }, [])

    return data !== null ? (
        <Card className='card-revenue-budget'>
            <Row className='mx-0'>
                <Col className='revenue-report-wrapper' md='12' xs='12'>
                    <div className='d-sm-flex justify-content-between align-items-center mb-3'>
                        <CardTitle className='mb-50 mb-sm-0'>Revenue Report</CardTitle>
                    </div>
                    <Chart id='revenue-report-chart' type='bar' height='230' options={revenueOptions} series={revenueSeries} />
                </Col>
            </Row>
        </Card>
    ) : null
}

export default RevenueReport
