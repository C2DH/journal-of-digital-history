import React, { useContext } from "react";
import { useCurrentWindowDimensions } from "./graphics";


const WindowSizeContext = React.createContext();


const WithWindowSize = ({ children }) => {

  const size = useCurrentWindowDimensions();

  return (
    <WindowSizeContext.Provider value={size}>
      {children}
    </WindowSizeContext.Provider>
  )
}


const useWindowSize = () => {

  const context = useContext(WindowSizeContext);

  if (context === undefined) {
    throw new Error('useWindowSize must be used within a WithWindowSize component');
  }

  return context;
}


export {
  WithWindowSize,
  useWindowSize
}