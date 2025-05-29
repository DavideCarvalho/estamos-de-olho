import axios, { type AxiosResponse } from 'axios'
import type {
  EmendaParlamentar,
  EmendaParlamentarParams,
  DocumentoDetalhes,
} from '#types/portal_transparencia'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import * as cheerio from 'cheerio'

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

  async getDocumentoDetalhes(codigo: string): Promise<AxiosResponse<DocumentoDetalhes>> {
    const response = await this.client.get(
      `/despesas/documento/empenho/${codigo}?ordenarPor=fase&direcao=asc`
    )

    const $ = cheerio.load(response.data)

    const documentoDetalhes: DocumentoDetalhes = {
      data: $('.dados-tabelados .row:first-child .col-xs-12.col-sm-3:first-child span')
        .text()
        .trim(),
      documento: $('.dados-tabelados .row:first-child .col-xs-12.col-sm-3:nth-child(2) span')
        .text()
        .trim(),
      documentoResumido: $('.dados-tabelados .row:first-child .col-xs-12.col-sm-6 span')
        .text()
        .trim(),
      observacao: $('.dados-tabelados .row:nth-child(3) .col-xs-12 span').text().trim(),
      funcao: $(
        '.dados-detalhados #dadosEmpenho .bloco .row:first-child .col-xs-12.col-sm-6:first-child span'
      )
        .text()
        .trim(),
      subfuncao: $(
        '.dados-detalhados #dadosEmpenho .bloco .row:first-child .col-xs-12.col-sm-6:nth-child(2) span'
      )
        .text()
        .trim(),
      programa: $(
        '.dados-detalhados #dadosEmpenho .bloco .row:nth-child(2) .col-xs-12.col-sm-6:first-child span'
      )
        .text()
        .trim(),
      acao: $(
        '.dados-detalhados #dadosEmpenho .bloco .row:nth-child(2) .col-xs-12.col-sm-3:nth-child(2) span'
      )
        .text()
        .trim(),
      subTitulo: $('strong:contains("Subtítulo (localizador)")').next('span').text().trim(),
      localizadorGasto: $(
        '.dados-detalhados #dadosEmpenho .bloco .row:nth-child(5) .col-xs-12.col-sm-12 span'
      )
        .text()
        .trim(),
      fase: $('strong:contains("Fase")').next('span').text().trim(),
      especie: $('strong:contains("Espécie/tipo de documento")').next('span').text().trim(),
      favorecido: $('.dados-detalhados #dadosFavorecido .col-xs-12.col-sm-9 span').text().trim(),
      codigoFavorecido: $('.dados-detalhados #dadosFavorecido .col-xs-12.col-sm-3 span')
        .text()
        .trim(),
      nomeFavorecido: $('.dados-detalhados #dadosFavorecido .col-xs-12.col-sm-9 span')
        .text()
        .trim(),
      ufFavorecido: '',
      valor: $('strong:contains("Valor atual do documento")').next('span').text().trim(),
      codigoUg: $('.dados-detalhados #dadosOrgaoEmitente .col-xs-12.col-sm-3:nth-child(3) .btwline')
        .text()
        .trim(),
      ug: $(
        '.dados-detalhados #dadosOrgaoEmitente .col-xs-12.col-sm-3:nth-child(3) span:last-child'
      )
        .text()
        .trim(),
      codigoUo: $('.dados-detalhados #dadosOrgaoEmitente .col-xs-12.col-sm-3:nth-child(2) .btwline')
        .text()
        .trim(),
      uo: $(
        '.dados-detalhados #dadosOrgaoEmitente .col-xs-12.col-sm-3:nth-child(2) span:last-child'
      )
        .text()
        .trim(),
      codigoOrgao: $(
        '.dados-detalhados #dadosOrgaoEmitente .col-xs-12.col-sm-3:nth-child(2) .btwline'
      )
        .text()
        .trim(),
      orgao: $(
        '.dados-detalhados #dadosOrgaoEmitente .col-xs-12.col-sm-3:nth-child(2) span:last-child'
      )
        .text()
        .trim(),
      codigoOrgaoSuperior: $(
        '.dados-detalhados #dadosOrgaoEmitente .col-xs-12.col-sm-3:first-child .btwline'
      )
        .text()
        .trim(),
      orgaoSuperior: $(
        '.dados-detalhados #dadosOrgaoEmitente .col-xs-12.col-sm-3:first-child span:last-child'
      )
        .text()
        .trim(),
      categoria: $(
        '.dados-detalhados #dadosEmpenho .bloco-cinza .row:first-child .col-xs-12.col-sm-6:first-child span'
      )
        .text()
        .trim(),
      grupo: $(
        '.dados-detalhados #dadosEmpenho .bloco-cinza .row:first-child .col-xs-12.col-sm-6:nth-child(2) span'
      )
        .text()
        .trim(),
      elemento: $(
        '.dados-detalhados #dadosEmpenho .bloco-cinza .row:nth-child(2) .col-xs-12.col-sm-6:nth-child(2) span'
      )
        .text()
        .trim(),
      modalidade: $(
        '.dados-detalhados #dadosEmpenho .bloco-cinza .row:nth-child(2) .col-xs-12.col-sm-6:first-child span'
      )
        .text()
        .trim(),
      numeroProcesso: $('.dados-detalhados #dadosEmpenho .bloco .row .col-xs-12.col-sm-4 span')
        .text()
        .trim(),
      planoOrcamentario: $(
        '.dados-detalhados #dadosEmpenho .bloco .row:nth-child(4) .col-xs-12.col-sm-12 span'
      )
        .text()
        .trim(),
      autor: $(
        '.dados-detalhados #dadosEmpenho .bloco-cinza .row:first-child .col-xs-12.col-sm-6:nth-child(2) span'
      )
        .text()
        .trim(),
      favorecidoIntermediario: false,
      favorecidoListaFaturas: false,
    }

    return {
      ...response,
      data: documentoDetalhes,
    }
  }
}
