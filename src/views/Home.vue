<template>
  <div class="home">
    <treemap v-if="hierarchy" :value="hierarchy" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Treemap from '../components/Treemap.vue'

export default Vue.extend({
  components: { Treemap },
  data() {
    return {
      hierarchy: undefined
    }
  },
  mounted() {
    this.fetchHierarchy()
  },
  methods: {
    async fetchHierarchy(url = process.env.VUE_APP_HIERARCHY_DATA) {
      try {
        const res = await fetch(url)
        this.hierarchy = await res.json()
      } catch (err) {
        alert(`階層データを取得できません。\n${err}`)
      }
    }
  }
})
</script>

<style scoped>
.home {
  height: 100%;
}
</style>
