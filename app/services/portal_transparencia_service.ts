import env from '#start/env'
import axios from 'axios'
import type { EmendaParlamentar, EmendaParlamentarParams } from '#types/portal_transparencia'

export class PortalTransparenciaService {
  private readonly baseUrl = 'https://api.portaldatransparencia.gov.br/api-de-dados'
  private readonly apiKey = env.get('PORTAL_TRANSPARENCIA_API_KEY')
  private readonly client = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'chave-api-dados': this.apiKey,
      'Content-Type': 'application/json',
    },
  })

  private readonly headers = {
    'chave-api-dados': this.apiKey,
    'Content-Type': 'application/json',
  }

  // Beneficiários
  async getBeneficiarios(params: {
    pagina?: number
    dataInicio?: string
    dataFim?: string
    codigoIBGE?: string
    codigoOrgao?: string
    codigoPrograma?: string
    codigoAcao?: string
    codigoFuncao?: string
    codigoSubFuncao?: string
    codigoFavorecido?: string
    nomeFavorecido?: string
    codigoElemento?: string
    codigoGrupo?: string
    codigoModalidade?: string
    codigoUnidade?: string
    codigoMunicipio?: string
    codigoUF?: string
  }) {
    const response = await this.client.get('/beneficiarios', { params })
    return response.data
  }

  // Convênios
  async getConvenios(params: {
    pagina?: number
    dataInicio?: string
    dataFim?: string
    codigoIBGE?: string
    codigoOrgao?: string
    codigoPrograma?: string
    codigoAcao?: string
    codigoFuncao?: string
    codigoSubFuncao?: string
    codigoFavorecido?: string
    nomeFavorecido?: string
    codigoElemento?: string
    codigoGrupo?: string
    codigoModalidade?: string
    codigoUnidade?: string
    codigoMunicipio?: string
    codigoUF?: string
  }) {
    const response = await this.client.get('/convenios', { params })
    return response.data
  }

  // Contratos
  async getContratos(params: {
    pagina?: number
    dataInicio?: string
    dataFim?: string
    codigoIBGE?: string
    codigoOrgao?: string
    codigoPrograma?: string
    codigoAcao?: string
    codigoFuncao?: string
    codigoSubFuncao?: string
    codigoFavorecido?: string
    nomeFavorecido?: string
    codigoElemento?: string
    codigoGrupo?: string
    codigoModalidade?: string
    codigoUnidade?: string
    codigoMunicipio?: string
    codigoUF?: string
  }) {
    const response = await axios.get(`${this.baseUrl}/contratos`, {
      headers: this.headers,
      params,
    })
    return response.data
  }

  // Empenhos
  async getEmpenhos(params: {
    pagina?: number
    dataInicio?: string
    dataFim?: string
    codigoIBGE?: string
    codigoOrgao?: string
    codigoPrograma?: string
    codigoAcao?: string
    codigoFuncao?: string
    codigoSubFuncao?: string
    codigoFavorecido?: string
    nomeFavorecido?: string
    codigoElemento?: string
    codigoGrupo?: string
    codigoModalidade?: string
    codigoUnidade?: string
    codigoMunicipio?: string
    codigoUF?: string
  }) {
    const response = await axios.get(`${this.baseUrl}/empenhos`, {
      headers: this.headers,
      params,
    })
    return response.data
  }

  // Licitações
  async getLicitacoes(params: {
    pagina?: number
    dataInicio?: string
    dataFim?: string
    codigoIBGE?: string
    codigoOrgao?: string
    codigoPrograma?: string
    codigoAcao?: string
    codigoFuncao?: string
    codigoSubFuncao?: string
    codigoFavorecido?: string
    nomeFavorecido?: string
    codigoElemento?: string
    codigoGrupo?: string
    codigoModalidade?: string
    codigoUnidade?: string
    codigoMunicipio?: string
    codigoUF?: string
  }) {
    const response = await axios.get(`${this.baseUrl}/licitacoes`, {
      headers: this.headers,
      params,
    })
    return response.data
  }

  // Pagamentos
  async getPagamentos(params: {
    pagina?: number
    dataInicio?: string
    dataFim?: string
    codigoIBGE?: string
    codigoOrgao?: string
    codigoPrograma?: string
    codigoAcao?: string
    codigoFuncao?: string
    codigoSubFuncao?: string
    codigoFavorecido?: string
    nomeFavorecido?: string
    codigoElemento?: string
    codigoGrupo?: string
    codigoModalidade?: string
    codigoUnidade?: string
    codigoMunicipio?: string
    codigoUF?: string
  }) {
    const response = await axios.get(`${this.baseUrl}/pagamentos`, {
      headers: this.headers,
      params,
    })
    return response.data
  }

  // Transferências
  async getTransferencias(params: {
    pagina?: number
    dataInicio?: string
    dataFim?: string
    codigoIBGE?: string
    codigoOrgao?: string
    codigoPrograma?: string
    codigoAcao?: string
    codigoFuncao?: string
    codigoSubFuncao?: string
    codigoFavorecido?: string
    nomeFavorecido?: string
    codigoElemento?: string
    codigoGrupo?: string
    codigoModalidade?: string
    codigoUnidade?: string
    codigoMunicipio?: string
    codigoUF?: string
  }) {
    const response = await axios.get(`${this.baseUrl}/transferencias`, {
      headers: this.headers,
      params,
    })
    return response.data
  }

  // Emendas Parlamentares
  async getEmendas(params: EmendaParlamentarParams): Promise<EmendaParlamentar[]> {
    const response = await this.client.get('/emendas', { params })
    return response.data
  }
}
