<template>
  <section class="code report--container pa3 bg-washed-green">
    <h3 class="underline b"> Report (Pro Version) </h3>
    <hr>
    <ul class="list">
      <li class="mt1" v-for="(report, idx) in reportList" :key="idx">{{report}}</li>
    </ul>
    <hr>
    <p> 
      <h3 class="underline b">Plan </h3>
      <br />
      All report must be generated from same container
      Each user can generate one container
    </p>
  </section>
</template>
<script>
export default {
  data: () => ({
    loading: false,
    reportList: []
  }),
  mounted() {
    this.reportList = [
      {
        date: 123122,
        id: "bsasdfe",
        setting: {
          resolution: 12
        }
      },
      {
        date: 123121,
        id: "bsasdfe",
        setting: {
          resolution: 12
        }
      },
      {
        date: 1231230,
        id: "bsasdfe",
        setting: {
          resolution: 12
        }
      }
    ];
  },
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style>
.report--container {
  max-height: 550px;
}
</style>