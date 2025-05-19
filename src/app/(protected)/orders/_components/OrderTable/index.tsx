import { OrderTableProps } from './types/order.types';
import { useOrderTable } from './hooks/useOrderTable';
import { useTableNavigation } from './hooks/useTableNavigation';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import { BranchSelectOption } from '../../_services/getBranchesByStore';

interface Product {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
}

interface OrderDetail {
    productId: number;
    branchId: number;
    unitId: number;
    quantity: number;
}

const OrderTable = ({ storeId, onOrderDetailsChange }: OrderTableProps) => {
    const {
        products,
        orderDetails,
        selectedBranches,
        selectedBranchToAdd,
        filteredBranches,
        defaultUnitId,
        isLoading,
        handleInputChange,
        handleUnitChange,
        handleAddBranch,
        handleRemoveBranch,
        setSelectedBranchToAdd,
    } = useOrderTable({ storeId, onOrderDetailsChange });

    const { tableRef, handleInputKeyDown, handleSelectKeyDown } = useTableNavigation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-base-300">
            <table ref={tableRef} className="table table-xs table-zebra table-pin-rows text-center whitespace-nowrap w-full">
                <thead className="bg-primary text-primary-content">
                    <TableHeader
                        selectedBranches={selectedBranches}
                        selectedBranchToAdd={selectedBranchToAdd}
                        filteredBranches={filteredBranches}
                        onBranchAdd={handleAddBranch}
                        onBranchRemove={handleRemoveBranch}
                        onBranchSelect={setSelectedBranchToAdd}
                    />
                </thead>
                <tbody>
                    {products.map((product) => (
                        <TableRow
                            key={product.id}
                            product={product}
                            selectedBranches={selectedBranches}
                            defaultUnitId={defaultUnitId}
                            orderDetails={orderDetails}
                            onInputChange={handleInputChange}
                            onUnitChange={handleUnitChange}
                            onInputKeyDown={handleInputKeyDown}
                            onSelectKeyDown={handleSelectKeyDown}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable; 