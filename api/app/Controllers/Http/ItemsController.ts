import Item from 'App/Models/Item'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ItemsController {
  public async index ({ response }: HttpContextContract) {
    const items: Item[] | null = await Item.all()
    return response.json(items)
  }
}
