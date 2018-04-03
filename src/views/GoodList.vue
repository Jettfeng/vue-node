<template>
    <div>
      这是商品列表页面
      <span>{{$route.params.goodsId}}</span>
      <span>{{$route.params.name}}</span>
    </div>
</template>

<script>
    export default {
        name: "good-list"
    }
</script>

<style scoped>

</style>
