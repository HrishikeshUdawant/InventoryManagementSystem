import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  InputAdornment,
  Snackbar,
  Alert,
  Stack,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

/* ================================================================
   SmartTable — reusable premium table component
   Props:
     storageKey  : localStorage key  (e.g. "productTable")
     title       : page title string
     icon        : emoji icon
     defaultCols : array of column name strings
     defaultRow  : object with default empty values
     kpiBuilder  : fn(rows) => array of { label, value, color }
     lowStockCol : optional column name to highlight low values
     accentColor : hex color for header/buttons
================================================================ */

const LOW_STOCK_LIMIT = 5;

export default function SmartTable({
  storageKey,
  title,
  icon,
  defaultCols,
  defaultRow,
  kpiBuilder,
  lowStockCol,
  columnOptions = {},
  accentColor = "#6366f1",
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const fileInputRef = useRef(null);

  /* ---- read / write helpers ---- */
  const readStorage = () => {
    const d = JSON.parse(localStorage.getItem(storageKey));
    return {
      columns: d?.columns || defaultCols,
      rows: d?.rows || [{ ...defaultRow }],
    };
  };

  const initial = readStorage();
  const [columns, setColumns] = useState(initial.columns);
  const [rows, setRows] = useState(initial.rows);

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });
  const [logs, setLogs] = useState([]);

  /* Add Row dialog */
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [newRow, setNewRow] = useState({ ...defaultRow });

  /* Add Column dialog */
  const [addColOpen, setAddColOpen] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColPosition, setNewColPosition] = useState("end");

  /* Delete confirm dialog */
  const [deleteIdx, setDeleteIdx] = useState(null);

  /* ---- auto save ---- */
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ columns, rows }));
  }, [columns, rows, storageKey]);

  /* ---- toast helper ---- */
  const notify = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const addLog = (msg) => {
    const t = new Date().toLocaleTimeString();
    setLogs((prev) => [{ t, msg }, ...prev.slice(0, 19)]);
  };

  /* ---- filtered rows ---- */
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  /* ---- add row ---- */
  const handleAddRow = () => {
    const emptyRow = {};
    columns.forEach((c) => (emptyRow[c] = newRow[c] ?? ""));
    setRows([emptyRow, ...rows]);
    setNewRow({ ...defaultRow });
    setAddRowOpen(false);
    addLog("➕ Row Added");
    notify("Row added successfully!");
  };

  /* ---- delete row ---- */
  const handleDeleteRow = () => {
    const globalIdx = rows.indexOf(filteredRows[deleteIdx]);
    setRows(rows.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
    addLog("🗑️ Row Deleted");
    notify("Row deleted.", "info");
  };

  /* ---- inline edit ---- */
  const handleCellEdit = (filteredRowIdx, col, value) => {
    const globalIdx = rows.indexOf(filteredRows[filteredRowIdx]);
    const updated = [...rows];
    updated[globalIdx] = { ...updated[globalIdx], [col]: value };
    setRows(updated);
  };

  /* ---- add column ---- */
  const handleAddCol = () => {
    if (!newColName.trim()) return;
    if (columns.includes(newColName.trim())) {
      notify("Column already exists!", "error");
      return;
    }
    const newCol = newColName.trim();
    let newCols = [...columns];
    if (newColPosition === "end") {
      newCols.push(newCol);
    } else {
      const idx = newCols.indexOf(newColPosition);
      if (idx !== -1) {
        newCols.splice(idx, 0, newCol);
      } else {
        newCols.push(newCol);
      }
    }

    setColumns(newCols);
    setRows(rows.map((r) => ({ ...r, [newCol]: "" })));
    addLog(`➕ Column Added: ${newCol}`);
    notify(`Column "${newCol}" added!`);
    setNewColName("");
    setNewColPosition("end");
    setAddColOpen(false);
  };

  /* ---- remove column ---- */
  const handleRemoveCol = (col) => {
    setColumns(columns.filter((c) => c !== col));
    setRows(rows.map((r) => { const x = { ...r }; delete x[col]; return x; }));
    addLog(`🗑️ Column Removed: ${col}`);
    notify(`Column "${col}" removed.`, "info");
  };

  /* ---- CSV export ---- */
  const exportCSV = () => {
    const header = columns.join(",");
    const body = rows
      .map((r) => columns.map((c) => `"${(r[c] || "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${storageKey}-export.csv`;
    a.click();
    addLog("📤 CSV Exported");
    notify("CSV exported!");
  };

  /* ---- CSV import ---- */
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").filter((l) => l.trim());
      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const newRows = lines.slice(1).map((line) => {
        const vals = line.split(",");
        const row = {};
        headers.forEach((h, i) => (row[h] = (vals[i] || "").trim().replace(/^"|"$/g, "")));
        return row;
      });
      setColumns(headers);
      setRows(newRows);
      addLog("📂 CSV Imported");
      notify(`Imported ${newRows.length} rows!`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  /* ---- reset ---- */
  const handleReset = () => {
    if (!window.confirm("Reset all data? This cannot be undone.")) return;
    setColumns(defaultCols);
    setRows([{ ...defaultRow }]);
    localStorage.removeItem(storageKey);
    addLog("🔄 Data Reset");
    notify("Table reset.", "warning");
  };

  /* ---- KPI stats ---- */
  const kpis = kpiBuilder ? kpiBuilder(rows) : [];

  /* ---- cell colour ---- */
  const getCellBg = (col, value) => {
    if (col !== lowStockCol) return "transparent";
    const n = Number(value);
    if (n === 0) return isDark ? "rgba(239,68,68,0.18)" : "#fff0f0";
    if (n < LOW_STOCK_LIMIT) return isDark ? "rgba(245,158,11,0.15)" : "#fffbeb";
    return "transparent";
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>

      {/* ---- Header ---- */}
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
            {icon} {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {rows.length} record{rows.length !== 1 ? "s" : ""} · Auto-saved to local storage
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            size="small"
            onClick={() => { setNewRow({ ...defaultRow }); setAddRowOpen(true); }}
            sx={{ background: accentColor, "&:hover": { background: accentColor, filter: "brightness(1.1)" }, borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            ➕ Add Row
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => { setNewColName(""); setNewColPosition("end"); setAddColOpen(true); }}
            sx={{ borderColor: accentColor, color: accentColor, borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            + Column
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={exportCSV}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            📤 Export
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => fileInputRef.current.click()}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            📂 Import
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleReset}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            🗑️ Reset
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" hidden onChange={handleCSVImport} />
        </Stack>
      </Box>

      {/* ---- KPI Chips ---- */}
      {kpis.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={1.5} mb={3}>
          {kpis.map((k) => (
            <Paper
              key={k.label}
              elevation={0}
              sx={{
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
                border: `1px solid ${k.color}30`,
                background: isDark ? `${k.color}18` : `${k.color}12`,
                minWidth: 130,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.8} fontSize={10}>
                {k.label}
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: k.color, lineHeight: 1.2, mt: 0.3 }}>
                {k.value}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      {/* ---- Search ---- */}
      <Box mb={2}>
        <TextField
          size="small"
          fullWidth
          placeholder={`Search ${title.toLowerCase()}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
            sx: { borderRadius: 3 },
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* ---- Table ---- */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.07)",
          boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.07)",
          mb: 3,
        }}
      >
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    background: isDark ? "#1a1a2e" : accentColor,
                    color: "#fff",
                    fontWeight: 700,
                    width: 48,
                    fontSize: 12,
                  }}
                >
                  #
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      background: isDark ? "#1a1a2e" : accentColor,
                      color: "#fff",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontSize: 12,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {col}
                      <Tooltip title={`Remove "${col}" column`}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveCol(col)}
                          sx={{ color: "rgba(255,255,255,0.6)", p: 0.3, "&:hover": { color: "#fff" } }}
                        >
                          <span style={{ fontSize: 11 }}>✕</span>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    background: isDark ? "#1a1a2e" : accentColor,
                    color: "#fff",
                    fontWeight: 700,
                    width: 80,
                    fontSize: 12,
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      {search ? `No results for "${search}"` : "No data yet. Click ➕ Add Row to get started."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, ri) => (
                  <TableRow
                    key={ri}
                    hover
                    sx={{
                      "&:nth-of-type(even)": {
                        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                      },
                      transition: "background 0.15s",
                    }}
                  >
                    <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>
                      {ri + 1}
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell
                        key={col}
                        sx={{
                          p: "4px 8px",
                          background: getCellBg(col, row[col]),
                        }}
                      >
                        {columnOptions && columnOptions[col] ? (
                          <Autocomplete
                            freeSolo
                            options={columnOptions[col]}
                            value={row[col] ?? ""}
                            onChange={(_, newValue) => handleCellEdit(ri, col, newValue || "")}
                            onInputChange={(_, newInputValue) => handleCellEdit(ri, col, newInputValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                InputProps={{ ...params.InputProps, disableUnderline: true, sx: { fontSize: 13 } }}
                                sx={{ minWidth: 100 }}
                              />
                            )}
                          />
                        ) : (
                          <TextField
                            variant="standard"
                            value={row[col] ?? ""}
                            onChange={(e) => handleCellEdit(ri, col, e.target.value)}
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                              sx: { fontSize: 13 },
                            }}
                            sx={{ minWidth: 80 }}
                          />
                        )}
                      </TableCell>
                    ))}
                    <TableCell sx={{ p: "4px 8px" }}>
                      <Tooltip title="Delete row">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteIdx(ri)}
                        >
                          🗑️
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* footer */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing {filteredRows.length} of {rows.length} rows
          </Typography>
          {lowStockCol && (
            <Box display="flex" gap={1} alignItems="center">
              <Chip size="small" label="Low stock" sx={{ background: "#fef3c7", color: "#92400e", fontSize: 10 }} />
              <Chip size="small" label="Out of stock" sx={{ background: "#fee2e2", color: "#991b1b", fontSize: 10 }} />
            </Box>
          )}
        </Box>
      </Paper>

      {/* ---- Audit Log ---- */}
      {logs.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={1}>
            📜 Session Audit Log
          </Typography>
          <Box mt={1} display="flex" flexWrap="wrap" gap={0.8}>
            {logs.map((l, i) => (
              <Chip
                key={i}
                size="small"
                label={`[${l.t}] ${l.msg}`}
                variant="outlined"
                sx={{ fontSize: 11 }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* ================================================================
          DIALOGS
      ================================================================ */}

      {/* Add Row Dialog */}
      <Dialog open={addRowOpen} onClose={() => setAddRowOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>➕ Add New {title.replace(" Table", "")}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            {columns.map((col) => (
              columnOptions && columnOptions[col] ? (
                <Autocomplete
                  key={col}
                  freeSolo
                  options={columnOptions[col]}
                  value={newRow[col] ?? ""}
                  onChange={(_, newValue) => setNewRow((p) => ({ ...p, [col]: newValue || "" }))}
                  onInputChange={(_, newInputValue) => setNewRow((p) => ({ ...p, [col]: newInputValue }))}
                  renderInput={(params) => (
                    <TextField {...params} label={col} size="small" fullWidth InputProps={{ ...params.InputProps, sx: { borderRadius: 2 } }} />
                  )}
                />
              ) : (
                <TextField
                  key={col}
                  label={col}
                  size="small"
                  fullWidth
                  value={newRow[col] ?? ""}
                  onChange={(e) => setNewRow((p) => ({ ...p, [col]: e.target.value }))}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              )
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddRowOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddRow}
            sx={{ background: accentColor, borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            Add Row
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Column Dialog */}
      <Dialog open={addColOpen} onClose={() => setAddColOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>+ Add New Column</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Column Name"
            fullWidth
            size="small"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCol()}
            sx={{ mt: 1 }}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <FormControl fullWidth size="small" sx={{ mt: 3 }}>
            <InputLabel>Insert Before...</InputLabel>
            <Select
              value={newColPosition}
              onChange={(e) => setNewColPosition(e.target.value)}
              label="Insert Before..."
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="end"><em>End of Table</em></MenuItem>
              {columns.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddColOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddCol}
            sx={{ background: accentColor, borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            Add Column
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteIdx !== null} onClose={() => setDeleteIdx(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>🗑️ Delete Row?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone. Are you sure?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteIdx(null)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteRow} sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          sx={{ borderRadius: 3 }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
