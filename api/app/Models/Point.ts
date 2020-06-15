import { DateTime } from 'luxon'
import Item from 'App/Models/Item'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Point extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public whatsapp: string

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column()
  public city: string

  @column()
  public uf: string

  @manyToMany(() => Item, {
    pivotTable: 'point_items',
  })
  public items: ManyToMany<typeof Item>

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime
}
