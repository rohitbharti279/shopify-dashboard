import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(null);
  return (
    <ShopContext.Provider value={{ shop, setShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
