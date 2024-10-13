import { Fragment, useState, useEffect, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const ViewModal = ({ modal, toggleModal, modalData, setReset, resetData }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)

    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-lg                                                  '>
            <ModalHeader toggle={toggleModal}>{modalData.key}</ModalHeader>
            <ModalBody>
                <Card>
                    <CardBody>
                        <h4 style={{fontFamily:'Inconsolata'}}>{modalData.body}</h4>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    )
}
export default ViewModal