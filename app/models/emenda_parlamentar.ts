import type { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EmendaParlamentar extends BaseModel {

  static table = 'emendas_parlamentares'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigoEmenda: string

  @column()
  declare ano: number

  @column()
  declare tipoEmenda: string

  @column()
  declare autor: string

  @column()
  declare nomeAutor: string

  @column()
  declare numeroEmenda: string

  @column()
  declare localidadeDoGasto: string

  @column()
  declare funcao: string

  @column()
  declare subfuncao: string

  @column()
  declare valorEmpenhado: string

  @column()
  declare valorLiquidado: string

  @column()
  declare valorPago: string

  @column()
  declare valorRestoInscrito: string

  @column()
  declare valorRestoCancelado: string

  @column()
  declare valorRestoPago: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
