import useJwt2 from '@src/auth/jwt/useJwt2'
import useJwtBMS from '@src/auth/jwt/useJwtBMS'
import '@styles/base/pages/dashboard-ecommerce.scss'
import '@styles/react/libs/charts/apex-charts.scss'
import { Fragment, useEffect, useState } from 'react'
import { Bell, User } from 'react-feather'
import { Card, CardBody, CardHeader, Col, Progress, Row } from 'reactstrap'
import { BMS_PASS, BMS_USER } from '../../Configurables'
import ActiveUserBarChart from '../VendorComponents/DashBoardUI/ActiveUserBarChart'
import CardMedal from '../VendorComponents/DashBoardUI/CardMedal'
import StatsCard from '../VendorComponents/DashBoardUI/StatsCard'
import TransactionList from './DashBoardUI/TranLog'
import ActiveCampaignList from './DashBoardUI/activeCamp'
import TukitakiLoader from './DashBoardUI/TukitakiLoader'

const Dashboard = () => {
  const [TTLoader, setTTLoader] = useState(true)
  const [DashData, setDashData] = useState([])
  const [DashData1, setDashData1] = useState({})
  const [DashData2, setDashData2] = useState([])
  const [adCampaignList, setadCampaignList] = useState([])
  const [resetData, setReset] = useState(true)

  useEffect(async() => {
    setTTLoader(true)
    localStorage.setItem('useBMStoken', true)
    localStorage.setItem('useBMStoken', false) //for token management
    localStorage.setItem('usePMStoken', false) //for token management
    
    await Promise.all([
      useJwtBMS.bmsDashboard().then(res => {
        console.log(res)
        setDashData(res.data)
        localStorage.setItem('useBMStoken', false)
      }).catch(err => {
        console.log(err)
        Error(err)
      }),
      useJwt2.getDashboardCounts().then(res => {
        console.log(res)
        setDashData1(res.data.payload)
      }).catch(err => {
        console.log(err)
      }),
  
      useJwt2.notificationTimeSeries().then(res => {
        console.log(res)
        setDashData2(res.data.payload)
      }).catch(err => {
        console.log(err)
      }),

      useJwt2.adCampaignList().then(res => {
        console.log('adCampaignList', res)
        const allCamps = []
        for (const q of res.data.payload) {
            if (q.is_approved === true) {
              allCamps.push(q)
            }
        }
        setadCampaignList(allCamps)
        }).catch(err => {
            Error(err)
            console.log(err.response)
        })

    ])

    setTTLoader(false)
   
  }, [resetData])

  return (
    <div>
      {TTLoader && <Card className="p-2 position-relative" style={{ height: '80vh' }}>
        <TukitakiLoader style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50% ,-50%)' }} />
      </Card>}

      {!TTLoader && <><Row className="match-height">
        <Col xl="4" md="6" xs="12">
          <CardMedal DashData={DashData1} />
        </Col>
        <Col xl="8" md="6" xs="12">
          <StatsCard DashData={DashData[0]} cols={{ xl: "12", sm: "12" }} />
        </Col>
      </Row>
        <Row className="match-height">
          <Col xl="6" md="6" xs="12">
            <Card className='p-0'>
              <CardHeader className='border-bottom p-1 mb-1'>
                <div className='d-flex align-items-center'>
                  <User color='blue' fill='blue' size={16} />
                  <h5 style={{ margin: '0 0 0 10px', color: '#999999', fontWeight: 'bold' }}>Loyalty User</h5>
                </div>
              </CardHeader>
              <CardBody className='pt-1'>
                <div className='d-flex justify-content-end'><p style={{ color: '#999999', fontWeight: 'bold' }}>User</p></div>
                
                {
                  DashData1['customer_segmentation_info'] && DashData1['customer_segmentation_info'].map(item => <Fragment>
                    <div className='d-flex align-items-center justify-content-between border-bottom pt-1 pb-1'>
                  <div>
                    <h5 style={{ color: '#999999', fontWeight: 'bold' }}>{item['tier']}</h5>
                    <h5 style={{ margin: '0', color: '#999999', fontWeight: 'normal' }}>Point - {item['point_required'] || 0}</h5>
                  </div>
                  <h5 style={{ margin: '0', color: '#006496', fontWeight: 'bold' }}>{item['user_count'] || 0}</h5>
                </div>
                  </Fragment>)
                }
                
               
              </CardBody>
            </Card>
          </Col>
          <Col xl="6" md="6" xs="12">
            <Card className='p-0'>
              <CardHeader className='border-bottom p-1 mb-1'>
                <div className='d-flex align-items-center'>
                  <Bell color='blue' fill='blue' size={20} style={{ transform: 'rotate(-130deg)' }} />
                  <h5 style={{ margin: '0 0 0 10px', color: '#999999', fontWeight: 'bold' }}>Ad Management</h5>
                </div>
                <h5 style={{ margin: '0 0 0 10px', color: 'blue', fontWeight: 'bold' }}>Last Month</h5>
              </CardHeader>
              <CardBody className='pt-1'>
                <div className='demo-vertical-spacing'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='w-75'>
                      <h5 style={{ color: '#999999', fontWeight: 'bold' }}>Facebook</h5>
                      <Progress value={Math.round((DashData1.total_numofadfb / DashData1.total_totalad) * 100) || 0} />
                    </div>
                    <h5 style={{ margin: '0 0 0 30px', color: '#999999', fontWeight: 'bold' }}>{Math.round((DashData1.total_numofadfb / DashData1.total_totalad) * 100) || 0}%</h5>
                  </div>
                  <div className='d-flex align-items-center justify-content-between mt-2'>
                    <div className='w-75'>
                      <h5 style={{ color: '#999999', fontWeight: 'bold' }}>Instagram</h5>
                      <Progress value={Math.round((DashData1.total_numofadinsta / DashData1.total_totalad) * 100) || 0} />
                    </div>
                    <h5 style={{ margin: '0 0 0 30px', color: '#999999', fontWeight: 'bold' }}>{Math.round((DashData1.total_numofadinsta / DashData1.total_totalad) * 100) || 0}%</h5>
                  </div>
                  <div className='d-flex align-items-center justify-content-between mt-2'>
                    <div className='w-75'>
                      <h5 style={{ color: '#999999', fontWeight: 'bold' }}>Google</h5>
                      <Progress value={Math.round((DashData1.total_numofadgoogle / DashData1.total_totalad) * 100) || 0} />
                    </div>
                    <h5 style={{ margin: '0 0 0 30px', color: '#999999', fontWeight: 'bold' }}>{Math.round((DashData1.total_numofadinsta / DashData1.total_totalad) * 100) || 0}%</h5>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <Row className="match-height">
          <Col md='8'>
            <Card className='p-0'>
              <CardHeader className='border-bottom p-1'>
                <div className='d-flex align-items-center'>
                  <Bell color='blue' fill='blue' size={16} />
                  <h5 style={{ margin: '0 0 0 10px', color: '#999999', fontWeight: 'bold' }}>Notification Bar Chart</h5>
                </div>
                <h5 style={{ margin: '0 0 0 10px', color: 'blue', fontWeight: 'bold' }}>Last Month</h5>
              </CardHeader>
              <CardBody className='pt-1'>
                <ActiveUserBarChart labels={DashData2.map(d => d.date)} dataCount={DashData2.map(d => d.count)} />
              </CardBody>
            </Card>
          </Col>
          <Col xl="4" md="6" xs="12">
            <Card className='p-0'>
              <CardHeader className='border-bottom p-1 mb-1'>
                <div className='d-flex align-items-center'>
                  <Bell color='blue' fill='blue' size={16} />
                  <h5 style={{ margin: '0 0 0 10px', color: '#999999', fontWeight: 'bold' }}>Notification</h5>
                </div>
                <h5 style={{ margin: '0 0 0 10px', color: 'blue', fontWeight: 'bold' }}>Last Month</h5>
              </CardHeader>
              <CardBody className='pt-1'>
                <div className='demo-vertical-spacing'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='w-75'>
                      <h5 style={{ color: '#999999', fontWeight: 'bold' }}>Facebook</h5>
                      <Progress value={Math.round((DashData1.numOfFb / DashData1.totalNotification) * 100) || 0} />
                    </div>
                    <h5 style={{ margin: '0 0 0 30px', color: '#999999', fontWeight: 'bold' }}>{Math.round((DashData1.numOfFb / DashData1.totalNotification) * 100) || 0}%</h5>
                  </div>
                  <div className='d-flex align-items-center justify-content-between mt-2'>
                    <div className='w-75'>
                      <h5 style={{ color: '#999999', fontWeight: 'bold' }}>Instagram</h5>
                      <Progress value={Math.round((DashData1.numOfInsta / DashData1.totalNotification) * 100) || 0} />
                    </div>
                    <h5 style={{ margin: '0 0 0 30px', color: '#999999', fontWeight: 'bold' }}>{Math.round((DashData1.numOfInsta / DashData1.totalNotification) * 100) || 0}%</h5>
                  </div>
                  <div className='d-flex align-items-center justify-content-between mt-2'>
                    <div className='w-75'>
                      <h5 style={{ color: '#999999', fontWeight: 'bold' }}>Email</h5>
                      <Progress value={Math.round((DashData1.numOfEmail / DashData1.totalNotification) * 100) || 0} />
                    </div>
                    <h5 style={{ margin: '0 0 0 30px', color: '#999999', fontWeight: 'bold' }}>{Math.round((DashData1.numOfEmail / DashData1.totalNotification) * 100) || 0}%</h5>
                  </div>
                  <div className='d-flex align-items-center justify-content-between mt-2'>
                    <div className='w-75'>
                      <h5 style={{ color: '#999999', fontWeight: 'bold' }}>Push Notification</h5>
                      <Progress value={Math.round((DashData1.numOfPush / DashData1.totalNotification) * 100) || 0} />
                    </div>
                    <h5 style={{ margin: '0 0 0 30px', color: '#999999', fontWeight: 'bold' }}>{Math.round((DashData1.numOfPush / DashData1.totalNotification) * 100) || 0}%</h5>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
        <Row className="match-height">
          <Col md='8'>
            <Card className='p-0'>
              <CardHeader className='border-bottom p-1'>
                <div className='d-flex align-items-center'>
                  <Bell color='blue' fill='blue' size={16} />
                  <h5 style={{ margin: '0 0 0 10px', color: '#999999', fontWeight: 'bold' }}>Campaing Reachability</h5>
                </div>
                <h5 style={{ margin: '0 0 0 10px', color: 'blue', fontWeight: 'bold' }}>Last 4 Campaign</h5>
              </CardHeader>
              <CardBody className='pt-1 d-flex overflow-scroll'>
                {
                  adCampaignList.slice(0, 4).map(item => <ActiveUserBarChart style={{minHeight:'400px'}} labels={['Facebook', 'SMS', 'P_Notification', 'Email']} dataCount={[50, 45, 77, 34]} datalabel={item.name} />)
                }
              </CardBody>
            </Card>
          </Col>
          <Col xl="4" md="6" xs="12">
            <Card className='p-0'>
              <CardHeader className='border-bottom p-1 mb-1'>
                <div className='d-flex align-items-center'>
                  <Bell color='blue' fill='blue' size={16} />
                  <h5 style={{ margin: '0 0 0 10px', color: '#999999', fontWeight: 'bold' }}>Campaing Success Rate</h5>
                </div>
                <h5 style={{ margin: '0 0 0 10px', color: 'blue', fontWeight: 'bold' }}>Last 4 campaign</h5>
              </CardHeader>
              <CardBody className='pt-1'>
                <div className='demo-vertical-spacing'>
                  {
                    adCampaignList.slice(0, 4).map((item, index) =>   <div className='d-flex align-items-center justify-content-between'>
                      <div className='w-75'>
                        <h5 style={{ color: '#999999', fontWeight: 'bold' }}>{item.name}</h5>
                        <Progress value={Math.round((80 * (index + 1) / 650) * 100) || 0} />
                      </div>
                      <h5 style={{ margin: '0 0 0 30px', color: '#999999', fontWeight: 'bold' }}>{Math.round((80 * (index + 1) / 650) * 100) || 0}%</h5>
                    </div>)
                  }
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="match-height">
          <Col md='6'>
            <Card className='p-0'>
              <CardHeader className='border-bottom p-1'>
                <div className='d-flex align-items-center'>
                  <Bell color='blue' fill='blue' size={16} />
                  <h5 style={{ margin: '0 0 0 10px', color: '#999999', fontWeight: 'bold' }}>Campaing vs Amount</h5>
                </div>
                <h5 style={{ margin: '0 0 0 10px', color: 'blue', fontWeight: 'bold' }}>Last 4 Campaign</h5>
              </CardHeader>
              <CardBody className='pt-1'>
               <ActiveUserBarChart style={{minHeight:'400px'}} labels={adCampaignList.slice(0, 4).map(i => i.name)} dataCount={[50, 45, 77, 34]} datalabel={'Campaigns'} />
              </CardBody>
            </Card>
          </Col>
          <Col xl="6" md="6" xs="12">
            <Card className='p-0'>
              <CardHeader className='border-bottom p-1 mb-1'>
                <div className='d-flex align-items-center'>
                  <Bell color='blue' fill='blue' size={16} />
                  <h5 style={{ margin: '0 0 0 10px', color: '#999999', fontWeight: 'bold' }}>Campaign vs Number of Transaction</h5>
                </div>
                <h5 style={{ margin: '0 0 0 10px', color: 'blue', fontWeight: 'bold' }}>Last 4 campaign</h5>
              </CardHeader>
              <CardBody className='pt-1'>
                <ActiveUserBarChart style={{minHeight:'400px'}} labels={adCampaignList.slice(0, 4).map(i => i.name)} dataCount={[80, 65, 27, 75]} datalabel={'Campaigns'} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className='match-height'>
          <Col lg='6' xs='6'>
            <ActiveCampaignList />
          </Col>
          <Col lg='6' xs='6'>
            <TransactionList />
          </Col>
        </Row>
      </>}
    </div>
  )
}
export default Dashboard