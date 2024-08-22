<template>
  <custom-scroll>
    <MenuPrincipal />
    <div class="mis-compras">
      <h1>Mis Compras</h1>

      <!-- Compras Pendientes -->
      <div v-if="comprasPendientes.length > 0">
        <h2>Compras Pendientes</h2>
        <ul>
          <li
            v-for="compra in comprasPendientes"
            :key="compra.id_pedido"
            :class="getClassEstado(compra.estado_nombre)"
          >
            <p>
              <span>Compra número: {{ compra.id_pedido }}</span>
            </p>
            <p>
              <span>Fecha: {{ compra.fecha_venta }}</span>
            </p>
            <p>
              <span>
                Monto Total: $
                <span
                  :style="{
                    color:
                      compra.estado_nombre === 'anulado' ? '#e60000' : '#000',
                  }"
                >
                  {{ compra.monto_total }}
                </span>
              </span>
            </p>
            <p>
              <span>
                Estado:
                <span :style="{ color: getColorEstado(compra.estado_nombre) }">
                  {{ compra.estado_nombre }}
                </span>
              </span>
            </p>
            <button
              v-if="
                compra.estado_nombre !== 'anulado' &&
                compra.estado_nombre !== 'Entregado'
              "
              @click="cancelarCompra(compra.id_pedido)"
              class="btn-cancelar"
            >
              Cancelar Pedido
            </button>
          </li>
        </ul>
      </div>

      <!-- Compras En Proceso -->
      <div v-if="comprasEnProceso.length > 0">
        <h2>Compras En Proceso</h2>
        <ul>
          <li
            v-for="compra in comprasEnProceso"
            :key="compra.id_pedido"
            :class="getClassEstado(compra.estado_nombre)"
          >
            <p>
              <span>Compra número: {{ compra.id_pedido }}</span>
            </p>
            <p>
              <span>Fecha: {{ compra.fecha_venta }}</span>
            </p>
            <p>
              <span>
                Monto Total: $
                <span
                  :style="{
                    color:
                      compra.estado_nombre === 'anulado' ? '#e60000' : '#000',
                  }"
                >
                  {{ compra.monto_total }}
                </span>
              </span>
            </p>
            <p>
              <span>
                Estado:
                <span :style="{ color: getColorEstado(compra.estado_nombre) }">
                  {{ compra.estado_nombre }}
                </span>
              </span>
            </p>
            <button
              v-if="
                compra.estado_nombre !== 'anulado' &&
                compra.estado_nombre !== 'Entregado'
              "
              @click="cancelarCompra(compra.id_pedido)"
              class="btn-cancelar"
            >
              Cancelar Pedido
            </button>
          </li>
        </ul>
      </div>

      <!-- Compras En Camino -->
      <div v-if="comprasEnCamino.length > 0">
        <h2>Compras En Camino</h2>
        <ul>
          <li
            v-for="compra in comprasEnCamino"
            :key="compra.id_pedido"
            :class="getClassEstado(compra.estado_nombre)"
          >
            <p>
              <span>Compra número: {{ compra.id_pedido }}</span>
            </p>
            <p>
              <span>Fecha: {{ compra.fecha_venta }}</span>
            </p>
            <p>
              <span>
                Monto Total: $
                <span
                  :style="{
                    color:
                      compra.estado_nombre === 'anulado' ? '#e60000' : '#000',
                  }"
                >
                  {{ compra.monto_total }}
                </span>
              </span>
            </p>
            <p>
              <span>
                Estado:
                <span :style="{ color: getColorEstado(compra.estado_nombre) }">
                  {{ compra.estado_nombre }}
                </span>
              </span>
            </p>
            <button
              v-if="
                compra.estado_nombre !== 'anulado' &&
                compra.estado_nombre !== 'Entregado'
              "
              @click="cancelarCompra(compra.id_pedido)"
              class="btn-cancelar"
            >
              Cancelar Pedido
            </button>
          </li>
        </ul>
      </div>

      <!-- Compras Entregadas -->
      <div v-if="comprasEntregadas.length > 0">
        <h2>Compras Entregadas</h2>
        <ul>
          <li
            v-for="compra in comprasEntregadas"
            :key="compra.id_pedido"
            :class="getClassEstado(compra.estado_nombre)"
          >
            <p>
              <span>Compra número: {{ compra.id_pedido }}</span>
            </p>
            <p>
              <span>Fecha: {{ compra.fecha_venta }}</span>
            </p>
            <p>
              <span>
                Monto Total: $
                <span
                  :style="{
                    color:
                      compra.estado_nombre === 'anulado' ? '#e60000' : '#000',
                  }"
                >
                  {{ compra.monto_total }}
                </span>
              </span>
            </p>
            <p>
              <span>
                Estado:
                <span :style="{ color: getColorEstado(compra.estado_nombre) }">
                  {{ compra.estado_nombre }}
                </span>
              </span>
            </p>
            <!-- No se muestra botón de cancelar si el estado es 'Entregado' -->
          </li>
        </ul>
      </div>

      <!-- Compras Anuladas -->
      <div v-if="comprasAnuladas.length > 0">
        <h2>Compras Anuladas</h2>
        <ul>
          <li
            v-for="compra in comprasAnuladas"
            :key="compra.id_pedido"
            :class="getClassEstado(compra.estado_nombre)"
          >
            <p>
              <span>Compra número: {{ compra.id_pedido }}</span>
            </p>
            <p>
              <span>Fecha: {{ compra.fecha_venta }}</span>
            </p>
            <p>
              <span>
                Monto Total: $
                <span
                  :style="{
                    color:
                      compra.estado_nombre === 'anulado' ? '#e60000' : '#000',
                  }"
                >
                  {{ compra.monto_total }}
                </span>
              </span>
            </p>
            <p>
              <span>
                Estado:
                <span :style="{ color: getColorEstado(compra.estado_nombre) }">
                  {{ compra.estado_nombre }}
                </span>
              </span>
            </p>
            <!-- No se muestra botón de cancelar si el estado es 'anulado' -->
          </li>
        </ul>
      </div>

      <div v-else>
        <p>No tienes compras registradas.</p>
      </div>
    </div>
  </custom-scroll>
