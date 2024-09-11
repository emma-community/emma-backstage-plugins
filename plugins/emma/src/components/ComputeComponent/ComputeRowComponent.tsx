import React from 'react';
import { TableCell, TableRow, IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { EmmaVm } from '@emma-community/backstage-plugin-emma-common';

interface ComputeRowProps {
  entry: EmmaVm;
  onEdit: () => void;
  onDelete: () => void;
}

export const ComputeRowComponent: React.FC<ComputeRowProps> = ({ entry, onEdit, onDelete }) => {
  return (
    <TableRow>
      <TableCell style={{ width: '40%' }}>{entry.label}</TableCell>
      <TableCell style={{ width: '20%' }}>{entry.provider}</TableCell>
      <TableCell style={{ width: '20%' }}>{entry.type}</TableCell>
      <TableCell style={{ width: '20%' }}>
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