<template>
  <div class="productos-tienda">
    <!-- Campo de búsqueda -->
    <input
      v-model="busqueda"
      type="text"
      placeholder="Buscar productos..."
      class="busqueda-input"
    />

    <div v-if="productosFiltrados.length > 0" class="productos-grid">
      <div
        v-for="producto in productosFiltrados"
        :key="producto.id_producto"
        class="producto-card"
      >
        <div class="producto-descripcion">
          <h3>{{ producto.descripcion }}</h3>
          <p>Precio: ${{ producto.precio_unitario }}</p>
        </div>
        <div class="producto-acciones">
          <button @click="agregarCarrito(producto)" class="btn-agregar">
            <i class="fas fa-shopping-cart icono-carrito"></i> Agregar al
            carrito
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No hay productos disponibles.</p>
    </div>

    <button @click="toggleSidebar" class="btn-sidebar">
      <i class="fas fa-shopping-cart icono-carrito"></i> Ver carrito
    </button>

    <div :class="['sidebar', { 'sidebar-abierto': sidebarAbierto }]">
      <button @click="toggleSidebar" class="btn-cerrar">
        <i class="fa-solid fa-times"></i>
      </button>
      <h2>Carrito de compras</h2>
      <ul class="carrito-lista">
        <li
          v-for="(item, index) in carrito"
          :key="item.id_carrito_producto"
          class="carrito-item"
        >
          <div class="carrito-item-info">
            {{ item.descripcion }} - ${{ item.precio_unitario }} x
            {{ item.cantidad }}
          </div>
          <button class="btn-eliminar" @click="eliminarDelCarrito(index)">
            Eliminar
          </button>
        </li>
      </ul>
      <p>Total: ${{ totalCarrito }}</p>
      <div class="formulario-venta">
        <h4>Metodo de pago</h4>
        <b-form-select v-model="metodo_pago_id" class="form-select">
          <b-form-select-option value="1"
            >Transferencia bancaria</b-form-select-option
          >
        </b-form-select>
        <button class="btn-procesar" @click="procesarVenta">
          Finalizar compra
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { BFormSelect, BFormSelectOption } from "bootstrap-vue-3";

