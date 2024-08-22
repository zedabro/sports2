<template>
  <div class="productos-container">
    <h1 class="productos-title">Lista de Productos</h1>

    <!-- Campo de búsqueda -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar por descripción o código"
        class="search-input"
      />
    </div>

    <div class="table-container">
      <table class="productos-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="producto in paginatedProductos"
            :key="producto.id_producto"
          >
            <td>{{ producto.descripcion }}</td>
            <td>{{ producto.stock }}</td>
            <td>
              <button @click="verDetallesProducto(producto)" class="btn-ver">
                Ver Detalles
              </button>
              <button @click="abrirModalEditar(producto)" class="btn-editar">
                Editar
              </button>
              <button
                @click="confirmarEliminacion(producto)"
                class="btn-eliminar"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="pagination-container">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Siguiente
      </button>
    </div>

    <!-- Modal para mostrar detalles del producto -->
    <b-modal
      id="modalDetallesProducto"
      title="Detalles del Producto"
      v-model="showModalDetalles"
    >
      <p><strong>Código:</strong> {{ productoActual.codigo_producto }}</p>
      <p><strong>Descripción:</strong> {{ productoActual.descripcion }}</p>
      <p>
        <strong>Precio Unitario:</strong> {{ productoActual.precio_unitario }}
      </p>
      <p><strong>Stock:</strong> {{ productoActual.stock }}</p>
      <p>
        <strong>Subcategoría:</strong> {{ productoActual.nombre_subcategoria }}
      </p>
    </b-modal>

    <!-- Modal para editar producto -->
    <b-modal
      id="modalEditarProducto"
      title="Editar Producto"
      v-model="showModalEditar"
      @ok="editarProducto"
    >
      <form @submit.prevent="editarProducto">
        <b-form-group label="Código">
          <b-form-input
            v-model="productoActual.codigo_producto"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Descripción">
          <b-form-input
            v-model="productoActual.descripcion"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Precio Unitario">
          <b-form-input
            type="number"
            v-model="productoActual.precio_unitario"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Stock">
          <b-form-input
            type="number"
            v-model="productoActual.stock"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { BModal, BFormGroup, BFormInput } from "bootstrap-vue-3";
import Swal from "sweetalert2";

export default {
  components: {
    BModal,
    BFormGroup,
    BFormInput,
  },
  data() {
    return {
      productos: [],
      showModalDetalles: false,
      showModalEditar: false,
      productoActual: {},
      searchQuery: "", // Búsqueda
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredProductos() {
      return this.productos.filter((producto) => {
        const searchTerm = this.searchQuery.toLowerCase();
        return (
          producto.descripcion.toLowerCase().includes(searchTerm) ||
          producto.codigo_producto.toLowerCase().includes(searchTerm)
        );
      });
    },
    paginatedProductos() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProductos.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProductos.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchProductos() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3306/api/listaproductos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.productos = response.data;
      } catch (error) {
        console.error(
          "Error al obtener los productos:",
          error.response ? error.response.data : error.message
        );
      }
    },
    verDetallesProducto(producto) {
      this.productoActual = producto;
      this.showModalDetalles = true;
    },
    abrirModalEditar(producto) {
      this.productoActual = { ...producto };
      this.showModalEditar = true;
    },
    async editarProducto() {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:3306/api/productos/${this.productoActual.id_producto}`,
          this.productoActual,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.fetchProductos();
        this.showModalEditar = false;
        Swal.fire({
          icon: "success",
          title: "Producto Editado",
          text: "El producto ha sido editado exitosamente.",
          confirmButtonColor: "#0a641a",
        });
      } catch (error) {
        console.error(
          "Error al editar el producto:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo editar el producto.",
          confirmButtonColor: "#0a641a",
        });
      }
    },
    async confirmarEliminacion(producto) {
      const result = await Swal.fire({
        title: "Confirmar Eliminación",
        text: `¿Estás seguro de que deseas eliminar el producto "${producto.descripcion}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0a641a",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        this.eliminarProducto(producto);
      }
    },
    async eliminarProducto(producto) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:3306/api/productos/${producto.id_producto}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.fetchProductos();
        Swal.fire({
          icon: "success",
          title: "Producto Eliminado",
          text: "El producto ha sido eliminado exitosamente.",
          confirmButtonColor: "#0a641a",
        });
      } catch (error) {
        console.error(
          "Error al eliminar el producto:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el producto.",
          confirmButtonColor: "#0a641a",
        });
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  mounted() {
    this.fetchProductos();
  },
};
</script>

<style scoped>
.productos-container {
  padding: 20px;
  background-color: #f4f4f4;
}

.productos-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.table-container {
  margin: 0 auto;
  max-width: 100%;
  overflow-x: auto;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-container button {
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  background-color: #0a641a;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-container button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination-container span {
  margin: 0 10px;
  font-weight: bold;
}

.search-container {
  margin-bottom: 20px;
  text-align: center;
}

.search-input {
  padding: 8px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.productos-table {
  width: 100%;
  border-collapse: collapse;
}

.productos-table th,
.productos-table td {
  padding: 12px;
  border: 1px solid #ddd;
}

.productos-table th {
  background-color: #0a641a;
  color: #fff;
}

.productos-table td {
  text-align: left;
}

button {
  padding: 5px 10px;
  margin: 2px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
}

.btn-ver {
  background-color: #3498db;
}

.btn-editar {
  background-color: #f39c12;
}

.btn-eliminar {
  background-color: #e74c3c;
}

/* Media Queries para Responsividad */

/* Pantallas hasta 768px de ancho */
@media (max-width: 768px) {
  .productos-table th,
  .productos-table td {
    padding: 8px;
    font-size: 14px;
  }
}

/* Pantallas hasta 480px de ancho */
@media (max-width: 480px) {
  .productos-table th,
  .productos-table td {
    padding: 6px;
    font-size: 12px;
  }
}
</style>
