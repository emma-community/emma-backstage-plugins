import React, { useState, useEffect } from 'react';
import { useApi } from '@backstage/frontend-plugin-api';
import { emmaApiRef } from '../../plugin';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, Slider, CircularProgress } from '@material-ui/core';
import { EmmaComputeType, EmmaVm, EmmaCPUType, EmmaVolumeType, EmmaLocation, EmmaDataCenter, EmmaProvider } from '@emma-community/backstage-plugin-emma-common';

interface ComputeModalProps {
  open: boolean;
  entry: Partial<EmmaVm> | null;
  onClose: () => void;
  onSave: (entry: EmmaVm) => void;
}

export const ComputeModalComponent = ({ open, entry, onClose, onSave }: ComputeModalProps) => {
  const emmaApi = useApi(emmaApiRef);
  const [locations, setLocations] = useState<EmmaLocation[]>([]);
  const [dataCenters, setDataCenters] = useState<EmmaDataCenter[]>([]);
  const [providers, setProviders] = useState<EmmaProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Partial<EmmaVm>>(entry || {
    label: '',
    type: EmmaComputeType.VirtualMachine,
    provider: { id: 75, name: 'Amazon EC2' },
    vCpu: 4,
    vCpuType: EmmaCPUType.Shared,
    ramGb: 32,
    disks: [{ type: EmmaVolumeType.SSD, sizeGb: 100 }],
    location: { id: 6, name: 'London' },
    dataCenter: { id: 'aws-eu-north-1', name: 'aws-eu-north-1', location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }
  });

  const [vCpuSliderValue, setVCpuSliderValue] = useState<number>(Math.log2(entry?.vCpu! || 4));
  const [ramSliderValue, setRamSliderValue] = useState<number>(Math.log2(entry?.ramGb! || 32));
  const [volumeSizeSliderValue, setVolumeSizeSliderValue] = useState<number>((entry?.disks && entry.disks[0].sizeGb) ? entry.disks[0].sizeGb : 200);

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
    { value: 9, label: '512' },   // log2(512) = 9
    { value: 10, label: '1024' }, // log2(1024) = 10
  ];

  // Fetch data dynamically from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);  // Start loading state

      try {
        const [locationsData, providersData, dataCentersData] = await Promise.all([
          emmaApi.getLocations(),
          emmaApi.getProviders(),
          emmaApi.getDataCenters(),
        ]);

        setLocations(locationsData);
        setProviders(providersData);
        setDataCenters(dataCentersData);
        setError(null);  // Clear any previous errors
      } catch (e) {
        setError('Failed to load data from the API');
      } finally {
        setLoading(false);  // End loading state
      }
    };

    fetchData();
  }, [emmaApi]);

  useEffect(() => {
    if (entry) {
      setCurrentEntry(entry);
      setVCpuSliderValue(Math.log2(entry.vCpu! || 4));
      setRamSliderValue(Math.log2(entry.ramGb! || 32));
      setVolumeSizeSliderValue((entry?.disks && entry.disks[0].sizeGb) ? entry.disks[0].sizeGb : 200);
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

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <CircularProgress /> {/* Show spinner while loading */}
          <p>Loading data...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <p>{error}</p> {/* Display error if loading fails */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{currentEntry?.id ? 'Edit compute entity' : 'Add compute entity'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Label"
          fullWidth
          margin="dense"
          value={currentEntry.label || ''}
          onChange={(e) => setCurrentEntry({ ...currentEntry, label: e.target.value })}
        />

        {/* Dropdown for Compute Type */}
        <div style={{ margin: '20px 0' }}>
          <div>Type</div>
          <Select
            fullWidth
            value={currentEntry.type || EmmaComputeType.VirtualMachine}
            onChange={(e) => setCurrentEntry({ ...currentEntry, type: e.target.value as EmmaComputeType })}
          >
            <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
            <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
            <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
          </Select>
        </div>

        {/* Dropdown for Providers */}
        <div style={{ margin: '20px 0' }}>
          <div>Provider</div>
          <Select
            fullWidth
            value={currentEntry.provider!.id || 75}
            onChange={(e) => setCurrentEntry({ ...currentEntry, provider: { id: e.target.value as number, name: currentEntry.provider?.name } })}
          >
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>{provider.name}</MenuItem>
            ))}
          </Select>
        </div>

        {/* Dropdown for Data Centers */}
        <div style={{ margin: '20px 0' }}>
          <div>Data Center</div>
          <Select
            fullWidth
            value={currentEntry.dataCenter?.id || 'aws-eu-north-1'}
            onChange={(e) => setCurrentEntry({ ...currentEntry, dataCenter: { id: e.target.value as string, name: currentEntry.dataCenter?.name, location: { longitude: 0, latitude: 0 }, region_code: currentEntry.location?.region! } })}
          >
            {dataCenters.map((dc) => (
              <MenuItem key={dc.id} value={dc.id}>{dc.name}</MenuItem>
            ))}
          </Select>
        </div>

        {/* Dropdown for Locations */}
        <div style={{ margin: '20px 0' }}>
          <div>Location</div>
          <Select
            fullWidth
            value={currentEntry.location?.id || 6}
            onChange={(e) => setCurrentEntry({ ...currentEntry, location: { id: e.target.value as number, name: currentEntry.location?.name } })}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </Select>
        </div>

        {/* vCPU and RAM Sliders */}
        <div style={{ margin: '20px 0' }}>
          <label>vCpu: {Math.pow(2, vCpuSliderValue)}</label>
          <Slider
            value={vCpuSliderValue || 4}
            onChange={(_, newValue) => setVCpuSliderValue(newValue as number)}
            step={1}
            marks={vCPUMarks}
            min={0}
            max={7}
          />
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>RAM (GB): {Math.pow(2, ramSliderValue)}</label>
          <Slider
            value={ramSliderValue || 32}
            onChange={(_, newValue) => setRamSliderValue(newValue as number)}
            step={1}
            marks={ramMarks}
            min={5}
            max={10}
          />
        </div>

        {/* Volume Type and Size */}
        <div style={{ margin: '20px 0' }}>
          <div>Volume Type</div>
          <Select
            fullWidth
            value={currentEntry.disks ? currentEntry.disks[0].type : EmmaVolumeType.SSD}
            onChange={(e) => setCurrentEntry({ ...currentEntry, disks: [{ type: e.target.value as EmmaVolumeType, sizeGb: volumeSizeSliderValue }] })}
          >
            <MenuItem value={EmmaVolumeType.SSD}>SSD</MenuItem>
            <MenuItem value={EmmaVolumeType.SSDPlus}>SSD-Plus</MenuItem>
          </Select>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>Volume (GB): {volumeSizeSliderValue}</label>
          <Slider
            value={volumeSizeSliderValue || 200}
            onChange={(_, newValue) => setVolumeSizeSliderValue(newValue as number)}
            step={25}
            min={50}
            max={1000}
          />
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">{currentEntry?.id ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};
