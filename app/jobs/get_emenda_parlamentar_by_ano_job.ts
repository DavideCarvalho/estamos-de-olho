import EmendaParlamentar from '#models/emenda_parlamentar'
import GetDocumentosEmendaByEmendaParlamentarJob from '#jobs/get_documentos_emenda_by_emenda_parlamentar_job'
// biome-ignore lint/style/useImportType: <explanation>
import { PortalTransparenciaService } from '#services/portal_transparencia_service'
import { inject } from '@adonisjs/core/container'
import { Job } from '@rlanz/bull-queue'
import queue from '@rlanz/bull-queue/services/main'
import { throttlePortalTransparencia } from '#start/limiter'

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
    const { ano, pagina = 1 } = payload
    const executed = await throttlePortalTransparencia.attempt(
      `get_emenda_parlamentar_by_ano_job_${ano}_${pagina}`,
      async () => {
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
        const savedEmendas = await EmendaParlamentar.createMany(emendas)
        queue.dispatch(GetEmendaParlamentarByAnoJob, { ano, pagina: pagina + 1 })
        for (const emenda of savedEmendas) {
          queue.dispatch(GetDocumentosEmendaByEmendaParlamentarJob, {
            emendaParlamentarId: emenda.id,
          })
        }
        return true
      }
    )
    if (!executed) {
      queue.dispatch(GetEmendaParlamentarByAnoJob, { ano, pagina })
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: GetEmendaParlamentarByAnoJobPayload) {}
}
