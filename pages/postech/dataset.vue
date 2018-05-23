<template>
  <section>
    <div> Data List </div>    
    <ul>
      <li v-for="(set, idx) in datasets.values" :key="idx">
        date: {{set.date}}, con: {{set.con}}
      </li>
    </ul>
    
    <hr>
    
    <button> Store Dataset </button>
    <button> Update Dataset </button>

  </section>
</template>

<script>
export default {
  data() {
    return {
      datasets: {name: "abc", values: [
        {date: "2017-01-30 10:30:00", con:5.44},
        {date: "2017-01-30 10:45:00", con: 5.11}
      ]}
    }
  }
} 
</script>
<style></style>