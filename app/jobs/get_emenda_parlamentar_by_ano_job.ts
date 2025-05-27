import EmendaParlamentar from '#models/emenda_parlamentar'
import GetDocumentosEmendaByEmendaParlamentarJob from '#jobs/get_documentos_emenda_by_emenda_parlamentar_job'
// biome-ignore lint/style/useImportType: <explanation>
import { PortalTransparenciaService } from '#services/portal_transparencia_service'
import { inject } from '@adonisjs/core/container'
import { Job } from '@rlanz/bull-queue'
import queue from '@rlanz/bull-queue/services/main'
import logger from '@adonisjs/core/services/logger'
// biome-ignore lint/style/useImportType: <explanation>
import { PortalTransparenciaLimiterService } from '#services/portal_transparencia_limiter_service'

interface GetEmendaParlamentarByAnoJobPayload {
  ano: number
  pagina?: number
}

@inject()
export default class GetEmendaParlamentarByAnoJob extends Job {
  constructor(
    private readonly portalTransparenciaService: PortalTransparenciaService,
    private readonly portalTransparenciaLimiterService: PortalTransparenciaLimiterService
  ) {
    super()
  }

  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  private convertBrazilianNumberToInteger(value: string | null): number | null {
    if (!value) return null
    // Remove dots (thousand separators) and replace comma with dot
    const normalizedValue = value.replace(/\./g, '').replace(',', '.')
    return Math.round(Number(normalizedValue) * 100)
  }

  /**
   * Base Entry point
   */
  async handle(payload: GetEmendaParlamentarByAnoJobPayload) {
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
    const formattedEmendas = emendas.map((emenda) => {
      return new EmendaParlamentar().fill({
        ...emenda,
        valorEmpenhado: this.convertBrazilianNumberToInteger(emenda.valorEmpenhado),
        valorLiquidado: this.convertBrazilianNumberToInteger(emenda.valorLiquidado),
        valorPago: this.convertBrazilianNumberToInteger(emenda.valorPago),
        valorRestoInscrito: this.convertBrazilianNumberToInteger(emenda.valorRestoInscrito),
        valorRestoCancelado: this.convertBrazilianNumberToInteger(emenda.valorRestoCancelado),
        valorRestoPago: this.convertBrazilianNumberToInteger(emenda.valorRestoPago),
      })
    })
    const savedEmendas = await EmendaParlamentar.createMany(formattedEmendas)
    queue.dispatch(GetEmendaParlamentarByAnoJob, { ano, pagina: pagina + 1 })
    for (const emenda of savedEmendas) {
      queue.dispatch(GetDocumentosEmendaByEmendaParlamentarJob, {
        emendaParlamentarId: emenda.id,
      })
    }
    logger.info(
      `[GetEmendaParlamentarByAnoJob] Emendas salvas para o ano ${ano} na página ${pagina}`
    )
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: GetEmendaParlamentarByAnoJobPayload) {}
}
