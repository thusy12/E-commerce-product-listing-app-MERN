import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import Loader from "../layouts/Loader"
import { MDBDataTable } from 'mdbreact';
import { deleteReview, getReviews } from './../../actions/productActions';
import { clearError, clearReviewDeleted } from "../../slices/productSlice";

export default function ReviewList(){
    const {reviews = [], loading = true, error, isReviewDeleted} = useSelector(state => state.productState);
    const [productId, setProductId] = useState("");

    const dispatch = useDispatch();
    const setReviews = () => {
        const data = {
            columns:[
                {
                    label: "ID",
                    field: "id",
                    sort: "asc",
                },
                {
                    label: "Rating",
                    field: "rating",
                    sort: "asc",
                },
                {
                    label: "User",
                    field: "user",
                    sort: "asc",
                },
                {
                    label: "Comment",
                    field: "comment",
                    sort: "asc",
                },
                {
                    label: "Actions",
                    field: "actions",
                    sort: "asc",
                },
            ],
            rows:[]
        }

        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                user: review.user.name,
                comment: review.comment,
                actions: (
                    <Fragment>
                        <Button onClick={e => deleteHandler(e, review._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            })
        })
        return data;
    }

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteReview(productId,id));
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getReviews(productId));
    }

    useEffect(() => {
        if (error) {
            toast(error, {
                position: "bottom-center",
                type: "error",
                onOpen: ()=>{
                    dispatch(clearError())
                }
            });
            return;
        }

        if(isReviewDeleted){
            toast("Review Deleted Successfully",{
                type:"success",
                position: "bottom-center",
                onOpen: () => {
                    dispatch(clearReviewDeleted());
                },
            })
            dispatch(getReviews(productId));
            return;
        }
    }, [dispatch, error, isReviewDeleted, productId]);
    
    return (
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <h1 className="my-4">Review List</h1>
          <div className="row justify-content-center mt-5">
            <div className="col-5">
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="productId_field">Product Id</label>
                        <input
                            type="text"
                            id="productId_field"
                            className="form-control"
                            value={productId}
                            onChange={e => setProductId(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="btn btn-primary btn-block py-2" disabled={loading}>Search</Button>
                </form>
            </div>
          </div>
          <Fragment>
            { loading ? <Loader/> : 
                <MDBDataTable
                    data={setReviews()}
                    className="px-3"
                    bordered
                    striped
                    hover
                />
            }
          </Fragment>
        </div>
      </div>
    );
}