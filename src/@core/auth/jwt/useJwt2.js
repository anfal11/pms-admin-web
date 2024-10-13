// ** JWT Service Import
import JwtService2 from './jwtService2'

// ** Export Service as useJwt

export default function useJwt2(jwtOverrideConfig) {
  const jwt = new JwtService2(jwtOverrideConfig)

  return {
    jwt
  }
}