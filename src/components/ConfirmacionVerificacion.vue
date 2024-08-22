<template>
  <div class="confirmation-container">
    <div class="confirmation-box">
      <h2 class="confirmation-title">¡Bienvenido a sports!</h2>
      <b-alert v-if="verificationSuccess" variant="success" show>
        Tu cuenta ha sido verificada exitosamente. Puedes iniciar sesión ahora.
      </b-alert>
      <b-alert v-else variant="danger" show>
        Hubo un problema con la verificación de tu correo.
      </b-alert>
      <b-button @click="redirectToLogin" class="confirmation-button">
        Iniciar sesion
      </b-button>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  props: ["token"], // Recibir el token como prop
  data() {
    return {
      verificationSuccess: false,
    };
  },
  methods: {
    async redirectToLogin() {
      this.$router.push("/login");
    },
  },
  async mounted() {
    const token = this.token; // Obtener el token de las props

    if (token) {
      try {
        console.log(`Verificando con el token: ${token}`);
        const response = await fetch(
          `http://localhost:3306/api/auth/verify-email?token=${token}`
        );
        console.log("Respuesta del servidor:", response);

        const result = await response.json(); // Cambia a .json() para manejar respuesta JSON

        if (response.ok && result.success) {
          this.verificationSuccess = true;
          Swal.fire({
            icon: "success",
            title: "¡Exito!",
            text: result.message,
            confirmButtonColor: "#0a641a",
          });
        } else {
          this.verificationSuccess = false;
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || "Hubo un problema con la verificación.",
            confirmButtonColor: "#0a641a",
          });
        }
      } catch (error) {
        console.error("Error al verificar:", error);
        this.verificationSuccess = false;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo conectar con el servidor.",
          confirmButtonColor: "#0a641a",
        });
      }
    }
  },
};
</script>

<style scoped>
.confirmation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

.confirmation-box {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.confirmation-title {
  margin-bottom: 1rem;
}

.confirmation-button {
  margin-top: 1rem;
}
</style>
