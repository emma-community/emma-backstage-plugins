import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem } from '@material-ui/core';
import { EmmaComputeType, EmmaVmConfiguration } from '@emma-community/backstage-plugin-emma-common';

interface VmConfigModalProps {
  open: boolean;
  entry: Partial<EmmaVmConfiguration> | null;
  onClose: () => void;
  onSave: (entry: EmmaVmConfiguration) => void;
}

export const VmConfigurationModalComponent: React.FC<VmConfigModalProps> = ({ open, entry, onClose, onSave }) => {
  const [currentEntry, setCurrentEntry] = useState<Partial<EmmaVmConfiguration>>(entry || { label: '', type: EmmaComputeType.VirtualMachine });

  useEffect(() => {
    if (entry) {
      setCurrentEntry(entry);
    }
  }, [entry]);

  const handleSave = () => {
    if (currentEntry.label && currentEntry.type) {
      onSave(currentEntry as EmmaVmConfiguration);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{currentEntry?.id ? 'Edit Compute Entry' : 'Add New Compute Entry'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="dense"
          value={currentEntry.label}
          onChange={(e) => setCurrentEntry({ ...currentEntry, label: e.target.value })}
        />
        <Select
          fullWidth
          margin="dense"
          value={currentEntry.type}
          onChange={(e) => setCurrentEntry({ ...currentEntry, type: e.target.value as EmmaComputeType })}
        >
          <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
          <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
          <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          {currentEntry?.id ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
