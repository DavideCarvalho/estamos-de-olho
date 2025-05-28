import type {
  EmendaParlamentar,
  EmendaParlamentarParams,
  EmendaDocumento,
} from '#types/portal_transparencia'
import { PortalTransparenciaFallbackIntegration } from '#integration/portal_transparencia_fallback_integration'
import { PortalTransparenciaIntegration } from '#integration/portal_transparencia_integration'
import logger from '@adonisjs/core/services/logger'
import { inject } from '@adonisjs/core'
import type { AxiosError } from 'axios'

@inject()
export class PortalTransparenciaService {
  constructor(
    private readonly portalTransparenciaFallbackIntegration: PortalTransparenciaFallbackIntegration,
    private readonly portalTransparenciaIntegration: PortalTransparenciaIntegration
  ) {}

  async getEmendas(params: EmendaParlamentarParams): Promise<EmendaParlamentar[]> {
    try {
      logger.info('[getEmendas] Tentando usar integração oficial')
      const response = await this.portalTransparenciaIntegration.getEmendas(params)
      logger.info(
        `[getEmendas] Usando integração oficial para o ano: ${params.ano} na página: ${params.pagina}`
      )
      if (!Array.isArray(response.data)) {
        logger.info(`[getEmendas] Resposta não é um array: ${JSON.stringify(response.data)}`)
        logger.info('[getEmendas] Soltando erro pra ir pro fallback')
        throw new Error()
      }
      return response.data
    } catch (error) {
      try {
        logger.info('[getEmendas] Erro na integração oficial, tentando usar fallback')
        const response = await this.portalTransparenciaFallbackIntegration.getEmendas(params)
        if (!Array.isArray(response.data?.data)) {
          logger.info(
            `[getEmendas] Fallback: Resposta não é um array: ${JSON.stringify(response.data)}`
          )
          logger.info('[getEmendas] Fallback: Soltando erro e não retornando nada')
          throw new Error()
        }
        logger.info(
          `[getEmendas] Usando fallback para o ano: ${params.ano} na página: ${params.pagina}`
        )
        return response.data.data.map((emenda) => ({
          codigoEmenda: emenda.codigoEmenda,
          ano: emenda.ano,
          tipoEmenda: emenda.tipoEmenda,
          autor: emenda.autor,
          nomeAutor: emenda.autor,
          numeroEmenda: emenda.numeroEmenda,
          localidadeDoGasto: emenda.localidadeDoGasto,
          funcao: emenda.funcao,
          subfuncao: emenda.subfuncao,
          valorEmpenhado: emenda.valorEmpenhado,
          valorLiquidado: emenda.valorLiquidado,
          valorPago: emenda.valorPago,
          valorRestoInscrito: emenda.valorRestoInscrito,
          valorRestoCancelado: emenda.valorRestoCancelado,
          valorRestoPago: emenda.valorRestoPago,
        }))
      } catch (error2) {
        logger.info('[getEmendas] Erro no fallback, soltando erro')
        logger.info(`[getEmendas] Erro: ${JSON.stringify((error2 as AxiosError).response?.data)}`)
        throw new Error()
      }
    }
  }

  async getEmendaDocumentos(codigo: string, pagina = 1): Promise<EmendaDocumento[]> {
    try {
      logger.info('[getEmendaDocumentos] Tentando usar integração oficial')
      const response = await this.portalTransparenciaIntegration.getEmendaDocumentos(codigo, pagina)
      logger.info(
        `[getEmendaDocumentos] Usando integração oficial para o código: ${codigo} na página: ${pagina}`
      )
      if (!Array.isArray(response.data)) {
        logger.info(
          `[getEmendaDocumentos] Resposta não é um array: ${JSON.stringify(response.data)}`
        )
        logger.info('[getEmendaDocumentos] Soltando erro pra ir pro fallback')
        throw new Error()
      }
      return response.data
    } catch (error) {
      try {
        logger.info('[getEmendaDocumentos] Erro na integração oficial, tentando usar fallback')
        const response = await this.portalTransparenciaFallbackIntegration.getEmendaDocumentos(
          codigo,
          pagina
        )
        if (!Array.isArray(response.data?.data)) {
          logger.info(
            `[getEmendaDocumentos] Fallback: Resposta não é um array: ${JSON.stringify(response.data)}`
          )
          logger.info('[getEmendaDocumentos] Fallback: Soltando erro e não retornando nada')
          throw new Error()
        }
        logger.info(
          `[getEmendaDocumentos] Usando fallback para o código: ${codigo} na página: ${pagina}`
        )
        return response.data.data.map((doc) => ({
          data: doc.data,
          fase: doc.fase,
          codigoDocumento: doc.codigoDocumento,
          codigoDocumentoResumido: doc.codigoDocumentoResumido,
          favorecido: doc.favorecido,
          valor: doc.valor,
          id: -1,
          especieTipo: '',
          tipoEmenda: '',
        }))
      } catch (error2) {
        logger.info('[getEmendaDocumentos] Erro no fallback, soltando erro')
        logger.info(`[getEmendaDocumentos] Erro: ${JSON.stringify(error2)}`)
        throw new Error()
      }
    }
  }
}
