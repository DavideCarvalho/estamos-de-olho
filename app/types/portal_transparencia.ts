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

export interface DocumentoDetalhes {
  data: string
  documento: string
  documentoResumido: string
  observacao: string
  funcao: string
  subfuncao: string
  programa: string
  acao: string
  subTitulo: string
  localizadorGasto: string
  fase: string
  especie: string
  favorecido: string
  codigoFavorecido: string
  nomeFavorecido: string
  ufFavorecido: string
  valor: string
  codigoUg: string
  ug: string
  codigoUo: string
  uo: string
  codigoOrgao: string
  orgao: string
  codigoOrgaoSuperior: string
  orgaoSuperior: string
  categoria: string
  grupo: string
  elemento: string
  modalidade: string
  numeroProcesso: string
  planoOrcamentario: string
  autor: string
  favorecidoIntermediario: boolean
  favorecidoListaFaturas: boolean
}
