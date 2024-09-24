import React, { useState, useEffect } from 'react';
import { useApi } from '@backstage/frontend-plugin-api';
import { emmaApiRef } from '../../plugin';
import { Dialog, DialogActions, DialogContent, Button, TextField, Select, MenuItem, Slider, CircularProgress } from '@material-ui/core';
import { EmmaComputeType, EmmaVm, EmmaCPUType, EmmaVolumeType, EmmaLocation, EmmaDataCenter, EmmaVmOs, EmmaProvider, EmmaNetworkType } from '@emma-community/backstage-plugin-emma-common';

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
  const [operatingSystems, setOperatingSystems] = useState<EmmaVmOs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Partial<EmmaVm>>(entry || {
    label: '',
    type: EmmaComputeType.VirtualMachine,
    provider: { id: 10, name: 'Amazon EC2' },
    vCpu: 2,
    vCpuType: EmmaCPUType.Shared,
    ramGb: 1,
    disks: [{ type: EmmaVolumeType.SSD, sizeGb: 16 }],
    location: { id: 3, name: 'Stockholm' },
    dataCenter: { id: 'aws-eu-north-1', name: 'aws-eu-north-1', location: { latitude: 0, longitude: 0 } },
    status: 'BUSY',
    cost: { currency: 'EUR', price: 0.0 },
    cloudNetworkType: EmmaNetworkType.Default,
    os: { id: 5 },
  });

  const [vCpuSliderValue, setVCpuSliderValue] = useState<number>(Math.log2(entry?.vCpu! || 2));
  const [ramSliderValue, setRamSliderValue] = useState<number>(Math.log2(entry?.ramGb! || 1));
  const [volumeSizeSliderValue, setVolumeSizeSliderValue] = useState<number>((entry?.disks && entry.disks[0].sizeGb) ? entry.disks[0].sizeGb : 16);

  const vCPUMarks = [
    { value: 0, label: '1' },
    { value: 1, label: '2' },
    { value: 2, label: '4' },
    { value: 3, label: '8' },
    { value: 4, label: '16' },
    { value: 5, label: '32' },
    { value: 6, label: '64' },
    { value: 7, label: '128' },
  ];

  const ramMarks = [
    { value: 0, label: '1' },
    { value: 1, label: '2' },
    { value: 2, label: '4' },
    { value: 3, label: '8' },
    { value: 4, label: '16' },
    { value: 5, label: '32' },
    { value: 6, label: '64' },
    { value: 7, label: '128' },
    { value: 8, label: '256' },
    { value: 9, label: '512' },
    { value: 10, label: '1024' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [locationsData, providersData, dataCentersData, operatingSystemsData] = await Promise.all([
          emmaApi.getLocations(),
          emmaApi.getProviders(),
          emmaApi.getDataCenters(),
          emmaApi.getOperatingSystems(),
        ]);

        setLocations(locationsData);
        setProviders(providersData);
        setDataCenters(dataCentersData);
        setOperatingSystems(operatingSystemsData.sort((a, b) => a.type!.localeCompare(b.type!)).sort((a, b) => a.version!.localeCompare(b.version!)));
        setError(null);
      } catch (e) {
        setError('Failed to load data from the API');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [emmaApi]);

  useEffect(() => {
    if (entry) {
      setCurrentEntry(entry);
      setVCpuSliderValue(Math.log2(entry.vCpu! || 2));
      setRamSliderValue(Math.log2(entry.ramGb! || (entry.type === EmmaComputeType.KubernetesNode) ? 2 : 1));
      setVolumeSizeSliderValue((entry?.disks && entry.disks[0].sizeGb) ? entry.disks[0].sizeGb : 16);
    }
  }, [entry]);

  const handleSave = () => {
    if (!currentEntry.label || !currentEntry.provider || !currentEntry.location || !currentEntry.dataCenter) {
      setError('Please fill in all required fields.');
      return;
    }

    onSave({
      ...currentEntry,
      vCpu: Math.pow(2, vCpuSliderValue),
      ramGb: Math.pow(2, ramSliderValue),
      volumeGb: volumeSizeSliderValue,
    } as EmmaVm);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  }

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <CircularProgress />
          <p>Loading data...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <p>{error}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>        
        <div style={{ margin: '20px 0' }}>
          <div>Label</div>
          <TextField
            label="Label"
            fullWidth
            margin="dense"
            value={currentEntry.label || ''}
            onChange={(e) => setCurrentEntry({ ...currentEntry, label: e.target.value })}
          />
        </div>

        <div style={{ margin: '20px 0' }}>
          <div>Type</div>
          <Select
            fullWidth
            value={currentEntry.type || EmmaComputeType.VirtualMachine}
            onChange={(e) => {
              if (currentEntry.id === undefined) {
                if((e.target.value as EmmaComputeType) === EmmaComputeType.KubernetesNode) {
                  setRamSliderValue(2);
                  setCurrentEntry(prev => ({ ...prev, type: (e.target.value as EmmaComputeType), ramGb: 4 }));
                } else {
                  setRamSliderValue(1);
                  setCurrentEntry(prev => ({ ...prev, type: (e.target.value as EmmaComputeType), ramGb: 2 }));
                }
              }
            }}
          >
            <MenuItem value={EmmaComputeType.VirtualMachine}>Virtual Machine</MenuItem>
            <MenuItem value={EmmaComputeType.SpotInstance}>Spot Instance</MenuItem>
            <MenuItem value={EmmaComputeType.KubernetesNode}>Kubernetes Node</MenuItem>
          </Select>
        </div>

        {currentEntry.type === EmmaComputeType.SpotInstance && (          
          <div style={{ margin: '20px 0' }}>
            <div>Price ({currentEntry.cost?.currency || "EUR"})</div>
            <TextField
              label="Price"
              fullWidth
              margin="dense"
              type="number"
              inputProps={{ min: "0", step: "0.01" }}
              value={currentEntry.cost?.price! || 0.0}
              onChange={(e) => setCurrentEntry({ ...currentEntry, cost: { price: parseFloat(e.target.value) } })}
            />
          </div>
        )}

        <div style={{ margin: '20px 0' }}>
          <div>Provider</div>
          <Select
            fullWidth
            value={currentEntry.provider!.id || 10}
            onChange={(e) => setCurrentEntry({ ...currentEntry, provider: { id: e.target.value as number, name: currentEntry.provider?.name ?? 'Amazon EC2' } })}
          >
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>{provider.name}</MenuItem>
            ))}
          </Select>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div>Data Center</div>
          <Select
            fullWidth
            value={currentEntry.dataCenter?.id || 'aws-eu-north-1'}
            onChange={(e) => setCurrentEntry({ ...currentEntry, dataCenter: { id: e.target.value as string, name: currentEntry.dataCenter?.name ?? 'aws-eu-north-1', location: { longitude: 0, latitude: 0 } } })}
          >
            {dataCenters.map((dc) => (
              <MenuItem key={dc.id} value={dc.id}>{dc.name}</MenuItem>
            ))}
          </Select>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div>Location</div>
          <Select
            fullWidth
            value={currentEntry.location?.id || 3}
            onChange={(e) => setCurrentEntry({ ...currentEntry, location: { id: e.target.value as number, name: currentEntry.location?.name ?? "Stockholm" } })}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </Select>
        </div>
                    
        {(currentEntry.type === EmmaComputeType.VirtualMachine || currentEntry.type === EmmaComputeType.SpotInstance) && (          
          <div style={{ margin: '20px 0' }}>
            <div>Cloud Network Type</div>
            <Select
              fullWidth
              value={currentEntry.cloudNetworkType ? currentEntry.cloudNetworkType : EmmaNetworkType.Default}
              onChange={(e) => setCurrentEntry({ ...currentEntry, cloudNetworkType: e.target.value as EmmaNetworkType })}
            >
              <MenuItem value={EmmaNetworkType.Default}>Default</MenuItem>
              <MenuItem value={EmmaNetworkType.Isolated}>Isolated</MenuItem>
              <MenuItem value={EmmaNetworkType.MultiCloud}>Multi-Cloud</MenuItem>
            </Select>
          </div>
        )}

        <div style={{ margin: '20px 0' }}>
          <div>Operating System</div>
          <Select
            fullWidth
            value={currentEntry.os ? currentEntry.os.id : 5 }
            onChange={(e) => setCurrentEntry({ ...currentEntry, os: { id: e.target.value as number } })}
          >            
            {operatingSystems.map((os) => (
              <MenuItem key={os.id} value={os.id}>{os.type} - {os.version}</MenuItem>
            ))}
          </Select>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>vCpu: {Math.pow(2, vCpuSliderValue)}</label>
          <Slider
            value={vCpuSliderValue || 2}
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
            value={ramSliderValue || 1}
            onChange={(_, newValue) => setRamSliderValue(newValue as number)}
            step={1}
            marks={ramMarks}
            min={0}
            max={10}
          />
        </div>

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
            value={volumeSizeSliderValue || 16}
            onChange={(_, newValue) => setVolumeSizeSliderValue(newValue as number)}
            step={25}
            min={50}
            max={1000}
          />
        </div>
      </DialogContent>

      <DialogActions>
        {(currentEntry.type === EmmaComputeType.KubernetesNode || currentEntry.id === undefined) && (
          <Button onClick={handleSave} color="primary">{currentEntry?.id ? 'Update' : 'Add'}</Button>
        )}
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
