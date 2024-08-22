<template>
  <div>
    <custom-scroll>
      <MenuAdmin />
      <ProductosVenta />
      <router-view></router-view>
    </custom-scroll>
  </div>
</template>

<script>
import MenuAdmin from "@/components/MenuAdmin.vue";
import ProductosVenta from "@/components/ProductosVentas.vue";
import CustomScroll from "./CustomScroll.vue";

export default {
  components: {
    MenuAdmin,
    ProductosVenta,
    CustomScroll,
  },
};
</script>
