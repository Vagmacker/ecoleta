import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column({ serializeAs: null })
  public image: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @computed()
  public get url () {
    return `http://localhost:3333/${this.image}`
  }
}
