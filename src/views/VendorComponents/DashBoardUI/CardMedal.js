import { Card, CardBody, CardText, Button } from 'reactstrap'
import Voucher from '../../../assets/images/icons/Voucher.svg'
import Voucher1 from '../../../assets/images/icons/active voucher.svg'

const CardMedal = ({DashData}) => {
    return (
        <Card className='card-congratulations-medal'>
            <CardBody>
                <h4 style={{fontWeight:'bold', color:'#999999', marginBottom:'40px'}}>Voucher Summery</h4>
                <div className='d-flex align-items-center justify-content-between border-bottom pb-2'>
                    <div className='d-flex align-items-center'>
                        <img src={Voucher} />
                        <h4 style={{margin:'0 0 0 20px', color:'#6E6B7B', fontWeight:'normal'}}>Total Voucher</h4>
                    </div>
                    <h4 style={{margin:'0', color:'#5E5873', fontWeight:'bold'}}>{DashData.total_voucher || 0}</h4>
                </div>
                <div className='d-flex align-items-center justify-content-between pb-3 pt-2'>
                    <div className='d-flex align-items-center'>
                        <img src={Voucher1} />
                        <h4 style={{margin:'0 0 0 20px', color:'#6E6B7B', fontWeight:'normal'}}>Active Voucher</h4>
                    </div>
                    <h4 style={{margin:'0', color:'#5E5873', fontWeight:'bold'}}>{DashData.total_active_voucher || 0}</h4>
                </div>
            </CardBody>
        </Card>
    )
}

export default CardMedal
