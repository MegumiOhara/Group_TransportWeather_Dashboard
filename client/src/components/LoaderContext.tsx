import { createContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface GlobalLoadingContextType {
   isLoading: boolean;
   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalLoadingContext = createContext<
   GlobalLoadingContextType | undefined
>(undefined);

interface GlobalLoadingProviderProps {
   children: ReactNode; // ReactNode type is used for the children prop
}

// A provider component that supplies the global loading state to its children
export const GlobalLoadingProvider: React.FC<GlobalLoadingProviderProps> = ({
   children,
}) => {
   const [isLoading, setIsLoading] = useState<boolean>(false);

   return (
      <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
         {children}
      </GlobalLoadingContext.Provider>
   );
};
