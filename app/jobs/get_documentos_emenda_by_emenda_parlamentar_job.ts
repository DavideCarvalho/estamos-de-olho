import EmendaDocumento from '#models/emenda_documento'
import EmendaParlamentar from '#models/emenda_parlamentar'
// biome-ignore lint/style/useImportType: <explanation>
import { PortalTransparenciaLimiterService } from '#services/portal_transparencia_limiter_service'
// biome-ignore lint/style/useImportType: <explanation>
import { PortalTransparenciaService } from '#services/portal_transparencia_service'
import { inject } from '@adonisjs/core/container'
import { Job } from '@rlanz/bull-queue'
import { DateTime } from 'luxon'
import queue from '@rlanz/bull-queue/services/main'
import logger from '@adonisjs/core/services/logger'

interface GetDocumentosEmendaByEmendaParlamentarJobPayload {
  emendaParlamentarId: number
}

@inject()
export default class GetDocumentosEmendaByEmendaParlamentarJob extends Job {
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

  /**
   * Base Entry point
   */
  async handle(payload: GetDocumentosEmendaByEmendaParlamentarJobPayload) {
    const { emendaParlamentarId } = payload
    try {
      const emendaParlamentar = await EmendaParlamentar.find(emendaParlamentarId)
      if (!emendaParlamentar) {
        logger.info(
          `[GetDocumentosEmendaByEmendaParlamentarJob] Emenda parlamentar não encontrada ${emendaParlamentarId}`
        )
        return
      }
      const emendaDocuments = await EmendaDocumento.findManyBy(
        'emendaParlamentarId',
        emendaParlamentarId
      )
      for (const doc of emendaDocuments) {
        await doc.delete()
      }

      const documentos = await this.portalTransparenciaService.getEmendaDocumentos(
        emendaParlamentar.codigoEmenda
      )

      if (!documentos || !documentos.length) {
        logger.info(
          `[GetDocumentosEmendaByEmendaParlamentarJob] Nenhum documento encontrado para a emenda parlamentar ${emendaParlamentarId}`
        )
        return
      }

      // Convert dates from DD/MM/YYYY to YYYY-MM-DD
      const documentosFormatados = await Promise.all(
        documentos.map((doc) => {
          const emendaDocumento = new EmendaDocumento()
          return emendaDocumento.fill({
            data: DateTime.fromFormat(doc.data, 'dd/MM/yyyy'),
            emendaParlamentarId,
            id: doc.id === -1 ? undefined : doc.id,
            fase: doc.fase,
            codigoDocumento: doc.codigoDocumento,
            codigoDocumentoResumido: doc.codigoDocumentoResumido,
            especieTipo: doc.especieTipo,
            tipoEmenda: doc.tipoEmenda,
          })
        })
      )

      EmendaDocumento.createMany(documentosFormatados)
      logger.info(
        `[GetDocumentosEmendaByEmendaParlamentarJob] Documentos salvos para a emenda parlamentar ${emendaParlamentarId}`
      )
    } catch (error) {
      logger.info(
        `[GetDocumentosEmendaByEmendaParlamentarJob] Erro ao salvar documentos para a emenda parlamentar ${emendaParlamentarId}`
      )
      logger.info(`[GetDocumentosEmendaByEmendaParlamentarJob] Erro: ${JSON.stringify(error)}`)
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: GetDocumentosEmendaByEmendaParlamentarJobPayload) {}
}
