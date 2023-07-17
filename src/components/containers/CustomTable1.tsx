import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AccountCircle, Send } from "@mui/icons-material";
import { data as initData } from "./makeData";

export type Employee = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  startDate: string;
  signatureCatchPhrase: string;
  avatar: string;
};

const Example = () => {
  const [data, setData] = useState(() => initData);

  const handleRemoveDiv = () => {
    let divElements = document.getElementsByClassName(
      "Mui-TableHeadCell-Content-Actions"
    );
    for (let i = 0; i < divElements.length; i++) {
      const divElement = divElements[i] as HTMLDivElement;
      divElement.remove();
    }
    divElements = document.getElementsByClassName(
      "Mui-TableHeadCell-Content-Actions"
    );
    for (let i = 0; i < divElements.length; i++) {
      const divElement = divElements[i] as HTMLDivElement;
      divElement.remove();
    }

    divElements = document.getElementsByClassName("MuiToolbar-root");
    for (let i = 0; i < divElements.length; i++) {
      const divElement = divElements[i] as HTMLDivElement;
      divElement.remove();
    }
  };

  useEffect(() => {
    handleRemoveDiv();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        id: "employee",
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            id: "name",
            header: "Name",
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  alt="avatar"
                  height={30}
                  src={row.original.avatar}
                  loading="lazy"
                  style={{ borderRadius: "50%" }}
                />
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "email", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            header: "Email",
            size: 300,
          },
        ],
      },
      {
        id: "id",

        columns: [
          {
            accessorKey: "salary",
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: "between",
            header: "Salary",
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue<number>() < 50_000
                      ? theme.palette.error.dark
                      : cell.getValue<number>() >= 50_000 &&
                        cell.getValue<number>() < 75_000
                      ? theme.palette.warning.dark
                      : theme.palette.success.dark,
                  borderRadius: "0.25rem",
                  color: "#fff",
                  maxWidth: "9ch",
                  p: "0.25rem",
                })}
              >
                {cell.getValue<number>()?.toLocaleString?.("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            ),
          },
          {
            accessorKey: "jobTitle",
            header: "Job Title",
            size: 350,
          },
          {
            accessorFn: (row) => new Date(row.startDate),
            id: "startDate",
            header: "Start Date",
            filterFn: "lessThanOrEqualTo",
            sortingFn: "datetime",
            Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
            Header: ({ column }) => <em>{column.columnDef.header}</em>,
            Filter: ({ column }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(newValue) => {
                    column.setFilterValue(newValue);
                  }}
                  slotProps={{
                    textField: {
                      helperText: "Filter Mode: Less Than",
                      sx: { minWidth: "120px" },
                      variant: "standard",
                    },
                  }}
                  value={column.getFilterValue()}
                />
              </LocalizationProvider>
            ),
          },
        ],
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      enableSubRowSelection
      initialState={{
        columnVisibility: {
          "mrt-row-expand": false,
        },
      }}
      enableExpandAll={false}
      positionActionsColumn="last"
      positionCheckboxColumn="last"
      enableExpanding={false}
      enableColumnFilterModes={false}
      enableColumnFilter={false}
      enableColumnVisibilityToggle={false}
      enableFullScreenToggle={false}
      autoResetPageIndex={false}
      enableRowOrdering
      enableSorting={false}
      muiTableBodyRowDragHandleProps={({ table }) => ({
        onDragEnd: () => {
          const { draggingRow, hoveredRow } = table.getState();
          if (hoveredRow && draggingRow) {
            data.splice(
              (hoveredRow as MRT_Row<Person>).index,
              0,
              data.splice(draggingRow.index, 1)[0]
            );
            setData([...data]);
          }
        },
      })}
      columns={columns}
      data={data}
      enableRowActions
      enableRowSelection
      positionToolbarAlertBanner="bottom"
      renderDetailPanel={({ row }) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <img
            alt="avatar"
            height={200}
            src={row.original.avatar}
            loading="lazy"
            style={{ borderRadius: "50%" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4">Signature Catch Phrase:</Typography>
            <Typography variant="h1">
              &quot;{row.original.signatureCatchPhrase}&quot;
            </Typography>
          </Box>
        </Box>
      )}
      renderRowActionMenuItems={({ closeMenu }) => [
        <MenuItem
          key={0}
          onClick={() => {
            // View profile logic...
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          View Profile
        </MenuItem>,
        <MenuItem
          key={1}
          onClick={() => {
            // Send email logic...
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          Send Email
        </MenuItem>,
      ]}
    />
  );
};

export default Example;
