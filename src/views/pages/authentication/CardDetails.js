import React, { useState } from 'react'
import {
  Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane
} from 'reactstrap'
import { Link, useHistory } from "react-router-dom"
import pms from '../../../assets/images/icons/RILAC-Logo.svg'
import CreditCardDetails from './AddCreditCard'
import GoCardless from './GoCardless'

const CardDetails = () => {
  const [activeTab, setActiveTab] = useState('1')
  const toggle = tab => setActiveTab(tab)
  const userData = JSON.parse(localStorage.getItem('registration_data'))
  return (
    <Card style={{ maxWidth: "768px" }} className="mx-auto my-4">
      <CardBody className='pt-2'>
        <Nav pills className="border-bottom pb-1">
          <NavItem>
            <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
              <span className='align-middle d-none d-sm-block'>Credit Card Details</span>
            </NavLink>
          </NavItem>
         {
          userData.country === "UK" &&  <NavItem>
          <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
            <span className='align-middle d-none d-sm-block'>Go-Cardless Details</span>
          </NavLink>
        </NavItem>
         }
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId='1'>
            <CreditCardDetails />
          </TabPane>
          <TabPane tabId='2'>
            <GoCardless />
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
  )
}

export default CardDetails
