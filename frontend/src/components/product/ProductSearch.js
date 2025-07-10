import { Fragment } from "react/jsx-runtime";
import Metadata from "../layouts/MetaData";
import { useEffect, useState } from "react";
import { getProducts } from './../../actions/productsActions';
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/Loader";
import Product from "./Product";
import {toast} from "react-toastify";
import Pagination from "react-js-pagination";
import { useParams } from 'react-router-dom';

export default function ProductSearch(){
    const dispatch = useDispatch();
    const {products, loading, error, productsCount, resPerPage} = useSelector((state)=> state.productsState)
    const [currentPage, setCurrentPage] = useState(1);
    const {keyword} = useParams();

    const setCurrentPageNo = (pageNo) => {
      setCurrentPage(pageNo)
    }

    useEffect(()=>{
        if (error) {
          return toast.error(error, {
            position: "bottom-center",
          })
        }
        dispatch(getProducts(keyword, currentPage))
    },[error, dispatch, currentPage, keyword])

    return (
      <Fragment>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <Metadata title={"Buy best products"} />
            <h1 id="products_heading">Search Products</h1>

            <section id="products" className="container mt-5">
              <div className="row">
                {products &&
                  products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
              </div>
            </section>
            {productsCount > 0 && productsCount > resPerPage ? (
              <div className="d-flex justify-content-center mt-5">
                <Pagination
                  activePage={currentPage}
                  onChange={setCurrentPageNo}
                  totalItemsCount={productsCount}
                  itemsCountPerPage={resPerPage}
                  firstPageText={"First"}
                  lastPageText={"Last"}
                  itemClass={"page-item"}
                  linkClass={"page-link"}
                />
              </div>
            ) : null}
          </Fragment>
        )}
      </Fragment>
    );
}