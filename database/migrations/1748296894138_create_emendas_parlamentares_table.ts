import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'emendas_parlamentares'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('codigo_emenda').notNullable()
      table.integer('ano').notNullable()
      table.string('tipo_emenda').notNullable()
      table.string('autor').notNullable()
      table.string('nome_autor').notNullable()
      table.string('numero_emenda').notNullable()
      table.string('localidade_do_gasto').notNullable()
      table.string('funcao').notNullable()
      table.string('subfuncao').notNullable()
      table.bigInteger('valor_empenhado').nullable()
      table.bigInteger('valor_liquidado').nullable()
      table.bigInteger('valor_pago').nullable()
      table.bigInteger('valor_resto_inscrito').nullable()
      table.bigInteger('valor_resto_cancelado').nullable()
      table.bigInteger('valor_resto_pago').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
