<template>
  <MenuPrincipal />
  <div class="register-container">
    <div class="register-box">
      <h2 class="register-title">Registro</h2>
      <b-form @submit.prevent="handleSubmit">
        <b-form-group
          label="Nombre:"
          label-for="name-input"
          class="register-label"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            type="text"
            required
            placeholder="Ingrese su nombre"
            class="register-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Email:"
          label-for="email-input"
          class="register-label"
        >
          <b-form-input
            id="email-input"
            v-model="email"
            type="email"
            required
            placeholder="Ingrese su mail"
            class="register-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Contraseña:"
          label-for="password-input"
          class="register-label"
        >
          <b-form-input
            id="password-input"
            v-model="password"
            type="password"
            required
            placeholder="Ingrese su contraseña"
            class="register-input"
          ></b-form-input>
        </b-form-group>

        <p class="login-text">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="login-link">Click aquí</router-link>
        </p>

        <b-button type="submit" class="register-button">Registrar</b-button>
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
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await fetch(
          "http://localhost:3306/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre: this.name,
              email: this.email,
              password: this.password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: data.message,
            confirmButtonColor: "#0a641a",
          });
          this.$router.push("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error || "Error al registrar el usuario",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al conectar con el servidor",
        });
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  background-color: #ffffff;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
}

.register-box {
  background-color: #0a641a;
  padding: 20px;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  height: 500px;
  box-shadow: 0 30px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.register-title {
  font-weight: bold;
  color: #ffffff;
  margin-top: 15px;
  margin-bottom: 15px;
}

.register-label {
  font-weight: bold;
  margin-top: 20px;
  color: #ffffff;
  text-align: left;
}

.register-input {
  border-radius: 5px;
}

.login-text {
  margin-top: 20px;
  color: #ffffff;
}

.login-link {
  color: #ff9800;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

.register-button {
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

.register-button:hover {
  background-color: #e68900;
}

@media (max-width: 600px) {
  .register-box {
    padding: 15px;
    border-radius: 10px;
  }

  .register-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .register-input {
    font-size: 14px;
  }

  .register-button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
