<template>
  <button class="cargar-producto-btn" @click="redirectToCargaProductos">
    Cargar producto
  </button>
  <ListaProductos />
  <ListaVentas />
  <ListaClientes />
</template>

<script>
import ListaClientes from "./ListaClientes.vue";
import ListaProductos from "./ListaProductos.vue";
import ListaVentas from "./ListaVentas.vue";
import { useRouter } from "vue-router";

export default {
  components: {
    ListaProductos,
    ListaVentas,
    ListaClientes,
  },
  setup() {
    const router = useRouter();

    const redirectToCargaProductos = () => {
      router.push("/cargaproductos");
    };

    return {
      redirectToCargaProductos,
    };
  },
};
</script>

<style scoped>
.cargar-producto-btn {
  background-color: #0a641a;
  color: #fff;
  padding: 10px 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cargar-producto-btn:hover {
  background-color: #084914;
  transform: scale(1.05);
}

.cargar-producto-btn:active {
  background-color: #063b0f;
  transform: scale(1);
}
</style>
