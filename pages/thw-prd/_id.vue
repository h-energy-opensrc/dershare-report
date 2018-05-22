<template>
<section>

    <input v-model.trim="targetQuery"  v-on:change="getQuery" >
    <hr />
    
    <div class="ma2" v-for="hit in hits"> 
            <div>
                {{hit._source.price}}
                {{hit._source.brand}} - {{hit._source.name}}
            </div>
    </div>
        
</section>
</template>
<script>
// import client from "~plugins/elastic.js"
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

export default{
    name: "elastic Search",
    data(){
        return{
            hits: {},
            targetQuery: ""
        }
    },
    methods: {
        getQuery(){
            var vm = this;
            client.search({
                index: 'prd_avail',
                type: 'data',
                body: {
                    query: {
                        match: {
                            name: vm.targetQuery
                        }
                    }
                }
            }).then(function (body) {
                var hits = body.hits.hits;
                vm.hits = body.hits.hits
            }, function (error) {
                console.trace(error.message);
            });
        }
    },
    mounted(){
        var vm = this;
        client.search({
            q: 'andis'
        }).then(function (body) {
            var hits = body.hits.hits;
            vm.hits = body
        }, function (error) {
            console.trace(error.message);
        });
    }
}
</script>