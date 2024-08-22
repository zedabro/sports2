<template>
  <custom-scroll>
    <MenuAdmin />
    <div class="form-container">
      <div class="form-box">
        <h1 class="form-title">Cargar Producto</h1>
        <form @submit.prevent="submitForm" class="product-form">
          <div class="form-group">
            <label for="codigo_producto" class="form-label">
              Código de Producto:
            </label>
            <input
              type="text"
              v-model="producto.codigo_producto"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="descripcion" class="form-label"> Descripción: </label>
            <textarea
              v-model="producto.descripcion"
              class="form-input"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="precio_unitario" class="form-label">
              Precio Unitario:
            </label>
            <input
              type="number"
              v-model="producto.precio_unitario"
              class="form-input"
              step="0.01"
              required
            />
          </div>

          <div class="form-group">
            <label for="stock" class="form-label"> Stock: </label>
            <input
              type="number"
              v-model="producto.stock"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="id_categoria" class="form-label"> Categoría: </label>
            <select
              v-model="selectedCategoria"
              @change="fetchSubcategorias"
              class="form-input"
            >
              <option
                v-for="categoria in categorias"
                :key="categoria.id_categoria"
                :value="categoria.id_categoria"
              >
                {{ categoria.nombre_categoria }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="id_subcategoria" class="form-label">
              Subcategoría:
            </label>
            <select v-model="producto.id_subcategoria" class="form-input">
              <option
                v-for="subcategoria in subcategorias"
                :key="subcategoria.id_subcategoria"
                :value="subcategoria.id_subcategoria"
              >
                {{ subcategoria.nombre_subcategoria }}
              </option>
            </select>
          </div>

          <button type="submit" class="submit-button">Cargar Producto</button>
        </form>
      </div>
    </div>
  </custom-scroll>
</template>

<script>
import axios from "axios";
import CustomScroll from "./CustomScroll.vue";
import Swal from "sweetalert2";
import MenuAdmin from "./MenuAdmin.vue";

export default {
  components: {
    MenuAdmin,
    CustomScroll,
  },
  data() {
    return {
      producto: {
        codigo_producto: "",
        descripcion: "",
        precio_unitario: null,
        stock: null,
        id_subcategoria: null,
      },
      categorias: [],
      subcategorias: [],
      selectedCategoria: null,
    };
  },
  methods: {
    async fetchCategorias() {
      try {
        const response = await axios.get(
          "http://localhost:3306/api/categorias"
        );
        this.categorias = response.data;
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    },
    async fetchSubcategorias() {
      try {
        const response = await axios.get(
          `http://localhost:3306/api/subcategorias/${this.selectedCategoria}`
        );
        this.subcategorias = response.data;
      } catch (error) {
        console.error("Error al obtener subcategorías:", error);
      }
    },
    async submitForm() {
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:3306/api/productos", this.producto, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Producto Cargado",
          text: "El producto ha sido cargado exitosamente.",
          confirmButtonColor: "#0a641a",
        });

        this.producto = {
          codigo_producto: "",
          descripcion: "",
          precio_unitario: null,
          stock: null,
          id_subcategoria: null,
        };
        this.selectedCategoria = null;
        this.subcategorias = [];
      } catch (error) {
        console.error("Error al cargar producto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al cargar el producto.",
          confirmButtonColor: "#0a641a",
        });
      }
    },
  },
  mounted() {
    this.fetchCategorias();
  },
};
</script>

<style scoped>
.form-container {
  background-color: #ffffff;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.form-box {
  margin-top: 10px;
  background-color: #0a641a;
  padding: 20px;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 30px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.form-title {
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #ffffff;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.submit-button {
  background-color: #ff9800;
  color: #ffffff;
  font-weight: bold;
  border: none;
  width: 100%;
  border-radius: 10px;
  margin-top: 15px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #e68900;
}

@media (max-width: 600px) {
  .form-box {
    padding: 15px;
    border-radius: 10px;
  }

  .form-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .form-input {
    font-size: 14px;
  }

  .submit-button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
