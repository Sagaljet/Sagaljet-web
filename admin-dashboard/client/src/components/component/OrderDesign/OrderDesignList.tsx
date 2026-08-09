// src/components/OrderDesign/OrderDesignList.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/redux/store";
import { getPostTypesFn } from "@/redux/slices/orderDesign/getPostTypes";
import { getAllOrderDesignsFn } from "@/redux/slices/orderDesign/getAllOrderDesigns";
import { deleteOrderDesignFn, resetDeleteOrderDesign } from "@/redux/slices/orderDesign/deleteOrderDesign";
import type { OrderDesign, PostType } from "@/redux/types/orderDesign";

const OrderDesignList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { data, isLoading, pagination } = useSelector(
    (state: RootState) => state.getAllOrderDesigns
  );
  const { isSuccess: deleteSuccess, message: deleteMessage } = useSelector(
    (state: RootState) => state.deleteOrderDesign
  );
  const { data: postTypes } = useSelector(
    (state: RootState) => state.getPostTypes
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [postTypeFilter, setPostTypeFilter] = useState("");

  useEffect(() => {
    dispatch(getPostTypesFn());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getAllOrderDesignsFn({
        page,
        limit: 10,
        search,
        postType: postTypeFilter,
      })
    );
  }, [dispatch, page, search, postTypeFilter]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success(deleteMessage);
      dispatch(getAllOrderDesignsFn({ page, limit: 10, search, postType: postTypeFilter }));
      dispatch(resetDeleteOrderDesign());
    }
  }, [deleteSuccess, deleteMessage, dispatch, page, search, postTypeFilter]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this order design?")) {
      dispatch(deleteOrderDesignFn(id));
    }
  };

  const formatPostType = (type: PostType) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Designs</h1>
        <Link
          to="/order-designs/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded flex-1"
        />
        <select
          value={postTypeFilter}
          onChange={(e) => setPostTypeFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Post Types</option>
          {postTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Post Type</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: OrderDesign) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{item.id}</td>
                <td className="px-4 py-3">
                  {item.images ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                <td className="px-4 py-3">{item.size || "-"}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {formatPostType(item.postType)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/order-designs/edit/${item.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDesignList;