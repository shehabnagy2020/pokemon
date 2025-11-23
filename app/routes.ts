import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/pokemon/:pokemonId", "routes/pokemon/info.tsx"),
] satisfies RouteConfig;
