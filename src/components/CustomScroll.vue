<template>
  <div class="custom-scroll">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "CustomScroll",
};
</script>

<style scoped>
.custom-scroll {
  overflow-y: auto;
  max-height: 100vh;
}

.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #09831f;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #ff9800;
  border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #f3a229;
}
</style>
