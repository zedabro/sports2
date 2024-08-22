<template>
  <div>
    <header class="header">
      <b-container fluid>
        <b-row class="align-items-center">
          <b-col class="d-flex align-items-center">
            <router-link to="/home">
              <img src="@/assets/logo.png" alt="Logo" class="logo" />
            </router-link>
          </b-col>
          <b-col class="d-none d-md-flex justify-content-end">
            <router-link to="/admin">
              <b-button class="menu-button mr-2">
                <i class="fa-solid fa-box"></i> Listas
              </b-button>
            </router-link>
            <router-link to="/cargaproductos">
              <b-button class="menu-button mr-2">
                <i class="fa-solid fa-upload"></i> Cargar Productos
              </b-button>
            </router-link>
            <b-button class="menu-button mr-2" @click="logout">
              <i class="fa-solid fa-sign-out-alt"></i> Cerrar sesión
            </b-button>
          </b-col>
          <b-col class="d-md-none text-right">
            <b-button v-b-toggle.admin-menu-collapse class="menu-toggle">
              <i class="fa-solid fa-bars"></i>
            </b-button>
          </b-col>
        </b-row>

        <b-collapse id="admin-menu-collapse" class="d-md-none">
          <b-nav vertical>
            <b-nav-item>
              <router-link to="/admin">
                <b-button class="menu-button">
                  <i class="fa-solid fa-box"></i> Productos
                </b-button>
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link to="/cargaproductos">
                <b-button class="menu-button">
                  <i class="fa-solid fa-upload"></i> Cargar Productos
                </b-button>
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <b-button class="menu-button" @click="logout">
                <i class="fa-solid fa-sign-out-alt"></i> Cerrar sesión
              </b-button>
            </b-nav-item>
          </b-nav>
        </b-collapse>
      </b-container>
    </header>
  </div>
</template>

<script>
import { BButton, BCollapse, BNav, BNavItem } from "bootstrap-vue-3";
import { vBToggle } from "bootstrap-vue-3";

export default {
  components: {
    BButton,
    BCollapse,
    BNav,
    BNavItem,
  },
  directives: {
    "b-toggle": vBToggle,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/home");
      this.isLoggedIn = false;
    },
  },
  mounted() {
    this.isLoggedIn = !!localStorage.getItem("token");
  },
  watch: {
    $route() {
      this.isLoggedIn = !!localStorage.getItem("token");
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #0a641a;
  padding: 10px 0;
  z-index: 1000000;
}

.logo {
  width: 180px;
  cursor: pointer;
}

.menu-button {
  font-weight: bold;
  color: #fff;
  background: #0a641a;
  border: none;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.menu-button:hover {
  background: #0a641a;
  color: #ff9800;
}

.menu-button i {
  background: #0a641a;
  margin-right: 0.5rem;
  color: #ff9800;
}

.menu-toggle {
  font-size: 1.5rem;
  background: #0a641a;
  color: #ff9800;
  border: none;
  position: relative;
  margin-right: -0.5rem;
}

.b-col.d-md-none.text-right {
  padding-right: 0;
  text-align: right;
}

.b-collapse {
  background-color: #0a641a;
  padding: 10px;
}

@media (max-width: 768px) {
  .menu-button {
    width: 100%;
    background: #0a641a;
    text-align: left;
  }
}
</style>
