import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { inject } from '@adonisjs/core'
import { PortalTransparenciaFallbackIntegration } from '#integration/portal_transparencia_fallback_integration'

export default class GetEmendaParlamentar extends BaseCommand {
  static commandName = 'documento-despesas-fallback'
  static description =
    'Roda o portalTransparenciaFallbackIntegration.getDocumentoDetalhes pra ver se ta conseguindo pegar o detalhes do documento direto da página do portal da transparência'
  static aliases = ['ddf']

  @args.string()
  declare codigo: string

  static options: CommandOptions = { startApp: true }

  @inject()
  async run(portalTransparenciaFallbackIntegration: PortalTransparenciaFallbackIntegration) {
    const documento = await portalTransparenciaFallbackIntegration.getDocumentoDetalhes(this.codigo)
    console.log(documento)
  }
}
