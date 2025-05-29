import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'favorecidos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('emenda_documento_id')
        .unsigned()
        .references('id')
        .inTable('emenda_documentos')
        .onDelete('CASCADE')
      table.date('data')
      table.string('documento')
      table.string('documento_resumido')
      table.text('observacao')
      table.string('funcao')
      table.string('subfuncao')
      table.string('programa')
      table.string('acao')
      table.string('sub_titulo')
      table.string('localizador_gasto')
      table.string('fase')
      table.string('especie')
      table.string('favorecido')
      table.string('codigo_favorecido')
      table.string('nome_favorecido')
      table.string('uf_favorecido')
      table.string('valor')
      table.string('codigo_ug')
      table.string('ug')
      table.string('codigo_uo')
      table.string('uo')
      table.string('codigo_orgao')
      table.string('orgao')
      table.string('codigo_orgao_superior')
      table.string('orgao_superior')
      table.string('categoria')
      table.string('grupo')
      table.string('elemento')
      table.string('modalidade')
      table.string('numero_processo')
      table.string('plano_orcamentario')
      table.string('autor')
      table.boolean('favorecido_intermediario').defaultTo(false)
      table.boolean('favorecido_lista_faturas').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}