"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RiEdit2Fill } from "react-icons/ri";
import { toast } from "react-toastify";

import EditBlogModal from "./EditBlogModal";
import { getBlogs, publishBlog } from "../../blogs.service";
import { BlogDataType } from "../../blogs.types";

import { TableProps } from "@/constants/types";
import CommonTable, { ColumnType } from "@/components/CommonTable";
import { ConfirmModal } from "@/components/ConfirmModal";


const BlogsTable: React.FC<TableProps> = ({ reload }) => {
  const [blogs, setBlogs] = useState<BlogDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [publishTarget, setPublishTarget] = useState<BlogDataType | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [selectedEditBlog, setSelectedEditBlog] =
    useState<BlogDataType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = async (paramPage?: number) => {
    setIsLoading(true);

    try {
      const currentPage = paramPage ?? page;

      const response = await getBlogs(currentPage, limit);

      if (response.success) {
        setBlogs(response.blogs);
        setTotalRows(response.totalBlogs);
        setTotalPages(response.totalPages);
        setPage(currentPage);
      } else {
        setBlogs([]);
      }
    } catch {
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [reload, page, limit]);

  const handlePublishToggle = (blog: BlogDataType) => {
    setPublishTarget(blog);
    setIsPublishModalOpen(true);
  };

  const handleEditBlog = (blog: BlogDataType) => {
    setSelectedEditBlog(blog);
    setIsEditModalOpen(true);
  };

  const confirmPublishToggle = async () => {
    if (!publishTarget) return;

    try {
      const response = await publishBlog(
        publishTarget.id,
        !publishTarget.isPublish
      );

      if (response.success) {
        toast.success(response.message);
        fetchData(page);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating publish status");
    } finally {
      setPublishTarget(null);
      setIsPublishModalOpen(false);
    }
  };

  const columns: ColumnType<BlogDataType>[] = [
    {
      header: "Title",
      accessor: "title",
      render: (blog) => (
        <div className="max-w-[260px]">
          <p className="line-clamp-2 font-medium">{blog.title}</p>
        </div>
      ),
    },
    {
      header: "Author",
      accessor: "author",
      render: (blog) => (
        <div className="max-w-[260px]">
          <p className="line-clamp-2 font-medium">{blog.author}</p>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Publish",
      accessor: "",
      render: (blog) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={blog.isPublish}
            className="sr-only peer"
            onChange={() => handlePublishToggle(blog)}
          />

          <div className="relative w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
        </label>
      ),
    },
    {
      header: "Edit",
      accessor: "",
      render: (blog) => (
        <button
          onClick={() => handleEditBlog(blog)}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <RiEdit2Fill className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <>
      <CommonTable
        columns={columns}
        data={blogs}
        isLoading={isLoading}
        expandable
        page={page}
        limit={limit}
        totalRows={totalRows}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          fetchData(newPage);
        }}
        renderExpandedRow={(blog) => (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">
                Description
              </h3>

              {blog.paragraph1 && (
                <p className="text-sm mb-2">
                  {blog.paragraph1}
                </p>
              )}

              {blog.paragraph2 && (
                <p className="text-sm mb-2">
                  {blog.paragraph2}
                </p>
              )}

              {blog.paragraph3 && (
                <p className="text-sm">
                  {blog.paragraph3}
                </p>
              )}
            </div>

            <div className="space-y-5">
              {blog.coverImagePath && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Cover Image
                  </h3>

                  <Image
                    src={blog.coverImagePath}
                    alt={blog.title}
                    width={350}
                    height={180}
                    className="rounded-lg border object-cover"
                  />
                </div>
              )}

              {blog.url && (
                <div>
                  <span className="font-semibold">URL:</span>{" "}
                  <span
                    className="text-blue-600 underline break-all"
                  >
                    {blog.url}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      />

      <ConfirmModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setPublishTarget(null);
        }}
        onConfirm={confirmPublishToggle}
        message={`Are you sure you want to ${publishTarget?.isPublish ? "unpublish" : "publish"
          } this blog?`}
      />

      {selectedEditBlog && (
        <EditBlogModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEditBlog(null);
          }}
          reloadData={fetchData}
          initialValues={selectedEditBlog}
        />
      )}
    </>
  );
};

export default BlogsTable;