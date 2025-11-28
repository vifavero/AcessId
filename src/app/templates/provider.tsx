import { useState } from "react";

import { createContext } from "react";

interface FormData {
  nameKids: string;
  nameParents: string;
  description: string;
}

interface Props {
  children: React.ReactNode;
}

interface FormContextType extends FormData {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const FormContext = createContext<FormContextType>({
  nameKids: "",
  nameParents: "",
  description: "",
  setFormData: () => {},
});

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
