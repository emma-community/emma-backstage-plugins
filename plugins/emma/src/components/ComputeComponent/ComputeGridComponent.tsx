import React, { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/frontend-plugin-api';
import { ResponseError } from '@backstage/errors';
import {
  Select, MenuItem, IconButton, Tooltip, Table, TableBody, TableCell, TableHead, TableRow, Collapse, Modal, Box, Typography, Button
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { EmmaComputeType, EmmaVm, EmmaCPUType, EmmaNetworkType, EmmaVolumeType, EmmaSshKeyType } from '@emma-community/backstage-plugin-emma-common';
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
  const [newPrivateKey, setNewPrivateKey] = useState<string | null>(null);
  const [privateKeyModalOpen, setPrivateKeyModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useAsync(async (): Promise<void> => {
    const vms = (await emmaApi.getComputeEntities());
    setData(vms);
  }, [setData]);

  const handleOpenModal = (entry?: Partial<EmmaVm>) => {
    setEditEntry(entry || { label: '', type: EmmaComputeType.VirtualMachine, provider: { id: 10, name: 'Amazon EC2' }, vCpu: 2, vCpuType: EmmaCPUType.Shared, ramGb: 1, disks: [{ type: EmmaVolumeType.SSD, sizeGb: 16 }], location: { id: 3, name: 'Stockholm' }, dataCenter: { id: 'aws-eu-north-1', name: 'aws-eu-north-1', location: { latitude: 0, longitude: 0 } }, status: 'BUSY', cost: { currency: 'EUR', amount: 0.0 }, cloudNetworkType: EmmaNetworkType.Default, });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewPrivateKey("");
    setEditEntry(null);
  };

  const handleSave = async (entry: EmmaVm) => {
    if (entry?.id) {
      await emmaApi.updateComputeEntity(entry);
      setData((prevData) => prevData.map((item) => (item.id === entry.id ? entry : item)));
    } else {      
      const keys = await emmaApi.getSshKeys();

      if(keys.length > 0) {
        entry.sshKeyId = keys.find(value => value.name === entry.name)?.id ?? keys[0].id;
      } else {
        const key = await emmaApi.addSshKey(entry.name ?? entry.type, EmmaSshKeyType.Rsa);
        entry.sshKeyId = key.id;

        setNewPrivateKey(key.key!);
        setPrivateKeyModalOpen(true);
      }

      try {
        const entityId = await emmaApi.addComputeEntity(entry);
        setData([...data, { ...entry, id: entityId }]);        
      } catch (error) {
        const message = ((error as ResponseError).body.error?.body as any).message || 'An error occurred';

        setErrorMessage(message);
        setErrorModalOpen(true);
      }
    }

    handleCloseModal();
  };

  const handleDelete = async (entry: EmmaVm) => {
    await emmaApi.deleteComputeEntity(entry.type === EmmaComputeType.KubernetesNode ? parseInt(entry.label!, 10) : entry.id!, entry.type);

    setData(data.filter((item) => item.id !== entry.id!));
  };

  const toggleGroupCollapse = (providerName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [providerName]: !prev[providerName],
    }));
  };

  const filteredData = filter === '*' ? data : data.filter((item) => item.type === filter);

  const groupedData = filteredData.reduce((acc, entry) => {
    const provider = entry.provider?.name || 'Amazon EC2';
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
            <TableCell style={{ width: '20%' }}><strong>Label</strong></TableCell>
            <TableCell style={{ width: '20%' }}><strong>Provider</strong></TableCell>
            <TableCell style={{ width: '20%' }}><strong>Status</strong></TableCell>
            <TableCell style={{ width: '20%' }}>       
              <Tooltip title="Filter by type">
                {/* Filter */}
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as EmmaComputeType | '*')}
                  style={{ width: '200px' }}
                >
                  <MenuItem value="*">Compute Type</MenuItem>
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
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>         
          {Object.keys(groupedData).sort((a, b) => a.localeCompare(b)).map((providerName) => (
            <React.Fragment key={providerName}>
              {/* Provider Group Header */}
              <TableRow>
                <TableCell colSpan={5}>
                  <IconButton onClick={() => toggleGroupCollapse(providerName)}>
                    {collapsedGroups[providerName] ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </IconButton>
                  <strong>{providerName}</strong>
                </TableCell>
              </TableRow>

              {/* Collapsible Entries */}
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                  <Collapse in={!collapsedGroups[providerName]} timeout="auto" unmountOnExit>
                    <Table>
                      <TableBody>
                        {groupedData[providerName].map((entry) => (
                          <ComputeRowComponent
                            key={entry.id}
                            entry={entry}
                            onEdit={() => handleOpenModal(entry)}
                            onDelete={() => handleDelete(entry)}
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

      {/* Modal for Private SSH Key */}
      <Modal
        open={privateKeyModalOpen}
        onClose={() => setPrivateKeyModalOpen(false)}
      >
        <Box style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '24px',
        }}>
          <Typography variant="h6" component="h2">
            SSH Private Key
          </Typography>
          <Typography style={{ marginTop: '16px', wordWrap: 'break-word' }}>
            {newPrivateKey}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
            onClick={() => setPrivateKeyModalOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Modal for Error Message */}
      <Modal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
      >
        <Box style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '24px',
        }}>
          <Typography variant="h6" component="h2">
            Error
          </Typography>
          <Typography style={{ marginTop: '16px', wordWrap: 'break-word' }}>
            {errorMessage}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
            onClick={() => setErrorModalOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
