import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { EmmaComputeType, EmmaVmConfiguration } from '@emma-community/backstage-plugin-emma-common';
import { VmConfigurationRowComponent } from './VmConfigurationRowComponent';
import { VmConfigurationModalComponent } from './VmConfigurationModalComponent';

const initialData: EmmaVmConfiguration[] = [
  { id: 1, label: 'VM1', type: EmmaComputeType.VirtualMachine },
  { id: 2, label: 'SpotInstance1', type: EmmaComputeType.SpotInstance },
  { id: 3, label: 'K8Node1', type: EmmaComputeType.KubernetesNode }
];

export const VmConfigurationGridComponent: React.FC = () => {
  const [data, setData] = useState<EmmaVmConfiguration[]>(initialData);
  const [filter, setFilter] = useState<EmmaComputeType | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<Partial<EmmaVmConfiguration> | null>(null); // Entry for editing

  const handleOpenModal = (entry?: Partial<EmmaVmConfiguration>) => {
    setEditEntry(entry || { label: '', type: EmmaComputeType.VirtualMachine });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditEntry(null);
  };

  const handleSave = (entry: EmmaVmConfiguration) => {
    if (editEntry?.id) {
      // Update existing entry
      setData((prevData) => prevData.map((item) => (item.id === entry.id ? entry : item)));
    } else {
      // Add new entry
      setData([...data, { ...entry, id: data.length + 1 }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  const filteredData = filter === 'All' ? data : data.filter((item) => item.type === filter);

  return (
    <div>
      <h2>Compute Types Management</h2>
      {/* Filter */}
      <Select value={filter} onChange={(e) => setFilter(e.target.value as EmmaComputeType | 'All')}>
        <MenuItem value="All">All</MenuItem>
        <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
        <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
        <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
      </Select>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((entry) => (
            <VmConfigurationRowComponent
              key={entry.id}
              entry={entry}
              onEdit={() => handleOpenModal(entry)}
              onDelete={() => handleDelete(entry.id!)}
            />
          ))}
          <TableRow>
            <TableCell colSpan={4}>
              <Tooltip title="Add New">
                <IconButton onClick={() => handleOpenModal()}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Modal for Add/Edit */}
      <VmConfigurationModalComponent
        open={modalOpen}
        entry={editEntry}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
};
