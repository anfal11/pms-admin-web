// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

const config = useJwt.jwtConfig

// ** Handle User Login
export const handleLogin = data => {
  return dispatch => {
    dispatch({
      type: 'LOGIN',
      data,
      config,
      [config.storageTokenKeyName]: data[config.storageTokenKeyName],
      [config.storageRefreshTokenKeyName]: data[config.storageRefreshTokenKeyName]
    })

    // ** Add to user, accessToken & refreshToken to localStorage
    localStorage.setItem('userData', JSON.stringify(data))
    localStorage.setItem(config.storageTokenKeyName, data.accessToken)
    localStorage.setItem(config.storageRefreshTokenKeyName, data.refreshToken)
  }
}

// ** Handle User Logout
export const handleLogout = () => {
  return dispatch => {
    
    useJwt2.logout({ headers: { Authorization : `${config.tokenType} ${localStorage.getItem(config.storageTokenKeyName)}`}}).catch(e => console.log(e))

    dispatch({ type: 'LOGOUT', [config.storageTokenKeyName]: null, [config.storageRefreshTokenKeyName]: null })

    // ** Remove user, accessToken & refreshToken from localStorage
    localStorage.removeItem('userData')
    localStorage.removeItem(config.storageTokenKeyName)
    localStorage.removeItem(config.storageRefreshTokenKeyName)
    localStorage.clear()
  }
}
