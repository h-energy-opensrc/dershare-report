import Vue from 'vue';
import {
  AbilityBuilder
} from '@casl/ability'
import {
  abilitiesPlugin
} from '@casl/vue'

function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item
  }
  return item.__type
}

var ability = AbilityBuilder.define({
  subjectName
}, can => {

  // user privileges
  can(['report-run', 'cite-info', 'cite-edit', 'cite-delete',
      'report-run', 'report-result-down', 'report-input-down', 'report-result-plot-down'], 'superUser')

  can(['cite-info', 'cite-edit',
      'report-run', 'report-result-down', 'report-input-down', 'report-result-plot-down'], 'citeManager')

  can(['report-run', 'report-result-down', 'report-result-plot-down'], 'guest')

  can(['report-run', 'report-result-down', 'report-input-down', 'report-result-plot-down'], 'researcher')

  // can(['read', 'create'], 'Todo')
  // can(['update', 'delete'], 'Todo', {
  //   assignee: 'me'
  // })
})

Vue.use(abilitiesPlugin, ability)
window.ability = ability