import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Select, MenuItem, IconButton, Tooltip, Collapse
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { EmmaComputeType, EmmaVmConfiguration, EmmaCPUType, EmmaVolumeType } from '@emma-community/backstage-plugin-emma-common';
import { VmConfigurationRowComponent } from './VmConfigurationRowComponent';
import { VmConfigurationModalComponent } from './VmConfigurationModalComponent';

const initialData: EmmaVmConfiguration[] = [
  { id: 1, label: 'VM1', type: EmmaComputeType.VirtualMachine, providerName: 'AWS', vCpuType: EmmaCPUType.Shared, vCpu: 32,volumeType: EmmaVolumeType.SSD, volumeGb: 100 },
  { id: 2, label: 'SpotInstance1', type: EmmaComputeType.SpotInstance, providerName: 'AWS', vCpuType: EmmaCPUType.Shared, vCpu: 16,volumeType: EmmaVolumeType.SSD, volumeGb: 200 },
  { id: 3, label: 'K8Node1', type: EmmaComputeType.KubernetesNode, providerName: 'Azure', vCpuType: EmmaCPUType.Standard, vCpu: 64,volumeType: EmmaVolumeType.SSDPlus, volumeGb: 700 },
  { id: 4, label: 'VM2', type: EmmaComputeType.VirtualMachine, providerName: 'GCP', vCpuType: EmmaCPUType.HCP, vCpu: 128,volumeType: EmmaVolumeType.SSDPlus, volumeGb: 500 },
  { id: 5, label: 'K8Node2', type: EmmaComputeType.KubernetesNode, providerName: 'Azure', vCpuType: EmmaCPUType.Standard, vCpu: 32,volumeType: EmmaVolumeType.SSD, volumeGb: 350 },
];

export const VmConfigurationGridComponent: React.FC = () => {
  const [data, setData] = useState<EmmaVmConfiguration[]>(initialData);
  const [filter, setFilter] = useState<EmmaComputeType | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<Partial<EmmaVmConfiguration> | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({});

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
      setData((prevData) => prevData.map((item) => (item.id === entry.id ? entry : item)));
    } else {
      setData([...data, { ...entry, id: data.length + 1 }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  const toggleGroupCollapse = (providerName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [providerName]: !prev[providerName],
    }));
  };

  const filteredData = filter === 'All' ? data : data.filter((item) => item.type === filter);

  const groupedData = filteredData.reduce((acc, entry) => {
    const provider = entry.providerName || 'Unknown';
    if (!acc[provider]) {
      acc[provider] = [];
    }
    acc[provider].push(entry);
    return acc;
  }, {} as { [key: string]: EmmaVmConfiguration[] });

  return (
    <div>
      {/* Filter */}
      <Select value={filter} onChange={(e) => setFilter(e.target.value as EmmaComputeType | 'All')} style={{ width: '250px' }}>
        <MenuItem value="All">All</MenuItem>
        <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
        <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
        <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
      </Select>

      {/* Main Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '40%' }}><strong>Label</strong></TableCell>
            <TableCell style={{ width: '20%' }}><strong>Provider</strong></TableCell>
            <TableCell style={{ width: '20%' }}><strong>Type</strong></TableCell>
            <TableCell style={{ width: '20%' }}><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(groupedData).map((providerName) => (
            <React.Fragment key={providerName}>
              {/* Provider Group Header */}
              <TableRow>
                <TableCell colSpan={4}>
                  <IconButton onClick={() => toggleGroupCollapse(providerName)}>
                    {collapsedGroups[providerName] ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </IconButton>
                  <strong>{providerName}</strong>
                </TableCell>
              </TableRow>

              {/* Collapsible Entries */}
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                  <Collapse in={!collapsedGroups[providerName]} timeout="auto" unmountOnExit>
                    <Table>
                      <TableBody>
                        {groupedData[providerName].map((entry) => (
                          <VmConfigurationRowComponent
                            key={entry.id}
                            entry={entry}
                            onEdit={() => handleOpenModal(entry)}
                            onDelete={() => handleDelete(entry.id!)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}

          {/* Add New Button */}
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
