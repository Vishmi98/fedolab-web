"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RiEdit2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { BiPlus, BiTrash } from "react-icons/bi";

import AddImagesModal from "./AddImagesModal";
import EditProjectModal from "./EditProjectModal";
import { ProjectDataType } from "../../projects.types";
import {
  deleteImage,
  getProjects,
  publishProject,
} from "../../projects.service";

import { TableProps } from "@/constants/types";
import CommonTable, { ColumnType } from "@/components/CommonTable";
import { ConfirmModal } from "@/components/ConfirmModal";


const ProjectsTable: React.FC<TableProps> = ({ reload }) => {
  const [projects, setProjects] = useState<ProjectDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [publishTarget, setPublishTarget] = useState<ProjectDataType | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDataType | null>(null);
  const [deleteImageTarget, setDeleteImageTarget] = useState<{ projectId: number; imagePath: string } | null>(null);
  const [selectedEditProject, setSelectedEditProject] =
    useState<ProjectDataType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = async (paramPage?: number) => {
    setIsLoading(true);

    try {
      const currentPage = paramPage ?? page;
      const response = await getProjects(currentPage, limit);

      if (response.success) {
        setProjects(response.projects);
        setTotalRows(response.totalProjects);
        setTotalPages(response.totalPages);
        setPage(currentPage);
      } else {
        setProjects([]);
      }
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [reload, page, limit]);

  const handlePublishToggle = (project: ProjectDataType) => {
    setPublishTarget(project);
    setIsPublishModalOpen(true);
  };

  const confirmPublishToggle = async () => {
    if (!publishTarget) return;

    try {
      const response = await publishProject(
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

  const handleDeleteImageConfirm = async () => {
    if (!deleteImageTarget) return;

    try {
      const formData = new FormData();
      formData.append("projectId", String(deleteImageTarget.projectId));
      formData.append("imagePath", deleteImageTarget.imagePath);

      const data = await deleteImage(formData);

      if (data.success) {
        toast.success(data.message);
        await fetchData(page);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Image Deletion Runtime Error:", err);
      toast.error("Pipeline failure while connecting to image disposal channel.");
    } finally {
      setDeleteImageTarget(null);
    }
  };

  const handleEditProject = (project: ProjectDataType) => {
    setSelectedEditProject(project);
    setIsEditModalOpen(true);
  };

  const columns: ColumnType<ProjectDataType>[] = [
    {
      header: "Thumbnail",
      accessor: "thumbnailImagePath",
      render: (project) => (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
          {project.thumbnailImagePath ? (
            <Image
              src={project.thumbnailImagePath}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
              No Image
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Title & Slug",
      accessor: "title",
      render: (project) => (
        <div className="max-w-[220px]">
          <p className="line-clamp-1 font-semibold text-gray-800 text-sm">
            {project.title}
          </p>
          <span className="text-xs text-gray-500 font-mono block truncate">
            /{project.slug}
          </span>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (project) => (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
          {project.category}
        </span>
      ),
    },
    {
      header: "Add Images",
      accessor: "imagePaths",
      render: (project) => {
        const isMaxImagesReached = (project.imagePaths?.length || 0) >= 3;
        return (
          <button
            disabled={isMaxImagesReached}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProject(project);
              setImageModalOpen(true);
            }}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border font-medium transition-colors ${isMaxImagesReached
              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
              }`}
            title={
              isMaxImagesReached
                ? "Maximum gallery images (3) reached"
                : "Add images to project"
            }
          >
            <BiPlus className="h-3.5 w-3.5 text-gray-500" />
            <span>Add ({project.imagePaths?.length || 0}/3)</span>
          </button>
        );
      },
    },
    {
      header: "Publish",
      accessor: "isPublish",
      render: (project) => (
        <label
          className="inline-flex items-center cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={project.isPublish}
            className="sr-only peer"
            onChange={() => handlePublishToggle(project)}
          />
          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500" />
        </label>
      ),
    },
    {
      header: "Edit",
      accessor: "id",
      render: (project) => (
        <button
          onClick={() => handleEditProject(project)}
          className="p-1.5 text-primary hover:text-primary/80 transition-colors rounded-md hover:bg-gray-100"
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
        data={projects}
        isLoading={isLoading}
        expandable
        page={page}
        limit={limit}
        totalRows={totalRows}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          fetchData(newPage);
        }}
        renderExpandedRow={(project) => (
          <div className="space-y-6">
            {/* Top Row: Cover Image & Description Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Cover Image & Short Description */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Cover Image
                  </h4>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {project.coverImagePath ? (
                      <Image
                        src={project.coverImagePath}
                        alt={`${project.title} Cover`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                        <span>No cover image uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Short Description
                  </h4>
                  <p className="text-xs text-gray-700 bg-white p-3 rounded-md border border-gray-200 leading-relaxed">
                    {project.shortDescription || "No short description available."}
                  </p>
                </div>
              </div>

              {/* Right Column: Full Description & Technologies */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Full Description
                  </h4>
                  <div className="text-xs text-gray-700 bg-white p-3 rounded-md border border-gray-200 max-h-48 overflow-y-auto leading-relaxed whitespace-pre-line">
                    {project.description || "No full description available."}
                  </div>
                </div>
                {project.client &&
                  (<div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Client
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs text-gray-400 italic">
                        {project.client}
                      </span>
                    </div>
                  </div>)
                }
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.length > 0 ? (
                      project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs rounded-md bg-white border border-gray-200 text-gray-800 font-medium shadow-2xs"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No technologies listed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Gallery Images Manager */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Project Gallery Images ({project.imagePaths?.length || 0}/3)
                </h4>
              </div>

              {project.imagePaths && project.imagePaths.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {project.imagePaths.map((image, index) => (
                    <div
                      key={index}
                      className="group relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-2xs"
                    >
                      <Image
                        src={image}
                        alt={`Gallery Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />

                      {/* Delete Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteImageTarget({
                              projectId: project.id,
                              imagePath: image,
                            })
                          }
                          className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                          title="Delete this image"
                        >
                          <BiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic bg-white p-3 rounded-md border border-gray-200">
                  No additional gallery images uploaded for this project yet.
                </div>
              )}
            </div>
          </div>
        )}
      />

      {imageModalOpen && selectedProject && (
        <AddImagesModal
          isOpen={imageModalOpen}
          onClose={() => {
            setImageModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          handleReload={fetchData}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteImageTarget}
        onClose={() => setDeleteImageTarget(null)}
        onConfirm={handleDeleteImageConfirm}
        message="Are you sure you want to delete this image?"
      />

      <ConfirmModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setPublishTarget(null);
        }}
        onConfirm={confirmPublishToggle}
        message={`Are you sure you want to ${publishTarget?.isPublish ? "unpublish" : "publish"
          } this project?`}
      />

      {selectedEditProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEditProject(null);
          }}
          reloadData={fetchData}
          initialValues={selectedEditProject}
        />
      )}
    </>
  );
};

export default ProjectsTable;