export default {
  components: {
    BFormSelect,
    BFormSelectOption,
  },
  props: {
    categoriaId: Number, // Propiedad para recibir el id_categoria
  },
  data() {
    return {
      productos: [],
      busqueda: "",
      carrito: [],
      totalCarrito: 0,
      id_cliente: null,
      sidebarAbierto: false,
      metodo_pago_id: 1,
    };
  },
  computed: {
    productosFiltrados() {
      console.log("Categoría seleccionada:", this.categoriaId);
      console.log("Búsqueda:", this.busqueda);

      return this.productos.filter((producto) => {
        return producto.descripcion
          .toLowerCase()
          .includes(this.busqueda.toLowerCase());
      });
    },
  },
  methods: {
    toggleSidebar() {
      this.sidebarAbierto = !this.sidebarAbierto;
    },
    async fetchProductos() {
      try {
        const response = await axios.get("http://localhost:3306/api/pro", {
          params: {
            categoriaId: this.categoriaId, // Enviar `categoriaId`
          },
        });
        console.log("Productos obtenidos:", response.data);
        if (Array.isArray(response.data)) {
          this.productos = response.data;
        } else {
          console.error("Respuesta inesperada:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    },
    async agregarCarrito(producto) {
      const token = localStorage.getItem("token");
      this.id_cliente = localStorage.getItem("id_cliente");

      if (!token) {
        Swal.fire("Por favor, inicie sesión para continuar.", "", "warning");
        return;
      }

      if (!this.id_cliente) {
        Swal.fire("El cliente no está definido.", "", "error");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3306/api/auth/carrito",
          {
            id_cliente: this.id_cliente,
            id_producto: producto.id_producto,
            cantidad: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.message === "Producto agregado al carrito") {
          this.carrito = response.data.carrito;
          this.actualizarTotal();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto agregado al carrito!",
            showConfirmButton: false,
            timer: 1000,
            background: "#ffffff",
            color: "#0a641a",
          });
        } else {
          Swal.fire("Error al agregar el producto al carrito.", "", "error");
        }
      } catch (error) {
        console.error("Error al agregar al carrito:", error);
        Swal.fire("Error al agregar el producto al carrito.", "", "error");
      }
    },
    async fetchCarrito() {
      const token = localStorage.getItem("token");
      this.id_cliente = localStorage.getItem("id_cliente");

      if (!token || !this.id_cliente) {
        console.error("El cliente o el token no están definidos.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3306/api/auth/carrito`,
          {
            params: {
              id_cliente: this.id_cliente,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data.carrito)) {
          this.carrito = response.data.carrito;
          this.actualizarTotal();
        } else {
          console.error(
            "Respuesta inesperada al obtener el carrito:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      }
    },
    async eliminarDelCarrito(index) {
      const token = localStorage.getItem("token");
      const producto = this.carrito[index];

      try {
        const response = await axios.delete(
          `http://localhost:3306/api/auth/carrito/${producto.id_carrito_producto}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.message === "Producto eliminado del carrito") {
          this.carrito.splice(index, 1);
          this.actualizarTotal();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto eliminado del carrito",
            showConfirmButton: false,
            timer: 1000,
            background: "#ffffff",
            color: "#0a641a",
          });
        } else {
          Swal.fire("Error al eliminar el producto del carrito.", "", "error");
        }
      } catch (error) {
        console.error("Error al eliminar del carrito:", error);
        Swal.fire("Error al eliminar el producto del carrito.", "", "error");
      }
    },
    actualizarTotal() {
      this.totalCarrito = this.carrito.reduce((total, item) => {
        return total + item.precio_unitario * item.cantidad;
      }, 0);
    },
    async procesarVenta() {
      const token = localStorage.getItem("token");
      const id_cliente = localStorage.getItem("id_cliente");

      if (!token || !id_cliente) {
        Swal.fire("Por favor, inicie sesión para continuar.", "", "warning");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3306/api/auth/venta",
          {
            id_cliente,
            productos: this.carrito,
            total: this.totalCarrito,
            metodo_pago_id: this.metodo_pago_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.message === "Compra registrada exitosamente") {
          Swal.fire(
            "Revisa tu correo y sigue los pasos para terminar tu compra!",
            "",
            "success"
          );
          this.carrito = [];
          this.totalCarrito = 0;
        } else {
          Swal.fire("Error al procesar la venta.", "", "error");
        }
      } catch (error) {
        console.error("Error al procesar la venta:", error);
        Swal.fire("Error al procesar la venta.", "", "error");
      }
    },
  },
  watch: {
    categoriaId() {
      this.fetchProductos(); // Recargar productos al cambiar la categoría
    },
  },
  created() {
    this.fetchProductos(); // Cargar productos al crear el componente
    this.fetchCarrito(); // Cargar carrito al crear el componente
  },
};
</script>

<style scoped>
.productos-tienda {
  padding: 20px;
  background-color: #ffffff;
  position: relative;
}

.busqueda-input {
  width: 50%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.productos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.producto-card {
  border: 1px solid #ddd;
  padding: 20px;
  width: 250px;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.producto-card:hover {
  transform: scale(1.05);
}

.producto-descripcion h3 {
  font-weight: bold;
  margin: 0;
  font-size: 20px;
  color: #333;
}

.producto-descripcion p {
  font-size: 18px;
  color: #555;
}

.producto-acciones {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.producto-acciones button {
  padding: 10px 20px;
  background-color: #0a641a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.producto-acciones button:hover {
  background-color: #09831f;
}

.icono-carrito {
  margin-right: 5px;
  color: #f1c40f;
}

.btn-sidebar {
  position: fixed;
  right: 20px;
  bottom: 20px;
  background-color: #0a641a;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  font-size: 16px;
}

.sidebar {
  position: fixed;
  right: -350px;
  top: 0;
  height: 100%;
  width: 350px;
  background-color: #0a641a;
  box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: right 0.3s;
  z-index: 1000;
  overflow-y: auto;
}

/* Estilo para el scroll en la barra lateral */
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: #09831f;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #f1c40f;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #ff9800;
}

.sidebar-abierto {
  right: 0;
}

h2 {
  color: #fff;
}

p {
  color: #fff;
}

.btn-cerrar {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  color: #ff9800;
}

.formulario-venta {
  color: #fff;
  margin-top: 20px;
}

.formulario-venta select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.btn-procesar {
  width: 100%;
  padding: 10px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-procesar:hover {
  background-color: #f1c40f;
}

.carrito-lista {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.carrito-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

.carrito-item-info {
  flex: 1;
  color: #333;
  font-size: 16px;
}

.btn-eliminar {
  background-color: #e74c3c;
  color: rgb(255, 255, 255);
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-eliminar:hover {
  background-color: #c0392b;
}

.alerta-agregado {
  background-color: #ffffff;
  position: fixed;
  border: none;
  top: 30px;
  left: 50%; /* Alineación horizontal */
  transform: translateX(-50%); /* Centra horizontalmente el elemento */
  z-index: 1050;
  width: 300px;
  padding: 10px; /* Añade un poco de espacio interno */
  border-radius: 5px; /* Bordes redondeados para un diseño más suave */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Sombra ligera para destacar */
}

@media (max-width: 768px) {
  .alerta-agregado {
    width: 90%; /* Ajusta el ancho para que ocupe un porcentaje de la pantalla */
    right: 5%; /* Ajusta la distancia desde el borde derecho para pantallas pequeñas */
  }
}
</style>
