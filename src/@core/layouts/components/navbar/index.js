// ** React Imports
import { Fragment, useEffect, useState  } from 'react'
import { useHistory } from 'react-router-dom'
import IdleTimer from '../../../../router/ActivityTracker'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'
import { activityLimit } from '../../../../Configurables'
// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'

const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
  const history = useHistory()
  const dispatch = useDispatch()
  useEffect(() => {
    const timer = new IdleTimer({
      timeout: activityLimit, //expire after 10 seconds
      onTimeout: async () => {
        const user = JSON.parse(localStorage.getItem('userData'))
        const pathnameV = window.location.pathname
        // console.log(window.location.pathname)
        await history.replace(JSON.parse(localStorage.getItem('userData'))?.role === 'admin' ? '/Adminlogin' : '/login')
        await dispatch(handleLogout())
        // alert("out of log")
        // setIsTimeout(true)
        localStorage.setItem("previousLocation", pathnameV)
        localStorage.setItem("previousRole", user?.role)
      },
      onExpired: async () => {
        console.log("expired", window.location.pathname)
        await history.replace(JSON.parse(localStorage.getItem('userData'))?.role === 'admin' ? '/Adminlogin' : '/login')
        await dispatch(handleLogout())
        // alert("Xpired! ")
        //do something if expired on load
        // setIsTimeout(true)
      }
    })

    return () => {
      timer.cleanUp()
    }
  }, [])
  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
