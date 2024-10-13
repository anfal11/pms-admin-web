import { Swiper, SwiperSlide } from 'swiper/react'
import { Card, CardHeader, Button, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Play, DollarSign, HelpCircle, FileText, Archive } from 'react-feather'
import SwiperCore, {
    Navigation,
    Pagination,
    EffectFade,
    EffectCube,
    EffectCoverflow,
    Autoplay,
    Lazy,
    Virtual
} from 'swiper'
import '@styles/react/libs/swiper/swiper.scss'
import { useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error, Success } from '../../viewhelper'
const MySwal = withReactContent(Swal)
import useJwt from '@src/auth/jwt/useJwt'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

SwiperCore.use([Navigation, Pagination, EffectFade, EffectCube, EffectCoverflow, Autoplay, Lazy, Virtual])

const SwiperCenterSlidesStyle = ({ modal, toggleModal, VoucherDetails, /* SliderArray, */ resetData, setReset }) => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const history = useHistory()
    const params = {
        className: 'swiper-centered-slides',
        // slidesPerView: 'auto',
        slidesPerView: 3,
        spaceBetween: 20,
        // centeredSlides: true,
        navigation: true,
        slideToClickedSlide: true
    }
    // const [modal, setModal] = useState(false)
    // const [VoucherDetails, setVoucherDetails] = useState({})
    // const toggleModal = () => setModal(!modal)

    const handlePoPupActions = (voucherId, message) => {
        return MySwal.fire({
            title: message,
            text: `You won't be able to revert this`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                // return true
                // localStorage.setItem('usePMStoken', true)
                // return useJwt.deleteVoucher({ voucherId }).then(res => {
                //     localStorage.setItem('usePMStoken', false)
                //     Success(res)
                //     console.log(res)
                //     toggleModal()
                //     setReset(!resetData)
                // }).catch(err => {
                //     localStorage.setItem('usePMStoken', false)
                //     console.log(err)
                //     Error(err)
                // })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {

            }
        })

    }
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
                <ModalHeader toggle={toggleModal}>Voucher Details</ModalHeader>
                <ModalBody>
                    {/* Description: {VoucherDetails.Description} */}
                    <table className="table">
                        <tbody>
                            <tr>
                                <td><img width='300px' src={`${VoucherDetails.VoucherImage}`}/></td>
                            </tr>
                            <tr>
                                <th scope="row">Voucher Type</th>
                                <td>{VoucherDetails.VoucherType}</td>
                            </tr>
                            <tr>
                                <th scope="row">Voucher Validity</th>
                                <td>{VoucherDetails.VoucherValidity}</td>
                            </tr>
                            <tr>
                                <th scope="row">Voucher Value</th>
                                <td>{VoucherDetails.VoucherValue}</td>
                            </tr>
                            <tr>
                                <th scope="row">Description</th>
                                <td>{VoucherDetails.Description}</td>
                            </tr>
                            <tr>
                                <th scope="row">RewardPoint</th>
                                <td>{VoucherDetails.RewardPoint}</td>
                            </tr>
                            <tr>
                                <th scope="row">Terms</th>
                                <td>{VoucherDetails.Terms}</td>
                            </tr>
                            <tr>
                                <th scope="row">Expiry Date</th>
                                <td>{new Date(VoucherDetails.ExpiryDate).toLocaleDateString()}</td>
                            </tr>

                            <tr>
                                <th scope="row">Quota</th>
                                <td>{VoucherDetails.Quota}</td>
                            </tr>
                        </tbody>
                    </table>
                </ModalBody>
                <ModalFooter>
                    {VoucherDetails.Quota > 0 && <Button.Ripple color='primary' tag={Link} to={`/bulkPurchaseVoucherADMIN?voucherid=${VoucherDetails.Id}`} >
                        Bulk Purchase
                    </Button.Ripple>
                    } &nbsp;&nbsp;&nbsp;
                    {subMenuIDs.includes(11) && <>
                        <Button.Ripple color='info' onClick={e => {
                            localStorage.setItem('VoucherDetails', JSON.stringify(VoucherDetails))
                            history.push('./UpdateVoucherADMIN')
                        }}>
                            Edit
                        </Button.Ripple> &nbsp;&nbsp;&nbsp;</>}
                    {subMenuIDs.includes(12) && <Button.Ripple color='danger' onClick={e => handlePoPupActions(VoucherDetails.Id, 'Are you sure?')}>
                        Delete
                    </Button.Ripple>}
                </ModalFooter>
            </Modal>
    //     <Card className='bg-transparent shadow-none'>
    //         <CardHeader>
    //     <CardTitle tag='h4'>Centered Slides option-1</CardTitle>
    //   </CardHeader>
    //         <CardBody>
    //             <Swiper dir={'ltr'} {...params}>
    //                 {
    //                     SliderArray.map((d, i) => <SwiperSlide key={i} className='rounded swiper-shadow' onClick={e => {
    //                         setVoucherDetails(d)
    //                         console.log(d)
    //                         setModal(true)
    //                     }}>
    //                         <img src={d.VoucherImage} alt="Discount img" width='250px' height='150px'></img>
    //                     </SwiperSlide>)
    //                 }
    //             </Swiper>
    //         </CardBody>
    //     </Card >
    )
}

export default SwiperCenterSlidesStyle