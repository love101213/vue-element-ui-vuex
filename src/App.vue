<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'app',
  components: {
     swiper,
    swiperSlide
  }
}
</script>

<style>

</style>
