import { getSuperpowersHooks } from "./superpowers/index";
import { loadCatalogHooks } from "./catalog/index";

export const getHooks = async (ctx: any) => {
  const superpowersHooks = await getSuperpowersHooks(ctx);
  const catalogHooks = await loadCatalogHooks(ctx);
  
  return {
    superpowersHooks,
    catalogHooks
  };
};
