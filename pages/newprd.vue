<template>
  <div>    
    <div class="ma1 w-100" style="position: relative;">
      <section class="w-100" style="position: absolute; bottom: 0;  z-index: 99;">
        <button class="w-33 f5 pv3 b link dim ph3 pv2 mb2 dib white bg-light-purple" @click="captureImg('UPC')">Add UPC</button>
        <button class="w-33 f5 pv3 b link dim ph3 pv2 mb2 dib white bg-hot-pink" @click="captureImg('PRD')">Add PRODUCT</button>
        <button class="w-33 f5 pv3 b link dim ph3 pv2 mb2 dib white bg-dark-gray" @click="captureImg('COLOR')">Add COLOR</button>
      </section>
      <video class="ma1 w-100" style="height:120px;" autoplay></video>
    </div>
    <section class="pa3">
      <div class="f4 b code"> Basic Info </div>
      <table class="collapse ba br2 b--black-10 pv2 ph3">
        <tbody>
          <tr>
            <td>ID: </td><td>{{product.id}}</td>
          </tr>
          <tr>
            <td>Title: </td><td>{{product.title}}</td>
          </tr>
          <tr>
            <td>Created: </td> <td>{{product.created}}</td>
          </tr>
          <tr>
            <td>Updated: </td> <td>{{product.updated}}</td>
          </tr>
        </tbody>
      </table>
      <div class="f4 mv2 b code"> Title </div> 
      <input class="w-100 f3" v-model="product.title" type="text">

      <div class="f4 mv2 b code"> Price </div>
      <input class="w-80 f3" v-model="product.price" type="number"> 
      
      <div class="f4 mv2 b code"> UPC</div>
      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in tempUPC" :key="idx" >
          <img style="max-width: 400px; max-height: 250px" class="center mw-80" :src='i' />
          <button class="fa4 pa3 b" @click="deletePicTemp('UPC', idx)">Delete {{idx}}</button>
        </div>
      </section>

      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in product.upcImgs" :key="idx" >
          <img style="max-width: 400px; max-height: 250px" class="center mw-80" :src='i' />
          <button class="fa4 pa3 b" @click="deletePic('upcImgs', idx)">Delete {{idx}}</button>
        </div>
      </section>

      <div class="f4 mv2 b code"> Product</div>
      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in tempPRD" :key="idx" >
          <img style="max-width: 400px; max-height: 250px" class="center mw-80" :src='i' />
          <button class="fa4 pa3 b" @click="deletePicTemp('PRD', idx)">Delete {{idx}}</button>
        </div>
      </section>
      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in product.prdImgs" :key="idx">
          <img style="max-width: 400px; max-height: 250px" class="center mw-80" :src='i' />
          <button class="fa4 pa3 b" @click="deletePic('prdImgs', idx)">Delete {{idx}}</button>
        </div>
      </section>
      
      <div class="f4 mv2 b code">COLOR</div>
      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in tempCOLOR" :key="idx" >
          <img style="max-width: 400px; max-height: 250px" class="center mw-80" :src='i' />
          <button class="fa4 pa3 b" @click="deletePicTemp('COLOR', idx)">Delete {{idx}}</button>
        </div>
      </section>
      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in product.colorImgs" :key="idx">
          <img style="max-width: 400px; max-height: 250px" class="center mw-80" :src='i' />
          <button class="fa4 pa3 b" @click="deletePic('colorImgs', idx)">Delete {{idx}}</button>
        </div>
      </section>

      <div class="f4 mv2 b code">NOTE</div>
      <textarea class="w-100 f5 h-100 pa2" v-model="product.note" style="min-height:250px;" placeholder="Leave Comment"> </textarea>
      
      <section class="mt3 mb5">
        <button class="w-50 f5 pv3 b link dim ph3 pv2 mb2 dib white bg-light-purple" @click="updatePrdInfo()"> UPDATE </button>
        <button class="w-50 f5 pv3 b link dim ph3 pv2 mb2 dib white bg-light-purple" @click="captureImg('UPC')"> DELETE </button>
      </section>
    </section>
  </div>
</template>
<script>

import {database, storage} from '~/plugins/fbConn'
// import firebase from 'firebase'
import auto from 'async/auto'
import Header from '~/components/Header'
var uuid = require('uuid4')
import _ from 'lodash'
import Quagga from 'quagga'
// var Quagga = require('quagga').default

// var fb
// var storage
// var config = {
//   apiKey: "AIzaSyBNiqf21f9wbn6Pnv2kKhhvFv6SM7Z5VpE",
//   authDomain: "bbl-dev.firebaseapp.com",
//   databaseURL: "https://bbl-dev.firebaseio.com",
//   projectId: "bbl-dev",
//   storageBucket: "bbl-dev.appspot.com",
//   messagingSenderId: "713823656240"
// }

