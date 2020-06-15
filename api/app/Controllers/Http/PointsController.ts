import Point from 'App/Models/Point'
import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PointsController {
  public async index ({ request, response }: HttpContextContract) {
    let parsedItems = String(request.input('items'))
      .split(',')
      .map((item) => Number(item.trim()))

    const points = await Database.query()
      .from('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(request.input('city')))
      .where('uf', String(request.input('uf')))
      .distinct()
      .select('points.*')

    return response.status(200).json(points)
  }

  public async store ({ request, response }: HttpContextContract) {
    const trx = Database.transaction()

    try {
      let newPoint: Point = await Point.create(request.all())
      await newPoint.related('items').attach(request.input('items'));

      (await trx).commit()
    } catch {
      (await trx).rollback()
    }

    return response.status(201).json({ success: true })
  }

  public async show ({ params, response }: HttpContextContract) {
    const point: Point | null = await Point.find(params.id)

    if (!point) {
      return response.status(404).json({
        message: 'Ponto de coleta não encontrado.',
      })
    }

    return response.status(200).json(point)
  }
}
