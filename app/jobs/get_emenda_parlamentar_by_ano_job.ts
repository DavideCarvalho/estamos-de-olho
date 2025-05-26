import EmendaParlamentar from '#models/emenda_parlamentar'
import { PortalTransparenciaService } from '#services/portal_transparencia_service'
import { inject } from '@adonisjs/core/container'
import { Job } from '@rlanz/bull-queue'
import queue from '@rlanz/bull-queue/services/main'

interface GetEmendaParlamentarByAnoJobPayload {
  ano: number
  pagina?: number
}

@inject()
export default class GetEmendaParlamentarByAnoJob extends Job {
  constructor(private readonly portalTransparenciaService: PortalTransparenciaService) {
    super()
  }

  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: GetEmendaParlamentarByAnoJobPayload) {
    console.log('GetEmendaParlamentarByAnoJob', payload)
    const { ano, pagina = 1 } = payload
    const emendas = await this.portalTransparenciaService.getEmendas({ ano, pagina })
    if (!emendas.length) {
      return
    }
    await EmendaParlamentar.query()
      .where(
        'codigoEmenda',
        'in',
        emendas.map((emenda) => emenda.codigoEmenda)
      )
      .delete()
    await EmendaParlamentar.createMany(emendas)
    queue.dispatch(GetEmendaParlamentarByAnoJob, { ano, pagina: pagina + 1 })
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: GetEmendaParlamentarByAnoJobPayload) {}
}
