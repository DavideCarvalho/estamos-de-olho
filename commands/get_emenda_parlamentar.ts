import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import queue from '@rlanz/bull-queue/services/main'
import GetEmendaParlamentarByAnoJob from '../app/jobs/get_emenda_parlamentar_by_ano_job.js'

export default class GetEmendaParlamentar extends BaseCommand {
  static commandName = 'get:emenda-parlamentar'
  static description = ''
  static aliases = ['gep']

  @args.string()
  declare ano: string

  static options: CommandOptions = { startApp: true }

  async run() {
    const currentYear = new Date().getFullYear()
    queue.dispatch(GetEmendaParlamentarByAnoJob, { ano: Number(this.ano) ?? currentYear })
  }
}
