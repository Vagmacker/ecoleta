import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Items extends BaseSchema {
  protected tableName = 'items'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique().unsigned()
      table.string('title').notNullable()
      table.string('image').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
