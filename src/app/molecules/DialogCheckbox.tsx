import { Input } from "@/components/ui/input";

type DialogCheckboxProps = {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function DialogCheckbox({
  children,
  checked = false,
  onCheckedChange,
}: DialogCheckboxProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="appearance-none peer rounded-b-sm flex items-center justify-center cursor-pointer transition overflow-hidden border-2 border-solid border-orange-200
          hover:border-orange-200 
          checked:border-orange-200 checked:bg-orange-200
          group-hover:checked:border-orange-200 group-hover:checked:bg-orange-200 w-5 h-5
        "
      />
      <p
        className="cursor-pointer select-none font-semibold"
        onClick={() => onCheckedChange?.(!checked)}
      >
        {children}
      </p>
    </div>
  );
}
