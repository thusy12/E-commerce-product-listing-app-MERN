import { Fragment } from "react/jsx-runtime";
import Metadata from "./layouts/MetaData";
import { useEffect } from "react";
import { getProducts } from "../actions/productsActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./layouts/Loader";
import Product from "./product/Product";
import {toast} from "react-toastify";

export default function Home(){
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state)=> state.productsState)

    useEffect(()=>{
        if (error) {
          return toast.error(error, {
            position: "bottom-center",
          })
        }
        dispatch(getProducts)
    },[error])

    return (
      <Fragment>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <Metadata title={"Buy best products"} />
            <h1 id="products_heading">Latest Products</h1>

            <section id="products" className="container mt-5">
              <div className="row">
                {products &&
                  products.map((product) => <Product product={product} />)}
              </div>
            </section>
          </Fragment>
        )}
      </Fragment>
    );
}