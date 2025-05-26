import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import queue from '@rlanz/bull-queue/services/main'
import GetEmendaParlamentarByAnoJob from '../app/jobs/get_emenda_parlamentar_by_ano_job.js'

export default class GetEmendaParlamentar extends BaseCommand {
  static commandName = 'get:emenda-parlamentar'
  static description = ''

  static options: CommandOptions = { startApp: true }

  async run() {
    queue.dispatch(GetEmendaParlamentarByAnoJob, { ano: 2024 })
  }
}
