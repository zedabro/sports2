<template>
  <div class="ventas-container">
    <h1 class="ventas-title">Lista de Ventas</h1>

    <!-- Buscador -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar por nombre de cliente o n-pedido..."
        class="search-input"
      />
    </div>

    <div class="table-container">
      <table class="ventas-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Monto total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pedido in paginatedPedidos" :key="pedido.id_pedido">
            <td>{{ pedido.nombre_cliente }}</td>
            <td>{{ pedido.total }}</td>
            <td>
              <button
                @click="verEstadoPedido(pedido.id_pedido)"
                class="btn-ver"
              >
                Ver Estado
              </button>
              <button
                @click="realizarEntrega(pedido.id_pedido)"
                :disabled="pedido.estado_nombre !== 'Pendiente'"
                class="btn-entrega"
              >
                Realizar Entrega
              </button>
              <button
                @click="anularPedido(pedido.id_pedido)"
                class="btn-anular"
              >
                Anular Pedido
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

    <!-- Modal para Ver Estado del Pedido -->
    <b-modal
      id="modalVerEstado"
      title="Estado del Pedido"
      v-model="showModalEstado"
    >
      <p>Pedido: #{{ currentPedido.id_pedido }}</p>
      <p>Estado: {{ currentPedido.estado_nombre }}</p>
      <b-button @click="showModalEstado = false">Cerrar</b-button>
    </b-modal>

    <!-- Modal para Ver Estado de Cuenta -->
    <b-modal
      id="modalVerCuenta"
      title="Estado de Cuenta"
      v-model="showModalCuenta"
    >
      <p>Cliente: #{{ currentCliente.id_cliente }}</p>
      <p>Estado de cuenta: Estático</p>
      <b-button @click="showModalCuenta = false">Cerrar</b-button>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { BModal, BButton } from "bootstrap-vue-3";
import Swal from "sweetalert2";

export default {
  components: {
    BModal,
    BButton,
  },
  data() {
    return {
      pedidos: [],
      searchQuery: "", // Para el campo de búsqueda
      currentPage: 1, // Página actual
      itemsPerPage: 10, // Número de ventas por página
      showModalEstado: false,
      showModalCuenta: false,
      currentPedido: {},
      currentCliente: {},
    };
  },
  computed: {
    filteredPedidos() {
      // Filtrar pedidos según la consulta de búsqueda
      return this.pedidos.filter((pedido) => {
        const query = this.searchQuery.toLowerCase();
        return (
          pedido.nombre_cliente.toLowerCase().includes(query) ||
          pedido.id_pedido.toString().includes(query)
        );
      });
    },
    paginatedPedidos() {
      // Calcular los pedidos que se mostrarán en la página actual
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPedidos.slice(start, end);
    },
    totalPages() {
      // Calcular el número total de páginas
      return Math.ceil(this.filteredPedidos.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchPedidos() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3306/api/pedidos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.pedidos = response.data;
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al obtener los pedidos.",
        });
      }
    },
    verEstadoPedido(idPedido) {
      const pedido = this.pedidos.find((p) => p.id_pedido === idPedido);
      if (pedido) {
        this.currentPedido = pedido;
        this.showModalEstado = true;
      }
    },
    verEstadoCuenta(idCliente) {
      const cliente = this.pedidos.find((p) => p.id_cliente === idCliente);
      if (cliente) {
        this.currentCliente = cliente;
        this.showModalCuenta = true;
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
    async realizarEntrega(idPedido) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:3306/api/pedidos/${idPedido}/entregar`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.fetchPedidos();
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Pedido marcado como entregado.",
        });
      } catch (error) {
        console.error("Error al realizar la entrega:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al marcar el pedido como entregado.",
        });
      }
    },
    async anularPedido(idPedido) {
      const confirmacion = await Swal.fire({
        title: "Confirmar Anulación",
        text: "¿Estás seguro de que deseas anular este pedido?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0a641a",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, anular",
        cancelButtonText: "Cancelar",
      });

      if (!confirmacion.isConfirmed) return;

      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3306/api/pedidos/${idPedido}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.fetchPedidos();
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Pedido anulado.",
        });
      } catch (error) {
        console.error("Error al anular el pedido:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al anular el pedido.",
        });
      }
    },
  },
  mounted() {
    this.fetchPedidos();
  },
};
</script>

<style scoped>
.ventas-container {
  padding: 20px;
  background-color: #f4f4f4;
}

.ventas-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.table-container {
  margin: 0 auto;
  max-width: 100%;
  overflow-x: auto;
}

.ventas-table {
  width: 100%;
  border-collapse: collapse;
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

.ventas-table th,
.ventas-table td {
  padding: 12px;
  border: 1px solid #ddd;
}

.ventas-table th {
  background-color: #0a641a;
  color: #fff;
}

td.estado-pendiente {
  color: #f1c40f;
}

td.estado-enviado {
  color: #2980b9;
}

td.estado-entregado {
  color: #2ecc71;
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

.btn-entrega {
  background-color: #0a641a;
}

.btn-cuenta {
  background-color: #f1c40f;
}

.btn-anular {
  background-color: #e74c3c;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  opacity: 0.8;
}

button:active:not(:disabled) {
  transform: scale(0.95);
}

/* Pantallas hasta 768px de ancho */
@media (max-width: 768px) {
  .ventas-table th,
  .ventas-table td {
    padding: 8px;
    font-size: 14px;
  }

  button {
    padding: 4px 8px;
    font-size: 12px;
  }
}

/* Pantallas hasta 480px de ancho */
@media (max-width: 480px) {
  .ventas-table th,
  .ventas-table td {
    padding: 6px;
    font-size: 12px;
  }

  button {
    padding: 3px 6px;
    font-size: 10px;
  }
}
</style>
