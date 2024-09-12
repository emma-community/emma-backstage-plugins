import React, { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/frontend-plugin-api';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Select, MenuItem, IconButton, Tooltip, Collapse
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { EmmaComputeType, EmmaVm, EmmaCPUType, EmmaVolumeType } from '@emma-community/backstage-plugin-emma-common';
import { ComputeRowComponent } from './ComputeRowComponent';
import { ComputeModalComponent } from './ComputeModalComponent';
import { emmaApiRef } from '../../plugin';

export const ComputeGridComponent = () => {  
  const emmaApi = useApi(emmaApiRef);
  const [data, setData] = useState<EmmaVm[]>([]);
  const [filter, setFilter] = useState<EmmaComputeType | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<Partial<EmmaVm> | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({});
  
  useAsync(async (): Promise<void> => {
    const vms = await emmaApi.getComputeEntities();

    setData(vms);
  }, [setData]);

  const handleOpenModal = (entry?: Partial<EmmaVm>) => {
    setEditEntry(entry || { label: '', type: EmmaComputeType.VirtualMachine, provider: { id: 75, name: 'Amazon EC2' }, vCpu: 4, vCpuType: EmmaCPUType.Shared, ramGb: 32, disks: [{ type: EmmaVolumeType.SSD, sizeGb: 100 }], location: { id: 6, name: 'London' }, dataCenter: { id: 'aws-eu-north-1', name: 'aws-eu-north-1', location: { latitude: 0, longitude: 0 }, region_code: 'unknown' } });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditEntry(null);
  };

  const handleSave = (entry: EmmaVm) => {
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
    const provider = entry.provider?.name || 'Unknown';
    if (!acc[provider]) {
      acc[provider] = [];
    }
    acc[provider].push(entry);
    return acc;
  }, {} as { [key: string]: EmmaVm[] });

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
                          <ComputeRowComponent
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
      <ComputeModalComponent
        open={modalOpen}
        entry={editEntry}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
};
