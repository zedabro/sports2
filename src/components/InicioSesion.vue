<template>
  <MenuPrincipal />
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Inicio de sesión</h2>
      <b-form @submit.prevent="handleSubmit">
        <b-form-group
          label="Email:"
          label-for="email-input"
          class="login-label"
        >
          <b-form-input
            id="email-input"
            v-model="email"
            type="email"
            required
            placeholder="Ingrese su mail"
            class="login-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Contraseña:"
          label-for="password-input"
          class="login-label"
        >
          <b-form-input
            id="password-input"
            v-model="password"
            type="password"
            required
            placeholder="Ingrese su contraseña"
            class="login-input"
          ></b-form-input>
        </b-form-group>

        <p class="signup-text">
          ¿No tienes cuenta?
          <router-link to="/registro" class="signup-link"
            >Click aquí</router-link
          >
        </p>

        <b-button type="submit" class="login-button">Iniciar</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import MenuPrincipal from "@/components/MenuPrincipal.vue";
import Swal from "sweetalert2";

export default {
  components: {
    MenuPrincipal,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await fetch("http://localhost:3306/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Inicio de sesión exitoso",
            text: data.message,
            confirmButtonColor: "#0a641a",
          });

          // Guardar los datos en localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("id_cliente", data.id_cliente || null);
          localStorage.setItem("id_personal", data.id_personal || null);
          localStorage.setItem("nombre", data.nombre);
          localStorage.setItem("email", data.email);

          // Redirección condicional basada en id_personal o id_cliente
          if (data.id_personal) {
            this.$router.push("/admin");
          } else if (data.id_cliente) {
            this.$router.push("/home");
          } else {
            // Fallback en caso de que algo salga mal
            this.$router.push("/login");
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error || "Error al iniciar sesión",
            confirmButtonColor: "#0a641a",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al conectar con el servidor",
          confirmButtonColor: "#0a641a",
        });
      }
    },
  },
};
</script>

<style scoped>
/* Aquí va tu código CSS que ya incluías anteriormente */
.login-container {
  background-color: #ffffff;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
}

.login-box {
  background-color: #0a641a;
  padding: 20px;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  height: 400px;
  box-shadow: 0 30px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.login-title {
  font-weight: bold;
  color: #ffffff;
  margin-top: 15px;
  margin-bottom: 15px;
}

.login-label {
  font-weight: bold;
  margin-top: 20px;
  color: #ffffff;
  text-align: left;
}

.login-input {
  border-radius: 5px;
}

.signup-text {
  margin-top: 20px;
  color: #ffffff;
}

.signup-link {
  color: #ff9800;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.login-button {
  background-color: #ff9800;
  color: #ffffff;
  font-weight: bold;
  border: none;
  width: 100%;
  border-radius: 10px;
  margin-top: 15px;
  padding: 10px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #e68900;
}

@media (max-width: 600px) {
  .login-box {
    margin-top: 10px;
    padding: 15px;
    border-radius: 10px;
  }

  .login-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .login-input {
    font-size: 14px;
  }

  .login-button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
