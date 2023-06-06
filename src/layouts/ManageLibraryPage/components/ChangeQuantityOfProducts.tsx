import React from "react";
import { useEffect, useState } from "react";
import ProductModel from '../../../models/ProductModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Pagination } from '../../Utils/Pagination';
import { ChangeQuantityOfProduct } from "./ChangeQuantityOfProduct";

export const ChangeQuantityOfProducts = () => {

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [productDelete, setProductDelete] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl: string = `http://localhost:8080/products?page=${currentPage - 1}&size=${productsPerPage}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.products;

            setTotalAmountOfProducts(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedProducts: ProductModel[] = [];

            for (const key in responseData) {
                loadedProducts.push({
                    product_id: responseData[key].product_id,
                    title: responseData[key].title,
                    artist: responseData[key].artist,
                    product_description: responseData[key].product_description,
                    quantities: responseData[key].quantities,
                    quantity_available: responseData[key].quantity_available,
                    category: responseData[key].category,
                    image: responseData[key].image,
                });
            }

            setProducts(loadedProducts);
            setIsLoading(false);
        };
        fetchProducts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, productDelete]);

    const indexOfLastProduct: number = currentPage * productsPerPage;
    const indexOfFirstProduct: number = indexOfLastProduct - productsPerPage;
    let lastItem = productsPerPage * currentPage <= totalAmountOfProducts ?
        productsPerPage * currentPage : totalAmountOfProducts;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteProduct = () => setProductDelete(!productDelete);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className='container mt-5'>
            {totalAmountOfProducts > 0 ?
                <>
                    <div className='mt-3'>
                        <h3>Number of results: ({totalAmountOfProducts})</h3>
                    </div>
                    <p>
                        {indexOfFirstProduct + 1} to {lastItem} of {totalAmountOfProducts} items: 
                    </p>
                    {products.map(product => (
                       <ChangeQuantityOfProduct product={product} key={product.product_id} deleteProduct={deleteProduct}/>
                    ))}
                </>
                :
                <h5>Add a Art Piece before changing quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}