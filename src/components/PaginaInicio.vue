<template>
  <custom-scroll>
    <MenuPrincipal />
    <div class="sidebar-container">
      <b-button v-b-toggle.sidebar-collapse class="menu-toggle">
        <i class="fa-solid fa-bars"></i>
        <h8 class="h8">Categorías</h8>
      </b-button>

      <b-collapse id="sidebar-collapse" class="sidebar">
        <b-button class="close-btn" v-b-toggle.sidebar-collapse>
          <i class="fa-solid fa-times"></i>
        </b-button>

        <section class="categorias">
          <h2>Categorías</h2>
          <h5>Seleccione una categoría</h5>
          <div class="categoria-list">
            <button class="button" @click="seleccionarCategoria(null)">
              Todas
            </button>
            <button class="button" @click="seleccionarCategoria(1)">
              Ropa y Accesorios
            </button>
            <button class="button" @click="seleccionarCategoria(2)">
              Ciclismo
            </button>
            <button class="button" @click="seleccionarCategoria(3)">
              Camping
            </button>
          </div>
        </section>
      </b-collapse>
    </div>
    <!-- Pasar la categoría seleccionada al componente ProductosTienda -->
    <ProductosTienda :categoriaId="categoriaSeleccionada" />
  </custom-scroll>
</template>

<script>
import ProductosTienda from "./ProductosTienda.vue";
import MenuPrincipal from "./MenuPrincipal.vue";
import CustomScroll from "./CustomScroll.vue";

import { vBToggle } from "bootstrap-vue-3";

export default {
  components: {
    ProductosTienda,
    MenuPrincipal,
    CustomScroll,
  },
  directives: {
    "b-toggle": vBToggle,
  },
  data() {
    return {
      categoriaSeleccionada: null, // Estado para almacenar el id_categoria seleccionado
    };
  },
  methods: {
    seleccionarCategoria(id_categoria) {
      console.log("Categoría seleccionada:", id_categoria);
      this.categoriaSeleccionada = id_categoria; // Actualizar el id_categoria seleccionado
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  position: relative;
  display: flex;
}

.menu-toggle {
  background-color: #0a641a;
  color: #ff9800;
  position: absolute;
  left: 15px;
  top: 15px;
  z-index: 100;
}
.h8 {
  margin-left: 6px;
  color: #fff;
}

.sidebar {
  position: fixed; /* Cambiado de absolute a fixed */
  top: 0;
  left: 0;
  height: 100%;
  width: 350px;
  color: #fff;
  background-color: #0a641a;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999; /* Asegura que esté encima de otros elementos */
}

.sidebar.show {
  transform: translateX(0);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1001;
  background-color: transparent;
  border: none;
  font-size: 24px;
  color: #ff9800;
}
.close-btn:hover {
  background-color: #0a641a;
  color: #ff9800;
}

.categorias {
  padding: 20px;
  text-align: center;
}

.categoria-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button {
  cursor: pointer;
  position: relative;
  padding: 10px 24px;
  font-size: 18px;
  color: #ff9800; /* Color verde personalizado */
  border: 2px solid #ff9800; /* Borde verde */
  border-radius: 34px;
  background-color: transparent;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
}

.button::before {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: 105px;
  height: 50px;
  border-radius: inherit;
  scale: 0;
  z-index: -1;
  background-color: #ff9800; /* Color verde al hacer hover */
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.button:hover::before {
  scale: 3;
}

.button:hover {
  color: #0a641a; /* Color naranja en el hover */
  scale: 1.1;
  box-shadow: 0 0px 20px rgba(10, 100, 26, 0.4); /* Sombras del verde en el hover */
}

.button:active {
  scale: 1;
}

@media (max-width: 600px) {
  .h8 {
    display: none;
  }
}
</style>
