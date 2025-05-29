import type { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import EmendaDocumento from '#models/emenda_documento'

export default class Favorecido extends BaseModel {
  static table = 'favorecidos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare emendaDocumentoId: number

  @column.date()
  declare data: DateTime

  @column()
  declare documento: string

  @column()
  declare documentoResumido: string

  @column()
  declare observacao: string

  @column()
  declare funcao: string

  @column()
  declare subfuncao: string

  @column()
  declare programa: string

  @column()
  declare acao: string

  @column()
  declare subTitulo: string

  @column()
  declare localizadorGasto: string

  @column()
  declare fase: string

  @column()
  declare especie: string

  @column()
  declare favorecido: string

  @column()
  declare codigoFavorecido: string

  @column()
  declare nomeFavorecido: string

  @column()
  declare ufFavorecido: string

  @column()
  declare valor: string

  @column()
  declare codigoUg: string

  @column()
  declare ug: string

  @column()
  declare codigoUo: string

  @column()
  declare uo: string

  @column()
  declare codigoOrgao: string

  @column()
  declare orgao: string

  @column()
  declare codigoOrgaoSuperior: string

  @column()
  declare orgaoSuperior: string

  @column()
  declare categoria: string

  @column()
  declare grupo: string

  @column()
  declare elemento: string

  @column()
  declare modalidade: string

  @column()
  declare numeroProcesso: string

  @column()
  declare planoOrcamentario: string

  @column()
  declare autor: string

  @column()
  declare favorecidoIntermediario: boolean

  @column()
  declare favorecidoListaFaturas: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => EmendaDocumento)
  declare emendaDocumento: BelongsTo<typeof EmendaDocumento>
} 