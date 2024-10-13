import { Fragment } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { ChevronLeft, Plus } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const CreatePushNotificationTemplate = ({userInput, uploadImg, handleChange, pushfilePrevw, setPushFilePrevw, handleChangeVoucherSelect, voucherList}) => {

    return (
        <Fragment>
            <Row className='pr-3'>
                {/* <Col sm="6" >
                    <FormGroup>
                        <Label for="push_from">From<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text"
                            name="push_from"
                            id='push_from'
                            value={userInput.push_from}
                            onChange={handleChange}
                            required
                            placeholder="from here..."
                        />
                    </FormGroup>
                </Col> */}
                <Col sm="6" >
                    <FormGroup>
                       <Label for="voucherid">Select Voucher</Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            classNamePrefix='select'
                            onChange={(selected) =>  handleChangeVoucherSelect(selected)}
                            isClearable={true}
                            options={voucherList}
                            
                        />
                    </FormGroup>
                </Col>
                <Col sm="6" > </Col>
                <Col sm="6" >
                    <FormGroup>
                        <Label for="title">Title<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text"
                            name="push_notification_title"
                            id='push_notification_title'
                            value={userInput.push_notification_title}
                            onChange={handleChange}
                            required
                            placeholder="your title"
                        />
                    </FormGroup>
                </Col>
                <Col sm="12" >
                    <FormGroup>
                        <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="textarea"
                            name="push_notification_body"
                            id='push_notification_body'
                            value={userInput.push_notification_body}
                            onChange={handleChange}
                            // maxLength="160"
                            required
                            placeholder="your message"
                        />
                        {/* <p className='text-right' style={userInput.push_notification_body.length === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - userInput.push_notification_body.length} characters remaining</p> */}
                    </FormGroup>
                </Col>
                <Col sm="12" >
                    <FormGroup>
                        <Label for="url">Redirect-url</Label>
                        <Input type="text"
                            name="url"
                            id='url'
                            value={userInput.url}
                            onChange={handleChange}
                            placeholder="Enter a redirect url"
                        />
                    </FormGroup>
                </Col>
                <Col md='12' className='mb-1'>
                    <Label for="voucherImage">Upload Image</Label>
                    <div className='d-flex'>
                        <div className="file position-relative overflow-hidden mr-2">
                            <div className='text-center p-1' style={{
                                height: '102px',
                                width: '102px',
                                border: '1px dashed #d9d9d9',
                                backgroundColor: "#fafafa"
                            }}>
                                <span ><Plus size={20} className='my-1' /></span> <br />
                                <span>Upload</span>
                            </div>
                            <Input
                                // style={{ width: '300px' }}
                                style={{
                                    position: 'absolute',
                                    opacity: '0',
                                    left: '0',
                                    top: '0',
                                    height: '102px',
                                    width: '102px',
                                    cursor: 'pointer'
                                }}
                                type="file"
                                accept="image/png, image/jpeg"
                                // required
                                name="voucherImage"
                                id='voucherImage'
                                onChange={e => {
                                    uploadImg(e.target.files[0], 'push_notification_image', setPushFilePrevw)
                                }}
                            />
                        </div>
                        {pushfilePrevw && <img src={pushfilePrevw} alt='push notification img' height='100px'></img>}
                    </div>
                </Col>

                <Col md='12' className='mb-1'>
                    <ul>
                        <li><b>Size:</b> Width must be at least 300px, height at least 200px. Avoid using images wider than 2000 pixels. Also, make sure that your image is not bigger than 1MB.</li>
                        <li><b>Aspect ratio:</b> Use images in landscape format respecting a 2:1 ratio (e.g. 1000x500px)</li>
                    </ul> 
                </Col>
            </Row>
        </Fragment>
    )
}

export default CreatePushNotificationTemplate