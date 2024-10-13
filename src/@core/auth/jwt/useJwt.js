// ** JWT Service Import
import JwtService from './jwtService'

// ** Export Service as useJwt
export default function useJwt2(jwtOverrideConfig) {
  const jwt = new JwtService(jwtOverrideConfig)

  return {
    jwt
  }
}