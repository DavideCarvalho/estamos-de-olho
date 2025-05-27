import limiter from '@adonisjs/limiter/services/main'

export class PortalTransparenciaLimiterService {
  public limiter = limiter.use({
    requests: 380,
    duration: '1 minute',
  })
}
