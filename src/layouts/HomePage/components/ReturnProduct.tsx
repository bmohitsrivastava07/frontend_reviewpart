import React from 'react'
import { Link } from 'react-router-dom';
import ProductModel from '../../../models/ProductModel';

export const ReturnProduct: React.FC<{product: ProductModel}> = (props) => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                {props.product.image ? 
                    <img
                        src={props.product.image}
                        width='151'
                        height='233'
                        alt="art"
                    />
                    :
                    <img
                        src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                        width='151'
                        height='233'
                        alt="art"
                    />
                }
                <h6 className='mt-2'>{props.product.title}</h6>
                <p>{props.product.artist}</p>
                <Link className='btn main-color text-white' to={`checkout/${props.product.product_id}`}>Reserve</Link>
            </div>
        </div>
    );
}