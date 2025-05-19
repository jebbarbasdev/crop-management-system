import { ChangeEvent } from "react";
import DaisySelect from "@/app/_components/DaisySelect";
import DaisyButton from "@/app/_components/DaisyButton";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { BranchSelectOption } from "../../../_services/getBranchesByStore";

interface TableHeaderProps {
    selectedBranches: BranchSelectOption[];
    selectedBranchToAdd: number | null;
    filteredBranches: BranchSelectOption[];
    onBranchAdd: () => void;
    onBranchRemove: (branchId: number) => void;
    onBranchSelect: (branchId: number | null) => void;
}

export const TableHeader = ({
    selectedBranches,
    selectedBranchToAdd,
    filteredBranches,
    onBranchAdd,
    onBranchRemove,
    onBranchSelect,
}: TableHeaderProps) => {
    const handleBranchSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onBranchSelect(value ? Number(value) : null);
    };

    return (
        <tr className="bg-primary text-primary-content text-xs">
            <th className="text-center">Producto</th>
            {selectedBranches.map((branch) => (
                <th key={branch.value} className="min-w-64">
                    <div className="flex items-center justify-center gap-2">
                        <span className="truncate">{branch.label}</span>
                        <DaisyButton
                            variant="error"
                            modifier="square"
                            size="xs"
                            onClick={() => onBranchRemove(branch.value)}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <IconTrash size={16} />
                        </DaisyButton>
                    </div>
                </th>
            ))}
            <th>
                <div className="flex items-center justify-center gap-2">
                    <DaisySelect
                        value={selectedBranchToAdd?.toString() ?? ""}
                        onChange={handleBranchSelect}
                        className="select-xs flex-1"
                        disabled={filteredBranches.length === 0}
                        options={[
                            { value: "", label: "Seleccionar..." },
                            ...filteredBranches.map(branch => ({
                                value: branch.value.toString(),
                                label: branch.label
                            }))
                        ]}
                    />
                    <DaisyButton
                        variant="secondary"
                        modifier="square"
                        size="xs"
                        onClick={onBranchAdd}
                        disabled={!selectedBranchToAdd}
                    >
                        <IconPlus size={16} />
                    </DaisyButton>
                </div>
            </th>
        </tr>
    );
}; 