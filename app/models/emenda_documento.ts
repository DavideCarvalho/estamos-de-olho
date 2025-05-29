import type { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import EmendaParlamentar from '#models/emenda_parlamentar'
import Favorecido from '#models/favorecido'

export default class EmendaDocumento extends BaseModel {
  static table = 'emenda_documentos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare emendaParlamentarId: number

  @column.date()
  declare data: DateTime

  @column()
  declare fase: string

  @column()
  declare codigoDocumento: string

  @column()
  declare codigoDocumentoResumido: string

  @column()
  declare especieTipo: string

  @column()
  declare tipoEmenda: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => EmendaParlamentar)
  declare emendaParlamentar: BelongsTo<typeof EmendaParlamentar>

  @hasOne(() => Favorecido)
  declare favorecido: HasOne<typeof Favorecido>
}
