import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Select, MenuItem, TextField, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { EmmaComputeType } from '@internal/backstage-plugin-emma-common'

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

export const ComputeConfigManagementGridComponent: React.FC = () => {
  const [data, setData] = useState<ComputeConfigEntry[]>(initialData);
  const [filter, setFilter] = useState<EmmaComputeType | 'All'>('All');
  const [newEntry, setNewEntry] = useState<Partial<ComputeConfigEntry>>({ name: '', type: EmmaComputeType.VirtualMachine });
  const [editMode, setEditMode] = useState<Partial<ComputeConfigEntry> | null>(null); // Allow null or valid entry

  const handleAddEntry = () => {
    if (newEntry.name) {
      setData([...data, { ...newEntry, id: data.length + 1 } as ComputeConfigEntry]);
      setNewEntry({ name: '', type: EmmaComputeType.VirtualMachine });
    }
  };

  const handleEditEntry = (id: number) => {
    if (editMode && editMode.name) {
      const updatedData = data.map(item => (item.id === id ? { ...item, ...editMode } : item));
      setData(updatedData);
      setEditMode(null);
    }
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
          <MenuItem value="VirtualMachine">Virtual Machine</MenuItem>
          <MenuItem value="SpotInstance">Spot Instance</MenuItem>
          <MenuItem value="KubernetesNode">Kubernetes Node</MenuItem>
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
                <IconButton onClick={handleAddEntry}>
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
              <TableCell>
                {editMode && editMode.id === row.id ? (
                  <TextField
                    value={editMode.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditMode({ ...editMode, name: e.target.value })}
                  />
                ) : (
                  row.name
                )}
              </TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>
                {editMode && editMode.id === row.id ? (
                  <Tooltip title="Save">
                    <IconButton onClick={() => handleEditEntry(row.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => setEditMode(row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteEntry(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}

          {/* New Entry Row */}
          <TableRow>
            <TableCell>New</TableCell>
            <TableCell>
              <TextField
                placeholder="New Compute Name"
                value={newEntry.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewEntry({ ...newEntry, name: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <Select
                value={newEntry.type}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => 
                  setNewEntry({ ...newEntry, type: e.target.value as EmmaComputeType })}
              >
                <MenuItem value="VirtualMachines">Virtual Machines</MenuItem>
                <MenuItem value="SpotInstances">Spot Instances</MenuItem>
                <MenuItem value="KubernetesNodes">Kubernetes Nodes</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <Tooltip title="Add">
                <IconButton onClick={handleAddEntry}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};