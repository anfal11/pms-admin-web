import React from 'react'
import {
  Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
  CardBody, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, InputGroup, InputGroupAddon, InputGroupText
} from 'reactstrap'


class ComponentToPrint extends React.PureComponent {
  render() {
    return (
      <div style={{ width: '100%', display: 'flex', padding: '10px', flexWrap: 'wrap' }}>
        <div style={{ width: '100%' }}>
          <h1>Fill in the Information</h1>
        </div>
        {this.props.userinput.firstname ? <div style={{ width: '50%', padding: '10px' }}>
          <label >Firstname</label>
          <input type="text" defaultValue={this.props.userinput.firstname} style={{ width: '100%', padding: '10px' }} />
        </div> : ''}
        {this.props.userinput.lastname ? <div style={{ width: '50%', padding: '10px' }}>
          <label >Lastname</label>
          <input type="text" defaultValue={this.props.userinput.lastname} style={{ width: '100%', padding: '10px' }} />
        </div> : ''}
        {this.props.userinput.companyname ? <div style={{ width: '50%', padding: '10px' }}>
          <label >Company Name</label>
          <input type="text" defaultValue={this.props.userinput.companyname} style={{ width: '100%', padding: '10px' }} />
        </div> : ''}
        <div style={{ width: '50%', padding: '10px' }}>
          <label >Account Holder Name</label>
          <input type="text" defaultValue={this.props.userinput.holderName} style={{ width: '100%', padding: '10px' }} />
        </div>
        <div style={{ width: '50%', padding: '10px' }}>
          <label >{this.props.userinput.isibn && 'IBAN'} Sort Code</label>
          <input type="text" defaultValue={this.props.userinput.sortCode} style={{ width: '100%', padding: '10px' }} />
        </div>
        <div style={{ width: '50%', padding: '10px' }}>
          <label >{this.props.userinput.isibn ? 'IBAN' : 'Account Number'}</label>
          <input type="text" defaultValue={this.props.userinput.accountnumber} style={{ width: '100%', padding: '10px' }} />
        </div>
        <div style={{ width: '50%', padding: '10px' }}>
          <label >Email</label>
          <input type="text" defaultValue={this.props.userinput.email} style={{ width: '100%', padding: '10px' }} />
        </div>
        <div style={{ width: '50%', padding: '10px' }}>
          <label >Post Code</label>
          <input type="text" defaultValue={this.props.userinput.postcode} style={{ width: '100%', padding: '10px' }} />
        </div>
        <div style={{ width: '50%', padding: '10px' }}>
          <label >Address</label>
          <input type="text" defaultValue={this.props.userinput.address} style={{ width: '100%', padding: '10px' }} />
        </div>
        <div style={{ width: '50%', padding: '10px' }}>
          <label >Country</label>
          <input type="text" defaultValue={this.props.userinput.country} style={{ width: '100%', padding: '10px' }} />
        </div>
        <div style={{ width: '50%', padding: '10px' }}>
          <label >City</label>
          <input type="text" defaultValue={this.props.userinput.city} style={{ width: '100%', padding: '10px' }} />
        </div>
        <div style={{ width: '100%', padding: '10px' }}>
          <small>You may cancel this Direct Debit at any time by contacting TukiTaki or your bank</small>
        </div>
      </div>
      // <Card>
      //   <CardHeader className='border-bottom'>
      //     <CardTitle tag='h3'>Fill in the information</CardTitle>
      //   </CardHeader>

      //   <Form className="p-2" style={{ width: '100%' }} autoComplete="off">
      //     <Row>
      //       {this.props.userinput.firstname ? <Col md='6' className="mb-1">
      //         <Label >Firstname</Label>
      //         <Input type='text' defaultValue={this.props.userinput.firstname} />
      //       </Col> : ''}

      //       {this.props.userinput.lastname ? <Col md='6' className="mb-1">
      //         <Label >Lastname</Label>
      //         <Input type='text' defaultValue={this.props.userinput.lastname} />
      //       </Col> : ''}

      //       {this.props.userinput.companyname ? <Col md='6' className="mb-1">
      //         <Label >Company Name</Label>
      //         <Input type='text' defaultValue={this.props.userinput.companyname} />
      //       </Col> : ''}

      //       <Col md='6' className="mb-1">
      //         <Label >Account Holder Name</Label>
      //         <Input type='text' defaultValue={this.props.userinput.holderName} />
      //       </Col>

      //       <Col md='6' className="mb-1">
      //         <Label >{this.props.userinput.isibn && 'IBAN'} Sort Code</Label>
      //         <Input type='number' defaultValue={this.props.userinput.sortCode} />
      //       </Col>

      //       <Col md='6' className="mb-1">
      //         <Label >{this.props.userinput.isibn ? 'IBAN' : 'Account Number'} </Label>
      //         <Input type='number' defaultValue={this.props.userinput.accountnumber} />

      //       </Col>

      //       <Col md='6' className="mb-1">
      //         <Label >Email</Label>
      //         <Input type='email' defaultValue={this.props.userinput.email} />
      //       </Col>

      //       <Col md='12'>
      //         <hr />
      //         <Card>
      //           <Row>
      //             <Col md='3'>
      //               <FormGroup>
      //                 <Label for='postcode'>Post Code</Label>
      //                 <Input type='text' defaultValue={this.props.userinput.postcode} />
      //               </FormGroup>
      //             </Col>

      //             <Col md='3' sm='12'>
      //               <FormGroup>
      //                 <Label for='address'>Address</Label>
      //                 <Input type='text' defaultValue={this.props.userinput.address} />
      //               </FormGroup>
      //             </Col>

      //             <Col md='3' sm='12'>
      //               <FormGroup>
      //                 <Label for='country'>Country</Label>
      //                 <Input type='text' defaultValue={this.props.userinput.country} />
      //               </FormGroup>
      //             </Col>

      //             <Col md='3' sm='12'>
      //               <FormGroup>
      //                 <Label for='city'>City</Label>
      //                 <Input type='text' defaultValue={this.props.userinput.city} />
      //               </FormGroup>
      //             </Col>
      //           </Row>
      //         </Card>
      //       </Col>

      //       <Col md='12' >
      //         <small>You may cancel this Direct Debit at any time by contacting TukiTaki or your bank</small>
      //       </Col>

      //     </Row>
      //   </Form>
      // </Card>
    )
  }

}

export default ComponentToPrint