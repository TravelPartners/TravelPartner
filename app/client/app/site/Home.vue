<template>
  <div>
    <h1> {{ message }} </h1>
    <Maintenance />
    <Error />
  </div>
</template>

<script>
import Maintenance from './Maintenance.vue';
import Error from './Error.vue';

export default {
  components: {
    Maintenance, Error
  },
  data () {
    return {
      message: 'Home Pageaaa'
    }
  }
}

</script>