</template>

<script>
import MenuPrincipal from "@/components/MenuPrincipal.vue";
import CustomScroll from "./CustomScroll.vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: {
    MenuPrincipal,
    CustomScroll,
  },
  data() {
    return {
      compras: [],
    };
  },
  computed: {
    comprasPendientes() {
      return this.compras.filter(
        (compra) => compra.estado_nombre === "Pendiente"
      );
    },
    comprasEnProceso() {
      return this.compras.filter(
        (compra) => compra.estado_nombre === "En proceso"
      );
    },
    comprasEnCamino() {
      return this.compras.filter(
        (compra) => compra.estado_nombre === "En camino"
      );
    },
    comprasEntregadas() {
      return this.compras.filter(
        (compra) => compra.estado_nombre === "Entregado"
      );
    },
    comprasAnuladas() {
      return this.compras.filter(
        (compra) => compra.estado_nombre === "anulado"
      );
    },
  },
  methods: {
    async fetchCompras() {
      const token = localStorage.getItem("token");
      const id_cliente = localStorage.getItem("id_cliente");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "Por favor, inicie sesión para continuar.",
        });
        return;
      }

      if (!id_cliente) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ID de cliente no disponible.",
        });
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3306/api/auth/compras",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              id_cliente,
            },
          }
        );
        this.compras = response.data;
        console.log("Compras obtenidas:", this.compras); // Verifica los datos obtenidos
      } catch (error) {
        console.error("Error al obtener las compras:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al obtener las compras.",
        });
      }
    },
    async cancelarCompra(id_pedido) {
      const confirmacion = await Swal.fire({
        title: "Confirmar Cancelación",
        text: "¿Estás seguro de que deseas cancelar esta compra?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0a641a",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "Cancelar",
      });

      if (!confirmacion.isConfirmed) return;

      const token = localStorage.getItem("token");

      try {
        await axios.delete(`http://localhost:3306/api/pedidos/${id_pedido}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Compra cancelada exitosamente.",
        });
        this.fetchCompras(); // Volvemos a cargar las compras para reflejar los cambios
      } catch (error) {
        console.error("Error al cancelar la compra:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cancelar la compra.",
        });
      }
    },
    getClassEstado(estado_nombre) {
      switch (estado_nombre) {
        case "Pendiente":
          return "pendiente";
        case "En proceso":
          return "enproceso";
        case "En camino":
          return "encamino";
        case "Entregado":
          return "entregado";
        case "anulado":
          return "anulado";
        default:
          return "";
      }
    },
    getColorEstado(estado_nombre) {
      switch (estado_nombre) {
        case "Pendiente":
          return "#f1c40f";
        case "En proceso":
          return "#f39c12";
        case "En camino":
          return "#f39c12";
        case "Entregado":
          return "#2ecc71";
        case "anulado":
          return "#e60000";
        default:
          return "#000";
      }
    },
  },
  mounted() {
    this.fetchCompras();
  },
};
</script>

<style scoped>
.pendiente {
  border-left: 5px solid #f1c40f;
}

.enproceso {
  border-left: 5px solid #f39c12;
}

.encamino {
  border-left: 5px solid #f39c12;
}

.entregado {
  border-left: 5px solid #2ecc71;
}

.anulado {
  border-left: 5px solid #e60000;
  color: #e60000;
}

.mis-compras {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f4f4f4;
  border-radius: 8px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

h2 {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  transition: background-color 0.3s, transform 0.2s;
}

li:hover {
  background-color: #eaf2e0;
  transform: scale(1.02);
}

p {
  margin: 5px 0;
  color: #555;
}

p span {
  font-weight: bold;
  color: #0a641a;
}

.btn-cancelar {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-cancelar:hover {
  background-color: #ff1a1a;
  transform: scale(1.05);
}

.btn-cancelar:active {
  background-color: #e60000;
}

.no-compras {
  text-align: center;
  font-size: 18px;
  color: #888;
}

/* Pantallas hasta 768px de ancho */
@media (max-width: 768px) {
  .mis-compras {
    padding: 15px;
  }

  h1 {
    font-size: 20px;
  }

  h2 {
    font-size: 20px;
  }

  li {
    padding: 15px;
  }

  p {
    font-size: 14px;
  }
}

/* Pantallas hasta 480px de ancho */
@media (max-width: 480px) {
  .mis-compras {
    padding: 10px;
  }

  h1 {
    font-size: 30px;
  }

  h2 {
    font-size: 20px;
  }

  li {
    padding: 10px;
  }

  p {
    font-size: 17px;
  }
}
</style>
