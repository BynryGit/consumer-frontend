import React, { createContext, useContext, useState } from "react";

const SharedContext = createContext(null);

export const SharedProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState({});
  const setValue = (key, value) => {
    setSharedState((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <SharedContext.Provider value={{ sharedState, setValue }}>
      {children}
    </SharedContext.Provider>
  );
};

export const useShared = () => {
  const context = useContext(SharedContext);
  if (!context) throw new Error("useShared must be used within a SharedProvider");
  return context;
};
