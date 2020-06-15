import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PointItems extends BaseSchema {
  protected tableName = 'point_items'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('item_id').unsigned().notNullable()
      table.integer('point_id').unsigned().notNullable()

      table
        .foreign('item_id')
        .references('id')
        .inTable('items')

      table
        .foreign('point_id')
        .references('id')
        .inTable('points')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
