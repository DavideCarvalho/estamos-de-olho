import EmendaDocumento from '#models/emenda_documento'
import EmendaParlamentar from '#models/emenda_parlamentar'
// biome-ignore lint/style/useImportType: <explanation>
import { PortalTransparenciaService } from '#services/portal_transparencia_service'
import { inject } from '@adonisjs/core/container'
import { Job } from '@rlanz/bull-queue'
import { DateTime } from 'luxon'
import { throttlePortalTransparencia } from '#start/limiter'
import queue from '@rlanz/bull-queue/services/main'

interface GetDocumentosEmendaByEmendaParlamentarJobPayload {
  emendaParlamentarId: number
}

@inject()
export default class GetDocumentosEmendaByEmendaParlamentarJob extends Job {
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
  async handle(payload: GetDocumentosEmendaByEmendaParlamentarJobPayload) {
    const { emendaParlamentarId } = payload
    const executed = await throttlePortalTransparencia.attempt(
      `get_documentos_emenda_by_emenda_parlamentar_job_${emendaParlamentarId}`,
      async () => {
        const emendaParlamentar = await EmendaParlamentar.find(emendaParlamentarId)
        if (!emendaParlamentar) {
          return
        }
        const documentos = await this.portalTransparenciaService.getEmendaDocumentos(
          emendaParlamentar.codigoEmenda
        )

        if (!documentos || !documentos.length) {
          console.log('Nenhum documento encontrado para a emenda parlamentar', emendaParlamentarId)
          return
        }

        // Convert dates from DD/MM/YYYY to YYYY-MM-DD
        const documentosFormatados = documentos.map((doc) => ({
          ...doc,
          data: DateTime.fromFormat(doc.data, 'dd/MM/yyyy'),
          emendaParlamentarId,
        }))

        await EmendaDocumento.query().where('emendaParlamentarId', emendaParlamentarId).delete()
        await EmendaDocumento.createMany(documentosFormatados)
        return true
      }
    )
    if (!executed) {
      queue.dispatch(GetDocumentosEmendaByEmendaParlamentarJob, { emendaParlamentarId })
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: GetDocumentosEmendaByEmendaParlamentarJobPayload) {}
}
