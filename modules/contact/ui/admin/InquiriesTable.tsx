"use client";

import React, { useEffect, useState } from "react";

import { ContactUsDataType } from "../../contact.types";
import { getLeads } from "../../contact.service";

import { TableProps } from "@/constants/types";
import CommonTable, { ColumnType } from "@/components/CommonTable";


const InquiriesTable: React.FC<TableProps> = ({ reload }) => {
  const [inquiries, setInquiries] = useState<ContactUsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (paramPage?: number) => {
    setIsLoading(true);

    try {
      const currentPage = paramPage ?? page;

      const response = await getLeads(currentPage, limit);

      if (response.success) {
        setInquiries(response.leads);
        setTotalRows(response.totalLeads);
        setTotalPages(response.totalPages);
        setPage(currentPage);
      } else {
        setInquiries([]);
      }
    } catch {
      setInquiries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [reload, page, limit]);

  const columns: ColumnType<ContactUsDataType>[] = [
    {
      header: "#ID",
      accessor: "id",
      render: (row) => (
        <span className="font-semibold text-gray-700">#{row.id}</span>
      ),
    },
    {
      header: "Name",
      accessor: "firstName",
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="line-clamp-1 font-medium text-gray-900">
            {row.name}
          </p>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      render: (row) => (
        <a
          href={`mailto:${row.email}`}
          className="text-blue-600 hover:underline"
        >
          {row.email}
        </a>
      ),
    },
    {
      header: "Phone Number",
      accessor: "phoneNo",
      render: (row) => (
        <a
          href={`tel:${row.phoneNo}`}
          className="text-gray-700 hover:text-black"
        >
          {row.phoneNo}
        </a>
      ),
    },
    {
      header: "Message",
      accessor: "message",
      render: (row) => (
        <div className="max-w-[300px]">
          <p className="line-clamp-2 text-sm text-gray-600" title={row.message}>
            {row.message}
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <CommonTable
        columns={columns}
        data={inquiries}
        isLoading={isLoading}
        expandable={true}
        page={page}
        limit={limit}
        totalRows={totalRows}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          fetchData(newPage);
        }}
        renderExpandedRow={(lead) => (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="font-semibold mb-3">
                Message
              </h3>
              <p className="text-sm mb-2">
                {lead.message}
              </p>
            </div>
          </div>
        )}
      />
    </>
  );
};

export default InquiriesTable;