import { createRouter, createWebHistory } from "vue-router";
import PaginaInicio from "@/components/PaginaInicio.vue";
import RegistroUsuario from "@/components/RegistroUsuario.vue";
import InicioSesion from "@/components/InicioSesion.vue";
import ProductosTienda from "@/components/ProductosTienda.vue";
import MisCompras from "@/components/MisCompras.vue";
import CargaProductos from "@/components/CargaProductos.vue";
import ListaVentas from "@/components/ListaVentas.vue";
import ListaProductos from "@/components/ListaProductos.vue";
import ProductosVenta from "@/components/ProductosVentas.vue";
import InicioAdmin from "@/components/InicioAdmin.vue";
import MenuAdmin from "@/components/MenuAdmin.vue";
import ListaClientes from "@/components/ListaClientes.vue";
import ConfirmacionVerificacion from "@/components/ConfirmacionVerificacion.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/productos",
    name: "productos",
    component: ProductosTienda,
  },
  {
    path: "/confirmacion-verificacion",
    name: "ConfirmacionVerificacion",
    component: ConfirmacionVerificacion,
    props: (route) => ({ token: route.query.token }),
  },
  {
    path: "/listaclientes",
    name: "ListaClientes",
    component: ListaClientes,
  },
  {
    path: "/menuadmin",
    name: "menuadmin",
    component: MenuAdmin,
  },
  {
    path: "/productosventas",
    name: "productosventas",
    component: ProductosVenta,
  },
  {
    path: "/listaproductos",
    name: "listaproductos",
    component: ListaProductos,
  },
  {
    path: "/listaventas",
    name: "listaventas",
    component: ListaVentas,
  },
  {
    path: "/cargaproductos",
    name: "cargaproductos",
    component: CargaProductos,
  },
  {
    path: "/miscompras",
    name: "miscompras",
    component: MisCompras,
  },
  {
    path: "/home",
    name: "home",
    component: PaginaInicio,
  },
  {
    path: "/registro",
    name: "registro",
    component: RegistroUsuario,
  },
  {
    path: "/login",
    name: "login",
    component: InicioSesion,
  },
  {
    path: "/admin",
    name: "admin",
    component: InicioAdmin,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
