/**
 * Merges multiple hook objects. Overlapping hooks with the same key 
 * (specifically 'experimental.chat.system.transform') are chained sequentially.
 */
export const mergePluginHooks = (hooksList: any[]) => {
  const merged: any = {};
  for (const hooks of hooksList) {
    if (!hooks) continue;
    for (const [key, value] of Object.entries(hooks)) {
      if (key === 'experimental.chat.system.transform' && merged[key]) {
        const existingHook = merged[key];
        const newHook = value as Function;
        merged[key] = async (input: any, output: any) => {
          await existingHook(input, output);
          await newHook(input, output);
        };
      } else {
        merged[key] = value;
      }
    }
  }
  return merged;
};
