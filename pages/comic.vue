<template>
  <div>
    <h4 class="mh3">[하승남] 십검풍 [개정판]</h4>
    <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <img src="../assets/img/002.jpg">
            </div>
            <div class="swiper-slide">
                <img src="../assets/img/003.jpg">
            </div>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
  </div>
</template>
<script>

export default {
    data () {
      return {
        banners: [
          'http://www.slidesjs.com/img/example-slide-350-1.jpg',
          'http://www.slidesjs.com/img/example-slide-350-1.jpg',
        ],
        swiperOption: {
          loop: true,
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 30,
          pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true
          },
          on: {
            slideChange() {
              console.log('onSlideChangeEnd', this);
            },
            tap() {
              console.log('onTap', this);
            }
          }
        }
      }
    },
    mounted() {
      console.log('app init', this)
      setTimeout(() => {
        this.banners.push('http://www.slidesjs.com/img/example-slide-350-1.jpg',)
        console.log('banners update')
      }, 3000)
      console.log(
        'This is current swiper instance object', this.mySwiper, 
        'I will slideTo banners 3')
       this.mySwiper.slideTo(3)
    }
  }
</script>

<style scoped>
  .my-swiper {
    height: 300px;
    width: 100%;
    /* 
    .swiper-slide {
      text-align: center;
      font-size: 38px;
      font-weight: 700;
      background-color: #eee;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .swiper-pagination {
      > .swiper-pagination-bullet {
        background-color: red;
      }
    }
    */
  }
</style>
