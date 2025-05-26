import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'emenda_documentos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('emenda_parlamentar_id')
        .unsigned()
        .references('id')
        .inTable('emendas_parlamentares')
        .onDelete('CASCADE')
      table.date('data').notNullable()
      table.string('fase').notNullable()
      table.string('codigo_documento').notNullable()
      table.string('codigo_documento_resumido').notNullable()
      table.string('especie_tipo').notNullable()
      table.string('tipo_emenda').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
