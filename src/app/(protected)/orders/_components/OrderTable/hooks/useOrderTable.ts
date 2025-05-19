import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStoreProducts, StoreProduct } from '../../../_services/getStoreProducts';
import { getBranchesForSelect, BranchSelectOption } from '../../../_services/getBranchesByStore';
import { OrderDetail, OrderTableProps } from '../types/order.types';

export const useOrderTable = ({ storeId, onOrderDetailsChange }: OrderTableProps) => {
    // Queries
    const { data: products = [], isLoading: isLoadingProducts } = useQuery({
        queryKey: ["storeProducts", storeId],
        queryFn: () => getStoreProducts(storeId),
    });

    const { data: availableBranches = [], isLoading: isLoadingBranches } = useQuery({
        queryKey: ["branches", storeId],
        queryFn: () => getBranchesForSelect(storeId),
    });

    // State
    const [orderDetails, setOrderDetails] = useState<OrderDetail>({});
    const [selectedBranches, setSelectedBranches] = useState<BranchSelectOption[]>([]);
    const [selectedBranchToAdd, setSelectedBranchToAdd] = useState<number | null>(null);

    // Computed values
    const defaultUnitId = products[0]?.available_storage_units.find(u => u.name.toLowerCase().includes("caja"))?.id || 
                         products[0]?.available_storage_units[0]?.id || 0;
    const filteredBranches = availableBranches.filter(
        branch => !selectedBranches.some(b => b.value === branch.value)
    );

    // Effects
    useEffect(() => {
        setOrderDetails({});
        setSelectedBranches([]);
        setSelectedBranchToAdd(null);
    }, [storeId]);

    useEffect(() => {
        onOrderDetailsChange?.(orderDetails);
    }, [orderDetails, onOrderDetailsChange]);

    // Handlers
    const handleInputChange = (productId: number, branchId: number, value: string) => {
        setOrderDetails((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [branchId]: {
                    quantity: value === '' ? '' : Number(value),
                    unitId: prev[productId]?.[branchId]?.unitId ?? defaultUnitId,
                },
            },
        }));
    };

    const handleUnitChange = (productId: number, branchId: number, unitId: number) => {
        setOrderDetails((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [branchId]: {
                    quantity: prev[productId]?.[branchId]?.quantity ?? '',
                    unitId,
                },
            },
        }));
    };

    const handleAddBranch = () => {
        if (selectedBranchToAdd) {
            const branchToAdd = availableBranches.find(branch => branch.value === selectedBranchToAdd);
            if (branchToAdd) {
                setSelectedBranches(prev => [...prev, branchToAdd]);
                setSelectedBranchToAdd(null);
            }
        }
    };

    const handleRemoveBranch = (branchId: number) => {
        setSelectedBranches(prev => prev.filter(b => b.value !== branchId));
        setOrderDetails(prev => {
            const newDetails = { ...prev };
            Object.keys(newDetails).forEach(productId => {
                if (newDetails[Number(productId)][branchId]) {
                    delete newDetails[Number(productId)][branchId];
                    if (Object.keys(newDetails[Number(productId)]).length === 0) {
                        delete newDetails[Number(productId)];
                    }
                }
            });
            return newDetails;
        });
    };

    return {
        // Data
        products,
        availableBranches,
        orderDetails,
        selectedBranches,
        selectedBranchToAdd,
        defaultUnitId,
        filteredBranches,
        
        // Loading states
        isLoading: isLoadingProducts || isLoadingBranches,
        
        // Handlers
        handleInputChange,
        handleUnitChange,
        handleAddBranch,
        handleRemoveBranch,
        setSelectedBranchToAdd,
    };
}; 