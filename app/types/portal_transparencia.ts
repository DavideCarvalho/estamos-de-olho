export interface EmendaParlamentar {
  codigoEmenda: string
  ano: number
  tipoEmenda: string
  autor: string
  nomeAutor: string
  numeroEmenda: string
  localidadeDoGasto: string
  funcao: string
  subfuncao: string
  valorEmpenhado: string
  valorLiquidado: string
  valorPago: string
  valorRestoInscrito: string
  valorRestoCancelado: string
  valorRestoPago: string
}

export interface EmendaParlamentarParams {
  pagina: number
  ano: number
}

export interface EmendaDocumento {
  id: number
  data: string
  fase: string
  codigoDocumento: string
  codigoDocumentoResumido: string
  especieTipo: string
  tipoEmenda: string
}
