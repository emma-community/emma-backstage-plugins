import React, { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/frontend-plugin-api';
import {
  Select, MenuItem, IconButton, Tooltip, Table, TableBody, TableCell, TableHead, TableRow, Collapse
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
  const [filter, setFilter] = useState<EmmaComputeType | '*'>('*');
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

  const handleSave = async (entry: EmmaVm) => {
    if (editEntry?.id) {
      await emmaApi.updateComputeEntity(entry);

      setData((prevData) => prevData.map((item) => (item.id === entry.id ? entry : item)));
    } else {      
      require('console').log('Adding', entry);

      const entityId = 1000000000; // await emmaApi.addComputeEntity(entry);

      setData([...data, { ...entry, id: entityId }]);
    }

    handleCloseModal();
  };

  const handleDelete = async (id: number) => {    
    require('console').log('Deleting', data.find((item) => item.id === id));
    // await emmaApi.deleteComputeEntity(id, data.find((item) => item.id === id)!.type);

    setData(data.filter((item) => item.id !== id));
  };

  const toggleGroupCollapse = (providerName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [providerName]: !prev[providerName],
    }));
  };

  const filteredData = filter === '*' ? data : data.filter((item) => item.type === filter);

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
      {/* Main Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '40%' }}><strong>Label</strong></TableCell>
            <TableCell style={{ width: '20%' }}><strong>Provider</strong></TableCell>
            <TableCell style={{ width: '20%' }}>       
              <Tooltip title="Filter by type">
                {/* Filter */}
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as EmmaComputeType | '*')}
                  style={{ width: '200px' }}
                >
                  <MenuItem value="*">Entity Type</MenuItem>
                  <MenuItem value={EmmaComputeType.VirtualMachine}><strong>Virtual Machine</strong></MenuItem>
                  <MenuItem value={EmmaComputeType.SpotInstance}><strong>Spot Instance</strong></MenuItem>
                  <MenuItem value={EmmaComputeType.KubernetesNode}><strong>Kubernetes Node</strong></MenuItem>
                </Select>
              </Tooltip>
            </TableCell>
            <TableCell style={{ width: '20%' }}><strong>Actions</strong>
              {/* Add New Button */}
              <Tooltip title="Add new entity">
                <IconButton onClick={() => handleOpenModal()} style={{ color: 'gray' }}>
                  <AddIcon />
                </IconButton>
              </Tooltip></TableCell>
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
