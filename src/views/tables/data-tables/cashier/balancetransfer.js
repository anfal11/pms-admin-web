import React, { useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import CashDeposit from './CashDeposit'
import SafeDeposit from './SafeDeposit'
import SafeToBank from './SafeDepoToBank'

const TabsBasic = () => {
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <React.Fragment>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Cash Deposit
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Deposit to Safe
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Safe to Bank
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
          <CashDeposit />
        </TabPane>
        <TabPane tabId='2'>
           <SafeDeposit />
        </TabPane>
        <TabPane tabId='3'>
            <SafeToBank />
        </TabPane>
      </TabContent>
    </React.Fragment>
  )
}
export default TabsBasic