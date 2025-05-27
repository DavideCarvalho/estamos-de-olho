import axios, { type AxiosResponse } from 'axios'
import type { EmendaParlamentar, EmendaParlamentarParams } from '#types/portal_transparencia'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'

interface PortalTransparenciaWebResponse {
  draw: number
  recordsTotal: number
  recordsFiltered: number
  data: Array<{
    codigoEmenda: string
    ano: number
    tipoEmenda: string
    autor: string
    numeroEmenda: string
    localidadeDoGasto: string
    codigoFuncao: string
    funcao: string
    subfuncao: string
    programa: string
    acao: string
    planoOrcamentario: string
    codigoSubfuncao: string
    valorEmpenhado: string
    valorLiquidado: string
    valorPago: string
    valorRestoInscrito: string
    valorRestoCancelado: string
    valorRestoPago: string
    flgExisteCodAutorValido: boolean
    skTipoEmenda: number
    linkDetalhamento: string
  }>
  error: null
}

interface EmendaDocumentoResponse {
  draw: number
  recordsTotal: number
  recordsFiltered: number
  data: Array<{
    data: string
    fase: string
    codigoDocumento: string
    codigoDocumentoResumido: string
    favorecido: string
    valor: string
  }>
  error: null
}

export class PortalTransparenciaFallbackIntegration {
  private readonly baseUrl = 'https://portaldatransparencia.gov.br'
  private readonly client = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PostmanRuntime/7.26.8',
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      'Host': 'portaldatransparencia.gov.br',
    },
  })

  async getEmendas(
    params: EmendaParlamentarParams
  ): Promise<AxiosResponse<PortalTransparenciaWebResponse>> {
    const { ano, pagina } = params
    const tamanhoPagina = 10

    const response = await this.client.get<PortalTransparenciaWebResponse>(
      '/emendas/consulta/resultado',
      {
        params: {
          paginacaoSimples: true,
          tamanhoPagina,
          offset: (pagina - 1) * tamanhoPagina,
          de: ano,
          ate: ano,
          colunasSelecionadas: [
            'linkDetalhamento',
            'ano',
            'tipoEmenda',
            'autor',
            'numeroEmenda',
            'localidadeDoGasto',
            'funcao',
            'subfuncao',
            'programa',
            'acao',
            'planoOrcamentario',
            'codigoEmenda',
            'valorEmpenhado',
            'valorLiquidado',
            'valorPago',
            'valorRestoInscrito',
            'valorRestoCancelado',
            'valorRestoPago',
          ].join(','),
        },
      }
    )

    return response
  }

  async getEmendaDocumentos(
    codigo: string,
    pagina = 1
  ): Promise<AxiosResponse<EmendaDocumentoResponse>> {
    const tamanhoPagina = 10

    const response = await this.client.get<EmendaDocumentoResponse>(
      '/emendas/documentos-relacionados/resultado',
      {
        params: {
          paginacaoSimples: true,
          tamanhoPagina,
          offset: (pagina - 1) * tamanhoPagina,
          direcaoOrdenacao: 'asc',
          colunaOrdenacao: 'data',
          codigo,
        },
      }
    )

    return response
  }
}
