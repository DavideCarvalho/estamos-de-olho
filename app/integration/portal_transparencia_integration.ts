import env from '#start/env'
import axios, { type AxiosResponse } from 'axios'
import type {
  EmendaParlamentar,
  EmendaParlamentarParams,
  EmendaDocumento,
} from '#types/portal_transparencia'

export class PortalTransparenciaIntegration {
  private readonly baseUrl = 'https://api.portaldatransparencia.gov.br/api-de-dados'
  private readonly apiKey = env.get('PORTAL_TRANSPARENCIA_API_KEY')
  private readonly client = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'chave-api-dados': this.apiKey,
      'Content-Type': 'application/json',
    },
  })

  // Emendas Parlamentares
  async getEmendas(params: EmendaParlamentarParams): Promise<AxiosResponse<EmendaParlamentar[]>> {
    const response = await this.client.get('/emendas', { params })
    return response
  }

  // Documentos de Emendas Parlamentares
  async getEmendaDocumentos(codigo: string, pagina = 1): Promise<AxiosResponse<EmendaDocumento[]>> {
    const response = await this.client.get(`/emendas/documentos/${codigo}`, {
      params: { pagina },
    })
    return response
  }
}
