import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Select, MenuItem, TextField, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { EmmaComputeType } from '@emma-community/backstage-plugin-emma-common'

interface ComputeConfigEntry {
  id: number;
  name: string;
  type: EmmaComputeType;
}

// Initial data for the table
const initialData: ComputeConfigEntry[] = [
  { id: 1, name: 'VM1', type: EmmaComputeType.VirtualMachine },
  { id: 2, name: 'SpotInstance1', type: EmmaComputeType.SpotInstance },
  { id: 3, name: 'K8Node1', type: EmmaComputeType.KubernetesNode }
];

export const VmConfigurationManagementComponent: React.FC = () => {
  const [data, setData] = useState<ComputeConfigEntry[]>(initialData);
  const [filter, setFilter] = useState<EmmaComputeType | 'All'>('All');
  const [editMode, setEditMode] = useState<Partial<ComputeConfigEntry> | null>(null); // Store entry being edited or null
  const [open, setOpen] = useState(false); // Control modal visibility
  const [newEntry, setNewEntry] = useState<Partial<ComputeConfigEntry>>({ name: '', type: EmmaComputeType.VirtualMachine }); // Used for both adding and editing

  const handleOpen = (entry?: Partial<ComputeConfigEntry>) => {
    if (entry) {
      setNewEntry(entry);
    } else {
      setNewEntry({ name: '', type: EmmaComputeType.VirtualMachine });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(null);
  };

  const handleAddEditEntry = () => {
    if (editMode) {
      // Edit existing entry
      setData((prevData) =>
        prevData.map((item) => (item.id === editMode.id ? { ...item, ...newEntry } : item))
      );
    } else {
      // Add new entry
      setData([...data, { ...newEntry, id: data.length + 1 } as ComputeConfigEntry]);
    }
    handleClose();
  };

  const handleDeleteEntry = (id: number) => {
    setData(data.filter(item => item.id !== id));
  };

  const filteredData = filter === 'All' ? data : data.filter(item => item.type === filter);

  return (
    <div>
      <h2>Compute Types Management</h2>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as EmmaComputeType | 'All')}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
          <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
          <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>
              Actions
              <Tooltip title="Add New">
                <IconButton onClick={() => handleOpen()}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => { setEditMode(row); handleOpen(row); }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDeleteEntry(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Adding/Editing Entry */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Compute Entry' : 'Add New Compute Entry'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={newEntry.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewEntry({ ...newEntry, name: e.target.value })}
          />
          <Select
            fullWidth
            margin="dense"
            value={newEntry.type}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => 
              setNewEntry({ ...newEntry, type: e.target.value as EmmaComputeType })}
          >
            <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
            <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
            <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddEditEntry} color="primary">
            {editMode ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
