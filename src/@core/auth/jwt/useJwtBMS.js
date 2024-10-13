// ** JWT Service Import
import JwtServiceBMS from './jwtServiceBMS'

// ** Export Service as useJwt

export default function useJwtBMS(jwtOverrideConfig) {
  const jwtBMS = new JwtServiceBMS(jwtOverrideConfig)

  return {
    jwtBMS
  }
}