import classnames from 'classnames'
import Avatar from '@components/avatar'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'

const StatsCard = ({ DashData }) => {
    // daily_disbursed_amnt: null
    return (
        <Row className='match-height'>
            <Col xl="4" md="6" xs="12">
                <Card>
                    <CardBody>
                        <div className='d-flex align-items-center'>
                            <div style={{ height: '30px', width: '30px', backgroundColor: '#006496', borderRadius: '50%' }}></div>
                            <div>
                                <h6 style={{ margin: '0 0 0 10px' }}>Total Attempt</h6>
                                <h6 style={{ margin: '0 0 0 10px' }}>(Disbursement)</h6>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{DashData?.disbursement_attemp_total || 0}</h5></div>
                    </CardBody>
                </Card>
            </Col>
            <Col xl="4" md="6" xs="12">
                <Card>
                    <CardBody>
                        <div className='d-flex align-items-center'>
                            <div style={{ height: '30px', width: '30px', backgroundColor: '#FFC75D', borderRadius: '50%' }}></div>
                            <div>
                                <h6 style={{ margin: '0 0 0 10px' }}>Total Success</h6>
                                <h6 style={{ margin: '0 0 0 10px' }}>(Disbursement)</h6>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{DashData?.disbursement_success || 0}</h5></div>
                    </CardBody>
                </Card>
            </Col>
            <Col xl="4" md="6" xs="12">
                <Card>
                    <CardBody>
                        <div className='d-flex align-items-center'>
                            <div style={{ height: '30px', width: '30px', backgroundColor: '#26C165', borderRadius: '50%' }}></div>
                            <div>
                                <h6 style={{ margin: '0 0 0 10px' }}>Total Error</h6>
                                <h6 style={{ margin: '0 0 0 10px' }}>(Disbursement)</h6>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{DashData?.disbursement_error || 0}</h5></div>
                    </CardBody>
                </Card>
            </Col>
            <Col xl="4" md="6" xs="12">
                <Card>
                    <CardBody>
                        <div className='d-flex align-items-center'>
                            <div style={{ height: '30px', width: '30px', backgroundColor: '#FF4133', borderRadius: '50%' }}></div>
                            <h6 style={{ margin: '0 0 0 10px' }}>Total Transaction</h6>
                        </div>
                        <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{DashData?.total_request || 0}</h5></div>
                    </CardBody>
                </Card>
            </Col>
            <Col xl="4" md="6" xs="12">
                <Card>
                    <CardBody>
                        <div className='d-flex align-items-center'>
                            <div style={{ height: '30px', width: '30px', backgroundColor: '#006496', borderRadius: '50%' }}></div>
                            <h6 style={{ margin: '0 0 0 10px' }}>Today Transaction</h6>
                        </div>
                        <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{DashData?.daily_request || 0}</h5></div>
                    </CardBody>
                </Card>
            </Col>
            <Col xl="4" md="6" xs="12">
                <Card>
                    <CardBody>
                        <div className='d-flex align-items-center'>
                            <div style={{ height: '30px', width: '30px', backgroundColor: '#FFC75D', borderRadius: '50%' }}></div>
                            <h6 style={{ margin: '0 0 0 10px' }}>Total Disbursed</h6>
                        </div>
                        <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{DashData?.total_disbursed_amnt || 0}</h5></div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default StatsCard
