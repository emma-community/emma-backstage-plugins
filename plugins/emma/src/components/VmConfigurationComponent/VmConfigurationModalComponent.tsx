import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, Slider } from '@material-ui/core';
import { EmmaComputeType, EmmaVmConfiguration, EmmaCPUType, EmmaVolumeType } from '@emma-community/backstage-plugin-emma-common';

interface VmConfigModalProps {
  open: boolean;
  entry: Partial<EmmaVmConfiguration> | null;
  onClose: () => void;
  onSave: (entry: EmmaVmConfiguration) => void;
}

export const VmConfigurationModalComponent: React.FC<VmConfigModalProps> = ({ open, entry, onClose, onSave }) => {
  const [currentEntry, setCurrentEntry] = useState<Partial<EmmaVmConfiguration>>(entry || { label: '', type: EmmaComputeType.VirtualMachine, providerName: 'AWS', vCpu: 2, vCpuType: EmmaCPUType.Shared, volumeGb: 200, volumeType: EmmaVolumeType.SSD });
  const [vCpuSliderValue, setVCpuSliderValue] = useState<number>(Math.log2(entry?.vCpu || 4)); // Set default vCPU to 4, using log base 2 of the value for slider
  const [volumeSizeSliderValue, setVolumeSizeSliderValue] = useState<number>(entry?.volumeGb || 50);

  useEffect(() => {
    if (entry) {
      setCurrentEntry(entry);
      setVCpuSliderValue(Math.log2(entry.vCpu || 4)); // Convert the entry's vCPU to log2 for the slider
      setVolumeSizeSliderValue(entry.volumeGb || 200);
    }
  }, [entry]);

  const handleSave = () => {
    if (currentEntry.label && currentEntry.type) {
      onSave({ ...currentEntry, vCpu: Math.pow(2, vCpuSliderValue), volumeGb: volumeSizeSliderValue } as EmmaVmConfiguration);
    }
  };

  const vCPUMarks = [
    { value: 0, label: '1' },   // log2(1) = 0
    { value: 1, label: '2' },   // log2(2) = 1
    { value: 2, label: '4' },   // log2(4) = 2
    { value: 3, label: '8' },   // log2(8) = 3
    { value: 4, label: '16' },  // log2(16) = 4
    { value: 5, label: '32' },  // log2(32) = 5
    { value: 6, label: '64' },   // log2(64) = 6
    { value: 7, label: '128' }   // log2(64) = 7
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{currentEntry?.id ? 'Edit VMConfiguration' : 'Add VMConfiguration'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Label"
          fullWidth
          margin="dense"
          value={currentEntry.label}
          onChange={(e) => setCurrentEntry({ ...currentEntry, label: e.target.value })}
        />
        <Select
          label="Provider"
          fullWidth
          margin="dense"
          value={currentEntry.providerName}
          onChange={(e) => setCurrentEntry({ ...currentEntry, providerName: e.target.value as string })}
        >
          <MenuItem value="AWS">AWS</MenuItem>
          <MenuItem value="Azure">Azure</MenuItem>
          <MenuItem value="GCP">GCP</MenuItem>
        </Select>        
        <Select
          label="Type"
          fullWidth
          margin="dense"
          value={currentEntry.type}
          onChange={(e) => setCurrentEntry({ ...currentEntry, type: e.target.value as EmmaComputeType })}
        >
          <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
          <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
          <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
        </Select>
              
        <Select
          label="vCpuType"
          fullWidth
          margin="dense"
          value={currentEntry.vCpuType}
          onChange={(e) => setCurrentEntry({ ...currentEntry, vCpuType: e.target.value as EmmaCPUType })}
        >
          <MenuItem value={EmmaCPUType.Shared}>Shared</MenuItem>
          <MenuItem value={EmmaCPUType.Standard}>Standard</MenuItem>
          <MenuItem value={EmmaCPUType.HCP}>HCP</MenuItem>
        </Select>

        <div style={{ margin: '20px 0' }}>
          <label>vCpu: {Math.pow(2, vCpuSliderValue)}</label> {/* Convert slider value back to binary */}
          <Slider
            value={vCpuSliderValue}
            onChange={(_: any, newValue: number | number[]) => setVCpuSliderValue(newValue as number)}
            aria-labelledby="v-cpu-slider"
            valueLabelDisplay="auto"
            step={1}
            marks={vCPUMarks}
            min={0}
            max={7}
          />
        </div>    
              
        <Select
          label="Volume Type"
          fullWidth
          margin="dense"
          value={currentEntry.volumeType}
          onChange={(e) => setCurrentEntry({ ...currentEntry, volumeType: e.target.value as EmmaVolumeType })}
        >
          <MenuItem value={EmmaVolumeType.SSD}>SSD</MenuItem>
          <MenuItem value={EmmaVolumeType.SSDPlus}>SSDPlus</MenuItem>
        </Select>

        <div style={{ margin: '20px 0' }}>
          <label>Volume Size (GB): {volumeSizeSliderValue}</label>
          <Slider
            value={volumeSizeSliderValue}
            onChange={(_: any, newValue: number | number[]) => setVolumeSizeSliderValue(newValue as number)}
            aria-labelledby="volume-size-slider"
            valueLabelDisplay="auto"
            step={25}
            marks
            min={50}
            max={1000}
          />
        </div>
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
