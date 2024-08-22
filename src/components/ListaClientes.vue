<template>
  <div class="clientes-container">
    <h1 class="clientes-title">Lista de Clientes</h1>
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar por nombre o email..."
        class="search-input"
      />
    </div>
    <div v-if="clientes.length" class="table-wrapper">
      <table class="clientes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in paginatedClientes" :key="cliente.id_cliente">
            <td>{{ cliente.nombre }}</td>
            <td>{{ cliente.email }}</td>
            <td>
              <button
                @click="verEstadoCuenta(cliente.id_cliente)"
                class="btn-cuenta"
              >
                Estado cuenta
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="no-clients-message">No se encontraron clientes.</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <div class="pagination-container">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Siguiente
      </button>
    </div>

    <!-- Modal -->
    <b-modal v-model="showModal" title="Estado de Cuenta">
      <template v-slot:default>
        <div v-if="estadoCuenta.length">
          <table class="estado-cuenta-table">
            <thead>
              <tr>
                <th>Pedido numero</th>
                <th>Fecha Pedido</th>
                <th>Total</th>
                <th>Fecha Entrega</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pedido in estadoCuenta" :key="pedido.id_pedido">
                <td>{{ pedido.id_pedido }}</td>
                <td>{{ pedido.fecha_pedido }}</td>
                <td>{{ pedido.total }}</td>
                <td>{{ pedido.fecha_entrega || "No disponible" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>No hay datos para mostrar.</p>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { BModal } from "bootstrap-vue-3";

export default {
  name: "ListaClientes",
  components: {
    BModal,
  },
  data() {
    return {
      clientes: [],
      error: null,
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      estadoCuenta: [], // Asegúrate de que sea un array
    };
  },
  computed: {
    filteredClientes() {
      const query = this.searchQuery.toLowerCase();
      return this.clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(query) ||
          cliente.email.toLowerCase().includes(query)
      );
    },
    paginatedClientes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredClientes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredClientes.length / this.itemsPerPage);
    },
  },
  async created() {
    try {
      const response = await axios.get("http://localhost:3306/api/clientes");
      this.clientes = response.data;
    } catch (error) {
      this.error = "Error al obtener los clientes";
      console.error(error);
    }
  },
  methods: {
    async verEstadoCuenta(idCliente) {
      try {
        const response = await axios.post(
          `http://localhost:3306/estado-cuenta/${idCliente}`
        );
        console.log("Respuesta de la API:", response.data);
        this.estadoCuenta = Array.isArray(response.data) ? response.data : [];
        this.showModal = true;
      } catch (error) {
        console.error("Error al obtener el estado de cuenta:", error);
        this.error = "Error al obtener el estado de cuenta";
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
  },
};
</script>

<style scoped>
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

.clientes-container {
  padding: 20px;
  background-color: #f4f4f4;
}

.clientes-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
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

.btn-cuenta {
  background-color: #f1c40f;
}

.table-wrapper {
  margin: 0 auto;
  max-width: 100%;
  overflow-x: auto;
}

.clientes-table {
  width: 100%;
  border-collapse: collapse;
}

.clientes-table th,
.clientes-table td {
  padding: 12px;
  border: 1px solid #ddd;
}

.clientes-table th {
  background-color: #0a641a;
  color: #fff;
}

.no-clients-message {
  text-align: center;
  color: #333;
}

.error-message {
  text-align: center;
  color: #e74c3c;
}
/* Estilos para el modal */
.estado-cuenta-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
}

.estado-cuenta-table th,
.estado-cuenta-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word;
}

.estado-cuenta-table th {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
}

.estado-cuenta-table td {
  background-color: #f9f9f9;
  color: #333;
}

.estado-cuenta-table tr:nth-child(even) td {
  background-color: #e9ecef;
}

.estado-cuenta-table tr:hover td {
  background-color: #cce5ff;
}

.modal-content {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header,
.modal-footer {
  border-bottom: 1px solid #ddd;
}

.modal-header {
  background-color: #007bff;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.modal-footer {
  background-color: #f1f1f1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #fff;
}

.b-button {
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
}

.b-button:hover {
  background-color: #0056b3;
}

@media screen and (max-width: 576px) {
  .estado-cuenta-table th,
  .estado-cuenta-table td {
    font-size: 12px;
    padding: 8px;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-content {
    padding: 1rem;
  }
  .clientes-table th,
  .clientes-table td {
    padding: 8px;
    font-size: 14px;
  }

  button {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>
