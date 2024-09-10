import React from 'react';
import { TableCell, TableRow, IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ComputeConfigEntry } from './VmConfigurationGridComponent';

interface VmConfigRowProps {
  entry: ComputeConfigEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export const VmConfigurationRowComponent: React.FC<VmConfigRowProps> = ({ entry, onEdit, onDelete }) => {
  return (
    <TableRow>
      <TableCell>{entry.id}</TableCell>
      <TableCell>{entry.name}</TableCell>
      <TableCell>{entry.type}</TableCell>
      <TableCell>
        <Tooltip title="Edit">
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
