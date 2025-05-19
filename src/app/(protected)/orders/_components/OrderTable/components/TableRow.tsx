import { ChangeEvent, KeyboardEvent } from "react";
import DaisySelect from "@/app/_components/DaisySelect";
import { BranchSelectOption } from "../../../_services/getBranchesByStore";
import { StoreProduct } from "../../../_services/getStoreProducts";

interface OrderDetail {
    [productId: number]: {
        [branchId: number]: {
            quantity: number | '';
            unitId: number;
        };
    };
}

interface TableRowProps {
    product: StoreProduct;
    selectedBranches: BranchSelectOption[];
    defaultUnitId: number;
    orderDetails: OrderDetail;
    onInputChange: (productId: number, branchId: number, value: string) => void;
    onUnitChange: (productId: number, branchId: number, unitId: number) => void;
    onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    onSelectKeyDown: (e: KeyboardEvent<HTMLSelectElement>) => void;
}

export const TableRow = ({
    product,
    selectedBranches,
    defaultUnitId,
    orderDetails,
    onInputChange,
    onUnitChange,
    onInputKeyDown,
    onSelectKeyDown,
}: TableRowProps) => {
    // Filtrar las unidades disponibles para este producto
    const availableUnits = product.available_storage_units;
    const defaultUnit = availableUnits.find(u => u.id === defaultUnitId) || availableUnits[0];

    return (
        <tr>
            <td className="text-center">{product.name}</td>
            
            {selectedBranches.map((branch) => {
                const detail = orderDetails[product.id]?.[branch.value];
                const quantity = detail?.quantity ?? '';
                const unitId = detail?.unitId ?? (defaultUnit?.id || 0);

                return (
                    <td key={branch.value}>
                        <div className="flex gap-2 items-center justify-center">
                            <input
                                type="number"
                                className="input input-xs input-bordered w-20"
                                value={quantity}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    onInputChange(product.id, branch.value, e.target.value)
                                }
                                onKeyDown={onInputKeyDown}
                            />
                            <DaisySelect
                                value={unitId}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    onUnitChange(product.id, branch.value, Number(e.target.value))
                                }
                                onKeyDown={onSelectKeyDown}
                                options={availableUnits.map((unit) => ({
                                    value: unit.id,
                                    label: `${unit.name}`,
                                }))}
                                className="select select-xs select-bordered w-40"
                            />
                        </div>
                    </td>
                );
            })}

            <td></td>
        </tr>
    );
}; 