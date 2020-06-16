<template>
  <div class="treemap">
    <div ref="plotly" class="plotly"></div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Plotly from 'plotly.js-dist'
import { Hierarchy } from '../main'

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<Hierarchy>,
      required: true
    },
    maxdepth: {
      type: Number as PropType<number>,
      default: 4
    }
  },
  computed: {
    ids() {
      function flatten({ children, hash }: Hierarchy): string[] {
        return children
          ? children.reduce<string[]>((a, c) => a.concat(flatten(c)), [hash])
          : [hash]
      }
      return flatten(this.value)
    },
    labels() {
      function flatten({ children, label }: Hierarchy): string[] {
        if (!label) { label = '' }
        return children
          ? children.reduce<string[]>((a, c) => a.concat(flatten(c)), [label])
          : [label]
      }
      return flatten(this.value)
    },
    texts() {
      function flatten({ children, text }: Hierarchy): string[] {
        if (!text) { text = '' }
        return children
          ? children.reduce<string[]>((a, c) => a.concat(flatten(c)), ['<div>' + text + '</div>'])
          : ['<div>' + text + '</div>']
      }
      return flatten(this.value)
    },
    parents() {
      const root = this.value
      function flatten({ children, hash }: Hierarchy): string[] {
        return children
          ? children.reduce<string[]>((a, c) => a.concat(flatten(c)
            .map(v => {
              if (v === root.hash) return ''
              if (v === '') return hash
              return v
            })), [''])
          : ['']
      }
      return flatten(root)
    },
    chartData(): {}[] {
      return [{
        type: 'treemap',
        maxdepth: this.maxdepth,
        ids: this.ids,
        labels: this.labels,
        customdata: this.texts,
        parents: this.parents
      }]
    }
  },
  watch: {
    chartData(data) {
      this.render(data)
    }
  },
  mounted() {
    this.render(this.chartData)
  },
  methods: {
    render(data: {}[]) {
      Plotly.newPlot(this.$refs.plotly, data, null, { displaylogo: false })
    }
  }
})
</script>

<style scoped>
.treemap,
.plotly {
  height: 100%;
}
</style>
