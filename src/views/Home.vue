<template>
  <div class="home">
    <select v-model="selected">
      <option value>-- 未選択 --</option>
      <option v-for="data of dataList" :key="data.id" :value="data.id">{{ data.title }}</option>
    </select>
    <button @click="mergeData(hierarchy, data)">merge</button>
    <treemap v-if="hierarchy" :value="hierarchy" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Treemap from '../components/Treemap.vue'
import { Hierarchy } from '../main'
import * as d3 from 'd3-hierarchy'

export default Vue.extend({
  components: { Treemap },
  data() {
    return {
      hierarchy: undefined,
      dataList: [],
      selected: '',
      data: [],
      merged: []
    }
  },
  watch: {
    selected(id) { this.fetchData(id) }
  },
  mounted() {
    this.fetchHierarchy()
    this.fetchDataList()
  },
  methods: {
    async fetchHierarchy(url = process.env.VUE_APP_HIERARCHY_DATA) {
      try {
        const res = await fetch(url)
        this.hierarchy = await res.json()
      } catch (err) {
        alert(`階層データを取得できません。\n${err}`)
      }
    },
    async fetchDataList(url = `${process.env.VUE_APP_DATA_PATH}${process.env.VUE_APP_DATA_LIST}`) {
      this.dataList = []
      try {
        const res = await fetch(url)
        this.dataList = await res.json()
      } catch (err) {
        alert(`データリストを取得できません。\n${err}`)
      }
    },
    async fetchData(id?: string, baseurl = process.env.VUE_APP_DATA_PATH) {
      this.data = []
      if (!id) { return }
      try {
        const res = await fetch(`${baseurl}${id}`)
        this.data = await res.json()
      } catch (err) {
        alert(`データを取得できません。\n${err}`)
      }
    },
    mergeData(root: Hierarchy, data: { parent: string } & any[]) {
      console.log('merge', root, data, d3)
      const hierarchy = d3.hierarchy(root)
      const noRoot: any[] = []
      data.forEach(v => {
        const p = hierarchy.descendants().find(h => h.data.hash === v.parent)
        const d = { text: v.text, hash: v.hash }
        if (p) {
          p.data.children ? p.data.children.push(d) : p.data.children = [d]
        } else {
          noRoot.push(d)
        }
      })
      const result = hierarchy.copy()
      console.log('result', result)
      console.log('noRoot', noRoot)
    }
  }
})
</script>

<style scoped>
.home {
  height: 100%;
}
</style>
