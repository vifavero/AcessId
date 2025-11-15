import { useState, type ReactNode } from "react";

import { createContext } from "react";

export const FormContext = createContext({
  nameKids: "",
  nameParents: "",
  description: "",
  setFormData: (data: any) => {},
});

interface Props {
  children: ReactNode;
}

export function FormProvider({ children }: Props) {
  const [formData, setFormData] = useState({
    nameKids: "",
    nameParents: "",
    description: "",
  });

  return (
    <FormContext.Provider value={{ ...formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
}
