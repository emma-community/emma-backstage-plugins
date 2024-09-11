import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, Slider } from '@material-ui/core';
import { EmmaComputeType, EmmaVm, EmmaCPUType, EmmaVolumeType } from '@emma-community/backstage-plugin-emma-common';

interface ComputeModalProps {
  open: boolean;
  entry: Partial<EmmaVm> | null;
  onClose: () => void;
  onSave: (entry: EmmaVm) => void;
}

export const ComputeModalComponent: React.FC<ComputeModalProps> = ({ open, entry, onClose, onSave }) => {
  const [currentEntry, setCurrentEntry] = useState<Partial<EmmaVm>>(entry || { label: '', type: EmmaComputeType.VirtualMachine, provider: 'AWS', vCpu: 4, vCpuType: EmmaCPUType.Shared, ramGb: 32, disks: [{ type: EmmaVolumeType.SSD, sizeGb: 100 }] });
  const [vCpuSliderValue, setVCpuSliderValue] = useState<number>(Math.log2(entry?.vCpu! || 4));
  const [ramSliderValue, setRamSliderValue] = useState<number>(Math.log2(entry?.ramGb! || 32));
  const [volumeSizeSliderValue, setVolumeSizeSliderValue] = useState<number>((() => {
    if (entry?.disks) {
      return entry.disks[0].sizeGb!;
    }

    return 200;
  }))

  useEffect(() => {
    if (entry) {
      setCurrentEntry(entry);
      setVCpuSliderValue(Math.log2(entry.vCpu! || 4));
      setRamSliderValue(Math.log2(entry.ramGb! || 32));
      setVolumeSizeSliderValue((() => {
        if (entry?.disks) {
          return entry.disks[0].sizeGb!;
        }
    
        return 200;
      }));
    }
  }, [entry]);

  const handleSave = () => {
    if (currentEntry.label && currentEntry.type) {
      onSave({ 
        ...currentEntry, 
        vCpu: Math.pow(2, vCpuSliderValue),
        ramGb: Math.pow(2, ramSliderValue),
        volumeGb: volumeSizeSliderValue 
      } as EmmaVm);
    }
  };

  const vCPUMarks = [
    { value: 0, label: '1' },     // log2(1) = 0
    { value: 1, label: '2' },     // log2(2) = 1
    { value: 2, label: '4' },     // log2(4) = 2
    { value: 3, label: '8' },     // log2(8) = 3
    { value: 4, label: '16' },    // log2(16) = 4
    { value: 5, label: '32' },    // log2(32) = 5
    { value: 6, label: '64' },    // log2(64) = 6
    { value: 7, label: '128' }    // log2(128) = 7
  ];

  const ramMarks = [
    { value: 5, label: '32' },    // log2(32) = 5
    { value: 6, label: '64' },    // log2(64) = 6
    { value: 7, label: '128' },   // log2(128) = 7
    { value: 8, label: '256' },   // log2(256) = 8    
    { value: 9, label: '512' },   // log2(128) = 9
    { value: 10, label: '1024' }, // log2(128) = 10
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{currentEntry?.id ? 'Edit compute entity' : 'Add compute entity'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Label"
          fullWidth
          margin="dense"
          value={currentEntry.label!}
          onChange={(e) => setCurrentEntry({ ...currentEntry, label: e.target.value })}
        />
        <div style={{ margin: '20px 0' }}>
          <div>Provider</div>  
          <Select
            fullWidth
            margin="dense"
            value={currentEntry.provider! ?? 'AWS'}
            onChange={(e) => setCurrentEntry({ ...currentEntry, provider: e.target.value as string })}
          >
            <MenuItem value="AWS">AWS</MenuItem>
            <MenuItem value="Azure">Azure</MenuItem>
            <MenuItem value="GCP">GCP</MenuItem>
          </Select>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div>Type</div>  
          <Select
            fullWidth
            margin="dense"
            value={currentEntry.type!}
            onChange={(e) => setCurrentEntry({ ...currentEntry, type: e.target.value as EmmaComputeType })}
          >
            <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
            <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
            <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
          </Select>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div>Location</div>  
          <Select
            fullWidth
            margin="dense"
            value={currentEntry.location! ?? 'TODO'}
            onChange={(e) => setCurrentEntry({ ...currentEntry, location: e.target.value as string })}
          >
            <MenuItem value="TODO">TODO: CALL API AND MAP LOCATIONS</MenuItem>
          </Select>
        </div>
           
        <div style={{ margin: '20px 0' }}>
          <div>Data Center</div>  
          <Select
            fullWidth
            margin="dense"
            value={currentEntry.dataCenter! ?? 'TODO'}
            onChange={(e) => setCurrentEntry({ ...currentEntry, dataCenter: e.target.value as string })}
          >
            <MenuItem value="TODO">TODO: CALL API AND MAP DATACENTERS</MenuItem>
          </Select>
        </div>
              
        <div style={{ margin: '20px 0' }}>
          <div>vCpuType</div>  
          <Select
            label="vCpuType"
            fullWidth
            margin="dense"
            value={currentEntry.vCpuType!}
            onChange={(e) => setCurrentEntry({ ...currentEntry, vCpuType: e.target.value as EmmaCPUType })}
          >
            <MenuItem value={EmmaCPUType.Shared}>Shared</MenuItem>
            <MenuItem value={EmmaCPUType.Standard}>Standard</MenuItem>
            <MenuItem value={EmmaCPUType.Hpc}>Hpc</MenuItem>
          </Select>
        </div>
   
        <div style={{ margin: '20px 0' }}>
          <label>vCpu: {Math.pow(2, vCpuSliderValue)}</label>
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

        <div style={{ margin: '20px 0' }}>
          <label>RAM (GB): {Math.pow(2, ramSliderValue)}</label>
          <Slider
            value={ramSliderValue}
            onChange={(_: any, newValue: number | number[]) => setRamSliderValue(newValue as number)}
            aria-labelledby="ram-size-slider"
            valueLabelDisplay="auto"
            step={1}
            marks={ramMarks}
            min={5}
            max={10}
          />
        </div>   

        <div style={{ margin: '20px 0' }}>
          <div>Volume Type</div>  
          <Select
            fullWidth
            margin="dense"
            value={currentEntry.disks ? currentEntry.disks[0].type! : EmmaVolumeType.SSD}
            onChange={(e) => {
              setCurrentEntry({ ...currentEntry, disks: [{ type: e.target.value as EmmaVolumeType, sizeGb: volumeSizeSliderValue }] });}
            }
          >
            <MenuItem value={EmmaVolumeType.SSD}>SSD</MenuItem>
            <MenuItem value={EmmaVolumeType.SSDPlus}>SSD-Plus</MenuItem>
          </Select>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>Volume (GB): {volumeSizeSliderValue}</label>
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

        {/* TODO: Add SSHKEY signature field to generate ssh key id via API call when creating new entities */}
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
