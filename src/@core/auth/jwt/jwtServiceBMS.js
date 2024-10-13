import axios  from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'
import { BMS_PASS, BMS_USER } from '../../../Configurables'

const instanceBMS = axios.create()

export default class JwtServiceBMS {

  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }
  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
    console.log('jwtOverrideConfig ', jwtOverrideConfig)
    // ** Request Interceptor
    instanceBMS.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        console.log('config ', config)
        const BMSToken = this.getToken()

        config.headers.Authorization = `${this.jwtConfig.tokenType} ${BMSToken}`
        
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    instanceBMS.interceptors.response.use(
        response => response,
        error => {
          // ** const { config, response: { status } } = error
          const { config, response } = error
          const originalRequest = config
  
          // ** if (status === 401) {
          if (response && response.status === 401) {
  
            console.log('response.status ', response.status)
            // console.log('!this.isAlreadyFetchingAccessToken ', !this.isAlreadyFetchingAccessToken)
  
            if (!this.isAlreadyFetchingAccessToken) {
              this.isAlreadyFetchingAccessToken = true
              // console.log('this.isAlreadyFetchingAccessToken ', this.isAlreadyFetchingAccessToken)
              this.refreshToken().then(r => {
                this.isAlreadyFetchingAccessToken = false
                // console.log('this.isAlreadyFetchingAccessToken ', this.isAlreadyFetchingAccessToken)
                // console.log('refreshToken response .data ', r.data)
                // ** Update accessToken in localStorage
                this.setToken(r.data.jwtToken)
                //this.setRefreshToken(r.data.RefreshToken)
  
                this.onAccessTokenFetched(r.data.jwtToken)
  
              })
            } else {
              //refresh token expire also.. need to clear session and redirect user to login page..
              window.location.replace("logout")
            }
            const retryOriginalRequest = new Promise(resolve => {
              this.addSubscriber(accessToken => {
  
                // console.log('addSubscriber accessToken ', accessToken)
                // ** Make sure to assign accessToken according to your response.
                // ** Check: https://pixinvent.ticksy.com/ticket/2413870
                // ** Change Authorization header
                originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
  
                // console.log('originalRequest.headers.Authorization ', `${this.jwtConfig.tokenType} ${accessToken}`)
  
                resolve(instanceBMS(originalRequest))
              })
            })
            return retryOriginalRequest
          }
          return Promise.reject(error)
        }
      )
    }


 onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

 addSubscriber(callback) {
   this.subscribers.push(callback)
 }

  getToken() {
    return localStorage.getItem('BMStoken') || null
  }

  setToken(value) {
    localStorage.setItem('BMStoken', value)
  }

  refreshToken() {
    return instanceBMS.post(this.jwtConfig.getBMStoken, {username: BMS_USER, password: BMS_PASS})

  }
  login() {
    return instanceBMS.post(this.jwtConfig.getBMStoken, {username: BMS_USER, password: BMS_PASS})

  }

  //bms dashboard
  bmsDashboard() {
    return instanceBMS.get(this.jwtConfig.bmsDashboardEndpoint)
  }
   //service
   getServiceList(...args) {
    return instanceBMS.get(this.jwtConfig.serviceListEndpoint)
  }

  campaignList() {
    return instanceBMS.get(`${this.jwtConfig.campaignEndpoint}`)
  }
}
