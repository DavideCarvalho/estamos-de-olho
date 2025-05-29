import EmendaDocumento from '#models/emenda_documento'
import Favorecido from '#models/favorecido'
import { PortalTransparenciaService } from '#services/portal_transparencia_service'
import { Job } from '@rlanz/bull-queue'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

interface GetEmendaDocumentoFavorecidosJobPayload {
  emendaDocumentoId: number
}

export default class GetEmendaDocumentoFavorecidosJob extends Job {
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
  async handle(payload: GetEmendaDocumentoFavorecidosJobPayload) {
    const { emendaDocumentoId } = payload
    const emendaDocumento = await EmendaDocumento.find(emendaDocumentoId)
    if (!emendaDocumento) {
      throw new Error('Emenda documento not found')
    }

    const data = await this.portalTransparenciaService.getDocumentoDetalhes(
      emendaDocumento.codigoDocumento
    )

    // Delete existing favorecido if any
    await Favorecido.query().where('emendaDocumentoId', emendaDocumentoId).delete()

    // Create new favorecido
    const favorecido = new Favorecido()
    await favorecido
      .fill({
        emendaDocumentoId,
        data: DateTime.fromFormat(data.data, 'dd/MM/yyyy'),
        documento: data.documento,
        documentoResumido: data.documentoResumido,
        observacao: data.observacao,
        funcao: data.funcao,
        subfuncao: data.subfuncao,
        programa: data.programa,
        acao: data.acao,
        subTitulo: data.subTitulo,
        localizadorGasto: data.localizadorGasto,
        fase: data.fase,
        especie: data.especie,
        favorecido: data.favorecido,
        codigoFavorecido: data.codigoFavorecido,
        nomeFavorecido: data.nomeFavorecido,
        ufFavorecido: data.ufFavorecido,
        valor: data.valor,
        codigoUg: data.codigoUg,
        ug: data.ug,
        codigoUo: data.codigoUo,
        uo: data.uo,
        codigoOrgao: data.codigoOrgao,
        orgao: data.orgao,
        codigoOrgaoSuperior: data.codigoOrgaoSuperior,
        orgaoSuperior: data.orgaoSuperior,
        categoria: data.categoria,
        grupo: data.grupo,
        elemento: data.elemento,
        modalidade: data.modalidade,
        numeroProcesso: data.numeroProcesso,
        planoOrcamentario: data.planoOrcamentario,
        autor: data.autor,
        favorecidoIntermediario: data.favorecidoIntermediario,
        favorecidoListaFaturas: data.favorecidoListaFaturas,
      })
      .save()

    logger.info(
      `[GetEmendaDocumentoFavorecidosJob] Favorecido salvo para o documento ${emendaDocumento.codigoDocumento}`
    )
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: GetEmendaDocumentoFavorecidosJobPayload) {
    logger.info(
      `[GetEmendaDocumentoFavorecidosJob] Job falhou para o documento ${payload.emendaDocumentoId}`
    )
  }
}
