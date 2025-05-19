export type OrderDetail = {
    [productId: number]: {
        [branchId: number]: {
            quantity: number | '';
            unitId: number;
        };
    };
};

export type OrderTableProps = {
    storeId: number;
    onOrderDetailsChange?: (details: OrderDetail) => void;
}; 