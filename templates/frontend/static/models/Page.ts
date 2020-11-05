export interface Page<T> {
    content: T[];
    pageNumber: number;
    numberOfElements: number;
    size: number;
    totalPages: number;
    totalElements: number;
}