export default {
  layout: 'rVis',
  // validate({ params }) {
  //   // return !isNaN(+params.id)
  // },
  head () {
    return {
      title: `User: ${this.id}`
    }
  },
  components: {},
  async asyncData() {},
  data() {
    return {
      tempUPC: [],
      tempPRD: [],
      tempCOLOR: [],
      product: {
        id: "",
        title: "",
        upcImgs: [],
        prdImgs: [],
        colorImgs: [],
        optionsLength: ['8"', '10s', '10"', '12"', '14"', '16"', '18"', '20"', '22"'],
        created: "",
        updated: "",
        addBig: "",
        note: ""
      }
    }
  },
  created(){
  },
  methods: {
    deletePicTemp(type, index){
      var vm = this;
      console.log(vm.tempUPC, index)
      if(type == "UPC"){
        _.pullAt(vm.tempUPC, [index]); 
      }
      else if(type == "PRD"){
        _.pullAt(vm.tempPRD, [index]);
      }
      else if(type == "COLOR"){
        _.pullAt(vm.tempCOLOR, [index]);
      }
      this.$forceUpdate();
      
    },
    deletePic(target, id){
      var vm = this;
      // Create a reference to the file to delete
      var imagesRef = storage.child('bbl/temp/prd/'+vm.product.id +'/'+ target+'/'+id)
      // Delete the file
      imagesRef.delete().then(function() {
        var bblColors = database.ref().child('bbl/temp/prd/'+vm.product.id).child(target).child(id)
        bblColors.remove()
        // File deleted successfully
      }).catch(function(error) {
        // Uh-oh, an error occurred!
      });
    },
    created(){
      // var bblColors = fb.database().ref().child('bbl/temp/prd/'+vm.product.id+'/upc')
      // bblColors.on('value',(snap)=>{ console.log(snap.val())})
    },
    uploadImgFB() {
      var vm = this
      var storageRef = fb.storage().ref()
      console.log("upload Color: ", storageRef)
      var imagesRef = storageRef.child('bbl/temp/prd/' + vm.prdid + '_m.jpg')
      var img = document.getElementById('genImg')
      blobUtil.imgSrcToBlob(img.src).then(function(blob) {
        imagesRef.put(blob).then(function(snapshot) {
          console.log('Uploaded a blob or file!')
          var bblColors = fb.database().ref('bbl/colors')
          bblColors.push({ name: vm.colorName, imgSrc: snapshot.downloadURL })
        })
      }).catch(function(err) {

      })
    },
    uploadTextFB() {
    },
    dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(',')[1]);
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      // create a view into the buffer
      var ia = new Uint8Array(ab);
      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: mimeString});
      return blob;
    },
    captureImg(type) {
      var vm = this
      var canvas = document.createElement("canvas")
      var video = document.querySelector('video')
      var scale = 1
      canvas.width = video.videoWidth * scale
      canvas.height = video.videoHeight * scale
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      var dataUrl = canvas.toDataURL('image/jpeg', 1);

      if(type == "UPC")
        vm.tempUPC.push(dataUrl)
      else if(type == "PRD")
        vm.tempPRD.push(dataUrl)
      else if(type == "COLOR")
        vm.tempCOLOR.push(dataUrl)
    },
    getUPC(){
      var vm = this;
      console.log(vm.tempUPC[0])
      Quagga.decodeSingle({
          decoder: {
              readers: ["code_128", "code_39", "upc_e"] // List of active readers
          },
          locate: true, // try to locate the barcode in the image
          src: vm.tempUPC[0] // or 'data:image/jpg;base64,' + data
      }, function(result){
          if(result.codeResult) {
              console.log("result", result.codeResult.code);
          } else {
              console.log("not detected");
          }
      });
    },
    updatePrdInfo(){
      var vm = this;
      
      auto({
        check_data: function(callback) {
          console.log('in get_data')
          console.log('1. Data Quality')
          var bblColors = database.ref().child('bbl/temp/prd').push()
          bblColors.child('title').set(vm.product.title)
          bblColors.child('price').set(vm.product.price)
          bblColors.child('note').set(vm.product.note)
          vm.product.id = bblColors.key
          callback(null, 'data', 'converted to array')
        },
        file_upload_upc: function(callback) {
          console.log('2. Upload UPC')
          var files = []
          var links = []
          vm.tempUPC.forEach((dataURL, idx) => {
            var blob = vm.dataURItoBlob(dataURL)
            var file = new File([blob], idx+"_m.jpg", {
              type: "image/jpeg",
            })
            // Set reference name
            var id = uuid();
            var imagesRef = storage.child('bbl/temp/prd/'+vm.product.id+'/upcImgs/'+id)
            imagesRef.put(file).then(function(snapshot) {
              var bblColors = database.ref().child('bbl/temp/prd/'+vm.product.id+'/upcImgs/'+id)
              bblColors.set(snapshot.downloadURL)
              links.push(snapshot.downloadURL)
            }).catch(function(err) {
              console.log(err)
            })
          })
          callback(null, 'upc', {links: links})
        },
        file_upload_prd: function(callback) {
          console.log('3. Upload PRD')
          var files = []
          var links = []
          vm.tempPRD.forEach((dataURL, idx) => {
            var blob = vm.dataURItoBlob(dataURL)
            var file = new File([blob], idx+"_m.jpg", {
              type: "image/jpeg",
            })
            // Set reference name 
            var id = uuid();
            var imagesRef = storage.child('bbl/temp/prd/'+vm.product.id+'/prdImgs/'+id)
            imagesRef.put(file).then(function(snapshot) {
              var bblColors = database.ref().child('bbl/temp/prd/'+vm.product.id+'/prdImgs/'+id)
              bblColors.set(snapshot.downloadURL)
              links.push(snapshot.downloadURL)
            }).catch(function(err) {
              console.log(err)
            })
          })
          callback(null, 'prd', {name: 'prd', links: links})
        },
        file_upload_color: function(callback) {
          console.log('4. Upload COLOR')
          var files = []
          var links = []
          vm.tempCOLOR.forEach((dataURL, idx) => {
            var blob = vm.dataURItoBlob(dataURL)
            var file = new File([blob], idx+"_m.jpg", {
              type: "image/jpeg",
            })
            // Set reference name 
            var id = uuid();
            var imagesRef = storage.child('bbl/temp/prd/'+vm.product.id+'/colorImgs/'+id)
            imagesRef.put(file).then(function(snapshot) {
              var bblColors = database.ref().child('bbl/temp/prd/'+vm.product.id+'/colorImgs/'+id)
              bblColors.set(snapshot.downloadURL)
              links.push(snapshot.downloadURL)
            }).catch(function(err) {
              console.log(err)
            })
          })
          callback(null, 'color', {name: 'color', links: links})
        },
        write_file: ['file_upload_upc', 'file_upload_prd', 'file_upload_color', function(results, callback) {
          console.log('in write_file', JSON.stringify(results))
          vm.tempUPC = []
          vm.tempPRD = []
          vm.tempCOLOR = []
          callback(null, {name: 'update fb'})
        }]
      }, function(err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      })
    }
  },
  mounted() {
    console.log(database)
    var test = database.ref().child('bbl/temp/prd/test123')
    test.on('value', snap=> {
      console.log(snap.val())
    })

    // var vm = this;
    // vm.product.id = params.id
    // var bblColors = firebase.database().ref().child('bbl/temp/prd/'+this.product.id)
    // bblColors.on('value',(snap)=>{
    //   var target = snap.val()
    //   console.log(target)
    //   if(target){
    //     vm.product = _.assign({}, vm.product, target);
    //   }
    // })

		navigator.mediaDevices.enumerateDevices().then( devices => {
			devices= devices.filter( v => (v.kind=="videoinput"))
			console.log("Found "+devices.length +" video devices")
			let lastDevice= devices[devices.length-1]
			devices= devices.filter( v => (v.label.indexOf("back")>0))
			let device= null;
			if( devices.length > 0 ) {
				console.log("Taking a 'back' camera")
				device= devices[devices.length-1]
			}
			else {
				console.log("Taking last camera")
				device= lastDevice;
			}
				
			if( !device ){
        console.log("No devices!")
				return;
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
			let constraints = {
				audio: false, 
				video: {
					deviceId: { ideal: device.deviceId },
					width: { ideal: window.innerWidth },
					height: { ideal: window.innerHeight }
				}
			};
			navigator.mediaDevices.getUserMedia(constraints).then( stream => {
        var video = document.querySelector('video')
        video.srcObject = stream
        video.onloadedmetadata = function(e) {
          video.play()
        }
				if( !this.$el.srcObject	)
				  this.$el.src = URL.createObjectURL(stream);
				else
				  this.$el.srcObject = stream
				//info.innerHTML+= "<pre>DONE</pre>";
				console.log("DONE");
			}).catch( err => {
				console.log(err.name + ": " + err.message);
			})
		}).catch( err => {
			console.log(err.name + ": " + err.message);
		});
	}

}
</script> 
<style>
  .left--expand {
    display: -webkit-box;
    overflow-x: scroll;
  }

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }
</style>