import React, { Fragment, useState, forwardRef, useEffect } from 'react'
import { Modal, Button, Skeleton } from 'antd'
import Draggable from 'react-draggable'
import { FormFeedback, Card, CardHeader, CardTitle,  UncontrolledButtonDropdown, 
    DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, 
    Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody } from 'reactstrap'

function ProductDetailsModal (props) {

    const [modalconfig, setmodalconfig] = useState({
        visible: false,
        disabled: true,
        bounds: { left: 0, top: 0, bottom: 0, right: 0 }
    })

    const  draggleRef = React.createRef()
    const handleOk  = (e) => {
        props.handelmodal()
        setmodalconfig({...modalconfig, visible:false})
    }
    const handleCancel  = (e) => {
        props.handelmodal()
        setmodalconfig({...modalconfig, visible:false})
    }

    const onMouseOver  = () => {
        if (modalconfig.disabled) {
            setmodalconfig({...modalconfig, disabled:false})
        }
    }
    const onMouseOut  = () => setmodalconfig({...modalconfig, disabled:true})

    const onStart = (event, uiData) => {

      }

      return (
        <Fragment>
          <Modal
          width={700}
          maskClosable={false}
          style={{ top: 20 }}
            title={
              <div
                style={{
                  width: '100%',
                  cursor: 'move'
                }}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onFocus={() => {}}
                onBlur={() => {}}
              >
                Product Details
              </div>
            }
            visible={props.openmodal || modalconfig.visible}
            onOk={handleOk}
            onCancel={handleCancel}
    
          >

          <Fragment>
          {
            props.loading ?  <Fragment>
            <Skeleton active />
            <Skeleton active />
            </Fragment> :  <Row>
                     <Col sm="4" >
                            <FormGroup>
                                <Label for="productname">Product Code </Label>
                                <Input type="text" disabled value={props.details['product_code']}/>

                            </FormGroup>
                        </Col>
                        <Col sm="4" >
                            <FormGroup>
                                <Label for="productname">Product name </Label>
                                <Input type="text" disabled value={props.details['productname']}/>

                            </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="productCategory">Category</Label>
                                <Input type="text" disabled value={props.details['categoryinfo'] ? props.details['categoryinfo']['categoryname'] : "" }/>
                            </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="productSubCategory">Sub-category</Label> 
                                <Input type="text" disabled value={props.details['categoryinfo'] ? props.details['subcategoryinfo']['subcategoryname'] : ""}/>
                            </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="RRP">RRP </Label>
                                <Input type="text" disabled value={props.details['RRP']}/>
                            </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="tillprice">Till price </Label>
                                <Input type="text" disabled value={props.details['tillprice']}/>
                            </FormGroup>
                        </Col>

                     <Col sm="4" >
                            <FormGroup>
                                <Label for="productsize">Product size </Label>
                                <Input type="text" disabled value={props.details['productsize']}/>
                            </FormGroup>
                        </Col>
                        <Col sm="4" >
                            <FormGroup>
                                <Label for="unitvolume"> Unit volume </Label>
                                <Input type="text" disabled value={props.details['unitvolume']}/>
                             </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="status">Status </Label>
                                <Input type="text" disabled value={props.details['status'] === 1 ? 'Active' : 'Inactive'}/>
                            </FormGroup>
                        </Col>
                       {
                           props.details['stockinfo'] && props.details['stockinfo'].length ? <Fragment>
                               {
                                   props.details['stockinfo'].map(item => <Fragment>
                                         <Col sm="4" >
                                    <FormGroup>
                                        <Label > Store Name </Label>
                                        <Input type="text" disabled value={item['storeinfo'] ? item['storeinfo']['storename'] : "" }/>
                                    </FormGroup>
                                </Col>
                                <Col sm="4" >
                                    <FormGroup>
                                        <Label > Quantity </Label>
                                        <Input type="text" disabled value={item['quantity'] || "" }/>
                                    </FormGroup>
                                </Col>
                                <Col sm="4" >
                                    <FormGroup>
                                        <Label > Location </Label>
                                        <Input type="textarea" disabled rows='2' value={item['location'] || "" }/>
                                    </FormGroup>
                                </Col>
                                   </Fragment>)
                               }
                              
                           </Fragment> : null
                       }

                       {
                           props.details['barcodes'] && props.details['barcodes']['barcode'] ? props.details['barcodes']['barcode'].map((item, index) =>  <Col sm="4" >
                           <FormGroup>
                               <Label for="status">Barcode-{index + 1} </Label>
                               <Input type="text" disabled value={item || ""}/>
                           </FormGroup>
                       </Col>) : null
                       }

                       <Col sm="12" >
                            <FormGroup>
                                <Label for="productdetails">Product details </Label>
                                <Input type='textarea' rows='3' disabled value={props.details['productdetails']} />
                                 </FormGroup>
                        </Col>

            </Row>

            }
          </Fragment>
           
          </Modal>
        </Fragment>
      )
    
 
}


export default ProductDetailsModal