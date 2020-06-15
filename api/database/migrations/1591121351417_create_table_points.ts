import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Points extends BaseSchema {
  protected tableName = 'points'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique().unsigned()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('whatsapp').notNullable()
      table.decimal('longitude', 19, 2).notNullable()
      table.decimal('latitude', 19, 2).notNullable()
      table.string('city').notNullable()
      table.string('uf', 2).notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
